# SEMANTIC_CROSS_REFERENCE_MAP.md — v3.0
## Mapa Semântico Obrigatório: Conteúdo → Número de Evidência

> **LIÇÃO APRENDIDA (Caso Renato Silveira v19→v23):**
> 7 referências cruzadas erradas no corpo da Cover Letter porque não existia um dicionário explícito
> vinculando cada entidade/pessoa/marca/documento ao seu número de evidência correto.
> MagicChá→26 (errado, era 30), INPI→23 (errado, era 25-32), Francelino→49 (errado, era 37),
> Laudo Contábil→71 (errado, era 50), Relatório Técnico→37 (errado, era 35).

---

## 1. REGRA INVIOLÁVEL

**ANTES de gerar qualquer texto da Cover Letter, o sistema DEVE construir e validar um mapa semântico completo.**
Este mapa é o "dicionário de verdade" — toda referência a uma evidência no corpo DEVE ser verificada contra ele.

---

## 2. ESTRUTURA DO MAPA

O mapa tem 6 categorias obrigatórias:

### 2.1 Marcas Registradas / Propriedade Intelectual
```
marca_evidencia = {
    "[Nome da Marca 1]": XX,    # Evidence XX = registro INPI
    "[Nome da Marca 2]": YY,    # Evidence YY = registro INPI
    ...
}
```
**Regra:** Toda menção a uma marca registrada (com ® ou referência a INPI) DEVE apontar para o número correto.

**Exemplo (Caso Renato):**
```python
marca_evidencia = {
    "Método Jejum Termogênico®": 25,
    "Renato Silveira dos Reis®": 26,
    "Bio Vitta®": 27,
    "Bioformula®": 28,
    "Chá&Shot®": 29,
    "MagicChá®": 30,
    "SkyCoffee®": 31,
    "H9®": 32,
}
# INTERVALO COMPLETO: Evidence 25-32 (quando referir "8 marcas registradas no INPI")
```

### 2.2 Pessoas / Recomendadores
```
pessoa_evidencia = {
    "[Nome da Pessoa 1]": XX,    # Evidence XX = carta de recomendação
    "[Nome da Pessoa 1] CV": XXa, # Evidence XXa = CV
    ...
}
```
**Regra:** Toda menção a um recomendador/validador DEVE apontar para o número da carta correspondente.

**Exemplo (Caso Renato):**
```python
pessoa_evidencia = {
    "Francelino Neto": 37,         # Carta Eduzz/Unifast
    "Jonathas Fernando": 38,       # Carta Action Suplementos
    "Júlio Caleiro": 39,           # Carta Naturopata
    "Pastor Antônio Júnior": 40,   # Carta Ministry/YouTube
    "Agnaldo Carvalho": 41,        # Carta Jadlog/Geopost
    "Elias Maman": 42,             # Carta CORE Educação
    "Elio Bonfim": 43,             # Carta WhatsFlow
}
```

### 2.3 Documentos Financeiros / Contábeis
```
documento_financeiro = {
    "[Tipo de Documento]": XX,
    ...
}
```
**Regra:** Toda menção a "Laudo Contábil", "DRE", "IRPF", "Balanço" etc. DEVE apontar para o número correto.

**Exemplo (Caso Renato):**
```python
documento_financeiro = {
    "DRE Cristais 2023": 45,
    "DRE Cristais 2024": 46,
    "Declaração do Contador": 49,
    "Laudo Contábil": 50,
    "DRE NewHealth 2024": 63,
    "DRE Bio Vitta 2024": 64,
    "Balanço Consolidado": 65,
    "CNDs": 66,
    "Folha de Pagamento": 67,
    "IRPF 2022": 68,
    "IRPF 2023": 69,
    "IRPF 2024": 70,
}
```

### 2.4 Veículos de Mídia / Publicações
```
veiculo_evidencia = {
    "[Nome do Veículo]": [XX, YY],  # pode ter múltiplas matérias
    ...
}
```

### 2.5 Empresas / Entidades Corporativas
```
empresa_evidencia = {
    "[Nome da Empresa]": XX,    # Evidence XX = documentação corporativa
    ...
}
```

### 2.6 Credenciais Acadêmicas / Profissionais
```
credencial_evidencia = {
    "[Diploma/Registro]": XX,
    ...
}
```

---

## 3. PROCESSO DE CONSTRUÇÃO DO MAPA

### Fase 1: Inventário (durante Phase 1 — Strategic Plan)
1. Listar TODAS as evidências do índice (Evidence 1 a N)
2. Para cada evidência, extrair: tipo, entidade principal, palavras-chave
3. Preencher as 6 categorias do mapa

