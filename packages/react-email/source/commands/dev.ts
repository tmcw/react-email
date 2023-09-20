import fs from 'node:fs';
import { exit } from 'shelljs';
import { downloadClient, REACT_EMAIL_ROOT } from '../utils';
import { setupServer } from '../utils/run-server';

interface Args {
  dir: string;
  port: string;
  skipInstall: boolean;
}

export const dev = async ({ dir, port, skipInstall }: Args) => {
  try {
    if (!fs.existsSync(dir)) {
      throw new Error(`Missing ${dir} folder`);
    }

    if (fs.existsSync(REACT_EMAIL_ROOT)) {
      await setupServer('dev', dir, port, skipInstall);
      return;
    }

    await downloadClient();

    await setupServer('dev', dir, port, skipInstall);
  } catch (error) {
    console.log(error);
    exit(1);
  }
};
