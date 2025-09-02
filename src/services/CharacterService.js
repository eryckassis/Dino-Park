const { Character, CharacterName, CharacterClass, CharacterLevel } = require('../entities');
const { CharacterRepository } = require('../repositories');
const { CharacterSpecificationFactory } = require('../repositories/CharacterSpecification');
const { ErrorFactory, CharacterNotFoundError, CharacterAlreadyExistsError } = require('../errors');
const { LoggerFactory } = require('../utils');

/**
 * Serviço de personagens - Camada de aplicação
 * 
 * PRINCÍPIOS APLICADOS:
 * - Single Responsibility: Responsável apenas pela lógica de aplicação de personagens
 * - Dependency Inversion: Depende da abstração CharacterRepository
 * - Open/Closed: Aberto para extensão via estratégias, fechado para modificação
 * - Interface Segregation: Métodos focados e específicos
 * - Command Pattern: Operações complexas encapsuladas
 * - Strategy Pattern: Diferentes estratégias de busca
 */
class CharacterService {
  #repository;
  #logger;

  /**
   * Constructor com Dependency Injection
   * @param {CharacterRepository} repository - Repositório de personagens
   */
  constructor(repository) {
    if (!repository || !(repository instanceof CharacterRepository)) {
      throw ErrorFactory.invalidRepository();
    }

    this.#repository = repository;
    this.#logger = LoggerFactory.forService('CharacterService');
  }

  // === OPERAÇÕES DE CONSULTA ===

  /**
   * Busca um personagem por nome
   * @param {string|CharacterName} name - Nome do personagem
   * @returns {Promise<Character>} Personagem encontrado
   * @throws {CharacterNotFoundError} Se personagem não encontrado
   */
  async findCharacterByName(name) {
    const characterName = name instanceof CharacterName ? name : new CharacterName(name);
    
    this.#logger.info('Searching for character', { name: characterName.value() });

    try {
      const character = await this.#repository.findByName(characterName);
      
      if (!character) {
        const error = ErrorFactory.characterNotFound(characterName.value());
        this.#logger.warn('Character not found', { name: characterName.value() });
        throw error;
      }

      this.#logger.debug('Character found successfully', { 
        name: character.name().value(),
        class: character.characterClass().value(),
        level: character.level().value()
      });

