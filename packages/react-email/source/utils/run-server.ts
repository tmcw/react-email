import path from 'node:path';
import { detect as detectPackageManager } from 'detect-package-manager';
import { findRoot } from '@manypkg/find-root';
import { cd } from 'shelljs';
import { createWatcherInstance, watcher } from './watcher';
import { CURRENT_PATH, REACT_EMAIL_ROOT } from './constants';
import { convertToAbsolutePath } from './convert-to-absolute-path';
import { installDependencies } from './install-dependencies';
import {
  startDevServer,
  buildProdServer,
  startProdServer,
} from './start-server-command';
import { syncPkg } from './sync-package';
import { generateEmailsPreview } from './generate-email-preview';

/**
 * Utility function to run init/sync for the server in dev, build or start mode.
 *
 * @param type - dev | build | start
 * @param dir - Directory in which the emails are located, only for dev and build, unused for start.
 * @param port - The port on which the server will run, only for dev and start, unused for build.
 */
export const setupServer = async (
  type: 'dev' | 'build' | 'start',
  dir: string,
  port: string,
  skipInstall = false,
) => {
  const cwd = await findRoot(CURRENT_PATH).catch(() => ({
    rootDir: CURRENT_PATH,
  }));

  const emailDir = convertToAbsolutePath(dir);
  const packageManager = await detectPackageManager({
    cwd: cwd.rootDir,
  }).catch(() => 'npm' as const);

  // when starting, we dont need to worry about these because it should've already happened during the build stage.
  if (type !== 'start') {
    generateEmailsPreview(emailDir);
    await syncPkg();

    if (!skipInstall) {
      installDependencies(packageManager);
    }
  }

  if (type === 'dev') {
    const watcherInstance = createWatcherInstance(emailDir);

    startDevServer(packageManager, port);

    watcher(watcherInstance, emailDir);
  } else if (type === 'build') {
    buildProdServer(packageManager);
  } else {
    cd(path.join(REACT_EMAIL_ROOT));

    startProdServer(packageManager, port);
  }
};
