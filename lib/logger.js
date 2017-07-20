/**
 * logger with log4js
 */
const log4js = require('log4js');
const logger = new log4js.getLogger('pencil');
logger.setLevel(log4js.levels.ALL);

module.exports = logger;