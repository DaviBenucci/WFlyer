export type YamlSubsetValue =
  | string
  | number
  | boolean
  | null
  | YamlSubsetValue[]
  | { [key: string]: YamlSubsetValue };

interface ParsedLine {
  readonly indent: number;
  readonly content: string;
}

function parseScalar(source: string): YamlSubsetValue {
  const value = source.trim();

  if (value === "null") {
    return null;
  }

  if (value === "true" || value === "false") {
    return value === "true";
  }

  if (/^-?\d+(?:\.\d+)?$/u.test(value)) {
    return Number(value);
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    const entries = value.slice(1, -1).trim();
    return entries.length === 0
      ? []
      : entries.split(",").map((entry) => parseScalar(entry));
  }

  if (value.startsWith('"') && value.endsWith('"')) {
    return JSON.parse(value) as YamlSubsetValue;
  }

  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replaceAll("''", "'");
  }

  return value;
}

function parseKeyValue(source: string): readonly [string, string] {
  const separatorIndex = source.indexOf(":");

  if (separatorIndex < 1) {
    throw new Error(`Entrada YAML sem chave válida: ${source}`);
  }

  return [
    source.slice(0, separatorIndex).trim(),
    source.slice(separatorIndex + 1).trim(),
  ];
}

function parseBlock(
  lines: readonly ParsedLine[],
  startIndex: number,
  indent: number,
): readonly [YamlSubsetValue, number] {
  const firstLine = lines[startIndex];

  if (!firstLine || firstLine.indent !== indent) {
    throw new Error(`Indentação YAML inesperada no item ${startIndex}.`);
  }

  if (firstLine.content.startsWith("- ")) {
    const sequence: YamlSubsetValue[] = [];
    let index = startIndex;

    while (
      index < lines.length &&
      lines[index]?.indent === indent &&
      lines[index]?.content.startsWith("- ")
    ) {
      const line = lines[index];

      if (!line) {
        break;
      }

      const itemSource = line.content.slice(2).trim();
      const itemHasMapping = itemSource.includes(":");
      let item: YamlSubsetValue;

      if (itemHasMapping) {
        const [key, rawValue] = parseKeyValue(itemSource);
        const objectItem: { [key: string]: YamlSubsetValue } = {};
        objectItem[key] = rawValue.length > 0 ? parseScalar(rawValue) : {};
        item = objectItem;
      } else {
        item = parseScalar(itemSource);
      }

      index += 1;

      if (index < lines.length && (lines[index]?.indent ?? -1) > indent) {
        const childIndent = lines[index]?.indent;

        if (childIndent === undefined) {
          throw new Error("Bloco YAML filho ausente.");
        }

        const [continuation, nextIndex] = parseBlock(lines, index, childIndent);

        if (
          itemHasMapping &&
          typeof item === "object" &&
          item !== null &&
          !Array.isArray(item) &&
          typeof continuation === "object" &&
          continuation !== null &&
          !Array.isArray(continuation)
        ) {
          Object.assign(item, continuation);
        } else {
          throw new Error(`Continuação YAML inválida em ${line.content}.`);
        }

        index = nextIndex;
      }

      sequence.push(item);
    }

    return [sequence, index];
  }

  const mapping: { [key: string]: YamlSubsetValue } = {};
  let index = startIndex;

  while (
    index < lines.length &&
    lines[index]?.indent === indent &&
    !lines[index]?.content.startsWith("- ")
  ) {
    const line = lines[index];

    if (!line) {
      break;
    }

    const [key, rawValue] = parseKeyValue(line.content);
    index += 1;

    if (rawValue.length > 0) {
      mapping[key] = parseScalar(rawValue);
      continue;
    }

    const childIndent = lines[index]?.indent;

    if (childIndent === undefined || childIndent <= indent) {
      mapping[key] = {};
      continue;
    }

    const [child, nextIndex] = parseBlock(lines, index, childIndent);
    mapping[key] = child;
    index = nextIndex;
  }

  return [mapping, index];
}

export function parseYamlSubset(source: string): YamlSubsetValue {
  const lines = source
    .split(/\r?\n/u)
    .filter((line) => line.trim().length > 0 && !line.trimStart().startsWith("#"))
    .map((line) => ({
      indent: line.length - line.trimStart().length,
      content: line.trim(),
    }));

  if (lines.length === 0) {
    return {};
  }

  const [document, nextIndex] = parseBlock(lines, 0, lines[0]?.indent ?? 0);

  if (nextIndex !== lines.length) {
    throw new Error(`YAML não consumido a partir da linha ${nextIndex}.`);
  }

  return document;
}
