/**
 * Logger — Winston configurado para o sistema Nex
 */

import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, agent, ...meta }) => {
      const agentTag = agent ? `[${agent}]` : '';
      const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return `${timestamp} ${level.toUpperCase()} ${agentTag} ${message}${metaStr}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, agent, ...meta }) => {
          const agentTag = agent ? `[${agent}]` : '';
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp} ${level} ${agentTag} ${message}${metaStr}`;
        })
      ),
    }),
  ],
});

export function createAgentLogger(agentName) {
  return {
    info: (msg, meta = {}) => logger.info(msg, { agent: agentName, ...meta }),
    warn: (msg, meta = {}) => logger.warn(msg, { agent: agentName, ...meta }),
    error: (msg, meta = {}) => logger.error(msg, { agent: agentName, ...meta }),
    debug: (msg, meta = {}) => logger.debug(msg, { agent: agentName, ...meta }),
  };
}

export default logger;
