// +++++ 1V2P8 +++++


// -----
import { LoggerType } from 'typescript-logging';
import { LFService } from 'typescript-logging';
import { LogFormat } from 'typescript-logging';
import { LogLevel } from 'typescript-logging';
import { LoggerFactory } from 'typescript-logging';
import { LoggerFactoryOptions } from 'typescript-logging';
import { LogGroupRule } from 'typescript-logging';
import { ConsoleLoggerImpl } from 'typescript-logging';
import { ErrorType } from 'typescript-logging/dist/commonjs/log/standard/Logger';
import { MessageType } from 'typescript-logging/dist/commonjs/log/standard/Logger';

// Must use relative path. `@/` will cause import error.
import { EnvConfig } from '../config/env_config';
import { BaseError } from './error';


// -----
const LOGGER_NAME = 'AoikAntDesignReactStarter';


// -----
class DevLogger extends ConsoleLoggerImpl {
  trace(msg: MessageType, error?: ErrorType) {
    const errLoc = error instanceof BaseError ? error.getLoc() : '';

    super.trace(`${errLoc ? `${msg}: ${errLoc}` : msg}`, error);
  }

  debug(msg: MessageType, error?: ErrorType) {
    const errLoc = error instanceof BaseError ? error.getLoc() : '';

    super.debug(`${errLoc ? `${msg}: ${errLoc}` : msg}`, error);
  }

  warn(msg: MessageType, error?: ErrorType) {
    const errLoc = error instanceof BaseError ? error.getLoc() : '';

    super.warn(`${errLoc ? `${msg}: ${errLoc}` : msg}`, error);
  }

  info(msg: MessageType, error?: ErrorType) {
    const errLoc = error instanceof BaseError ? error.getLoc() : '';

    super.info(`${errLoc ? `${msg}: ${errLoc}` : msg}`, error);
  }

  error(msg: MessageType, error?: ErrorType) {
    const errLoc = error instanceof BaseError ? error.getLoc() : '';

    super.error(`${errLoc ? `${msg}: ${errLoc}` : msg}`, error);
  }

  fatal(msg: MessageType, error?: ErrorType) {
    const errLoc = error instanceof BaseError ? error.getLoc() : '';

    super.fatal(`${errLoc ? `${msg}: ${errLoc}` : msg}`, error);
  }
}


// -----
class ProdLogger extends ConsoleLoggerImpl {
  trace() {}

  debug() {}

  info() {}

  warn() {}

  error() {}

  fatal() {}
}


// -----
const loggerFactoryOptions = new LoggerFactoryOptions()
  .addLogGroupRule(
    new LogGroupRule(
      new RegExp('.+'),
      LogLevel.Debug,
      new LogFormat(),
      LoggerType.Custom,
      (name: string, settings: object) => {
        const LoggerClass = EnvConfig.DEV_ON ? DevLogger : ProdLogger;

        return new LoggerClass(
          name,
          // `LogGroupRuntimeSettings` not exported.
          // @ts-ignore
          settings,
        );
      },
    ),
  );


// -----
const loggerFactory: LoggerFactory = LFService.createNamedLoggerFactory(
  LOGGER_NAME,
  loggerFactoryOptions,
);


// -----
const Logger = loggerFactory.getLogger(LOGGER_NAME);


// -----
export {
  Logger,
};
