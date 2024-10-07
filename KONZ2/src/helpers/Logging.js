// Logging.js
import { blue, blueBright, yellow, yellowBright, red, redBright, green, greenBright } from 'colorette'

const LogLevel = {
    INFO: 'INFO',
    SUCCESS: 'SUCCESS',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

class Logging {
    formatMessage(level, args) {
        const timestamp = new Date().toLocaleString();
        const formattedArgs = typeof args === 'string' ? args : JSON.stringify(args, null, 2);
        return `[${timestamp}] [${level}] ${formattedArgs}`;
    }

    logWithColor(color, brightColor, level, args) {
        const message = this.formatMessage(level, args);
        console.log(color(message));
    }

    log(args) {
        this.info(args);
    }

    info(args) {
        this.logWithColor(blue, blueBright, LogLevel.INFO, args);
    }

    success(args) {
        this.logWithColor(green, greenBright, LogLevel.SUCCESS, args);
    }

    warning(args) {
        this.logWithColor(yellow, yellowBright, LogLevel.WARN, args);
    }

    error(args) {
        this.logWithColor(red, redBright, LogLevel.ERROR, args);
    }
}

export default new Logging()