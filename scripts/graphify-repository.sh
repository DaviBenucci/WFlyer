#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
repo_root="$(cd "${script_dir}/.." && pwd -P)"
graph_dir="${repo_root}/graphify-out"
graphify_required="0.9.51"
openspec_required="1.11.0"
vis_network_url="https://unpkg.com/vis-network@9.1.6/standalone/umd/vis-network.min.js"
vis_network_sri="sha384-Ux6phic9PEHJ38YtrijhkzyJ8yQlH8i/+buBR8s3mAZOJrP1gwyvAcIYl3GWtpX1"

usage() {
  cat <<'EOF'
Uso: scripts/graphify-repository.sh <comando> [argumentos]

Comandos:
  deps                 verifica CLIs e versões mínimas
  generate             gera o grafo completo em modo normal com Gemini
  update               atualiza a parte estrutural e sinaliza semântica pendente
  validate             valida saídas, integridade, escopo e checksums
  query <pergunta>     consulta o grafo local

Sem GEMINI_API_KEY/GOOGLE_API_KEY, use `$graphify .` no Codex para a geração
semântica completa. O script não reduz silenciosamente o corpus para code-only.
EOF
}

fail() {
  printf 'erro: %s\n' "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "comando ausente: $1"
}

version_at_least() {
  local current="$1"
  local required="$2"
  [[ "$(printf '%s\n%s\n' "${required}" "${current}" | sort -V | head -n 1)" == "${required}" ]]
}

graphify_version() {
  graphify --version | awk '{print $NF}'
}

check_dependencies() {
  require_command graphify
  require_command openspec
  require_command curl
  require_command jq
  require_command openssl
  require_command perl
  require_command sha256sum

  local graphify_current
  local openspec_current
  local graphify_bin
  local graphify_python
  local python_version

  graphify_current="$(graphify_version)"
  openspec_current="$(openspec --version)"
  graphify_bin="$(command -v graphify)"
  graphify_python="$(head -n 1 "${graphify_bin}" | sed 's/^#!//')"
  [[ -x "${graphify_python}" ]] || fail "interpretador Graphify inválido: ${graphify_python}"
  python_version="$("${graphify_python}" -c 'import platform; print(platform.python_version())')"

  version_at_least "${graphify_current}" "${graphify_required}" ||
    fail "Graphify ${graphify_required}+ necessário; encontrado ${graphify_current}. Execute: uv tool upgrade graphifyy"
  version_at_least "${openspec_current}" "${openspec_required}" ||
    fail "OpenSpec ${openspec_required}+ necessário; encontrado ${openspec_current}. Execute: pnpm add --global @fission-ai/openspec@${openspec_required}"
  version_at_least "${python_version}" "3.10" ||
    fail "Python 3.10+ necessário; encontrado ${python_version}"

  printf 'Graphify %s (%s)\n' "${graphify_current}" "${graphify_bin}"
  printf 'OpenSpec %s\n' "${openspec_current}"
  printf 'Python %s (%s)\n' "${python_version}" "${graphify_python}"
  printf 'Corpus: %s\n' "${repo_root}"
}

make_html_standalone() {
  local graph_html="${graph_dir}/graph.html"
  local temp_js
  local temp_html
  local actual_sri

  [[ -s "${graph_html}" ]] || fail "graph.html ausente antes da incorporação offline"

  if ! grep -Fq "src=\"${vis_network_url}\"" "${graph_html}"; then
    return
  fi

  temp_js="$(mktemp "${graph_dir}/.vis-network.XXXXXX.js")"
  temp_html="$(mktemp "${graph_dir}/.graph.XXXXXX.html")"

  curl --fail --silent --show-error --location \
    "${vis_network_url}" \
    --output "${temp_js}"

  actual_sri="sha384-$(openssl dgst -sha384 -binary "${temp_js}" | openssl base64 -A)"
  [[ "${actual_sri}" == "${vis_network_sri}" ]] ||
    fail "hash SRI do vis-network 9.1.6 divergiu; HTML não foi alterado"

  GRAPHIFY_VIS_NETWORK_JS="${temp_js}" perl -0pe '
    BEGIN {
      local $/;
      open my $fh, "<", $ENV{GRAPHIFY_VIS_NETWORK_JS} or die $!;
      $js = <$fh>;
      close $fh;
    }
    s{<script src="https://unpkg\.com/vis-network\@9\.1\.6/standalone/umd/vis-network\.min\.js"\s+integrity="sha384-Ux6phic9PEHJ38YtrijhkzyJ8yQlH8i/\+buBR8s3mAZOJrP1gwyvAcIYl3GWtpX1"\s+crossorigin="anonymous"></script>}{<script>\n$js\n</script>}s
      or die "tag CDN vis-network esperado não encontrado";
  ' "${graph_html}" >"${temp_html}"

  mv "${temp_html}" "${graph_html}"
  rm -f "${temp_js}"
}

