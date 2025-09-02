/**
 * Aplicação principal demonstrando todos os princípios SOLID implementados
 * 
 * Esta aplicação serve como exemplo prático de uso do sistema refatorado,
 * mostrando como todos os padrões e princípios trabalham juntos.
 */

const { CharacterService } = require('./src/services');
const { InMemoryCharacterRepository } = require('./src/repositories');
const { CharacterSpecificationFactory } = require('./src/repositories/CharacterSpecification');
const { Character, CharacterName, CharacterLevel, CharacterClass } = require('./src/entities');
const { LoggerFactory, LogLevel } = require('./src/utils');

/**
 * Factory para configuração da aplicação
 * Factory Pattern: Centraliza criação e configuração de componentes
 */
class ApplicationFactory {
  /**
   * Cria e configura serviços da aplicação com Dependency Injection
   */
  static createCharacterService() {
    // Dependency Injection: Repository injetado no Service
    const repository = new InMemoryCharacterRepository();
    const service = new CharacterService(repository);
    
    return service;
  }

  /**
   * Configura sistema de logging
   */
  static configureLogging(level = LogLevel.INFO) {
    const logger = LoggerFactory.forClass('DinosaurParkApplication', level);
    return logger;
  }
}

/**
 * Facade para simplificar uso do sistema
 * Facade Pattern: Interface simplificada para subsistemas complexos
 */
class DinosaurParkFacade {
  #service;
  #logger;

  constructor() {
    this.#service = ApplicationFactory.createCharacterService();
    this.#logger = ApplicationFactory.configureLogging();
  }

  async initializePark() {
    this.#logger.info('🦕 Inicializando Parque dos Dinossauros...');
    
    try {
      // Adiciona alguns personagens temáticos
      await this.#service.createCharacter('Rex', 'Guerreiro', 95);
      await this.#service.createCharacter('Velociraptor', 'Arqueiro', 85);
      await this.#service.createCharacter('Triceratops', 'Paladino', 70);
      await this.#service.createCharacter('Pteranodon', 'Mago', 60);
      
      this.#logger.info('✅ Parque inicializado com sucesso!');
    } catch (error) {
      this.#logger.logError(error, { operation: 'initializePark' });
      throw error;
    }
  }

  async displayParkStatus() {
    this.#logger.info('📊 Gerando relatório do parque...');
    
    const stats = await this.#service.getCharacterStatistics();
    const allCharacters = await this.#service.getAllCharacters();
    
    console.log('\n' + '='.repeat(50));
    console.log('🦕 RELATÓRIO DO PARQUE DOS DINOSSAUROS');
    console.log('='.repeat(50));
    
    console.log(`\n📊 ESTATÍSTICAS GERAIS:`);
    console.log(`   Total de criaturas: ${stats.total}`);
    console.log(`   Nível médio: ${stats.averageLevel}`);
    console.log(`   Poder de combate total: ${stats.totalCombatPower.toFixed(1)}`);
    
    console.log(`\n🏛️ DISTRIBUIÇÃO POR CLASSE:`);
    Object.entries(stats.byClass).forEach(([className, count]) => {
      console.log(`   ${className}: ${count} criatura(s)`);
    });
    
    console.log(`\n⭐ EXPERIÊNCIA:`);
    console.log(`   Novatos: ${stats.levelDistribution.novice}`);
    console.log(`   Experientes: ${stats.levelDistribution.experienced}`);
    console.log(`   Mestres: ${stats.levelDistribution.masters}`);
    
    console.log(`\n🦕 TODAS AS CRIATURAS:`);
    allCharacters.forEach((character, index) => {
      console.log(`   ${index + 1}. ${character.describe()}`);
    });
  }

  async simulateBattles() {
    this.#logger.info('⚔️ Simulando batalhas...');
    
    console.log('\n' + '='.repeat(50));
    console.log('⚔️ SIMULAÇÃO DE BATALHAS');
    console.log('='.repeat(50));
    
    try {
      const rex = await this.#service.findCharacterByName('Rex');
      const opponents = await this.#service.findViableOpponents('Rex');
      
      console.log(`\n🦖 ${rex.name().value()} pode lutar contra:`);
      opponents.forEach((opponent, index) => {
        const advantage = rex.calculateCombatPower() > opponent.calculateCombatPower() ? 
          '(Vantagem)' : '(Desvantagem)';
        console.log(`   ${index + 1}. ${opponent.describe()} ${advantage}`);
      });
      
      // Demonstra diferentes tipos de busca
      console.log('\n🏹 ARQUEIROS DISPONÍVEIS:');
      const archers = await this.#service.findCharactersByClass('Arqueiro');
      archers.forEach((archer, index) => {
        console.log(`   ${index + 1}. ${archer.describe()}`);
      });
      
      console.log('\n⚡ CRIATURAS PODEROSAS (Poder > 80):');
      const powerfulSpec = CharacterSpecificationFactory.byMinimumCombatPower(80);
      const powerful = await this.#service.findCharactersBySpecification(powerfulSpec);
      powerful.forEach((creature, index) => {
        console.log(`   ${index + 1}. ${creature.describe()}`);
      });
      
    } catch (error) {
      this.#logger.logError(error, { operation: 'simulateBattles' });
    }
  }

