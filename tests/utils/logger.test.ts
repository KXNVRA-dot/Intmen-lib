import { Logger } from '../../src/utils/logger';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  it('should create a logger with the given namespace', () => {
    const logger = new Logger('TestLogger');
    expect(logger).toBeInstanceOf(Logger);
  });

  it('should log debug messages only when debug mode is enabled', () => {
    const regularLogger = new Logger('RegularLogger');
    const debugLogger = new Logger('DebugLogger', true);

    regularLogger.debug('This should not be logged');
    expect(consoleDebugSpy).not.toHaveBeenCalled();

    debugLogger.debug('This should be logged');
    expect(consoleDebugSpy).toHaveBeenCalledWith(
      '[DebugLogger] [DEBUG] This should be logged'
    );
  });

  it('should log info messages regardless of debug mode', () => {
    const regularLogger = new Logger('RegularLogger');
    const debugLogger = new Logger('DebugLogger', true);

    regularLogger.info('Regular info');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[RegularLogger] [INFO] Regular info'
    );

    debugLogger.info('Debug info');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[DebugLogger] [INFO] Debug info'
    );
  });

  it('should log warning messages regardless of debug mode', () => {
    const regularLogger = new Logger('RegularLogger');
    const debugLogger = new Logger('DebugLogger', true);

    regularLogger.warn('Regular warning');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[RegularLogger] [WARN] Regular warning'
    );

    debugLogger.warn('Debug warning');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[DebugLogger] [WARN] Debug warning'
    );
  });

  it('should log error messages regardless of debug mode', () => {
    const regularLogger = new Logger('RegularLogger');
    const debugLogger = new Logger('DebugLogger', true);

    regularLogger.error('Regular error');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[RegularLogger] [ERROR] Regular error'
    );

    debugLogger.error('Debug error');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[DebugLogger] [ERROR] Debug error'
    );
  });

  it('should log additional error object when provided', () => {
    const logger = new Logger('ErrorLogger');
    const errorObj = new Error('Test error');

    logger.error('Error occurred', errorObj);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[ErrorLogger] [ERROR] Error occurred'
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(errorObj);
  });
}); 