/**
 * Testes para CharacterService
 * Demonstra aplicação de SOLID principles na camada de serviço
 */

const { CharacterService } = require('./src/services');
const { InMemoryCharacterRepository } = require('./src/repositories');
const { CharacterSpecificationFactory } = require('./src/repositories/CharacterSpecification');
const { Character, CharacterName, CharacterLevel, CharacterClass } = require('./src/entities');
const { 
  CharacterNotFoundError, 
  CharacterAlreadyExistsError, 
  InvalidOperationError 
} = require('./src/errors');

async function testCharacterService() {
  console.log('=== TESTANDO CHARACTER SERVICE ===\n');

  try {
    // Dependency Injection: Injetando repositório no serviço
    console.log('🧪 Criando serviço com Dependency Injection...');
    const repository = new InMemoryCharacterRepository();
    const service = new CharacterService(repository);
    console.log('✅ CharacterService criado com sucesso');

    // Testando busca por nome
    console.log('\n🧪 Testando busca por nome...');
    const aragorn = await service.findCharacterByName('Aragorn');
    console.log(`✅ Aragorn encontrado: ${aragorn.describe()}`);

    // Testando busca por nome inexistente
    console.log('\n🧪 Testando busca por personagem inexistente...');
    try {
      await service.findCharacterByName('Sauron');
      console.log('❌ Deveria ter lançado CharacterNotFoundError');
    } catch (error) {
      if (error instanceof CharacterNotFoundError) {
        console.log(`✅ Erro capturado corretamente: ${error.message}`);
      } else {
        throw error;
      }
    }

    // Testando criação de personagem
    console.log('\n🧪 Testando criação de personagem...');
    const boromir = await service.createCharacter('Boromir', 'Guerreiro', 18);
    console.log(`✅ Boromir criado: ${boromir.describe()}`);

    // Testando criação de personagem duplicado
    console.log('\n🧪 Testando criação de personagem duplicado...');
    try {
      await service.createCharacter('Boromir', 'Paladino', 20);
      console.log('❌ Deveria ter lançado CharacterAlreadyExistsError');
    } catch (error) {
      if (error instanceof CharacterAlreadyExistsError) {
        console.log(`✅ Erro capturado corretamente: ${error.message}`);
      } else {
        throw error;
      }
    }

    // Testando level up
    console.log('\n🧪 Testando level up...');
    const levelBefore = boromir.level().value();
    const leveledUp = await service.levelUpCharacter('Boromir');
    const levelAfter = leveledUp.level().value();
    console.log(`✅ Boromir subiu de nível: ${levelBefore} → ${levelAfter}`);

    // Testando busca por classe
    console.log('\n🧪 Testando busca por classe...');
    const warriors = await service.findCharactersByClass('Guerreiro');
    console.log(`✅ Guerreiros encontrados (${warriors.length}):`);
    warriors.forEach(warrior => console.log(`   - ${warrior.describe()}`));

    // Testando busca por faixa de nível
    console.log('\n🧪 Testando busca por faixa de nível...');
    const midLevel = await service.findCharactersByLevelRange(10, 30);
    console.log(`✅ Personagens nível 10-30 (${midLevel.length}):`);
    midLevel.forEach(char => console.log(`   - ${char.describe()}`));

  } catch (error) {
    console.error('❌ Erro no teste básico:', error.message);
    throw error;
  }
}

async function testAdvancedFeatures() {
  console.log('\n=== TESTANDO RECURSOS AVANÇADOS ===\n');

  try {
    const repository = new InMemoryCharacterRepository();
    const service = new CharacterService(repository);

    // Adicionando mais personagens para testes avançados
    await service.createCharacter('Elrond', 'Mago', 85);
    await service.createCharacter('Galadriel', 'Mago', 95);
    await service.createCharacter('Faramir', 'Guerreiro', 22);

    // Testando oponentes viáveis
    console.log('🧪 Testando busca de oponentes viáveis...');
    const opponents = await service.findViableOpponents('Aragorn');
    console.log(`✅ Oponentes viáveis para Aragorn (${opponents.length}):`);
    opponents.forEach(opponent => console.log(`   - ${opponent.describe()}`));

    // Testando personagens experientes
    console.log('\n🧪 Testando busca de personagens experientes...');
    const experienced = await service.findExperiencedCharacters();
    console.log(`✅ Personagens experientes (${experienced.length}):`);
    experienced.forEach(char => console.log(`   - ${char.describe()}`));

    // Testando personagens mestres
    console.log('\n🧪 Testando busca de personagens mestres...');
    const masters = await service.findMasterCharacters();
    console.log(`✅ Personagens mestres (${masters.length}):`);
    masters.forEach(char => console.log(`   - ${char.describe()}`));

    // Testando guerreiros poderosos
    console.log('\n🧪 Testando busca de guerreiros poderosos...');
    const powerfulWarriors = await service.findPowerfulWarriors();
    console.log(`✅ Guerreiros poderosos (${powerfulWarriors.length}):`);
    powerfulWarriors.forEach(char => console.log(`   - ${char.describe()}`));

    // Testando specification customizada
    console.log('\n🧪 Testando specification customizada...');
    const customSpec = CharacterSpecificationFactory.byMinimumCombatPower(50)
      .and(CharacterSpecificationFactory.byNamePattern('G'));
    const customResults = await service.findCharactersBySpecification(customSpec);
    console.log(`✅ Personagens com 'G' no nome e poder 50+ (${customResults.length}):`);
    customResults.forEach(char => console.log(`   - ${char.describe()}`));

  } catch (error) {
    console.error('❌ Erro nos recursos avançados:', error.message);
    throw error;
  }
}