  async demonstrateEvolution() {
    this.#logger.info('🧬 Demonstrando evolução...');
    
    console.log('\n' + '='.repeat(50));
    console.log('🧬 EVOLUÇÃO DE CRIATURAS');
    console.log('='.repeat(50));
    
    try {
      // Cria uma criatura jovem
      const youngDino = await this.#service.createCharacter('Baby Raptor', 'Arqueiro', 5);
      console.log(`\n🥚 Criatura nasceu: ${youngDino.describe()}`);
      
      // Evolui através dos níveis
      for (let i = 0; i < 5; i++) {
        const evolved = await this.#service.levelUpCharacter('Baby Raptor');
        console.log(`📈 Evoluiu para: ${evolved.describe()}`);
        
        if (evolved.isExperienced()) {
          console.log('🎉 Tornou-se experiente!');
          break;
        }
      }
      
    } catch (error) {
      this.#logger.logError(error, { operation: 'demonstrateEvolution' });
    }
  }

  async runInteractiveDemo() {
    console.log('\n' + '='.repeat(60));
    console.log('🦕 BEM-VINDO AO PARQUE DOS DINOSSAUROS');
    console.log('📚 Demonstração de Princípios SOLID e Clean Code');
    console.log('='.repeat(60));
    
    try {
      await this.initializePark();
      await this.displayParkStatus();
      await this.simulateBattles();
      await this.demonstrateEvolution();
      
      console.log('\n' + '='.repeat(60));
      console.log('🎓 PRINCÍPIOS DEMONSTRADOS NESTA APLICAÇÃO');
      console.log('='.repeat(60));
      
      console.log('\n📋 SOLID PRINCIPLES:');
      console.log('   ✅ S - Single Responsibility: Cada classe tem uma única responsabilidade');
      console.log('   ✅ O - Open/Closed: Extensível via specifications e strategies');
      console.log('   ✅ L - Liskov Substitution: Diferentes repositórios intercambiáveis');
      console.log('   ✅ I - Interface Segregation: Interfaces específicas e focadas');
      console.log('   ✅ D - Dependency Inversion: Dependência de abstrações');
      
      console.log('\n🤸 OBJECT CALISTHENICS:');
      console.log('   ✅ Primitivos encapsulados em Value Objects');
      console.log('   ✅ Máximo 2 variáveis de instância por classe');
      console.log('   ✅ Uso de First Class Collections');
      console.log('   ✅ Métodos expressivos em vez de getters/setters');
      console.log('   ✅ Evitar uso de ELSE em favor de early returns');
      
      console.log('\n🏗️ DESIGN PATTERNS:');
      console.log('   ✅ Repository Pattern - Abstração para persistência');
      console.log('   ✅ Specification Pattern - Critérios de busca flexíveis');
      console.log('   ✅ Strategy Pattern - Diferentes algoritmos intercambiáveis');
      console.log('   ✅ Factory Pattern - Criação centralizada de objetos');
      console.log('   ✅ Command Pattern - Operações encapsuladas');
      console.log('   ✅ Facade Pattern - Interface simplificada');
      console.log('   ✅ Value Object Pattern - Encapsulamento de primitivos');
      
      console.log('\n🧹 CLEAN CODE PRACTICES:');
      console.log('   ✅ Nomes expressivos e intencionais');
      console.log('   ✅ Funções pequenas e focadas');
      console.log('   ✅ Tratamento adequado de erros');
      console.log('   ✅ Código autodocumentado');
      console.log('   ✅ Consistência de estilo');
      
      console.log('\n🎯 BACKEND JAVASCRIPT PRACTICES:');
      console.log('   ✅ Uso adequado de async/await');
      console.log('   ✅ Error handling com classes customizadas');
      console.log('   ✅ Logging estruturado');
      console.log('   ✅ Modularização adequada');
      console.log('   ✅ Separation of Concerns');
      
    } catch (error) {
      this.#logger.logError(error, { operation: 'runInteractiveDemo' });
      console.error('\n❌ Erro durante a demonstração:', error.message);
    }
  }
}

// Execução da aplicação
async function main() {
  const park = new DinosaurParkFacade();
  await park.runInteractiveDemo();
}

// Executa apenas se for chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DinosaurParkFacade, ApplicationFactory };