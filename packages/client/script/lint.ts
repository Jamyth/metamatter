import { spawn } from './spawn';
import { createConsoleLogger } from '@iamyth/logger';

const logger = createConsoleLogger('ESLint');

logger.task('Linting codes');
spawn('yarn', ['eslint', '--ext=.ts', './src'], 'Lint Error, Please fix !');
