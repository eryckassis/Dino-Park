# Parque de Dinossauros – Documentação Técnica

## 1. Visão Geral e Objetivos

O projeto "Parque de Dinossauros" é uma aplicação backend desenvolvida em **Node.js** com **Express** e **MongoDB (Mongoose)** cujo objetivo é gerenciar entidades relacionadas a um parque temático de dinossauros. Contempla o cadastro, listagem e remoção de dinossauros, além da estrutura para gerenciamento de recintos (habitats). A arquitetura busca ser extensível, modular e alinhada a princípios de engenharia de software como **SOLID**, **Clean Code**, **KISS** e recomendações de **Object Calisthenics**.

### Propósito

- Fornecer uma API REST simples e evolutiva para operações CRUD de domínio.
- Estabelecer base arquitetural organizada para futura expansão (ex.: alocação de dinossauros em recintos, controle de capacidade, relatórios).
- Demonstrar boas práticas de modelagem com Mongoose e separação de responsabilidades.

### Escopo Atual

- Conexão com MongoDB.
- Modelos Mongoose: `Dinossauro` e `Recinto`.
- Repositórios para abstração de persistência.
- Rotas REST para dinossauros (`/dinossauros`).
- Script de inicialização que realiza seed inicial (exemplo didático).

### Fora do Escopo (ainda não implementado)

- Autenticação e autorização.
- Testes automatizados (unitários/integrados).
- Versionamento de API.
- Observabilidade (logs estruturados, métricas, tracing).

## 2. Arquitetura e Organização de Pastas

A organização segue um padrão modular visando clareza e expansão progressiva.

```text
src/
	index.js                  # Ponto de entrada (bootstrap da aplicação)
	controllers/
		mongo.js                # Conexão com MongoDB
	models/
		Dinossauro.js           # Schema e Model Mongoose de Dinossauro
		Recinto.js              # Schema e Model Mongoose de Recinto
	respositories/
		DinossauroRepository.js # Operações de persistência para Dinossauro
		RecintoRepository.js    # Operações de persistência para Recinto
	routes/
		dinossauro.js           # Definição das rotas REST de Dinossauro
	services/                 # (Reservado para regras de negócio mais complexas)
	entities/                 # (Legado: modelos de domínio puros, em transição)
```

### 2.1. Camadas e Responsabilidades

| Camada          | Responsabilidade Principal                                                         | Observações                                      |
| --------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------ |
| `index.js`      | Inicializar servidor, conectar ao banco, registrar rotas e semear dados de exemplo | Evitar lógica de domínio extensa                 |
| `controllers`   | Coordenação de aspectos técnicos (ex.: conexão a banco)                            | Pode evoluir para controladores HTTP             |
| `models`        | Definição de Schemas e Models Mongoose                                             | Define constraints e valores padrão              |
| `respositories` | Abstração de persistência (CRUD)                                                   | Facilita testes e futura troca de ODM/BD         |
| `routes`        | Mapeamento HTTP → handlers                                                         | Deve permanecer fino e delegar regras            |
| `services`      | Regras de negócio (futuro)                                                         | Orquestra operações complexas                    |
| `entities`      | Modelos de domínio puros (legado)                                                  | Podem ser removidos ou absorvidos pelos serviços |

### 2.2. Justificativa da Abordagem em Camadas

1. **Separação de Responsabilidades (SRP)**: Cada diretório tem foco reduzindo acoplamento.
2. **Evolução Controlada**: A introdução futura de `services` isola regras de negócio.
3. **Testabilidade**: Repositórios e serviços podem ser mockados.
4. **Substituibilidade**: Troca de banco demanda alterações pontuais.

### 2.3. Fluxo Resumido de uma Requisição (GET /dinossauros)

1. Cliente envia requisição para `/dinossauros`.
2. Express roteia para o handler em `routes/dinossauro.js`.
3. Handler consulta o Model `Dinossauro` (ou repositório, em evolução futura).
4. Resposta JSON retornada ao cliente.

### 2.4. Evolução Recomendada do Fluxo (Camada de Serviço)

Futuro: rota → serviço (validações, regras) → repositório → model → banco.

## 3. Modelagem de Dados (MongoDB / Mongoose)

### 3.1. Dinossauro

Campos:

- `nome` (String, obrigatório, trim)
- `especie` (String, obrigatório, trim)
- `idade` (Number, padrão 0, mínimo 0)
- `recintoId` (ObjectId, referência opcional a `Recinto`)

Decisões:

- Uso de `trim` para sanitização.
- `recintoId` é opcional permitindo criação antes de alocar habitat.
- Validação de tipos delegada ao Mongoose.

