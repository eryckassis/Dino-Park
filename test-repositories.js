/**
 * Testes para repositórios e padrão Specification
 * Demonstra aplicação de Dependency Inversion Principle e Specification Pattern
 */

const { Character, CharacterName, CharacterLevel, CharacterClass } = require('./src/entities');
const { InMemoryCharacterRepository } = require('./src/repositories');
const { CharacterSpecificationFactory } = require('./src/repositories/CharacterSpecification');

async function testRepositories() {
  console.log('=== TESTANDO REPOSITÓRIOS ===\n');

  try {
    // Dependency Injection: Criando repositório
    console.log('🧪 Criando repositório em memória...');
    const repository = new InMemoryCharacterRepository();
    
    console.log(`✅ Repositório criado com ${await repository.count()} personagens iniciais`);
    console.log(`📊 Debug info:`, repository._debug());

    // Testando busca por nome
    console.log('\n🧪 Testando busca por nome...');
    const aragorn = await repository.findByName(new CharacterName('Aragorn'));
    const nonExistent = await repository.findByName(new CharacterName('Sauron'));
    
    console.log(`✅ Aragorn encontrado: ${aragorn ? aragorn.describe() : 'Não encontrado'}`);
    console.log(`✅ Sauron encontrado: ${nonExistent ? nonExistent.describe() : 'Não encontrado'}`);

    // Testando busca por classe
    console.log('\n🧪 Testando busca por classe...');
    const warriors = await repository.findByClass(new CharacterClass('Guerreiro'));
    const mages = await repository.findByClass(new CharacterClass('Mago'));
    
    console.log(`✅ Guerreiros encontrados (${warriors.length}):`);
    warriors.forEach(warrior => console.log(`   - ${warrior.describe()}`));
    
    console.log(`✅ Magos encontrados (${mages.length}):`);
    mages.forEach(mage => console.log(`   - ${mage.describe()}`));

    // Testando busca por faixa de nível
    console.log('\n🧪 Testando busca por faixa de nível...');
    const midLevelCharacters = await repository.findByLevelRange(
      new CharacterLevel(10),
      new CharacterLevel(30)
    );
    
    console.log(`✅ Personagens nível 10-30 (${midLevelCharacters.length}):`);
    midLevelCharacters.forEach(char => console.log(`   - ${char.describe()}`));

    // Testando salvamento
    console.log('\n🧪 Testando salvamento...');
    const newCharacter = new Character('Boromir', 'Guerreiro', 15);
    await repository.save(newCharacter);
    const savedCharacter = await repository.findByName(new CharacterName('Boromir'));
    
    console.log(`✅ Boromir salvo: ${savedCharacter.describe()}`);
    console.log(`✅ Total de personagens após salvamento: ${await repository.count()}`);

    // Testando métodos adicionais
    console.log('\n🧪 Testando métodos adicionais...');
    const experiencedChars = await repository.findExperiencedCharacters();
    console.log(`✅ Personagens experientes (${experiencedChars.length}):`);
    experiencedChars.forEach(char => console.log(`   - ${char.describe()}`));

    const opponents = await repository.findViableOpponents(newCharacter);
    console.log(`✅ Oponentes viáveis para Boromir (${opponents.length}):`);
    opponents.forEach(opponent => console.log(`   - ${opponent.describe()}`));

  } catch (error) {
    console.error('❌ Erro nos testes de repositório:', error.message);
  }
}

