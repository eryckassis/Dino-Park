/**
 * Padrão Specification para queries complexas de Character
 * 
 * PRINCÍPIOS APLICADOS:
 * - Specification Pattern: Encapsula critérios de busca em objetos
 * - Single Responsibility: Cada specification tem um critério específico
 * - Open/Closed: Novas specifications podem ser adicionadas sem modificar existentes
 * - Composite Pattern: Specifications podem ser combinadas
 * - Strategy Pattern: Diferentes estratégias de filtro
 */

/**
 * Classe base para specifications
 * Template Method Pattern: Define estrutura comum
 */
class CharacterSpecification {
  /**
   * Verifica se um personagem satisfaz a specification
   * @param {Character} character - Personagem a ser testado
   * @returns {boolean} true se satisfaz, false caso contrário
   */
  isSatisfiedBy(character) {
    throw new Error('Method isSatisfiedBy must be implemented by subclass');
  }

  /**
   * Combina specifications com AND
   * @param {CharacterSpecification} specification - Outra specification
   * @returns {AndSpecification} Specification combinada
   */
  and(specification) {
    return new AndSpecification(this, specification);
  }

  /**
   * Combina specifications com OR
   * @param {CharacterSpecification} specification - Outra specification
   * @returns {OrSpecification} Specification combinada
   */
  or(specification) {
    return new OrSpecification(this, specification);
  }

  /**
   * Nega a specification
   * @returns {NotSpecification} Specification negada
   */
  not() {
    return new NotSpecification(this);
  }
}

/**
 * Specification para filtrar por classe
 */
class ClassSpecification extends CharacterSpecification {
  #characterClass;

  constructor(characterClass) {
    super();
    this.#characterClass = characterClass;
  }

  isSatisfiedBy(character) {
    return character.characterClass().equals(this.#characterClass);
  }
}

/**
 * Specification para filtrar por nível mínimo
 */
class MinimumLevelSpecification extends CharacterSpecification {
  #minimumLevel;

  constructor(minimumLevel) {
    super();
    this.#minimumLevel = minimumLevel;
  }

  isSatisfiedBy(character) {
    return character.level().isGreaterThan(this.#minimumLevel) || 
           character.level().equals(this.#minimumLevel);
  }
}

/**
 * Specification para filtrar por personagens experientes
 */
class ExperiencedCharacterSpecification extends CharacterSpecification {
  isSatisfiedBy(character) {
    return character.isExperienced();
  }
}

/**
 * Specification para filtrar por personagens mestres
 */
class MasterCharacterSpecification extends CharacterSpecification {
  isSatisfiedBy(character) {
    return character.isMaster();
  }
}

/**
 * Specification para filtrar por poder de combate mínimo
 */
class MinimumCombatPowerSpecification extends CharacterSpecification {
  #minimumPower;

  constructor(minimumPower) {
    super();
    this.#minimumPower = minimumPower;
  }

  isSatisfiedBy(character) {
    return character.calculateCombatPower() >= this.#minimumPower;
  }
}

/**
 * Specification para filtrar por padrão de nome
 */
class NamePatternSpecification extends CharacterSpecification {
  #pattern;

  constructor(pattern) {
    super();
    this.#pattern = new RegExp(pattern, 'i');
  }

  isSatisfiedBy(character) {
    return this.#pattern.test(character.name().value());
  }
}

/**
 * Specification composta - AND
 * Composite Pattern: Combina múltiplas specifications
 */
class AndSpecification extends CharacterSpecification {
  #left;
  #right;

  constructor(left, right) {
    super();
    this.#left = left;
    this.#right = right;
  }

  isSatisfiedBy(character) {
    return this.#left.isSatisfiedBy(character) && this.#right.isSatisfiedBy(character);
  }
}

/**
 * Specification composta - OR
 */
class OrSpecification extends CharacterSpecification {
  #left;
  #right;

  constructor(left, right) {
    super();
    this.#left = left;
    this.#right = right;
  }

  isSatisfiedBy(character) {
    return this.#left.isSatisfiedBy(character) || this.#right.isSatisfiedBy(character);
  }
}

/**
 * Specification composta - NOT
 */
class NotSpecification extends CharacterSpecification {
  #specification;

  constructor(specification) {
    super();
    this.#specification = specification;
  }

  isSatisfiedBy(character) {
    return !this.#specification.isSatisfiedBy(character);
  }
}

/**
 * Factory para criar specifications comuns
 * Factory Pattern: Simplifica criação de specifications
 */
class CharacterSpecificationFactory {
  static byClass(characterClass) {
    return new ClassSpecification(characterClass);
  }

  static byMinimumLevel(level) {
    return new MinimumLevelSpecification(level);
  }

  static experienced() {
    return new ExperiencedCharacterSpecification();
  }

  static masters() {
    return new MasterCharacterSpecification();
  }

  static byMinimumCombatPower(power) {
    return new MinimumCombatPowerSpecification(power);
  }

  static byNamePattern(pattern) {
    return new NamePatternSpecification(pattern);
  }

  /**
   * Specifications predefinidas úteis
   */
  static powerfulWarriors() {
    const { CharacterClass, CharacterLevel } = require('../entities');
    return new ClassSpecification(new CharacterClass('Guerreiro'))
      .and(new MinimumLevelSpecification(new CharacterLevel(20)));
  }

  static expertMages() {
    const { CharacterClass } = require('../entities');
    return new ClassSpecification(new CharacterClass('Mago'))
      .and(new ExperiencedCharacterSpecification());
  }
}

module.exports = {
  CharacterSpecification,
  ClassSpecification,
  MinimumLevelSpecification,
  ExperiencedCharacterSpecification,
  MasterCharacterSpecification,
  MinimumCombatPowerSpecification,
  NamePatternSpecification,
  AndSpecification,
  OrSpecification,
  NotSpecification,
  CharacterSpecificationFactory
};