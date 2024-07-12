import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// 打包
const checkWorker = execSync('pnpm tsc && pnpm build', { stdio: 'inherit' });
// 如果检查未通过，则退出
if (checkWorker) process.exit(1);

// 升级 package.json
const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf-8'));
const { version } = packageJson;
const newVersion = version
  .split('.')
  .map((v, i) => (i === 2 ? parseInt(v) + 1 : v))
  .join('.');
packageJson.version = newVersion;
writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// git commit
execSync('git add .', { stdio: 'inherit' });
execSync(`git commit -m "chore: upgrade version to ${newVersion}"`, { stdio: 'inherit' });

// npm 发布
execSync(`npm publish --registry https://registry.npmjs.org --no-git-checks --access public`, {
  stdio: 'inherit',
});
