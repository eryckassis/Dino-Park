/**
 * Barrel Export para erros do domínio
 */

const {
  DomainError,
  CharacterNotFoundError,
  CharacterAlreadyExistsError,
  BusinessRuleViolationError,
  InvalidOperationError,
  InvalidSpecificationError,
  RepositoryError,
  ErrorFactory
} = require('./DomainErrors');

module.exports = {
  DomainError,
  CharacterNotFoundError,
  CharacterAlreadyExistsError,
  BusinessRuleViolationError,
  InvalidOperationError,
  InvalidSpecificationError,
  RepositoryError,
  ErrorFactory
};