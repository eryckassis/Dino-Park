# 🦕 Dino Park - Demonstração de Princípios SOLID e Clean Code

## 📖 Visão Geral

Este projeto demonstra a aplicação prática de **princípios SOLID**, **Object Calisthenics**, **Clean Code** e boas práticas de **backend JavaScript** através de um sistema de gerenciamento de personagens temático sobre dinossauros.

## 🎯 Objetivos Didáticos

O projeto foi desenvolvido com foco total em:

- ✅ **Princípios SOLID**
- ✅ **Object Calisthenics**  
- ✅ **Clean Code** (baseado no livro Clean Code)
- ✅ **The Pragmatic Programmer**
- ✅ **Padrões de Design (Design Patterns)**
- ✅ **Práticas de Backend JavaScript**

## 🏗️ Arquitetura

```
src/
├── entities/           # Entidades de domínio e Value Objects
├── repositories/       # Padrão Repository e Specifications
├── services/          # Camada de aplicação
├── errors/            # Tratamento de erros específicos do domínio
├── utils/            # Utilitários (Logging, etc.)
└── index.js          # Ponto de entrada da aplicação
```

## 📋 Princípios SOLID Implementados

### S - Single Responsibility Principle
- **CharacterName**: Responsável apenas por validar e representar nomes
- **CharacterLevel**: Gerencia exclusivamente níveis de personagem
- **CharacterClass**: Controla informações sobre classes
- **CharacterService**: Focado apenas na lógica de aplicação
- **InMemoryCharacterRepository**: Responsável apenas por persistência em memória

### O - Open/Closed Principle
- **Specifications**: Novas specifications podem ser adicionadas sem modificar existentes
- **Repository**: Novas implementações podem ser criadas sem alterar a interface
- **Strategies de Logging**: Diferentes estratégias podem ser implementadas

### L - Liskov Substitution Principle
- **CharacterRepository**: Qualquer implementação pode substituir a interface
- **LogStrategy**: Diferentes estratégias de log são intercambiáveis
- **Specifications**: Todas seguem o mesmo contrato base

### I - Interface Segregation Principle
- **CharacterRepository**: Interface focada apenas em operações de repositório
- **CharacterSpecification**: Interface específica para critérios de busca
- **LogStrategy**: Interface dedicada apenas ao logging

### D - Dependency Inversion Principle
- **CharacterService** depende da abstração `CharacterRepository`, não da implementação
- **Logger** depende da abstração `LogStrategy`
- **Dependency Injection** usado em toda a aplicação

## 🤸 Object Calisthenics Aplicados

### 1. Encapsular Primitivos
```javascript
// ❌ Antes: Primitivos expostos
const character = { name: "Aragorn", level: 10 };

// ✅ Depois: Value Objects
const character = new Character(
  new CharacterName("Aragorn"),
  new CharacterClass("Guerreiro"), 
  new CharacterLevel(10)
);
```

### 2. First Class Collections
```javascript
// Collections são encapsuladas em classes específicas
class CharacterRepository {
  #characters = new Map(); // Coleção como primeira classe
}
```

### 3. Máximo 2 Variáveis por Classe
```javascript
class Character {
  #name;        // Variável 1: Informações de identidade
  #attributes;  // Variável 2: Atributos (level, class, etc agrupados)
}
```

### 4. Métodos Expressivos (Sem Getters/Setters)
```javascript
// ❌ Evitado
character.getLevel();

// ✅ Preferido  
character.level().value();
character.isExperienced();
character.canFight(opponent);
```

## 🧹 Práticas Clean Code

### Nomes Expressivos
- `CharacterNotFoundError` em vez de `Error1`
- `findCharactersBySpecification` em vez de `search`
- `calculateCombatPower` em vez de `calc`

### Funções Pequenas e Focadas
- Cada método tem uma única responsabilidade
- Máximo 20-30 linhas por função
- Parâmetros bem definidos

### Tratamento de Erros
- Classes de erro específicas do domínio
- Fail Fast pattern
- Logging estruturado de erros

## 🏗️ Padrões de Design Implementados

### Repository Pattern
```javascript
// Abstração para persistência
class CharacterRepository {
  async findByName(name) { /* ... */ }
  async save(character) { /* ... */ }
}
```

### Specification Pattern
```javascript
// Critérios de busca encapsulados
const powerfulWarriors = CharacterSpecificationFactory
  .byClass(new CharacterClass('Guerreiro'))
  .and(CharacterSpecificationFactory.byMinimumLevel(new CharacterLevel(20)));
```