      return character;
    } catch (error) {
      this.#logger.logError(error, { operation: 'findCharacterByName', name: characterName.value() });
      throw error;
    }
  }

  /**
   * Lista todos os personagens
   * @returns {Promise<Character[]>} Array com todos os personagens
   */
  async getAllCharacters() {
    this.#logger.info('Retrieving all characters');

    try {
      const characters = await this.#repository.findAll();
      
      this.#logger.debug('Characters retrieved successfully', { 
        count: characters.length 
      });

      return characters;
    } catch (error) {
      this.#logger.logError(error, { operation: 'getAllCharacters' });
      throw error;
    }
  }

  /**
   * Busca personagens por classe
   * Strategy Pattern: Diferentes estratégias de busca
   */
  async findCharactersByClass(className) {
    const characterClass = className instanceof CharacterClass ? 
      className : new CharacterClass(className);

    this.#logger.info('Searching characters by class', { class: characterClass.value() });

    try {
      const characters = await this.#repository.findByClass(characterClass);
      
      this.#logger.debug('Characters found by class', { 
        class: characterClass.value(),
        count: characters.length 
      });

      return characters;
    } catch (error) {
      this.#logger.logError(error, { operation: 'findCharactersByClass', class: className });
      throw error;
    }
  }

  /**
   * Busca personagens por faixa de nível
   */
  async findCharactersByLevelRange(minLevel, maxLevel) {
    const min = minLevel instanceof CharacterLevel ? minLevel : new CharacterLevel(minLevel);
    const max = maxLevel instanceof CharacterLevel ? maxLevel : new CharacterLevel(maxLevel);

    this.#logger.info('Searching characters by level range', { 
      minLevel: min.value(), 
      maxLevel: max.value() 
    });

    try {
      const characters = await this.#repository.findByLevelRange(min, max);
      
      this.#logger.debug('Characters found by level range', { 
        minLevel: min.value(),
        maxLevel: max.value(),
        count: characters.length 
      });

      return characters;
    } catch (error) {
      this.#logger.logError(error, { 
        operation: 'findCharactersByLevelRange', 
        minLevel: min.value(), 
        maxLevel: max.value() 
      });
      throw error;
    }
  }

  // === OPERAÇÕES DE COMANDO ===

  /**
   * Cria um novo personagem
   * Command Pattern: Operação complexa encapsulada
   */
  async createCharacter(name, className, level) {
    const characterName = name instanceof CharacterName ? name : new CharacterName(name);
    
    this.#logger.info('Creating new character', { 
      name: characterName.value(), 
      class: className,
      level: level 
    });

    try {
      // Verifica se personagem já existe
      const exists = await this.#repository.exists(characterName);
      if (exists) {
        const error = ErrorFactory.characterAlreadyExists(characterName.value());
        this.#logger.warn('Attempted to create existing character', { 
          name: characterName.value() 
        });
        throw error;
      }

      // Cria o personagem
      const character = new Character(name, className, level);
      const savedCharacter = await this.#repository.save(character);

      this.#logger.info('Character created successfully', {
        name: savedCharacter.name().value(),
        class: savedCharacter.characterClass().value(),
        level: savedCharacter.level().value(),
        combatPower: savedCharacter.calculateCombatPower()
      });

      return savedCharacter;
    } catch (error) {
      this.#logger.logError(error, { 
        operation: 'createCharacter', 
        name: characterName.value() 
      });
      throw error;
    }
  }

  /**
   * Remove um personagem
   */
  async removeCharacter(name) {
    const characterName = name instanceof CharacterName ? name : new CharacterName(name);
    
    this.#logger.info('Removing character', { name: characterName.value() });

    try {
      const removed = await this.#repository.remove(characterName);
      
      if (!removed) {
        const error = ErrorFactory.characterNotFound(characterName.value());
        this.#logger.warn('Attempted to remove non-existent character', { 
          name: characterName.value() 
        });
        throw error;
      }

      this.#logger.info('Character removed successfully', { 
        name: characterName.value() 
      });

      return true;
    } catch (error) {
      this.#logger.logError(error, { 
        operation: 'removeCharacter', 
        name: characterName.value() 
      });
      throw error;
    }
  }

  // === OPERAÇÕES DE NEGÓCIO ===

  /**
   * Faz um personagem subir de nível
   */
  async levelUpCharacter(name) {
    const characterName = name instanceof CharacterName ? name : new CharacterName(name);
    
    this.#logger.info('Leveling up character', { name: characterName.value() });

    try {
      const character = await this.findCharacterByName(characterName);
      const oldLevel = character.level().value();
      
      const success = character.levelUp();
      if (!success) {
        const error = ErrorFactory.maxLevelReached();
        this.#logger.warn('Character already at max level', { 
          name: characterName.value(),
          currentLevel: oldLevel
        });
        throw error;
      }

      const updatedCharacter = await this.#repository.save(character);
      const newLevel = updatedCharacter.level().value();

      this.#logger.info('Character leveled up successfully', {
        name: characterName.value(),
        oldLevel,
        newLevel,
        newCombatPower: updatedCharacter.calculateCombatPower()
      });

      return updatedCharacter;
    } catch (error) {
      this.#logger.logError(error, { 
        operation: 'levelUpCharacter', 
        name: characterName.value() 
      });
      throw error;
    }
  }

  /**
   * Encontra oponentes viáveis para um personagem
   */
  async findViableOpponents(name) {
    const characterName = name instanceof CharacterName ? name : new CharacterName(name);
    
    this.#logger.info('Finding viable opponents', { name: characterName.value() });

    try {
      const character = await this.findCharacterByName(characterName);
      
      // Usa método específico do repositório se disponível
      if (typeof this.#repository.findViableOpponents === 'function') {
        const opponents = await this.#repository.findViableOpponents(character);
        
        this.#logger.debug('Viable opponents found', {
          character: characterName.value(),
          opponentsCount: opponents.length
        });

        return opponents;
      }

      // Fallback: busca todos e filtra
      const allCharacters = await this.#repository.findAll();
      const opponents = allCharacters.filter(candidate => character.canFight(candidate));
      
      this.#logger.debug('Viable opponents found (fallback)', {
        character: characterName.value(),
        opponentsCount: opponents.length
      });

      return opponents;
    } catch (error) {
      this.#logger.logError(error, { 
        operation: 'findViableOpponents', 
        name: characterName.value() 
      });
      throw error;
    }
  }

  // === CONSULTAS AVANÇADAS ===

  /**
   * Busca personagens usando specification
   * Specification Pattern: Critérios de busca flexíveis
   */
  async findCharactersBySpecification(specification) {
    this.#logger.info('Searching characters by specification');

    try {
      const characters = await this.#repository.findBySpecification(specification);
      
      this.#logger.debug('Characters found by specification', { 
        count: characters.length 
      });

      return characters;
    } catch (error) {
      this.#logger.logError(error, { operation: 'findCharactersBySpecification' });
      throw error;
    }
  }

  /**
   * Busca personagens experientes
   */
  async findExperiencedCharacters() {
    this.#logger.info('Finding experienced characters');

    try {
      const spec = CharacterSpecificationFactory.experienced();
      return await this.findCharactersBySpecification(spec);
    } catch (error) {
      this.#logger.logError(error, { operation: 'findExperiencedCharacters' });
      throw error;
    }
  }

  /**
   * Busca personagens mestres
   */
  async findMasterCharacters() {
    this.#logger.info('Finding master characters');

    try {
      const spec = CharacterSpecificationFactory.masters();
      return await this.findCharactersBySpecification(spec);
    } catch (error) {
      this.#logger.logError(error, { operation: 'findMasterCharacters' });
      throw error;
    }
  }

  /**
   * Busca guerreiros poderosos (exemplo de specification predefinida)
   */
  async findPowerfulWarriors() {
    this.#logger.info('Finding powerful warriors');

    try {
      const spec = CharacterSpecificationFactory.powerfulWarriors();
      return await this.findCharactersBySpecification(spec);
    } catch (error) {
      this.#logger.logError(error, { operation: 'findPowerfulWarriors' });
      throw error;
    }
  }

  // === ESTATÍSTICAS ===

  /**
   * Obtém estatísticas gerais dos personagens
   */
  async getCharacterStatistics() {
    this.#logger.info('Generating character statistics');

    try {
      const allCharacters = await this.getAllCharacters();
      
      const stats = {
        total: allCharacters.length,
        byClass: {},
        levelDistribution: {
          novice: 0,
          experienced: 0,
          masters: 0
        },
        averageLevel: 0,
        highestLevel: 0,
        lowestLevel: 100,
        totalCombatPower: 0
      };

      let totalLevel = 0;

      allCharacters.forEach(character => {
        // Por classe
        const className = character.characterClass().value();
        stats.byClass[className] = (stats.byClass[className] || 0) + 1;

        // Distribuição de nível
        if (character.isMaster()) {
          stats.levelDistribution.masters++;
        } else if (character.isExperienced()) {
          stats.levelDistribution.experienced++;
        } else {
          stats.levelDistribution.novice++;
        }

        // Níveis
        const level = character.level().value();
        totalLevel += level;
        stats.highestLevel = Math.max(stats.highestLevel, level);
        stats.lowestLevel = Math.min(stats.lowestLevel, level);

        // Poder de combate
        stats.totalCombatPower += character.calculateCombatPower();
      });

      stats.averageLevel = allCharacters.length > 0 ? 
        (totalLevel / allCharacters.length).toFixed(2) : 0;

      this.#logger.debug('Character statistics generated', stats);

      return stats;
    } catch (error) {
      this.#logger.logError(error, { operation: 'getCharacterStatistics' });
      throw error;
    }
  }
}

module.exports = CharacterService;