/**
 * Barrel Export Pattern para repositórios
 * 
 * PRINCÍPIOS APLICADOS:
 * - Single Point of Access: Centraliza imports de repositórios
 * - Interface Segregation: Permite importação seletiva
 * - Dependency Management: Facilita mudança de implementações
 */

const CharacterRepository = require('./CharacterRepository');
const InMemoryCharacterRepository = require('./InMemoryCharacterRepository');

module.exports = {
  CharacterRepository,
  InMemoryCharacterRepository
};