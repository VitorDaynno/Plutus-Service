const winston = require('winston')

const { format, createLogger, transports } = winston;
const { printf, combine, colorize, timestamp } = format;
const { Console, File } = transports;


module.exports = () =>{

  const myFormat = printf(({ level, message, timestamp }) => {
    return `${level}: [${timestamp}]${message}`;
  });

  const logger = createLogger({
    format: combine(colorize(),
                    timestamp({format: 'DD-MM-YYYY HH:mm:ss'}),
                    myFormat),
    transports: [
      new Console(),
      new File({filename: 'error.log', level: 'error'})
    ]
  });

  return logger;
};
