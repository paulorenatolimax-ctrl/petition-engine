# INSTRUÇÃO: Atualizar Sistema de Résumé (EB-1A e EB-2 NIW)

## O QUE ACONTECEU

O sistema de résumé que você está usando para gerar résumés EB-1A **não está funcionando direito**. Os résumés saíam com formatação errada (header sem barra Navy, footer errado, evidence blocks com thumbnail do lado errado, margens largas demais, etc.).

Fiz uma investigação profunda comparando os résumés que ficaram **perfeitos** (Thiago Fernandes, Rafael Almeida, André Cerbasi) com os que saíam errados, e identifiquei todos os problemas. Os arquivos de sistema corrigidos estão aqui:

## ARQUIVOS ATUALIZADOS (FONTE DA VERDADE)

### EB-1A (10 arquivos):
```
/Users/paulo1844/Documents/AIOS_Petition Engine/EB1A_RESUME_SYSTEM/
├── ARCHITECT_RESUME_EB1.md
├── FORBIDDEN_CONTENT_RESUME.md
├── FORMATTING_SPEC_RESUME.md        ← V2.0 Premium (o principal)
├── MAPA_DE_ERROS.md
├── PROTOCOLO_INTERACAO_RESUME.md
├── QUALITY_GATES_RESUME.md
├── QUALITY_REVIEWER.md              ← NOVO — script de QA obrigatório
├── README_RESUME.md
├── SISTEMA_RESUME_EB1A.md
└── TEMPLATE_RESUME.md
```

### EB-2 NIW (4 arquivos):
```
/Users/paulo1844/Documents/AIOS_Petition Engine/EB2_NIW_RESUME_SYSTEM/
├── FORMATTING_SPEC_RESUME_EB2NIW.md
├── QUALITY_REVIEWER.md              ← NOVO — script de QA obrigatório
├── SISTEMA_RESUME_EB2NIW.md
└── TEMPLATE_RESUME_EB2NIW.md
```

## O QUE VOCÊ DEVE FAZER

1. **Leia TODOS os arquivos** de ambas as pastas acima
2. **Substitua** os arquivos do sistema de résumé que você usa atualmente (seja onde for que estejam — `_sistema résumé auto`, Knowledge, project files, etc.) por estes arquivos atualizados
3. **NÃO apague** os arquivos de onde eles já existem em outros caminhos — só COPIE por cima / atualize
4. **Confirme** que está usando a versão atualizada

## O QUE ESTAVA ERRADO (pra você não repetir)

### Problemas graves que foram corrigidos:

1. **Header**: Deve ser uma TABELA Navy (#2D4F5F) 1×2 colunas no header do Word — nome à esquerda, contato à direita. Aparece em TODAS as páginas. NÃO é parágrafo simples.

2. **Footer**: "Page X of Y" alinhado à direita, Arial 9pt, cinza #666666. NÃO barra navy no footer (isso é da spec mas os benchmarks reais NÃO usam).

3. **Evidence Blocks**: Thumbnail na coluna DIREITA (não esquerda!). Description/Impact DENTRO da célula esquerda (não abaixo da tabela). Dimensões: metadata 5797 DXA, thumbnail 4743 DXA.

4. **Margens**: 0.59" laterais, ~0.4" topo. NÃO 1" padrão. Margens estreitas = mais espaço útil = visual premium.

5. **Section Headers**: Barra Navy full-width com texto branco centralizado, 11pt Bold.

6. **Fonte**: Arial em todo o documento (apesar da spec dizer Garamond — os benchmarks reais aprovados usam Arial).

7. **QUALITY_REVIEWER.md**: Script Python que DEVE rodar após cada build. Verifica fontes, cores, header, footer, evidence blocks, palavras proibidas. Se S0 ou S1 = rebuild obrigatório.

## BENCHMARKS DE REFERÊNCIA

Para conferir se o output está certo, compare com:
- **Thiago Fernandes**: 61 imagens, 78 tabelas, 153 parágrafos, ~54 páginas
- **André Cerbasi**: 37 imagens, 48 tabelas, ~12K chars
- **Rafael Almeida** (EB-2 NIW): benchmark do sistema EB-2

Os résumés desses três ficaram perfeitos. Se o seu output não se parece com eles, algo está errado.
