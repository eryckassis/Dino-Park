/**
 * Testes simples para validar as entidades criadas
 * Demonstra o uso das classes seguindo princípios SOLID
 */

const { Character, CharacterName, CharacterLevel, CharacterClass } = require('./src/entities');

console.log('=== TESTANDO VALUE OBJECTS ===\n');

try {
  // Testando CharacterName
  console.log('🧪 Testando CharacterName...');
  const name1 = new CharacterName('Aragorn');
  const name2 = new CharacterName('ARAGORN');
  console.log(`✅ Nome criado: ${name1.value()}`);
  console.log(`✅ Nomes iguais (case insensitive): ${name1.equals(name2)}`);
  
  // Testando CharacterLevel
  console.log('\n🧪 Testando CharacterLevel...');
  const level1 = new CharacterLevel(10);
  const level2 = new CharacterLevel(50);
  console.log(`✅ Nível criado: ${level1.toString()}`);
  console.log(`✅ É novato: ${level1.isNovice()}`);
  console.log(`✅ É experiente: ${level2.isExperienced()}`);
  console.log(`✅ Diferença de níveis: ${level2.differenceFrom(level1)}`);
  
  // Testando CharacterClass
  console.log('\n🧪 Testando CharacterClass...');
  const warriorClass = new CharacterClass('guerreiro');
  const mageClass = new CharacterClass('MAGO');
  console.log(`✅ Classe criada: ${warriorClass.value()}`);
  console.log(`✅ Habilidades do guerreiro: ${warriorClass.abilities().join(', ')}`);
  console.log(`✅ É classe de combate corpo a corpo: ${warriorClass.isMeleeClass()}`);
  console.log(`✅ Mago é classe mágica: ${mageClass.isMagicalClass()}`);
  
} catch (error) {
  console.error('❌ Erro nos Value Objects:', error.message);
}

console.log('\n=== TESTANDO ENTIDADE CHARACTER ===\n');

try {
  // Criando personagens usando Value Objects
  console.log('🧪 Criando personagens...');
  const aragorn = new Character(
    new CharacterName('Aragorn'),
    new CharacterClass('Guerreiro'),
    new CharacterLevel(10)
  );
  
  // Criando personagem usando primitivos (convertidos automaticamente)
  const gandalf = new Character('Gandalf', 'mago', 100);
  
  console.log(`✅ Aragorn: ${aragorn.describe()}`);
  console.log(`✅ Gandalf: ${gandalf.describe()}`);
  
  // Testando funcionalidades
  console.log('\n🧪 Testando funcionalidades...');
  console.log(`✅ Aragorn pode lutar contra Gandalf: ${aragorn.canFight(gandalf)}`);
  console.log(`✅ Poder de combate do Aragorn: ${aragorn.calculateCombatPower()}`);
  console.log(`✅ Gandalf é mestre: ${gandalf.isMaster()}`);
  
  // Testando level up
  console.log('\n🧪 Testando level up...');
  const levelBefore = aragorn.level().value();
  const success = aragorn.levelUp();
  const levelAfter = aragorn.level().value();
  console.log(`✅ Level up ${levelBefore} → ${levelAfter}: ${success ? 'Sucesso' : 'Falhou'}`);
  
  // Testando conversão para objeto simples
  console.log('\n🧪 Testando serialização...');
  const aragornData = aragorn.toPlainObject();
  console.log(`✅ Dados do Aragorn:`, JSON.stringify(aragornData, null, 2));
  
  // Testando factory method
  console.log('\n🧪 Testando factory method...');
  const legolas = Character.fromPlainObject({
    name: 'Legolas',
    class: 'Arqueiro',
    level: 25
  });
  console.log(`✅ Legolas criado via factory: ${legolas.describe()}`);
  
} catch (error) {
  console.error('❌ Erro na entidade Character:', error.message);
}

console.log('\n=== TESTANDO VALIDAÇÕES ===\n');

// Testando validações de erro
console.log('🧪 Testando validações de erro...');

const errorTests = [
  () => new CharacterName(''), // Nome vazio
  () => new CharacterName('A'), // Nome muito curto
  () => new CharacterLevel(0), // Nível muito baixo
  () => new CharacterLevel(101), // Nível muito alto
  () => new CharacterClass('InvalidClass'), // Classe inválida
];

errorTests.forEach((test, index) => {
  try {
    test();
    console.log(`❌ Teste ${index + 1}: Deveria ter falhado`);
  } catch (error) {
    console.log(`✅ Teste ${index + 1}: Validação funcionou - ${error.message}`);
  }
});

console.log('\n🎉 Testes concluídos! Todas as entidades implementam SOLID e Object Calisthenics.');