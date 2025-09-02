const CharacterRepository = require('./CharacterRepository');
const { Character, CharacterName, CharacterLevel, CharacterClass } = require('../entities');

/**
 * Implementação em memória do repositório de personagens
 * 
 * PRINCÍPIOS APLICADOS:
 * - Dependency Inversion: Implementa a abstração CharacterRepository
 * - Single Responsibility: Responsável apenas por gerenciar personagens em memória
 * - Object Calisthenics: Usa coleção como primeira classe, evita primitivos expostos
 * - Liskov Substitution: Pode ser substituída por qualquer implementação da interface
 * - Open/Closed: Aberta para extensão via herança, fechada para modificação
 */
class InMemoryCharacterRepository extends CharacterRepository {
  #characters; // Map para garantir unicidade por nome

  constructor() {
    super();
    this.#characters = new Map();
    this.#initializeDefaultCharacters();
  }

  /**
   * Inicializa com alguns personagens padrão para demonstração
   * Template Method Pattern: Pode ser sobrescrito por subclasses
   */
  #initializeDefaultCharacters() {
    const defaultCharacters = [
      new Character('Aragorn', 'Guerreiro', 10),
      new Character('Gandalf', 'Mago', 100),
      new Character('Legolas', 'Arqueiro', 25),
      new Character('Gimli', 'Guerreiro', 20),
      new Character('Frodo', 'Arqueiro', 5)
    ];

    defaultCharacters.forEach(character => {
      this.#characters.set(character.name().value().toLowerCase(), character);
    });
  }

  /**
   * Busca um personagem pelo nome
   * Case-insensitive search seguindo princípio de menor surpresa
   */
  async findByName(name) {
    this.#validateName(name);
    const key = this.#createKey(name);
    return this.#characters.get(key) || null;
  }

  /**
   * Busca todos os personagens
   * Retorna cópia defensiva para manter encapsulamento
   */
  async findAll() {
    return Array.from(this.#characters.values());
  }

  /**
   * Busca personagens por classe
   * Usa filtering funcional em vez de loops imperativos
   */
  async findByClass(characterClass) {
    this.#validateCharacterClass(characterClass);
    
    return Array.from(this.#characters.values())
      .filter(character => character.characterClass().equals(characterClass));
  }

  /**
   * Busca personagens por faixa de nível
   * Demonstra uso de Value Objects para comparações
   */
  async findByLevelRange(minLevel, maxLevel) {
    this.#validateLevelRange(minLevel, maxLevel);
    
    return Array.from(this.#characters.values())
      .filter(character => {
        const level = character.level();
        return !level.isGreaterThan(maxLevel) && !minLevel.isGreaterThan(level);
      });
  }

  /**
   * Salva um personagem
   * Upsert pattern: Insere ou atualiza
   */
  async save(character) {
    this.#validateCharacter(character);
    
    const key = this.#createKey(character.name());
    this.#characters.set(key, character);
    
    return character;
  }

  /**
   * Remove um personagem
   */
  async remove(name) {
    this.#validateName(name);
    
    const key = this.#createKey(name);
    return this.#characters.delete(key);
  }

  /**
   * Verifica se um personagem existe
   */
  async exists(name) {
    this.#validateName(name);
    
    const key = this.#createKey(name);
    return this.#characters.has(key);
  }

  /**
   * Conta quantos personagens existem
   */
  async count() {
    return this.#characters.size;
  }

  /**
   * Método adicional: Busca por padrão no nome
   * Extensibilidade sem quebrar interface
   */
  async findByNamePattern(pattern) {
    if (typeof pattern !== 'string') {
      throw new Error('Pattern must be a string');
    }
    
    const regex = new RegExp(pattern, 'i');
    return Array.from(this.#characters.values())
      .filter(character => regex.test(character.name().value()));
  }

  /**
   * Método adicional: Busca personagens experientes
   * Business logic específica encapsulada
   */
  async findExperiencedCharacters() {
    return Array.from(this.#characters.values())
      .filter(character => character.isExperienced());
  }

  /**
   * Método adicional: Busca personagens que podem lutar entre si
   * Demonstra uso da lógica de negócio das entidades
   */
  async findViableOpponents(character) {
    this.#validateCharacter(character);
    
    return Array.from(this.#characters.values())
      .filter(candidate => character.canFight(candidate));
  }

  // === MÉTODOS DE VALIDAÇÃO PRIVADOS ===

  /**
   * Valida nome de entrada
   */
  #validateName(name) {
    if (!(name instanceof CharacterName)) {
      throw new Error('Name must be a CharacterName instance');
    }
  }

  /**
   * Valida classe de entrada
   */
  #validateCharacterClass(characterClass) {
    if (!(characterClass instanceof CharacterClass)) {
      throw new Error('CharacterClass must be a CharacterClass instance');
    }
  }

  /**
   * Valida personagem de entrada
   */
  #validateCharacter(character) {
    if (!(character instanceof Character)) {
      throw new Error('Character must be a Character instance');
    }
  }

  /**
   * Valida faixa de níveis
   */
  #validateLevelRange(minLevel, maxLevel) {
    if (!(minLevel instanceof CharacterLevel) || !(maxLevel instanceof CharacterLevel)) {
      throw new Error('Level range must use CharacterLevel instances');
    }
    
    if (minLevel.isGreaterThan(maxLevel)) {
      throw new Error('Minimum level cannot be greater than maximum level');
    }
  }

  /**
   * Cria chave padronizada para o Map
   * Garante case-insensitive storage
   */
  #createKey(name) {
    return name instanceof CharacterName ? 
      name.value().toLowerCase() : 
      name.toLowerCase();
  }

  /**
   * Busca personagens que satisfazem uma specification
   * Specification Pattern: Permite queries complexas e combinadas
   */
  async findBySpecification(specification) {
    const { CharacterSpecification } = require('./CharacterSpecification');
    
    if (!(specification instanceof CharacterSpecification)) {
      throw new Error('Specification must be a CharacterSpecification instance');
    }
    
    return Array.from(this.#characters.values())
      .filter(character => specification.isSatisfiedBy(character));
  }

  /**
   * Método para debugging - não deve ser usado em produção
   * Utility method para visualizar estado interno
   */
  _debug() {
    return {
      totalCharacters: this.#characters.size,
      characters: Array.from(this.#characters.keys())
    };
  }
}

module.exports = InMemoryCharacterRepository;