### 3.2. Recinto

Campos:

- `tipo` (String, obrigatório) – ex.: Carnivoro, Herbivoro.
- `nome` (String, obrigatório, único desejável futuramente).
- `capacidade` (Number, mínimo 1) – limite de dinossauros.

### 3.3. Relacionamentos

Relação 1:N – um `Recinto` pode conter vários dinossauros (referência armazenada no `Dinossauro`). Futuro: criar índice composto ou campo derivado para contagem e validação de capacidade.

### 3.4. Considerações Futuras

- Índices: `{ nome: 1 }` em Dinossauro e Recinto para busca rápida.
- Restrições adicionais: unicidade de `nome` de recinto.
- Validação de compatibilidade (`tipo` do recinto vs espécie) via serviço.

## 4. Fluxo de Execução e Ciclo de Vida

1. Carregamento de dependências em `index.js`.
2. Execução de `connectMongo()` com tratamento de erro e encerramento em falha.
3. Inicialização do servidor Express e registro de rotas.
4. Execução de bloco assíncrono para semear dados (exemplo didático).
5. Atendimento de requisições REST.

Risco atual: o seed executa a cada inicialização podendo gerar duplicações. Recomenda-se mecanismo idempotente.

## 5. API REST Atual

Base URL padrão: `http://localhost:3000`

### 5.1. Listar Dinossauros

`GET /dinossauros`

Resposta 200:

```json
[
  {
    "_id": "...",
    "nome": "Rex",
    "especie": "Tyranossaurus",
    "idade": 5,
    "recintoId": null
  }
]
```

### 5.2. Criar Dinossauro

`POST /dinossauros`

Body JSON:

```json
{ "nome": "Blue", "especie": "Velociraptor", "idade": 2 }
```

Respostas:

- 201 Created (objeto persistido)
- 400 Bad Request (falha de validação)

### 5.3. Remover Dinossauro

`DELETE /dinossauros/:id`

Respostas:

- 200 (mensagem de sucesso)
- 404 (não encontrado)

## 6. Aplicação de SOLID

| Princípio | Situação Atual                           | Oportunidade de Melhoria                                      |
| --------- | ---------------------------------------- | ------------------------------------------------------------- |
| SRP       | Camadas separadas (models, repos, rotas) | Mover lógica de seed e futuras regras para `services`         |
| OCP       | Repositórios permitem extensão           | Isolar interfaces e permitir múltiplas implementações         |
| LSP       | Não aplicável diretamente ainda          | Definir interfaces para repositórios antes de especializações |
| ISP       | Interfaces ainda inexistentes            | Criar interfaces finas para serviços (ex.: AlocacaoService)   |
| DIP       | Rotas dependem diretamente de Models     | Introduzir inversão via injeção de repositórios/serviços      |

## 7. Object Calisthenics

Regras (resumo) e estado:
Lista de regras e situação:

1. **Small Classes**: Estrutura enxuta. Serviços ainda não criados (melhorar ao extrair regras).
2. **Small Methods**: Handlers curtos; manter assim ao evoluir.
3. **No Primitives Obsession**: Ainda há uso de tipos primitivos para espécie/tipo; pode-se criar Value Objects futuros.
4. **Use First-Class Collections**: Listas retornadas diretamente; pode-se encapsular coleção de dinossauros se regras agregadas surgirem.
5. **One Level of Indentation per Method**: Atendido na maioria dos métodos.
6. **No Else**: Pouco uso de `else`; early return pode ser reforçado.
7. **Wrap All Primitives and Strings**: Futuro para atributos sensíveis (ex.: NomeDinossauro).
8. **First-Class Collections**: Ver item 4.
9. **No Classes with More Than Two Instance Variables**: Models Mongoose possuem poucos campos – adequado.

## 8. KISS e Clean Code

Aplicações:
Lista de aspectos aplicados:

- Estrutura mínima necessária (KISS).
- Nomes descritivos (`DinossauroRepository`, `connectMongo`).
- Evita lógica complexa nas rotas (Clean Code – thin controllers).
- Uso de defaults e validações no schema reduz boilerplate.

Melhorias sugeridas:
Melhorias sugeridas:

- Introduzir camada de serviços para não ampliar rotas.
- Remover duplicação de seed repetido.
- Centralizar mensagens de erro.

## 9. Validações, Erros e Boas Práticas

Atual:
Situação atual:

- Validações de obrigatoriedade e tipos delegadas ao Mongoose.
- Try/catch em criação de dinossauro (rota POST).
- Encerramento do processo em falha de conexão (fail fast).

Sugestões:
Recomendações:

