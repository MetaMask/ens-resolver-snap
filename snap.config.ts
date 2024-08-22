import type { SnapConfig } from '@metamask/snaps-cli';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

// eslint-disable-next-line n/no-process-env
if (!process.env.INFURA_PROJECT_ID) {
  throw new Error('INFURA_PROJECT_ID must be set as an environment variable.');
}

const config: SnapConfig = {
  bundler: 'webpack',
  input: resolve(__dirname, 'src/index.ts'),
  server: {
    port: 8080,
  },
  polyfills: {
    buffer: true,
  },
  environment: {
    // eslint-disable-next-line n/no-process-env
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
  },
};

export default config;
