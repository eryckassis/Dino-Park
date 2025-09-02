/**
 * Interface para repositório de personagens
 * 
 * PRINCÍPIOS APLICADOS:
 * - Dependency Inversion Principle: Define abstração para acesso a dados
 * - Interface Segregation: Interface específica para operações com Character
 * - Single Responsibility: Responsável apenas por definir contratos de persistência
 * 
 * Esta interface define o contrato que qualquer implementação de repositório
 * de personagens deve seguir. Permite diferentes implementações (em memória,
 * banco de dados, API externa) sem afetar o código que a utiliza.
 */
class CharacterRepository {
  
  /**
   * Busca um personagem pelo nome
   * @param {CharacterName} name - Nome do personagem
   * @returns {Promise<Character|null>} Personagem encontrado ou null
   */
  async findByName(name) {
    throw new Error('Method findByName must be implemented by subclass');
  }

  /**
   * Busca todos os personagens
   * @returns {Promise<Character[]>} Array com todos os personagens
   */
  async findAll() {
    throw new Error('Method findAll must be implemented by subclass');
  }

  /**
   * Busca personagens por classe
   * @param {CharacterClass} characterClass - Classe do personagem
   * @returns {Promise<Character[]>} Array com personagens da classe especificada
   */
  async findByClass(characterClass) {
    throw new Error('Method findByClass must be implemented by subclass');
  }

  /**
   * Busca personagens por faixa de nível
   * @param {CharacterLevel} minLevel - Nível mínimo
   * @param {CharacterLevel} maxLevel - Nível máximo
   * @returns {Promise<Character[]>} Array com personagens na faixa de nível
   */
  async findByLevelRange(minLevel, maxLevel) {
    throw new Error('Method findByLevelRange must be implemented by subclass');
  }

  /**
   * Salva um personagem
   * @param {Character} character - Personagem a ser salvo
   * @returns {Promise<Character>} Personagem salvo
   */
  async save(character) {
    throw new Error('Method save must be implemented by subclass');
  }

  /**
   * Remove um personagem
   * @param {CharacterName} name - Nome do personagem a ser removido
   * @returns {Promise<boolean>} true se removeu, false se não encontrou
   */
  async remove(name) {
    throw new Error('Method remove must be implemented by subclass');
  }

  /**
   * Verifica se um personagem existe
   * @param {CharacterName} name - Nome do personagem
   * @returns {Promise<boolean>} true se existe, false caso contrário
   */
  async exists(name) {
    throw new Error('Method exists must be implemented by subclass');
  }

  /**
   * Conta quantos personagens existem
   * @returns {Promise<number>} Número total de personagens
   */
  async count() {
    throw new Error('Method count must be implemented by subclass');
  }

  /**
   * Busca personagens que satisfazem uma specification
   * @param {CharacterSpecification} specification - Critério de busca
   * @returns {Promise<Character[]>} Array com personagens que satisfazem a specification
   */
  async findBySpecification(specification) {
    throw new Error('Method findBySpecification must be implemented by subclass');
  }
}

module.exports = CharacterRepository;