- Middleware global de tratamento de erros.
- Padronização de payload de erro: `{ codigo, mensagem, detalhe }`.
- Validação adicional semântica (compatibilidade de recinto) em serviço.

## 10. Segurança e Boas Práticas Operacionais

Itens a considerar:
Itens a considerar:

- Uso de variáveis de ambiente (`dotenv`) para URI do Mongo.
- Desabilitar seed automático em produção.
- Logs estruturados (ex.: pino / winston).
- Rate limiting (ex.: para POST/DELETE).
- Helmet para cabeçalhos HTTP de segurança.

## 11. Próximos Passos (Backlog Técnico)

| Prioridade | Item                                                         | Justificativa                                    |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------ |
| Alta       | Idempotência do seed                                         | Evitar dados duplicados                          |
| Alta       | Camada de serviços                                           | Encapsular regras e evitar crescimento das rotas |
| Alta       | Alocação de dinossauro a recinto com validação de capacidade | Requisito de domínio                             |
| Média      | Testes unitários e de integração                             | Garantia de qualidade                            |
| Média      | Middleware de erros                                          | Respostas consistentes                           |
| Média      | Variáveis de ambiente                                        | Configuração segura                              |
| Baixa      | Value Objects (Nome, Espécie)                                | Robustez semântica                               |
| Baixa      | Documentação OpenAPI/Swagger                                 | Facilidade de consumo                            |

## 12. Execução do Projeto

Pré-requisitos: Node.js LTS, MongoDB em execução local (`mongodb://localhost:27017`).

Instalação de dependências:

```bash
npm install
```

Execução:

```bash
node src/index.js
```

## 13. Qualidade e Manutenibilidade

- Baixo acoplamento inicial.
- Fácil extensão de endpoints.
- Repositórios simplificam substituição de persistência.

## 14. Licença

Projeto didático; nenhuma licença específica definida ainda.

---

Documento completo – versão inicial consolidada.

## 15. Concurrency e Condições de Corrida

### 15.1. Conceito

Condição de corrida ocorre quando duas ou mais operações concorrentes acessam e modificam o mesmo recurso sem coordenação adequada, produzindo estado inconsistente. Em aplicações com banco de dados, isso pode gerar efeitos como ultrapassar capacidade, duplicar registros ou retornar dados parcialmente atualizados.

### 15.2. Cenários de Risco no Projeto

- Criação simultânea do mesmo dinossauro (mesmo `nome`).
- Alocação concorrente de múltiplos dinossauros no mesmo recinto (risco de exceder `capacidade`).
- Seed executado repetidamente em múltiplas instâncias (dados duplicados).
- Remoção de dinossauro enquanto outra requisição tenta associá-lo a um recinto.
- Atualização de `recintoId` enquanto o recinto é removido (estado órfão).

### 15.3. Estratégias de Mitigação

1. **Índices Únicos**: Definir `unique: true` (ex.: campo `nome` de Recinto e, se regra de negócio exigir, de Dinossauro) evita duplicação em nível de banco.
2. **Verificação Atômica de Capacidade**: Em vez de contar manualmente e depois inserir, usar padrão de atualização condicional / transação.
   - Variante simples: contar e comparar dentro de uma transação (necessita replicaset: `mongod --replSet rs0`).
   - Padrão: manter no Recinto um campo `ocupado` e usar `findOneAndUpdate({ _id, ocupado: { $lt: capacidade } }, { $inc: { ocupado: 1 } })` antes de criar o dinossauro.
3. **Transações (Sessions Mongoose)**: Agrupar sequência (incrementar ocupação + criar dinossauro) garantindo atomicidade.
4. **Optimistic Locking**: Usar `versionKey` (`__v`) para detectar atualização concorrente; ao salvar, erro de versão sinaliza retry.
5. **Idempotência de Seed**: Substituir inserções simples por `updateOne({ nome: ... }, { $setOnInsert: {...} }, { upsert: true })` evitando duplicações.
6. **Soft Delete / Flags**: Antes de remoções físicas, marcar como inativo para evitar condição em curso (dependendo de requisitos futuros).
7. **Timeouts e Retry Exponencial**: Ao detectar erro de concorrência (duplicate key, version error), reprocessar com limite de tentativas.

### 15.4. Exemplo de Alocação Atômica (Pseudo-código Serviço)

```javascript
async function alocarDinossauroNoRecinto(dinoData, recintoId, session) {
  const recinto = await Recinto.findOneAndUpdate(
    { _id: recintoId, ocupado: { $lt: capacidade } },
    { $inc: { ocupado: 1 } },
    { new: true, session }
  );
  if (!recinto) throw new Error("Capacidade esgotada");
  const dino = await Dinossauro.create([{ ...dinoData, recintoId }], {
    session,
  });
  return dino[0];
}
```

