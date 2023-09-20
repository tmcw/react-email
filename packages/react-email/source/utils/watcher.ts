import fs from 'node:fs';
import path from 'node:path';
import type { FSWatcher } from 'chokidar';
import { watch } from 'chokidar';
import { cp } from 'shelljs';
import {
  EVENT_FILE_DELETED,
  PACKAGE_EMAILS_PATH,
  REACT_EMAIL_ROOT,
} from './constants';
import { generateEmailsPreview } from './generate-email-preview';

export const createWatcherInstance = (watchDir: string) => {
  const watcher = watch(watchDir, {
    ignoreInitial: true,
    cwd: watchDir.split(path.sep).slice(0, -1).join(path.sep),
    ignored: /(^|[/\\])\../,
  });

  // Catches ctrl+c event
  const exit = () => {
    void watcher.close();
  };
  process.on('SIGINT', exit);
  process.on('uncaughtException', exit);

  return watcher;
};

export const watcher = (watcherInstance: FSWatcher, watchDir: string) => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  watcherInstance.on('all', async (event, filename) => {
    const file = filename.split(path.sep);
    if (file[1] === undefined) {
      return;
    }

    if (event === EVENT_FILE_DELETED) {
      if (file[1] === 'static' && file[2]) {
        await fs.promises.rm(
          path.join(REACT_EMAIL_ROOT, 'public', 'static', file[2]),
        );
        return;
      }

      await fs.promises.rm(path.join(REACT_EMAIL_ROOT, filename));
      return;
    }

    if (file[1] === 'static' && file[2]) {
      const srcPath = path.join(watchDir, 'static', file[2]);
      const result = cp(
        '-r',
        srcPath,
        path.join(REACT_EMAIL_ROOT, 'public', 'static'),
      );
      if (result.code > 0) {
        throw new Error(
          `Something went wrong while copying the file to ${PACKAGE_EMAILS_PATH}, ${result.cat()}`,
        );
      }
      return;
    }

    await generateEmailsPreview(watchDir, 'templates');
  });
};
