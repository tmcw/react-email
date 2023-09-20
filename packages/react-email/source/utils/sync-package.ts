import fs from 'node:fs';
import path from 'node:path';
import { readPackageSync } from 'read-pkg';
import { REACT_EMAIL_ROOT } from './constants';

export const syncPkg = async () => {
  const clientPkg = readPackageSync({ cwd: REACT_EMAIL_ROOT });
  const userPkg = readPackageSync();

  await fs.promises.writeFile(
    path.join(REACT_EMAIL_ROOT, 'package.json'),
    JSON.stringify({
      ...clientPkg,
      dependencies: {
        ...clientPkg.dependencies,
        ...userPkg.dependencies,
      },
    }),
  );
};
