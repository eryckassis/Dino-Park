/**
 * Barrel Export para utilitários
 */

const {
  LogLevel,
  LogStrategy,
  ConsoleLogStrategy,
  FileLogStrategy,
  Logger,
  LoggerFactory
} = require('./Logger');

module.exports = {
  LogLevel,
  LogStrategy,
  ConsoleLogStrategy,
  FileLogStrategy,
  Logger,
  LoggerFactory
};