write_checksums() {
  (
    cd "${repo_root}"
    sha256sum \
      graphify-out/graph.json \
      graphify-out/graph.html \
      graphify-out/GRAPH_REPORT.md \
      >graphify-out/CHECKSUMS.sha256
  )
}

validate_outputs() {
  check_dependencies

  local graph_json="${graph_dir}/graph.json"
  local graph_html="${graph_dir}/graph.html"
  local graph_report="${graph_dir}/GRAPH_REPORT.md"
  local checksum_file="${graph_dir}/CHECKSUMS.sha256"
  local node_count
  local edge_count
  local community_count
  local contaminated_count

  [[ -s "${graph_json}" ]] || fail "graph.json ausente ou vazio"
  [[ -s "${graph_html}" ]] || fail "graph.html ausente ou vazio"
  [[ -s "${graph_report}" ]] || fail "GRAPH_REPORT.md ausente ou vazio"

  jq -e '
    (.nodes | type == "array" and length > 0) and
    (((.links // .edges) | type == "array") and ((.links // .edges) | length > 0))
  ' "${graph_json}" >/dev/null || fail "schema básico de graph.json inválido"

  node_count="$(jq '.nodes | length' "${graph_json}")"
  edge_count="$(jq '(.links // .edges) | length' "${graph_json}")"
  community_count="$(jq '[.nodes[] | .community? // empty] | unique | length' "${graph_json}")"
  [[ "${community_count}" -gt 0 ]] || fail "nenhuma comunidade atribuída"

  contaminated_count="$(
    jq -r '.nodes[] | .source_file? // empty' "${graph_json}" |
      sed "s#^${repo_root}/##" |
      grep -Ev '^graphify-out/memory/' |
      grep -Ec '^(\.git|node_modules|\.next|out|dist|build|coverage|storybook-static|playwright-report|test-results|\.lighthouseci|graphify-out)/' ||
      true
  )"
  [[ "${contaminated_count}" -eq 0 ]] ||
    fail "grafo contém ${contaminated_count} nós de fontes geradas/ignoradas"

  grep -qi '<!doctype html' "${graph_html}" || fail "graph.html não contém DOCTYPE"
  grep -qi '<html' "${graph_html}" || fail "graph.html não contém documento HTML"
  if grep -Eqi '<(script|link)[^>]+(src|href)="https?://' "${graph_html}"; then
    fail "graph.html depende de script ou stylesheet remoto"
  fi

  graphify diagnose multigraph --graph "${graph_json}" --json >/dev/null

  if [[ -f "${checksum_file}" ]]; then
    (
      cd "${repo_root}"
      sha256sum --check --strict graphify-out/CHECKSUMS.sha256 >/dev/null
    ) || fail "checksums Graphify divergentes"
  fi

  printf 'Graphify válido: %s nós, %s arestas, %s comunidades\n' \
    "${node_count}" "${edge_count}" "${community_count}"
}

generate_graph() {
  check_dependencies

  if [[ -z "${GEMINI_API_KEY:-}" && -z "${GOOGLE_API_KEY:-}" ]]; then
    fail 'geração semântica headless exige GEMINI_API_KEY/GOOGLE_API_KEY; sem chave, execute `$graphify .` no Codex'
  fi

  (
    cd "${repo_root}"
    graphify extract . --backend gemini --out .
  )
  make_html_standalone
  write_checksums
  validate_outputs
}

update_graph() {
  check_dependencies
  (
    cd "${repo_root}"
    graphify update .
    graphify check-update .
  )
  make_html_standalone
  write_checksums
  validate_outputs
}

query_graph() {
  [[ "$#" -gt 0 ]] || fail "informe uma pergunta"
  check_dependencies
  (
    cd "${repo_root}"
    graphify query "$*"
  )
}

command_name="${1:-}"
case "${command_name}" in
  deps)
    check_dependencies
    ;;
  generate)
    generate_graph
    ;;
  update)
    update_graph
    ;;
  validate)
    validate_outputs
    ;;
  query)
    shift
    query_graph "$@"
    ;;
  -h | --help | help)
    usage
    ;;
  *)
    usage >&2
    exit 2
    ;;
esac
