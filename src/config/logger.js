const winston = require('winston');

const { format, createLogger, transports } = winston;
const { printf, combine, colorize, timestamp } = format;
const { Console, File } = transports;


module.exports = (filename) => {
  const myFormat = printf(({ level, message, timestamp }) => {
    const format = filename ?
      `${level}: [${timestamp}][${filename}] ${message}` :
      `${level}: [${timestamp}]${message}`;
    return format;
  });

  const logger = createLogger({
    format: combine(colorize(),
        timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        myFormat),
    transports: [
      new Console(),
      new File({ filename: 'error.log', level: 'error' }),
    ],
  });

  return logger;
};