Requer campo adicional `ocupado` no schema de Recinto e ambiente com transações habilitadas.

### 15.5. Detecção vs Prevenção

- **Prevenção**: constraints (unique), transações e atualizações condicionais.
- **Detecção**: optimistic locking (falha tardia) para retry.

### 15.6. Decisões Recomendadas (Prioridade)

| Ordem | Ação                                           | Justificativa                 |
| ----- | ---------------------------------------------- | ----------------------------- |
| 1     | Idempotência de seed                           | Evita sujar ambiente          |
| 2     | Índice único em `Recinto.nome`                 | Consistência de referência    |
| 3     | Campo `ocupado` + update atômico               | Garante capacidade            |
| 4     | Transações para alocação                       | Atomicidade completa          |
| 5     | Optimistic locking para atualizações complexas | Controle fino de concorrência |

## 16. Resolução de Problemas (FAQ Técnico)

| Problema                                         | Causa Raiz                                                               | Solução Aplicada / Recomendada                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `ReferenceError: require is not defined`         | Projeto marcado como ES Module (`"type": "module"`) mas uso de `require` | Migrar para `import/export` ou remover `"type": "module"` se quiser CommonJS |
| `TypeError: Dinossauro is not a constructor`     | Exportação incorreta (faltava `export default`) ou import errado         | Garantir `export default` no model e usar `import Dinossauro from ...`       |
| `ERR_MODULE_NOT_FOUND`                           | Falta de extensão `.js` em import ES Modules                             | Adicionar sufixo `.js` em todos os imports relativos                         |
| `connectMongo is not a function`                 | Export nomeado vs default inconsistente                                  | Unificar para `export default` e ajustar import                              |
| `Cannot read properties of null (reading '_id')` | Consulta a Recinto antes de criar (ordem de execução)                    | Reordenar seed: criar recintos antes de referenciá-los e validar retorno     |
| Duplicação de registros em reinicialização       | Seed sempre insere dados                                                 | Tornar seed idempotente (upsert) ou condicional a ambiente                   |
| Mistura de repositório e acesso direto a Model   | Duplicação de lógica e inconsistência                                    | Centralizar acesso via repositórios ou via serviços abstraídos               |
| Crescimento não controlado das rotas             | Lógica de domínio dentro de handlers                                     | Extrair para camada de serviços                                              |
| Falta de validação de capacidade                 | Não existe controle transacional                                         | Implementar fluxo atômico conforme seção 15                                  |
| Nomes divergentes (`respositories`)              | Erro de digitação no nome do diretório                                   | Renomear para `repositories` (alterar imports)                               |

### 16.1. Padrão para Investigar Erros

1. Registrar mensagem completa e stack trace.
2. Classificar: configuração, dependência, lógica de domínio, concorrência.
3. Reproduzir em ambiente local isolado.
4. Criar teste que falha (quando houver suíte de testes).
5. Corrigir com mudança mínima.
6. Documentar no README (tabela acima) se recorrente.

### 16.2. Códigos de Erro Recomendados (Futuro)

| Código            | Situação                                   |
| ----------------- | ------------------------------------------ |
| DINO_DUPLICATE    | Tentativa de criar dinossauro já existente |
| RECINTO_CAPACITY  | Capacidade excedida                        |
| RECINTO_NOT_FOUND | Recinto inexistente                        |
| DINO_NOT_FOUND    | Dinossauro não encontrado                  |
| VALIDATION_FAILED | Erro de validação de entrada               |
| INTERNAL_ERROR    | Falha inesperada                           |

## 17. Atualização do Backlog (Concorrência e Robustez)

| Prioridade | Item                                              | Justificativa                                        |
| ---------- | ------------------------------------------------- | ---------------------------------------------------- |
| Alta       | Seed idempotente (upsert)                         | Eliminar duplicação (condição de corrida e reinício) |
| Alta       | Índice único `Recinto.nome`                       | Integridade de referência                            |
| Alta       | Fluxo atômico de alocação (`ocupado` + transação) | Evitar ultrapassar capacidade                        |
| Média      | Otimistic locking para atualizações complexas     | Detectar conflitos                                   |
| Média      | Middleware de erro padronizado                    | Consistência de respostas                            |
| Média      | Refatorar `respositories` → `repositories`        | Clareza e padrão                                     |
| Baixa      | Value Objects (Nome, Espécie)                     | Semântica forte                                      |
| Baixa      | Soft delete para Recinto                          | Evitar órfãos temporários                            |
| Baixa      | OpenAPI/Swagger                                   | Comunicação externa                                  |
