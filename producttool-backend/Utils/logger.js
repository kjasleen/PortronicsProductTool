// utils/logger.js
const winston = require('winston');
const { format } = require('winston');
const winstonRotate = require('winston-daily-rotate-file');

// Define log rotation options
const logRotationOptions = new winstonRotate({
  filename: 'logs/%DATE%-app.log', // Log file naming pattern
  datePattern: 'YYYY-MM-DD', // Date format for log files
  zippedArchive: true, // Compress old log files
  maxSize: '20m', // Max file size before rotating
  maxFiles: '14d', // Keep logs for 14 days
});

const logger = winston.createLogger({
  level: 'info', // Set the default log level
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({ level: 'info' }), // Logs to console
    logRotationOptions, // Logs to rotating files
  ],
});

module.exports = logger;