### Strategy Pattern
```javascript
// Diferentes estratégias de logging
const consoleLogger = new Logger(new ConsoleLogStrategy());
const fileLogger = new Logger(new FileLogStrategy('app.log'));
```

### Factory Pattern
```javascript
// Criação centralizada
const service = ApplicationFactory.createCharacterService();
const logger = LoggerFactory.forService('CharacterService');
```

### Command Pattern
```javascript
// Operações encapsuladas
await service.levelUpCharacter('Aragorn'); // Comando complexo encapsulado
```

### Facade Pattern
```javascript
// Interface simplificada para subsistemas
class DinosaurParkFacade {
  async runInteractiveDemo() { /* Simplifica uso de múltiplos subsistemas */ }
}
```

## 🚀 Como Executar

### Executar aplicação principal:
```bash
node main.js
```

### Executar testes das entidades:
```bash
node test-entities.js
```

### Executar testes dos repositórios:
```bash
node test-repositories.js  
```

### Executar testes dos serviços:
```bash
node test-services.js
```

## 📚 Exemplos de Uso

### Criação de Personagem
```javascript
const service = new CharacterService(repository);

// Com Value Objects
const character = await service.createCharacter(
  new CharacterName('Rex'),
  new CharacterClass('Guerreiro'),
  new CharacterLevel(95)
);

// Com primitivos (convertidos automaticamente)
const character2 = await service.createCharacter('Gandalf', 'Mago', 100);
```

### Busca com Specifications
```javascript
// Specifications simples
const warriors = await service.findCharactersByClass('Guerreiro');

// Specifications compostas  
const powerfulMages = await service.findCharactersBySpecification(
  CharacterSpecificationFactory.byClass(new CharacterClass('Mago'))
    .and(CharacterSpecificationFactory.byMinimumCombatPower(80))
);
```

### Operações de Negócio
```javascript
// Level up
const leveledUp = await service.levelUpCharacter('Aragorn');

// Buscar oponentes viáveis
const opponents = await service.findViableOpponents('Rex');

// Estatísticas
const stats = await service.getCharacterStatistics();
```

## 🎓 Benefícios da Refatoração

### Antes (Código Original)
- ❌ Funções duplicadas e incompletas
- ❌ Hard-coded data
- ❌ Sem separação de responsabilidades
- ❌ Naming inconsistente
- ❌ Ausência de tratamento de erros
- ❌ Código não seguia princípios SOLID

### Depois (Código Refatorado)
- ✅ Princípios SOLID aplicados rigorosamente
- ✅ Object Calisthenics implementado
- ✅ Clean Code em todas as práticas
- ✅ Arquitetura bem definida e extensível
- ✅ Testes abrangentes e didáticos
- ✅ Documentação completa
- ✅ Tratamento robusto de erros
- ✅ Logging estruturado
- ✅ Padrões de design bem aplicados

## 🔧 Tecnologias e Conceitos

- **Node.js** - Runtime JavaScript
- **ES6+ Features** - Classes, Modules, Async/Await
- **Design Patterns** - Repository, Specification, Strategy, Factory, Command, Facade
- **SOLID Principles** - Todos os 5 princípios aplicados
- **Object Calisthenics** - 9 regras implementadas  
- **Clean Code** - Práticas do livro Clean Code
- **Domain-Driven Design** - Conceitos de DDD aplicados
- **Error Handling** - Classes customizadas de erro
- **Logging** - Sistema estruturado de logs
- **Testing** - Testes didáticos e abrangentes

## 📖 Estrutura Didática

O projeto foi organizado em **fases incrementais**:

1. **Fase 1**: Entidades e Value Objects
2. **Fase 2**: Repositórios e Specifications  
3. **Fase 3**: Serviços e Tratamento de Erros
4. **Fase 4**: Aplicação Principal e Demonstrações

Cada fase demonstra princípios específicos e builds sobre a anterior, facilitando o aprendizado progressivo.

## 🏆 Conclusão

Este projeto serve como **referência completa** para implementação de:
- Princípios SOLID em JavaScript
- Object Calisthenics na prática
- Clean Code e boas práticas
- Arquitetura bem estruturada
- Padrões de design aplicados corretamente
- Práticas modernas de backend JavaScript

É uma demonstração prática de como código bem estruturado, seguindo princípios sólidos, resulta em software mais maintível, extensível e profissional.
