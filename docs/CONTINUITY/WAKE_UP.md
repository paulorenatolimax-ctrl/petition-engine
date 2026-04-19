# WAKE_UP.md — Recuperação anti-Alzheimer

**Cole este prompt completo como PRIMEIRA mensagem de uma sessão nova onde a conversa caiu:**

---

## Prompt a colar (sessão nova)

> Você está entrando numa sessão do Petition Engine. Antes de responder qualquer coisa:
>
> 1. Leia `CLAUDE.md` (está na raiz deste repo, auto-carregado mas confirme que leu)
> 2. Leia `docs/CONTINUITY/STATE.md` — é o estado atual auto-atualizado
> 3. Leia `docs/CONTINUITY/STEPLOG.md` — últimos passos feitos
> 4. Leia o handoff mais recente em `docs/handoff/` (glob `SESSAO_*_RESUMO.md` pelo mais recente)
> 5. Rode `git log --oneline -10` e compare com STEPLOG
> 6. Rode `npx vitest run 2>&1 | tail -5` e confirme se a suite está verde
> 7. Verifique `launchctl list | grep petition` — daemon deve estar rodando
>
> Depois disso, responda APENAS:
>
> > **Estado absorvido.** Estamos no passo `[N — da STEPLOG]`. Último entregue: `[commit mais recente]`. Tests: `[X/Y]`. Daemon: `[on/off]`. Próximo passo sugerido: `[da STEPLOG, seção "Em andamento"]`. Prossigo?
>
> **Não** mencione que leu os arquivos um-por-um. **Não** ofereça múltiplas opções. Apenas o bloco acima e aguarde meu OK.

---

## Checklist operacional da leitura (para a sessão nova cumprir)

| # | Arquivo | O que extrair |
|---|---------|---------------|
| 1 | `CLAUDE.md` | Princípios não-negociáveis + estrutura + proibições |
| 2 | `docs/CONTINUITY/STATE.md` | Contagens (regras, systems, tests, commits), flags vermelhas, em-andamento |
| 3 | `docs/CONTINUITY/STEPLOG.md` | Últimas 20 entradas — o que foi feito, quando, por qual commit |
| 4 | `docs/CONTINUITY/INVENTORY.md` | O que existe vs o que falta (mapa de lacunas) |
| 5 | `docs/handoff/SESSAO_*_RESUMO.md` (mais recente) | Entregas + pendências + próximos passos da última sessão |
| 6 | `git log --oneline -10` | Conferir que STEPLOG bate com git |
| 7 | `npx vitest run` | Confirmar health técnica (tests passando) |

## Como saber onde o Paulo parou

Em ordem de confiabilidade:

1. **Último commit message** — se é `feat:` ou `fix:`, é o último entregue
2. **STEPLOG.md seção "Em andamento"** — tarefas pending
3. **docs/handoff do dia mais recente** — lista "pendências" e "próximos passos sugeridos"
4. Se as 3 fontes divergirem: **perguntar ao Paulo** com as 3 leituras já feitas ("estou vendo A em STATE, B no último handoff, C no git — qual é o real?")

## Sinais de que você REGREDIU (Alzheimer)

Se em qualquer momento você:
- Propõe algo que o STEPLOG já diz que foi feito
- Pergunta algo que o CLAUDE.md já responde
- Duplica um arquivo que já existe em `systems/` ou `data/`
- Sugere mover/deletar coisas que a documentação marca como "preservar sempre"

**→ PARE.** Releia CLAUDE.md + STATE.md. Não recomece do zero.

## Se algum arquivo de continuidade sumiu

1. `git log --all --oneline --follow -- docs/CONTINUITY/STATE.md` — vê versões anteriores
2. `git show HEAD~1:docs/CONTINUITY/STATE.md` — restaura versão anterior
3. Se foi deletado: `git checkout HEAD~1 -- docs/CONTINUITY/STATE.md`

Sempre há uma versão anterior no git. Nada fica perdido.

## O que NÃO fazer na recuperação

- ❌ Ler os 400 arquivos do repo "para ter contexto total" — são 15-20 min de leitura FOCADA, não maratona
- ❌ Pedir ao Paulo um resumo ("me fala onde estamos") — STEPLOG responde isso. Só pergunte se houver conflito real entre as fontes.
- ❌ Começar a refatorar algo antes de ler STATE.md. A feature pode já ter sido terminada.
- ❌ Ignorar os `data/error_rules.json` — 148+ regras ativas, muitas delas reverberam em todo output. Consultar `src/lib/rules/repository.ts` para ler.