### Fase 2: Validação (durante Phase 3 — Evidence Organization)
1. Para cada entrada do mapa, verificar que o PDF correspondente existe
2. Extrair texto do PDF e confirmar que o conteúdo bate com a categoria
3. Marcar entradas não verificáveis como `PENDENTE_VERIFICAÇÃO`

### Fase 3: Enforcement (durante Phase 2 — Production)
1. **Toda vez que o texto mencionar uma entidade do mapa**, verificar o número
2. Se o número no texto ≠ número no mapa → **FAIL — corrigir antes de continuar**
3. Registrar cada referência verificada em log

---

## 4. VALIDAÇÃO AUTOMÁTICA

### 4.1 Script de Verificação
Após gerar cada parte da Cover Letter, executar:

```python
import re

def validar_referencias(texto_xml, mapa):
    """Verifica todas as referências Evidence XX contra o mapa semântico."""
    erros = []

    # Extrair todas as menções "Evidence XX" do texto
    refs = re.findall(r'Evidence\s+(\d+)', texto_xml)

    # Para cada referência, buscar contexto (50 chars antes)
    for match in re.finditer(r'(.{0,80})(Evidence\s+(\d+))', texto_xml):
        contexto = match.group(1)
        ev_num = int(match.group(3))

        # Verificar contra cada categoria do mapa
        for entidade, num_correto in mapa.items():
            if entidade.lower() in contexto.lower():
                if isinstance(num_correto, int) and ev_num != num_correto:
                    erros.append({
                        'contexto': match.group(0),
                        'entidade': entidade,
                        'numero_encontrado': ev_num,
                        'numero_correto': num_correto,
                    })
                elif isinstance(num_correto, list) and ev_num not in num_correto:
                    erros.append({
                        'contexto': match.group(0),
                        'entidade': entidade,
                        'numero_encontrado': ev_num,
                        'numeros_corretos': num_correto,
                    })

    return erros
```

### 4.2 Verificação de Cobertura
```python
def verificar_cobertura(texto_xml, total_evidencias):
    """Verifica que todas as evidências são referenciadas pelo menos 1x."""
    refs = set(int(x) for x in re.findall(r'Evidence\s+(\d+)', texto_xml))
    esperadas = set(range(1, total_evidencias + 1))
    faltantes = esperadas - refs
    excedentes = refs - esperadas

    if faltantes:
        print(f"FAIL: Evidências nunca referenciadas: {sorted(faltantes)}")
    if excedentes:
        print(f"FAIL: Referências a evidências inexistentes: {sorted(excedentes)}")

    return len(faltantes) == 0 and len(excedentes) == 0
```

---

## 5. ERROS QUE ESTE MAPA TERIA PREVENIDO (Caso Renato)

| Erro | Como o Mapa Preveniria |
|---|---|
| MagicChá → Evidence 26 (errado) | mapa["MagicChá®"] = 30 → detectaria 26 ≠ 30 |
| INPI → Evidence 23 (errado) | Ao mencionar "INPI" + "8 marcas" → intervalo 25-32, não 23 |
| Francelino → Evidence 49 (errado) | mapa["Francelino"] = 37 → detectaria 49 ≠ 37 |
| Laudo Contábil → Evidence 71 (errado) | mapa["Laudo Contábil"] = 50 → detectaria 71 ≠ 50 |
| Relatório Técnico → Evidence 37 (errado) | mapa["Relatório Técnico"] = 35 → detectaria 37 ≠ 35 |
| Evidence 49-81 (excede máximo) | verificar_cobertura → detectaria referência a 81 quando max = 80 |
| Evidence 37 = CRF (PDF errado) | Fase 2: texto do PDF diz "Federal Council of Pharmacy" ≠ "Carta de Recomendação" |

---

## 6. TEMPLATE PARA NOVOS CASOS

Ao iniciar um novo caso, copiar e preencher:

```python
# === MAPA SEMÂNTICO — [NOME DO BENEFICIÁRIO] ===
# Gerado em: [DATA]
# Total de evidências: [N]

marca_evidencia = {
    # "Nome da Marca®": número_da_evidência,
}

pessoa_evidencia = {
    # "Nome Completo": número_da_evidência,  # Papel/Empresa
}

documento_financeiro = {
    # "Tipo do Documento": número_da_evidência,
}

veiculo_evidencia = {
    # "Nome do Veículo": [números],
}

empresa_evidencia = {
    # "Nome da Empresa": número_da_evidência,
}

credencial_evidencia = {
    # "Diploma/Registro": número_da_evidência,
}
```
