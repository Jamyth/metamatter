import { spawn } from './spawn';
import { createConsoleLogger } from '@iamyth/logger';

const logger = createConsoleLogger('Prettier');

logger.task('Formatting codes');
spawn('prettier', ['--write', './src/**/*.{css,html,js,json,jsx,less,ts,tsx}'], 'Cannot Format');
