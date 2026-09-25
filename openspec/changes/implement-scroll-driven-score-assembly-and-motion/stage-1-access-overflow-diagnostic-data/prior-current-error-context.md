# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/phase09-score-path-review.spec.ts >> Phase-9 ScorePath task-33 candidate matrix >> organic-soft · vertical-wide · light
- Location: tests/e2e/phase09-score-path-review.spec.ts:184:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

@@ -60,11 +60,11 @@
      "vertical": 0,
    },
    Object {
      "chapter": "application-access",
      "horizontal": 0,
-     "vertical": 0,
+     "vertical": 110,
    },
    Object {
      "chapter": "application-terminal",
      "horizontal": 0,
      "vertical": 0,
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Pular para o conteúdo principal" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - navigation "Navegação da história W_Flyer" [ref=e5]:
        - list [ref=e6]:
          - listitem [ref=e7]:
            - link "Aplicação" [ref=e8] [cursor=pointer]:
              - /url: "#aplicacao"
          - listitem [ref=e9]:
            - link "Como funciona" [ref=e10] [cursor=pointer]:
              - /url: "#como-funciona"
          - listitem [ref=e11]:
            - link "Benefícios" [ref=e12] [cursor=pointer]:
              - /url: "#beneficios"
          - listitem [ref=e13]:
            - link "Lançamento" [ref=e14] [cursor=pointer]:
              - /url: "#lancamento"
          - listitem [ref=e15]:
            - link "W_Flyer — Home" [ref=e16] [cursor=pointer]:
              - /url: "#home"
              - text: W_Flyer
          - listitem [ref=e17]:
            - link "Sobre" [ref=e18] [cursor=pointer]:
              - /url: "#sobre"
          - listitem [ref=e19]:
            - link "Serviços" [ref=e20] [cursor=pointer]:
              - /url: "#servicos"
          - listitem [ref=e21]:
            - link "Processo" [ref=e22] [cursor=pointer]:
              - /url: "#processo"
          - listitem [ref=e23]:
            - link "Projetos" [ref=e24] [cursor=pointer]:
              - /url: "#projetos"
          - listitem [ref=e25]:
            - link "Contato" [ref=e26] [cursor=pointer]:
              - /url: "#contato"
      - button "Tema escuro" [ref=e28] [cursor=pointer]
  - main [ref=e32]:
    - generic [ref=e33]:
      - paragraph [ref=e34]: Phase 9 · task 33 · human approval pending
      - heading "Organic Soft" [level=1] [ref=e35]
      - paragraph [ref=e36]: Calm notation shelves, broad side-corridor drops, and restrained asymmetric drift.
      - paragraph [ref=e37]: Organic Soft — REFERENCE_ONLY
      - paragraph [ref=e38]: Development-only candidate. This is not public integration and does not close task 33.
    - article [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]:
          - paragraph [ref=e42]: Ramo isolado para task-33 review
          - heading "Profissional" [level=2] [ref=e43]
          - paragraph [ref=e44]: Origem compartilhada + seis cenas reais · composição determinística preservada entre geometrias.
        - generic [ref=e45]:
          - generic [ref=e46]:
            - term [ref=e47]: Semântica
            - definition [ref=e48]: fnv1a32:039bce10
          - generic [ref=e49]:
            - term [ref=e50]: Tangente máxima
            - definition [ref=e51]: 0.50° / 18°
          - generic [ref=e52]:
            - term [ref=e53]: Clef
            - definition [ref=e54]: 0.00° · sem espelho
          - generic [ref=e55]:
            - term [ref=e56]: Colisões
            - definition [ref=e57]: "0"
          - generic [ref=e58]:
            - term [ref=e59]: Eventos em conectores
            - definition [ref=e60]: "0"
          - generic [ref=e61]:
            - term [ref=e62]: Continuidade
            - definition [ref=e63]: C² · cinco linhas
          - generic [ref=e64]:
            - term [ref=e65]: Altura da trilha
            - definition [ref=e66]: 9310px
          - generic [ref=e67]:
            - term [ref=e68]: Distância só de transição
            - definition [ref=e69]: 8255.97px
          - generic [ref=e70]:
            - term [ref=e71]: Altura do conteúdo
            - definition [ref=e72]: 5600px
          - generic [ref=e73]:
            - term [ref=e74]: Altura só de transição
            - definition [ref=e75]: 3710px
          - generic [ref=e76]:
            - term [ref=e77]: Maior intervalo vazio
            - definition [ref=e78]: 530px
          - generic [ref=e79]:
            - term [ref=e80]: Maior arco conector
            - definition [ref=e81]: 2994.42px
          - generic [ref=e82]:
            - term [ref=e83]: Notação em descida
            - definition [ref=e84]: 1919.60px
          - generic [ref=e85]:
            - term [ref=e86]: Beam/stem span
            - definition [ref=e87]: 0 violações · 18 inspecionados
          - generic [ref=e88]:
            - term [ref=e89]: Barra final
            - definition [ref=e90]: PASS · t=1 · 0 primitivas após END
        - group [ref=e91]:
          - generic "Diagnóstico de zonas · desenvolvimento" [ref=e92] [cursor=pointer]
      - generic [ref=e94]:
        - region [ref=e95]:
          - generic [ref=e96]:
            - generic [aria-hidden] [ref=e97]: área reservada · heading-and-body
            - generic [ref=e98]:
              - paragraph [ref=e99]: Origem compartilhada · contrato de revisão
              - heading "W_Flyer" [level=2] [ref=e100]
              - paragraph [ref=e101]: A origem é repetida apenas para comparar cada ramo isoladamente. A composição pública compartilhada pertence à tarefa 34 e ainda não está integrada.
        - region [ref=e102]:
          - generic [ref=e103]:
            - generic [aria-hidden] [ref=e104]: área reservada · heading-and-body · persona-slot
            - generic [ref=e105]:
              - generic [ref=e106]:
                - paragraph [ref=e107]: Sobre
                - heading "Tecnologia, produto e design com responsabilidade pessoal." [level=2] [ref=e108]
                - paragraph [ref=e109]: Combino desenvolvimento de software, organização de produto e cuidado visual para transformar necessidades reais em soluções digitais compreensíveis.
                - link "Conhecer o trabalho profissional" [ref=e110] [cursor=pointer]:
                  - /url: /sobre
              - region "Contrato de integração da Persona W_Flyer" [ref=e112]:
                - generic [ref=e113]:
                  - paragraph [ref=e114]: Persona W_Flyer
                  - heading "Espaço obrigatório da seção Sobre" [level=3] [ref=e115]
                - status [ref=e116]: A Persona final é obrigatória na seção Sobre e aguarda fornecimento e aprovação do titular.
                - paragraph [ref=e117]: Este espaço reserva somente o contrato de integração. Nenhuma ilustração, geometria, pose ou aparência substituta foi criada.
                - generic [ref=e118]:
                  - paragraph [ref=e119]: Alternativa estática ativa
                  - paragraph [ref=e120]: A leitura deste contrato permanece disponível sem imagem, movimento ou JavaScript.
                - paragraph [ref=e121]: Rig, poses, movimentos e aparições opcionais ficam adiados para a Fase 10 e só poderão ser integrados depois da aprovação do ativo final.
        - region [ref=e122]:
          - generic [ref=e123]:
            - generic [aria-hidden] [ref=e124]: área reservada · heading-and-body · services-modules
            - generic [ref=e125]:
              - generic [ref=e126]:
                - paragraph [ref=e127]: Serviços
                - heading "Soluções digitais para necessidades concretas." [level=2] [ref=e128]
                - paragraph [ref=e129]: Quatro frentes organizam o que posso desenvolver, sempre com escopo, limites e critérios de qualidade explícitos.
                - link "Ver todos os serviços" [ref=e130] [cursor=pointer]:
                  - /url: /servicos
              - list "Quatro frentes de serviço" [ref=e131]:
                - listitem [ref=e132]:
                  - article [ref=e133]:
                    - generic [aria-hidden] [ref=e134]: "01"
                    - heading "Sites" [level=3] [ref=e135]
                    - paragraph [ref=e136]: Sites institucionais, landing pages e experiências web com conteúdo compreensível e base técnica sólida.
                    - link "Conhecer sites" [ref=e137] [cursor=pointer]:
                      - /url: /servicos/criacao-de-sites
                - listitem [ref=e138]:
                  - article [ref=e139]:
                    - generic [aria-hidden] [ref=e140]: "02"
                    - heading "Aplicações" [level=3] [ref=e141]
                    - paragraph [ref=e142]: Sistemas, portais e ferramentas web desenhados em torno de uma necessidade real.
                    - link "Conhecer aplicações" [ref=e143] [cursor=pointer]:
                      - /url: /servicos/criacao-de-aplicacoes
                - listitem [ref=e144]:
                  - article [ref=e145]:
                    - generic [aria-hidden] [ref=e146]: "03"
                    - heading "Integrações" [level=3] [ref=e147]
                    - paragraph [ref=e148]: Conexões entre APIs, ferramentas e fluxos para reduzir trabalho manual e tornar dependências visíveis.
                    - link "Conhecer integrações" [ref=e149] [cursor=pointer]:
                      - /url: /servicos/integracoes
                - listitem [ref=e150]:
                  - article [ref=e151]:
                    - generic [aria-hidden] [ref=e152]: "04"
                    - heading "Soluções sob medida" [level=3] [ref=e153]
                    - paragraph [ref=e154]: Diagnóstico e desenvolvimento incremental para necessidades que não são bem atendidas por uma solução pronta.
                    - link "Conhecer soluções sob medida" [ref=e155] [cursor=pointer]:
                      - /url: /servicos/solucoes-sob-medida
        - region [ref=e156]:
          - generic [ref=e157]:
            - generic [aria-hidden] [ref=e158]: área reservada · heading-and-body · process-stages
            - generic [ref=e159]:
              - generic [ref=e160]:
                - paragraph [ref=e161]: Processo
                - heading "Da necessidade à evolução, em etapas visíveis." [level=2] [ref=e162]
                - paragraph [ref=e163]: O processo preserva decisões verificáveis e espaço para validar o que está sendo construído.
                - link "Conhecer o processo" [ref=e164] [cursor=pointer]:
                  - /url: /processo
              - list "Quatro etapas do processo" [ref=e165]:
                - listitem [ref=e166]:
                  - generic [aria-hidden] [ref=e167]: "01"
                  - heading "Descoberta e contexto" [level=3] [ref=e168]
                  - paragraph [ref=e169]: Compreendo a necessidade, o público, o processo atual e os limites do projeto.
                - listitem [ref=e170]:
                  - generic [aria-hidden] [ref=e171]: "02"
                  - heading "Escopo e direção" [level=3] [ref=e172]
                  - paragraph [ref=e173]: Organizo prioridades, responsabilidades e critérios de qualidade para orientar o trabalho.
                - listitem [ref=e174]:
                  - generic [aria-hidden] [ref=e175]: "03"
                  - heading "Implementação incremental" [level=3] [ref=e176]
                  - paragraph [ref=e177]: Desenvolvo em etapas verificáveis para que decisões e riscos apareçam cedo.
                - listitem [ref=e178]:
                  - generic [aria-hidden] [ref=e179]: "04"
                  - heading "Validação e evolução" [level=3] [ref=e180]
                  - paragraph [ref=e181]: Valido o escopo acordado e avalio os próximos passos conforme a necessidade.
        - region [ref=e182]:
          - generic [ref=e183]:
            - generic [aria-hidden] [ref=e184]: área reservada · heading-and-body · project-card-fan
            - generic [ref=e185]:
              - generic [ref=e186]:
                - paragraph [ref=e187]: Projetos
                - heading "Trabalhos selecionados com escopo verificável." [level=2] [ref=e188]
                - paragraph [ref=e189]: A seleção apresenta somente projetos autorizados, sem métricas, resultados ou estudos de caso inventados.
                - link "Ver projetos selecionados" [ref=e190] [cursor=pointer]:
                  - /url: /portfolio
              - list "Projetos em destaque" [ref=e192]:
                - listitem [ref=e193]:
                  - article [ref=e194]:
                    - link "Conhecer o projeto W_Flyer" [ref=e195] [cursor=pointer]:
                      - /url: /portfolio/w-flyer
                      - generic [ref=e196]:
                        - generic [aria-hidden] [ref=e197]: 01/03
                        - generic [ref=e198]:
                          - generic [ref=e199]: Status
                          - text: Em desenvolvimento
                      - generic [ref=e200]:
                        - paragraph [ref=e201]: Produto próprio
                        - heading "W_Flyer" [level=3] [ref=e202]
                        - paragraph [ref=e203]: Site profissional e aplicação musical apresentados sob uma mesma marca.
                        - generic [ref=e204]:
                          - generic [ref=e205]:
                            - term [ref=e206]: Atuação
                            - definition [ref=e207]: Concepção, documentação, arquitetura, design e desenvolvimento do projeto público.
                          - generic [ref=e208]:
                            - term [ref=e209]: Competências
                            - definition [ref=e210]: Identidade · Documentação · Arquitetura · Desenvolvimento
                      - generic [aria-hidden] [ref=e211]:
                        - text: Conhecer projeto
                        - generic [ref=e212]: →
                - listitem [ref=e213]:
                  - article [ref=e214]:
                    - link "Conhecer o projeto MSN Distribuidora" [ref=e215] [cursor=pointer]:
                      - /url: /portfolio/msn-distribuidora
                      - generic [ref=e216]:
                        - generic [aria-hidden] [ref=e217]: 02/03
                        - generic [ref=e218]:
                          - generic [ref=e219]: Status
                          - text: Publicado
                      - generic [ref=e220]:
                        - paragraph [ref=e221]: E-commerce
                        - heading "MSN Distribuidora" [level=3] [ref=e222]
                        - paragraph [ref=e223]: Projeto real de comércio eletrônico apresentado dentro do escopo público autorizado.
                        - generic [ref=e224]:
                          - generic [ref=e225]:
                            - term [ref=e226]: Atuação
                            - definition [ref=e227]: Atuação descrita somente pelos elementos autorizados para o portfólio público.
                          - generic [ref=e228]:
                            - term [ref=e229]: Competências
                            - definition [ref=e230]: E-commerce
                      - generic [aria-hidden] [ref=e231]:
                        - text: Conhecer projeto
                        - generic [ref=e232]: →
                - listitem [ref=e233]:
                  - article [ref=e234]:
                    - link "Conhecer o projeto MSN Suprimentos" [ref=e235] [cursor=pointer]:
                      - /url: /portfolio/msn-suprimentos
                      - generic [ref=e236]:
                        - generic [aria-hidden] [ref=e237]: 03/03
                        - generic [ref=e238]:
                          - generic [ref=e239]: Status
                          - text: Publicado
                      - generic [ref=e240]:
                        - paragraph [ref=e241]: Site comercial e institucional
                        - heading "MSN Suprimentos" [level=3] [ref=e242]
                        - paragraph [ref=e243]: Site que organiza conteúdo, linhas de produtos e caminhos de atendimento.
                        - generic [ref=e244]:
                          - generic [ref=e245]:
                            - term [ref=e246]: Atuação
                            - definition [ref=e247]: Atuação descrita somente pelos elementos autorizados para o portfólio público.
                          - generic [ref=e248]:
                            - term [ref=e249]: Competências
                            - definition [ref=e250]: Organização de conteúdo · Apresentação de produtos · Direcionamento de atendimento
                      - generic [aria-hidden] [ref=e251]:
                        - text: Conhecer projeto
                        - generic [ref=e252]: →
        - region [ref=e253]:
          - generic [ref=e254]:
            - generic [aria-hidden] [ref=e255]: área reservada · heading-and-body · contact-form
            - generic [ref=e256]:
              - generic [ref=e257]:
                - generic [ref=e258]:
                  - paragraph [ref=e259]: Contato
                  - heading "Vamos conversar sobre o seu projeto?" [level=2] [ref=e260]
                  - paragraph [ref=e261]: Compartilhe o contexto, o objetivo e o tipo de solução. O formulário detalhado preserva validação e controles de segurança no servidor.
                - generic [ref=e262]:
                  - link "davi.benucci@wflyer.com.br" [ref=e263] [cursor=pointer]:
                    - /url: mailto:davi.benucci@wflyer.com.br
                  - link "GitHub — abre em nova aba" [ref=e264] [cursor=pointer]:
                    - /url: https://github.com/DaviBenucci
                    - text: GitHub
                    - generic [ref=e265]: — abre em nova aba
                  - link "Instagram — abre em nova aba" [ref=e266] [cursor=pointer]:
                    - /url: https://www.instagram.com/davibenucci/
                    - text: Instagram
                    - generic [ref=e267]: — abre em nova aba
              - form "Formulário de contato" [ref=e269]:
                - group "Apresente o seu projeto" [ref=e270]:
                  - generic [ref=e272]:
                    - generic [ref=e273]:
                      - text: Nome
                      - textbox "Nome" [ref=e274]
                    - generic [ref=e275]:
                      - text: E-mail
                      - textbox "E-mail" [ref=e276]
                  - generic [ref=e277]:
                    - generic [ref=e278]:
                      - text: Empresa (opcional)
                      - textbox "Empresa (opcional)" [ref=e279]
                    - generic [ref=e280]:
                      - text: Tipo de projeto
                      - combobox "Tipo de projeto" [ref=e281]:
                        - option "Selecione uma opção" [selected]
                        - option "Site institucional"
                        - option "Landing page"
                        - option "Aplicação web"
                        - option "Integração"
                        - option "Automação"
                        - option "Solução personalizada"
                        - option "Outro"
                  - generic [ref=e282]:
                    - text: Mensagem
                    - textbox "Mensagem" [ref=e283]
                  - generic [ref=e284]:
                    - checkbox "Li a Política de Privacidade e concordo com o uso destes dados para resposta ao contato." [ref=e285]
                    - generic [ref=e286]:
                      - text: Li a
                      - link "Política de Privacidade" [ref=e287] [cursor=pointer]:
                        - /url: /politica-de-privacidade
                      - text: e concordo com o uso destes dados para resposta ao contato.
                  - generic [aria-hidden] [ref=e288]:
                    - text: Website
                    - textbox [ref=e289]
                  - paragraph [ref=e291]: A verificação de segurança será carregada quando você interagir com o formulário.
                  - button "Enviar mensagem" [disabled] [ref=e292]
                - status [ref=e293]: Os dados serão usados somente para responder ao contato. Nenhuma cópia é armazenada pelo site.
        - region [ref=e294]:
          - generic [ref=e295]:
            - generic [aria-hidden] [ref=e296]: área reservada · terminal-content
            - generic [ref=e298]:
              - paragraph [ref=e299]: Conclusão profissional
              - heading "Fim do percurso profissional." [level=2] [ref=e300]
              - paragraph [ref=e301]: Uma barra final encerra visualmente este ramo. Na leitura vertical, ela é uma transição para a aplicação, não um segundo rodapé.
    - article [ref=e302]:
      - generic [ref=e303]:
        - generic [ref=e304]:
          - paragraph [ref=e305]: Ramo isolado para task-33 review
          - heading "Aplicação" [level=2] [ref=e306]
          - paragraph [ref=e307]: Origem compartilhada + seis cenas reais · composição determinística preservada entre geometrias.
        - generic [ref=e308]:
          - generic [ref=e309]:
            - term [ref=e310]: Semântica
            - definition [ref=e311]: fnv1a32:1fe3356b
          - generic [ref=e312]:
            - term [ref=e313]: Tangente máxima
            - definition [ref=e314]: 0.50° / 18°
          - generic [ref=e315]:
            - term [ref=e316]: Clef
            - definition [ref=e317]: 0.00° · sem espelho
          - generic [ref=e318]:
            - term [ref=e319]: Colisões
            - definition [ref=e320]: "0"
          - generic [ref=e321]:
            - term [ref=e322]: Eventos em conectores
            - definition [ref=e323]: "0"
          - generic [ref=e324]:
            - term [ref=e325]: Continuidade
            - definition [ref=e326]: C² · cinco linhas
          - generic [ref=e327]:
            - term [ref=e328]: Altura da trilha
            - definition [ref=e329]: 8140px
          - generic [ref=e330]:
            - term [ref=e331]: Distância só de transição
            - definition [ref=e332]: 7086.03px
          - generic [ref=e333]:
            - term [ref=e334]: Altura do conteúdo
            - definition [ref=e335]: 4430px
          - generic [ref=e336]:
            - term [ref=e337]: Altura só de transição
            - definition [ref=e338]: 3710px
          - generic [ref=e339]:
            - term [ref=e340]: Maior intervalo vazio
            - definition [ref=e341]: 530px
          - generic [ref=e342]:
            - term [ref=e343]: Maior arco conector
            - definition [ref=e344]: 2628.48px
          - generic [ref=e345]:
            - term [ref=e346]: Notação em descida
            - definition [ref=e347]: 1919.60px
          - generic [ref=e348]:
            - term [ref=e349]: Beam/stem span
            - definition [ref=e350]: 0 violações · 23 inspecionados
          - generic [ref=e351]:
            - term [ref=e352]: Barra final
            - definition [ref=e353]: PASS · t=1 · 0 primitivas após END
        - group [ref=e354]:
          - generic "Diagnóstico de zonas · desenvolvimento" [ref=e355] [cursor=pointer]
      - generic [ref=e357]:
        - region [ref=e358]:
          - generic [ref=e359]:
            - generic [aria-hidden] [ref=e360]: área reservada · heading-and-body
            - generic [ref=e361]:
              - paragraph [ref=e362]: Origem compartilhada · contrato de revisão
              - heading "W_Flyer" [level=2] [ref=e363]
              - paragraph [ref=e364]: A origem é repetida apenas para comparar cada ramo isoladamente. A composição pública compartilhada pertence à tarefa 34 e ainda não está integrada.
        - region [ref=e365]:
          - generic [ref=e366]:
            - generic [aria-hidden] [ref=e367]: área reservada · heading-and-body · application-overview
            - generic [ref=e368]:
              - generic [ref=e369]:
                - paragraph [ref=e370]: Aplicação W_Flyer
                - heading "Adaptação musical com escolhas visíveis e revisão humana." [level=2] [ref=e371]
                - paragraph [ref=e372]: A proposta é apoiar a adaptação de partituras entre instrumentos e contextos tonais. A conferência e a decisão musical permanecem com quem usa a aplicação.
                - link "Conhecer a proposta da aplicação" [ref=e373] [cursor=pointer]:
                  - /url: /aplicacao-wflyer
              - list "Problema, proposta e revisão da aplicação" [ref=e374]:
                - listitem [ref=e375]:
                  - generic [aria-hidden] [ref=e376]: "01"
                  - heading "Contexto de origem" [level=3] [ref=e377]
                  - paragraph [ref=e378]: A partitura parte de um instrumento e de um contexto tonal conhecidos.
                - listitem [ref=e379]:
                  - generic [aria-hidden] [ref=e380]: "02"
                  - heading "Contexto de destino" [level=3] [ref=e381]
                  - paragraph [ref=e382]: A pessoa informa o instrumento e o contexto tonal para os quais deseja adaptar o material.
                - listitem [ref=e383]:
                  - generic [aria-hidden] [ref=e384]: "03"
                  - heading "Revisão humana" [level=3] [ref=e385]
                  - paragraph [ref=e386]: O resultado é apresentado para conferência; a decisão musical não é automatizada nem garantida.
        - region [ref=e387]:
          - generic [ref=e388]:
            - generic [aria-hidden] [ref=e389]: área reservada · heading-and-body
            - generic [ref=e390]:
              - generic [ref=e391]:
                - paragraph [ref=e392]: Como funciona
                - heading "Um fluxo orientado da partitura ao resultado." [level=2] [ref=e393]
                - paragraph [ref=e394]: Cada etapa torna as escolhas compreensíveis e preserva um momento explícito de revisão antes de continuar.
                - link "Ver como funciona em detalhes" [ref=e395] [cursor=pointer]:
                  - /url: /aplicacao-wflyer/como-funciona
              - list "Cinco etapas de como a aplicação funciona" [ref=e396]:
                - listitem [ref=e397]:
                  - generic [aria-hidden] [ref=e398]: "01"
                  - heading "Insira ou selecione a partitura" [level=3] [ref=e399]
                  - paragraph [ref=e400]: Escolha o material que será usado no fluxo.
                - listitem [ref=e401]:
                  - generic [aria-hidden] [ref=e402]: "02"
                  - heading "Informe instrumento e tonalidade de origem" [level=3] [ref=e403]
                  - paragraph [ref=e404]: Contextualize o material de partida.
                - listitem [ref=e405]:
                  - generic [aria-hidden] [ref=e406]: "03"
                  - heading "Defina instrumento e tonalidade de destino" [level=3] [ref=e407]
                  - paragraph [ref=e408]: Indique o contexto para o qual deseja adaptar.
                - listitem [ref=e409]:
                  - generic [aria-hidden] [ref=e410]: "04"
                  - heading "Visualize e revise" [level=3] [ref=e411]
                  - paragraph [ref=e412]: Confira o resultado e faça a avaliação musical necessária.
                - listitem [ref=e413]:
                  - generic [aria-hidden] [ref=e414]: "05"
                  - heading "Exporte ou continue" [level=3] [ref=e415]
                  - paragraph [ref=e416]: Siga com o resultado ou continue o trabalho na aplicação.
        - region [ref=e417]:
          - generic [ref=e418]:
            - generic [aria-hidden] [ref=e419]: área reservada · heading-and-body · application-benefits
            - generic [ref=e420]:
              - generic [ref=e421]:
                - paragraph [ref=e422]: Benefícios
                - heading "Mais clareza para revisar e continuar." [level=2] [ref=e423]
                - paragraph [ref=e424]: Quatro grupos traduzem a proposta pública em valor sem promessas quantitativas ou garantias.
                - link "Conhecer os benefícios" [ref=e425] [cursor=pointer]:
                  - /url: /aplicacao-wflyer/beneficios
              - list "Quatro grupos de benefícios da aplicação" [ref=e426]:
                - listitem [ref=e427]:
                  - heading "Menos trabalho repetitivo" [level=3] [ref=e429]
                  - paragraph [ref=e430]: Organize tarefas recorrentes em um fluxo orientado.
                - listitem [ref=e431]:
                  - heading "Diferentes contextos" [level=3] [ref=e433]
                  - paragraph [ref=e434]: Prepare materiais para outros instrumentos ou contextos tonais com escolhas explícitas.
                - listitem [ref=e435]:
                  - heading "Revisão antes de prosseguir" [level=3] [ref=e437]
                  - paragraph [ref=e438]: Mantenha a interpretação, a conferência e a decisão musical com você.
                - listitem [ref=e439]:
                  - heading "Continuidade do fluxo" [level=3] [ref=e441]
                  - paragraph [ref=e442]: Exporte o resultado nos formatos aprovados ou continue na aplicação.
        - region [ref=e443]:
          - generic [ref=e444]:
            - generic [aria-hidden] [ref=e445]: área reservada · heading-and-body · application-tablet-demo
            - generic [ref=e446]:
              - generic [ref=e447]:
                - paragraph [ref=e448]: Demonstração
                - heading "Veja um percurso ilustrativo pela aplicação." [level=2] [ref=e449]
                - paragraph [ref=e450]: A tela simulada permanece inerte. A reprodução ocorre somente quando esta etapa está ativa, e o único controle disponível é o de mídia.
                - link "Ver o contrato da demonstração" [ref=e451] [cursor=pointer]:
                  - /url: /aplicacao-wflyer#demonstracao
              - figure "Demonstração visual ilustrativa. A tela simulada é inerte; somente o controle de reprodução pode receber interação." [ref=e453]:
                - group "Tela da demonstração visual da aplicação" [ref=e457]:
                  - generic [ref=e458]:
                    - generic [aria-hidden] [ref=e459]: APP-04
                    - paragraph [ref=e460]: WebM, MP4, poster e quadro final aguardam fornecimento e aprovação humana.
                  - status [ref=e461]: WebM, MP4, poster e quadro final aguardam fornecimento e aprovação humana.
        - region [ref=e464]:
          - generic [ref=e465]:
            - generic [aria-hidden] [ref=e466]: área reservada · heading-and-body · access-action
            - generic [ref=e467]:
              - generic [ref=e468]:
                - paragraph [ref=e469]: Lançamento
                - heading "A aplicação está em desenvolvimento." [level=2] [ref=e470]
                - paragraph [ref=e471]: Quer saber quando ela estiver disponível? Cadastre seu e-mail para receber apenas este aviso.
              - form "Aviso de lançamento da aplicação" [ref=e473]:
                - group "Receber o aviso de lançamento" [ref=e474]:
                  - generic [ref=e476]:
                    - text: E-mail
                    - textbox "E-mail" [ref=e477]:
                      - /placeholder: voce@exemplo.com.br
                  - generic [ref=e478]:
                    - checkbox "Li a Política de Privacidade e concordo com o uso do meu e-mail somente para este aviso." [ref=e479]
                    - generic [ref=e480]:
                      - text: Li a
                      - link "Política de Privacidade" [ref=e481] [cursor=pointer]:
                        - /url: /politica-de-privacidade
                      - text: e concordo com o uso do meu e-mail somente para este aviso.
                  - generic [aria-hidden] [ref=e482]:
                    - text: Não preencha este campo
                    - textbox [ref=e483]
                  - button "Quero receber o aviso" [ref=e486] [cursor=pointer]
                - status [ref=e487]: Você receberá somente o aviso de disponibilidade da aplicação.
        - region [ref=e488]:
          - generic [ref=e489]:
            - generic [aria-hidden] [ref=e490]: área reservada · terminal-content
            - generic [ref=e492]:
              - paragraph [ref=e493]: Conclusão da aplicação
              - heading "Fim da narrativa vertical." [level=2] [ref=e494]
              - paragraph [ref=e495]: A barra final encerra o ramo da aplicação e a navegação institucional conclui a experiência sem duplicar um segundo rodapé.
  - contentinfo [ref=e496]:
    - generic [ref=e497]:
      - generic [ref=e498]:
        - heading "W_Flyer" [level=2] [ref=e499]
        - paragraph [ref=e500]: Portfólio profissional, serviços digitais e uma aplicação musical apresentados em uma narrativa acessível.
      - navigation "Rodapé" [ref=e501]:
        - generic [ref=e502]:
          - heading "Trabalho profissional" [level=3] [ref=e503]
          - list [ref=e504]:
            - listitem [ref=e505]:
              - link "Sobre" [ref=e506] [cursor=pointer]:
                - /url: /sobre
            - listitem [ref=e507]:
              - link "Serviços" [ref=e508] [cursor=pointer]:
                - /url: /servicos
            - listitem [ref=e509]:
              - link "Projetos" [ref=e510] [cursor=pointer]:
                - /url: /portfolio
            - listitem [ref=e511]:
              - link "Contato" [ref=e512] [cursor=pointer]:
                - /url: /contato
        - generic [ref=e513]:
          - heading "Informações" [level=3] [ref=e514]
          - list [ref=e515]:
            - listitem [ref=e516]:
              - link "Aplicação W_Flyer" [ref=e517] [cursor=pointer]:
                - /url: /aplicacao-wflyer
            - listitem [ref=e518]:
              - link "Privacidade" [ref=e519] [cursor=pointer]:
                - /url: /politica-de-privacidade
            - listitem [ref=e520]:
              - link "Cookies" [ref=e521] [cursor=pointer]:
                - /url: /politica-de-cookies
            - listitem [ref=e522]:
              - link "Termos de uso" [ref=e523] [cursor=pointer]:
                - /url: /termos-de-uso
            - listitem [ref=e524]:
              - link "Acessibilidade" [ref=e525] [cursor=pointer]:
                - /url: /acessibilidade
        - generic [ref=e526]:
          - heading "Canais" [level=3] [ref=e527]
          - list [ref=e528]:
            - listitem [ref=e529]:
              - link "E-mail" [ref=e530] [cursor=pointer]:
                - /url: mailto:davi.benucci@wflyer.com.br
            - listitem [ref=e531]:
              - link "GitHub — abre em nova aba" [ref=e532] [cursor=pointer]:
                - /url: https://github.com/DaviBenucci
                - text: GitHub
                - generic [ref=e533]: — abre em nova aba
            - listitem [ref=e534]:
              - link "Instagram — abre em nova aba" [ref=e535] [cursor=pointer]:
                - /url: https://www.instagram.com/davibenucci/
                - text: Instagram
                - generic [ref=e536]: — abre em nova aba
      - paragraph [ref=e537]: © 2026 W_Flyer. Todos os direitos reservados.
  - button "Open Next.js Dev Tools" [ref=e543] [cursor=pointer]
  - alert [ref=e547]
```

# Test source

```ts
  156 |       );
  157 |       await expect(page.locator(state.root)).not.toHaveAttribute("data-theme");
  158 |       await page.evaluate(async () => {
  159 |         await document.fonts.ready;
  160 |         await new Promise<void>((resolve) => {
  161 |           requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  162 |         });
  163 |       });
  164 | 
  165 |       const overlayText = await page.locator("nextjs-portal").evaluateAll(
  166 |         (portals) =>
  167 |           portals
  168 |             .map((portal) => portal.shadowRoot?.textContent ?? portal.textContent)
  169 |             .join("\n"),
  170 |       );
  171 |       if (HYDRATION_WARNING_PATTERN.test(overlayText)) {
  172 |         hydrationMessages.push(overlayText);
  173 |       }
  174 | 
  175 |       expect(hydrationMessages).toEqual([]);
  176 |     });
  177 |   }
  178 | });
  179 | 
  180 | test.describe("Phase-9 ScorePath task-33 candidate matrix", () => {
  181 |   test.skip(productionServer, "Development-only task-33 review surface");
  182 | 
  183 |   for (const [candidate, mode, theme] of REVIEW_MATRIX) {
  184 |     test(`${candidate} · ${mode} · ${theme}`, async ({ page }) => {
  185 |       const pageErrors: string[] = [];
  186 |       page.on("pageerror", (error) => pageErrors.push(error.message));
  187 |       await openPreview(page, candidate, mode, theme);
  188 | 
  189 |       await expect(page.locator("[data-review-branch]")).toHaveCount(2);
  190 |       await expect(page.locator("[data-review-chapter-id]")).toHaveCount(14);
  191 |       await expect(page.locator("[data-professional-scene]")).toHaveCount(6);
  192 |       await expect(page.locator("[data-application-scene]")).toHaveCount(6);
  193 |       await expect(page.locator('[data-score-role="staff-line"]')).toHaveCount(10);
  194 |       await expect(page.locator('[data-score-role="clef"]')).toHaveCount(2);
  195 |       await expect(
  196 |         page.locator('[data-score-role="final-barline-thin"]'),
  197 |       ).toHaveCount(2);
  198 |       await expect(
  199 |         page.locator('[data-score-role="final-barline-thick"]'),
  200 |       ).toHaveCount(2);
  201 |       await expect(page.locator('[data-review-zone-kind="notation-safe"]')).toHaveCount(
  202 |         14,
  203 |       );
  204 |       const expectedConnectorCount =
  205 |         candidate === "organic-flowing" ? 12 : 14;
  206 |       await expect(page.locator('[data-review-zone-kind="connector"]')).toHaveCount(
  207 |         expectedConnectorCount,
  208 |       );
  209 |       await expect(page.locator("[data-review-diagnostics]")).toHaveCount(2);
  210 |       await expect(page.locator('[data-review-marker-only="true"]')).toHaveCount(
  211 |         14 + expectedConnectorCount,
  212 |       );
  213 |       await expect(
  214 |         page.locator("[data-review-zone-markers] polyline"),
  215 |       ).toHaveCount(0);
  216 |       await expect(
  217 |         page.locator('[data-review-terminal-invariant="pass"]'),
  218 |       ).toHaveCount(2);
  219 |       expect(
  220 |         await page
  221 |           .locator("[data-review-primitive-span-violations]")
  222 |           .evaluateAll((branches) =>
  223 |             branches.every(
  224 |               (branch) =>
  225 |                 branch.getAttribute(
  226 |                   "data-review-primitive-span-violations",
  227 |                 ) === "0",
  228 |             ),
  229 |           ),
  230 |       ).toBe(true);
  231 |       if (candidate === "organic-flowing") {
  232 |         await expect(
  233 |           page.locator("main[data-phase-9-task-33-review]"),
  234 |         ).toHaveAttribute("data-review-status", "SELECTED_FOR_REVISION");
  235 |       }
  236 |       expect(
  237 |         await page.locator('[data-review-zone-kind="connector"]').evaluateAll(
  238 |           (connectors) =>
  239 |             connectors.every(
  240 |               (connector) =>
  241 |                 connector.getAttribute("data-review-event-count") === "0" &&
  242 |                 connector.getAttribute("data-review-semantic-slot-ids") === "",
  243 |             ),
  244 |         ),
  245 |       ).toBe(true);
  246 | 
  247 |       const envelopeOverflow = await page
  248 |         .locator("[data-review-content-envelope]")
  249 |         .evaluateAll((envelopes) =>
  250 |           envelopes.map((envelope) => ({
  251 |             chapter: envelope.getAttribute("data-review-content-envelope"),
  252 |             horizontal: envelope.scrollWidth - envelope.clientWidth,
  253 |             vertical: envelope.scrollHeight - envelope.clientHeight,
  254 |           })),
  255 |         );
> 256 |       expect(envelopeOverflow).toEqual(
      |                                ^ Error: expect(received).toEqual(expected) // deep equality
  257 |         envelopeOverflow.map(({ chapter }) => ({
  258 |           chapter,
  259 |           horizontal: 0,
  260 |           vertical: 0,
  261 |         })),
  262 |       );
  263 | 
  264 |       expect(
  265 |         await page.locator("[data-review-score]").evaluateAll((scores) =>
  266 |           scores.every(
  267 |             (score) => getComputedStyle(score).pointerEvents === "none",
  268 |           ),
  269 |         ),
  270 |       ).toBe(true);
  271 |       expect(
  272 |         await page.evaluate(() =>
  273 |           document.documentElement.scrollWidth <= window.innerWidth,
  274 |         ),
  275 |       ).toBe(true);
  276 |       expect(
  277 |         await page.locator("main[data-phase-9-task-33-review]").evaluate(
  278 |           (root) => getComputedStyle(root).colorScheme,
  279 |         ),
  280 |       ).toContain(theme);
  281 | 
  282 |       await expect(page.locator("[data-project-card-link]")).toHaveCount(3);
  283 |       await expect(page.locator("[data-contact-form]")).toHaveCount(1);
  284 |       await expect(page.locator('[data-primary-app-access="true"]')).toHaveCount(0);
  285 |       await expect(page.getByRole("form", { name: "Aviso de lançamento da aplicação" })).toHaveCount(1);
  286 |       await expect(page.locator("[data-app04-deterministic-fallback]")).toHaveCount(1);
  287 |       expect(
  288 |         await page
  289 |           .locator(
  290 |             "[data-project-card-link], [data-contact-form] input, [data-contact-form] textarea, [data-app-launch-interest-state] input",
  291 |           )
  292 |           .evaluateAll((elements) =>
  293 |             elements.every((element) => {
  294 |               const style = getComputedStyle(element);
  295 |               const rect = element.getBoundingClientRect();
  296 |               return (
  297 |                 style.pointerEvents !== "none" &&
  298 |                 rect.width > 0 &&
  299 |                 rect.height > 0
  300 |               );
  301 |             }),
  302 |           ),
  303 |       ).toBe(true);
  304 |       expect(pageErrors).toEqual([]);
  305 |     });
  306 |   }
  307 | 
  308 |   test("reduced motion retains the complete static score and usable scenes", async ({
  309 |     page,
  310 |   }) => {
  311 |     await page.emulateMedia({ reducedMotion: "reduce" });
  312 |     await openPreview(page, "organic-flowing", "vertical-compact", "dark");
  313 | 
  314 |     await expect(page.locator('[data-score-role="staff-line"]')).toHaveCount(10);
  315 |     await expect(page.locator("[data-review-chapter-id]")).toHaveCount(14);
  316 |     expect(
  317 |       await page.evaluate(() =>
  318 |         document.getAnimations().filter((animation) => {
  319 |           if (!(animation.effect instanceof KeyframeEffect)) return true;
  320 | 
  321 |           const { duration, iterations } = animation.effect.getTiming();
  322 |           return (
  323 |             duration === "auto" ||
  324 |             Number(duration) > 1 ||
  325 |             iterations === Number.POSITIVE_INFINITY
  326 |           );
  327 |         }),
  328 |       ),
  329 |     ).toEqual([]);
  330 |     await expect(page.locator("[data-contact-form]")).toBeVisible();
  331 |     await expect(page.locator('[data-primary-app-access="true"]')).toHaveCount(0);
  332 |     await expect(page.getByRole("form", { name: "Aviso de lançamento da aplicação" })).toBeVisible();
  333 |   });
  334 | });
  335 | 
  336 | test.describe("Phase-9 task-33 responsive refinement", () => {
  337 |   test.skip(productionServer, "Development-only task-33 review surface");
  338 | 
  339 |   for (const viewport of COMPACT_VIEWPORT_MATRIX) {
  340 |     test(`Organic Flowing compact real scenes fit ${viewport.width}×${viewport.height}`, async ({
  341 |       page,
  342 |     }) => {
  343 |       const consoleErrors: string[] = [];
  344 |       const pageErrors: string[] = [];
  345 |       page.on("console", (message) => {
  346 |         if (message.type() === "error") consoleErrors.push(message.text());
  347 |       });
  348 |       page.on("pageerror", (error) => pageErrors.push(error.message));
  349 |       await page.setViewportSize(viewport);
  350 |       const response = await page.goto(
  351 |         previewUrl("organic-flowing", "vertical-compact", "light"),
  352 |         { waitUntil: "domcontentloaded" },
  353 |       );
  354 | 
  355 |       expect(response?.ok()).toBe(true);
  356 |       const root = page.locator("main[data-phase-9-task-33-review]");
```