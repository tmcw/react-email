import path from 'node:path';
import logSymbols from 'log-symbols';
import ora from 'ora';
import { cd, exec } from 'shelljs';
import { closeOraOnSIGNIT } from './close-ora-on-sigint';
import { REACT_EMAIL_ROOT } from './constants';

export type PackageManager = 'yarn' | 'npm' | 'pnpm';

export const installDependencies = (packageManager: PackageManager) => {
  const spinner = ora('Installing dependencies...\n').start();
  closeOraOnSIGNIT(spinner);

  cd(path.join(REACT_EMAIL_ROOT));
  exec(`${packageManager} install`);
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Dependencies installed',
  });
};
