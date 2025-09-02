/**
 * Sistema de logging simples para a aplicação
 * 
 * PRINCÍPIOS APLICADOS:
 * - Single Responsibility: Responsável apenas por logging
 * - Strategy Pattern: Diferentes estratégias de output de log
 * - Factory Pattern: Criação de loggers específicos
 * - Dependency Inversion: Abstração para diferentes implementações
 */

/**
 * Níveis de log
 */
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

/**
 * Interface para estratégias de logging
 */
class LogStrategy {
  log(level, message, metadata = {}) {
    throw new Error('Method log must be implemented by subclass');
  }
}

/**
 * Estratégia de logging para console
 */
class ConsoleLogStrategy extends LogStrategy {
  constructor(colorize = true) {
    super();
    this.colorize = colorize;
    this.colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      reset: '\x1b[0m'
    };
  }

  log(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const levelName = Object.keys(LogLevel)[level];
    
    let logMessage = `[${timestamp}] ${levelName}: ${message}`;
    
    if (Object.keys(metadata).length > 0) {
      logMessage += ` | ${JSON.stringify(metadata)}`;
    }

    if (this.colorize && process.stdout.isTTY) {
      const color = this.colors[level] || '';
      logMessage = `${color}${logMessage}${this.colors.reset}`;
    }

    console.log(logMessage);
  }
}

/**
 * Estratégia de logging para arquivo (simulada)
 */
class FileLogStrategy extends LogStrategy {
  constructor(filename) {
    super();
    this.filename = filename;
    this.logs = []; // Em memória para simplicidade
  }

  log(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const levelName = Object.keys(LogLevel)[level];
    
    const logEntry = {
      timestamp,
      level: levelName,
      message,
      metadata
    };

    this.logs.push(logEntry);
    
    // Em uma implementação real, escreveria no arquivo
    // fs.appendFileSync(this.filename, JSON.stringify(logEntry) + '\n');
  }

  getLogs() {
    return [...this.logs]; // Defensive copy
  }
}

/**
 * Logger principal
 * Strategy Pattern: Usa diferentes estratégias de output
 */
class Logger {
  #strategy;
  #minLevel;
  #context;

  constructor(strategy, minLevel = LogLevel.INFO, context = '') {
    this.#strategy = strategy;
    this.#minLevel = minLevel;
    this.#context = context;
  }

  /**
   * Valida se deve logar baseado no nível mínimo
   */
  #shouldLog(level) {
    return level >= this.#minLevel;
  }

  /**
   * Adiciona contexto à mensagem se definido
   */
  #formatMessage(message) {
    return this.#context ? `[${this.#context}] ${message}` : message;
  }

  /**
   * Log genérico
   */
  log(level, message, metadata = {}) {
    if (!this.#shouldLog(level)) {
      return;
    }

    const formattedMessage = this.#formatMessage(message);
    this.#strategy.log(level, formattedMessage, metadata);
  }

  /**
   * Métodos de conveniência para cada nível
   */
  debug(message, metadata = {}) {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message, metadata = {}) {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message, metadata = {}) {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message, metadata = {}) {
    this.log(LogLevel.ERROR, message, metadata);
  }

  /**
   * Log de erro com stack trace
   */
  logError(error, additionalContext = {}) {
    const metadata = {
      name: error.name,
      stack: error.stack,
      ...additionalContext
    };

    if (error.code) {
      metadata.code = error.code;
    }

    this.error(error.message, metadata);
  }

  /**
   * Cria novo logger com contexto específico
   */
  withContext(context) {
    const newContext = this.#context ? `${this.#context}:${context}` : context;
    return new Logger(this.#strategy, this.#minLevel, newContext);
  }

  /**
   * Altera nível mínimo de logging
   */
  setMinLevel(level) {
    this.#minLevel = level;
  }
}

/**
 * Factory para criação de loggers
 */
class LoggerFactory {
  static console(minLevel = LogLevel.INFO, colorize = true) {
    const strategy = new ConsoleLogStrategy(colorize);
    return new Logger(strategy, minLevel);
  }

  static file(filename, minLevel = LogLevel.INFO) {
    const strategy = new FileLogStrategy(filename);
    return new Logger(strategy, minLevel);
  }

  static forClass(className, minLevel = LogLevel.INFO) {
    return LoggerFactory.console(minLevel).withContext(className);
  }

  static forService(serviceName, minLevel = LogLevel.INFO) {
    return LoggerFactory.console(minLevel).withContext(`Service:${serviceName}`);
  }
}

module.exports = {
  LogLevel,
  LogStrategy,
  ConsoleLogStrategy,
  FileLogStrategy,
  Logger,
  LoggerFactory
};