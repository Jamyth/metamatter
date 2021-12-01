import { spawnSync } from 'child_process';
import { createConsoleLogger } from '@iamyth/logger';

const logger = createConsoleLogger('System');
export const spawn = (command: string, args: string[], errorMessage: string) => {
    const isWindow = process.platform === 'win32';
    const result = spawnSync(isWindow ? command + '.cmd' : command, args);
    if (result.error) {
        logger.error(errorMessage);
        logger.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        logger.error(`A non-zero status received, command: ${command} ${args.join(' ')}`);
        process.exit(1);
    }
};