async function testSpecifications() {
  console.log('\n=== TESTANDO PADRÃO SPECIFICATION ===\n');

  try {
    const repository = new InMemoryCharacterRepository();

    // Adicionando mais personagens para testes
    await repository.save(new Character('Elrond', 'Mago', 80));
    await repository.save(new Character('Faramir', 'Guerreiro', 30));
    await repository.save(new Character('Galadriel', 'Mago', 95));

    console.log('🧪 Testando specifications simples...');

    // Specification por classe
    const warriorSpec = CharacterSpecificationFactory.byClass(new CharacterClass('Guerreiro'));
    const warriors = await repository.findBySpecification(warriorSpec);
    console.log(`✅ Guerreiros via specification (${warriors.length}):`);
    warriors.forEach(w => console.log(`   - ${w.describe()}`));

    // Specification por nível mínimo
    const highLevelSpec = CharacterSpecificationFactory.byMinimumLevel(new CharacterLevel(50));
    const highLevelChars = await repository.findBySpecification(highLevelSpec);
    console.log(`✅ Personagens nível 50+ (${highLevelChars.length}):`);
    highLevelChars.forEach(char => console.log(`   - ${char.describe()}`));

    // Specification por experiência
    const experiencedSpec = CharacterSpecificationFactory.experienced();
    const experienced = await repository.findBySpecification(experiencedSpec);
    console.log(`✅ Personagens experientes via specification (${experienced.length}):`);
    experienced.forEach(char => console.log(`   - ${char.describe()}`));

    console.log('\n🧪 Testando specifications compostas (AND/OR/NOT)...');

    // Specification composta: Guerreiros experientes
    const experiencedWarriors = warriorSpec.and(experiencedSpec);
    const expWarriors = await repository.findBySpecification(experiencedWarriors);
    console.log(`✅ Guerreiros experientes (${expWarriors.length}):`);
    expWarriors.forEach(char => console.log(`   - ${char.describe()}`));

    // Specification composta: Magos OU personagens muito experientes
    const mageSpec = CharacterSpecificationFactory.byClass(new CharacterClass('Mago'));
    const masterSpec = CharacterSpecificationFactory.masters();
    const magesOrMasters = mageSpec.or(masterSpec);
    const result = await repository.findBySpecification(magesOrMasters);
    console.log(`✅ Magos OU Mestres (${result.length}):`);
    result.forEach(char => console.log(`   - ${char.describe()}`));

    // Specification negada: NÃO guerreiros
    const nonWarriors = warriorSpec.not();
    const notWarriors = await repository.findBySpecification(nonWarriors);
    console.log(`✅ Não-guerreiros (${notWarriors.length}):`);
    notWarriors.forEach(char => console.log(`   - ${char.describe()}`));

    console.log('\n🧪 Testando specifications predefinidas...');

    // Specifications predefinidas do factory
    const powerfulWarriors = CharacterSpecificationFactory.powerfulWarriors();
    const pwWarriors = await repository.findBySpecification(powerfulWarriors);
    console.log(`✅ Guerreiros poderosos (${pwWarriors.length}):`);
    pwWarriors.forEach(char => console.log(`   - ${char.describe()}`));

    const expertMages = CharacterSpecificationFactory.expertMages();
    const expMages = await repository.findBySpecification(expertMages);
    console.log(`✅ Magos especialistas (${expMages.length}):`);
    expMages.forEach(char => console.log(`   - ${char.describe()}`));

    // Specification por padrão de nome
    const namePatternSpec = CharacterSpecificationFactory.byNamePattern('G');
    const gNames = await repository.findBySpecification(namePatternSpec);
    console.log(`✅ Personagens com 'G' no nome (${gNames.length}):`);
    gNames.forEach(char => console.log(`   - ${char.describe()}`));

    // Specification por poder de combate
    const powerSpec = CharacterSpecificationFactory.byMinimumCombatPower(50);
    const powerfulChars = await repository.findBySpecification(powerSpec);
    console.log(`✅ Personagens com poder 50+ (${powerfulChars.length}):`);
    powerfulChars.forEach(char => console.log(`   - ${char.describe()}`));

  } catch (error) {
    console.error('❌ Erro nos testes de specification:', error.message);
  }
}

// Executar todos os testes
async function runAllTests() {
  await testRepositories();
  await testSpecifications();
  console.log('\n🎉 Todos os testes de repositório e specification concluídos!');
  console.log('\n📚 PRINCÍPIOS DEMONSTRADOS:');
  console.log('   ✅ Dependency Inversion Principle - Interface abstrata para repositório');
  console.log('   ✅ Specification Pattern - Encapsulamento de critérios de busca');
  console.log('   ✅ Composite Pattern - Combinação de specifications');
  console.log('   ✅ Strategy Pattern - Diferentes estratégias de filtro');
  console.log('   ✅ Factory Pattern - Criação simplificada de specifications');
  console.log('   ✅ Single Responsibility - Cada specification tem um propósito');
  console.log('   ✅ Open/Closed Principle - Novas specifications sem modificar existentes');
}

runAllTests().catch(console.error);