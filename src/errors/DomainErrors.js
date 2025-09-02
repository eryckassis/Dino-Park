/**
 * Classes de erro customizadas para o domínio
 * 
 * PRINCÍPIOS APLICADOS:
 * - Single Responsibility: Cada erro tem uma responsabilidade específica
 * - Fail Fast: Fornece informações claras sobre falhas
 * - Domain-Driven Design: Erros específicos do domínio
 * - Inheritance: Hierarquia clara de erros
 */

/**
 * Erro base para o domínio
 */
class DomainError extends Error {
  constructor(message, code = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date().toISOString();
    
    // Mantém stack trace correto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converte erro para objeto serializable
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp
    };
  }
}

/**
 * Erro quando personagem não é encontrado
 */
class CharacterNotFoundError extends DomainError {
  constructor(characterName) {
    super(`Character '${characterName}' was not found`, 'CHARACTER_NOT_FOUND');
    this.characterName = characterName;
  }
}

/**
 * Erro quando personagem já existe
 */
class CharacterAlreadyExistsError extends DomainError {
  constructor(characterName) {
    super(`Character '${characterName}' already exists`, 'CHARACTER_ALREADY_EXISTS');
    this.characterName = characterName;
  }
}

/**
 * Erro de validação de negócio
 */
class BusinessRuleViolationError extends DomainError {
  constructor(rule, details = null) {
    super(`Business rule violation: ${rule}`, 'BUSINESS_RULE_VIOLATION');
    this.rule = rule;
    this.details = details;
  }
}

/**
 * Erro de operação inválida
 */
class InvalidOperationError extends DomainError {
  constructor(operation, reason) {
    super(`Invalid operation '${operation}': ${reason}`, 'INVALID_OPERATION');
    this.operation = operation;
    this.reason = reason;
  }
}

/**
 * Erro de especificação inválida
 */
class InvalidSpecificationError extends DomainError {
  constructor(specificationName, reason) {
    super(`Invalid specification '${specificationName}': ${reason}`, 'INVALID_SPECIFICATION');
    this.specificationName = specificationName;
    this.reason = reason;
  }
}

/**
 * Erro de repositório
 */
class RepositoryError extends DomainError {
  constructor(operation, reason) {
    super(`Repository error during '${operation}': ${reason}`, 'REPOSITORY_ERROR');
    this.operation = operation;
    this.reason = reason;
  }
}

/**
 * Factory para criação de erros comuns
 * Factory Pattern: Simplifica criação de erros
 */
class ErrorFactory {
  static characterNotFound(name) {
    return new CharacterNotFoundError(name);
  }

  static characterAlreadyExists(name) {
    return new CharacterAlreadyExistsError(name);
  }

  static cannotFightSelf() {
    return new BusinessRuleViolationError('A character cannot fight itself');
  }

  static levelDifferenceTooHigh(difference) {
    return new BusinessRuleViolationError(
      `Level difference too high: ${difference}`,
      { maxAllowedDifference: 20 }
    );
  }

  static maxLevelReached() {
    return new InvalidOperationError('levelUp', 'Character is already at maximum level');
  }

  static invalidRepository() {
    return new RepositoryError('initialization', 'Repository instance is null or invalid');
  }

  static specificationRequired() {
    return new InvalidSpecificationError('search', 'Specification is required for complex queries');
  }
}

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