async function testStatistics() {
  console.log('\n=== TESTANDO ESTATÍSTICAS ===\n');

  try {
    const repository = new InMemoryCharacterRepository();
    const service = new CharacterService(repository);

    // Adicionando personagens variados
    await service.createCharacter('Thorin', 'Guerreiro', 45);
    await service.createCharacter('Radagast', 'Mago', 75);
    await service.createCharacter('Tauriel', 'Arqueiro', 30);

    console.log('🧪 Gerando estatísticas dos personagens...');
    const stats = await service.getCharacterStatistics();
    
    console.log('✅ Estatísticas geradas:');
    console.log(`   📊 Total de personagens: ${stats.total}`);
    console.log(`   📊 Distribuição por classe:`, JSON.stringify(stats.byClass, null, 6));
    console.log(`   📊 Distribuição por experiência:`, JSON.stringify(stats.levelDistribution, null, 6));
    console.log(`   📊 Nível médio: ${stats.averageLevel}`);
    console.log(`   📊 Maior nível: ${stats.highestLevel}`);
    console.log(`   📊 Menor nível: ${stats.lowestLevel}`);
    console.log(`   📊 Poder de combate total: ${stats.totalCombatPower.toFixed(1)}`);

  } catch (error) {
    console.error('❌ Erro nas estatísticas:', error.message);
    throw error;
  }
}

async function testErrorHandling() {
  console.log('\n=== TESTANDO TRATAMENTO DE ERROS ===\n');

  try {
    const repository = new InMemoryCharacterRepository();
    const service = new CharacterService(repository);

    console.log('🧪 Testando level up no nível máximo...');
    
    // Criar personagem no nível máximo
    const maxLevelChar = await service.createCharacter('MaxLevel', 'Mago', 100);
    
    try {
      await service.levelUpCharacter('MaxLevel');
      console.log('❌ Deveria ter lançado InvalidOperationError');
    } catch (error) {
      if (error instanceof InvalidOperationError) {
        console.log(`✅ Erro capturado corretamente: ${error.message}`);
      } else {
        throw error;
      }
    }

    console.log('\n🧪 Testando remoção de personagem...');
    const removed = await service.removeCharacter('MaxLevel');
    console.log(`✅ Personagem removido: ${removed}`);

    // Tentando remover novamente
    console.log('\n🧪 Testando remoção de personagem inexistente...');
    try {
      await service.removeCharacter('MaxLevel');
      console.log('❌ Deveria ter lançado CharacterNotFoundError');
    } catch (error) {
      if (error instanceof CharacterNotFoundError) {
        console.log(`✅ Erro capturado corretamente: ${error.message}`);
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('❌ Erro no tratamento de erros:', error.message);
    throw error;
  }
}

// Executar todos os testes
async function runAllServiceTests() {
  await testCharacterService();
  await testAdvancedFeatures();
  await testStatistics();
  await testErrorHandling();
  
  console.log('\n🎉 Todos os testes do CharacterService concluídos!');
  console.log('\n📚 PRINCÍPIOS SOLID DEMONSTRADOS NO SERVICE:');
  console.log('   ✅ Single Responsibility - Service focado apenas em lógica de aplicação');
  console.log('   ✅ Open/Closed - Extensível via strategies, fechado para modificação');
  console.log('   ✅ Liskov Substitution - Funciona com qualquer implementação de CharacterRepository');
  console.log('   ✅ Interface Segregation - Métodos específicos e focados');
  console.log('   ✅ Dependency Inversion - Depende de abstrações, não implementações');
  console.log('\n📚 PADRÕES APLICADOS:');
  console.log('   ✅ Command Pattern - Operações complexas encapsuladas');
  console.log('   ✅ Strategy Pattern - Diferentes estratégias de busca');
  console.log('   ✅ Specification Pattern - Critérios de busca flexíveis');
  console.log('   ✅ Error Handling - Erros específicos do domínio');
  console.log('   ✅ Logging - Sistema estruturado de logging');
}

runAllServiceTests().catch(console.error);