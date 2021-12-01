import { spawn } from './spawn';
import { createConsoleLogger } from '@iamyth/logger';

const logger = createConsoleLogger('ESLint');

logger.task('Linting codes');
spawn('eslint', ['--ext', './src/**/*.ts'], 'Lint Error, Please fix !');
