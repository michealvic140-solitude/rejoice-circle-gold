#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';

console.log('[v0] Starting dependency cleanup...');

// Update package.json to have correct versions
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

packageJson.devDependencies['vite'] = '^7.0.0';
packageJson.devDependencies['@vitejs/plugin-react'] = '^4.3.0';
packageJson.devDependencies['vitest'] = '^1.6.0';

// Remove lovable-tagger if it exists
delete packageJson.devDependencies['lovable-tagger'];

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
console.log('[v0] Updated package.json');

// Try npm install with legacy peer deps
try {
  console.log('[v0] Running npm install with legacy-peer-deps...');
  execSync('npm install --legacy-peer-deps --force', { stdio: 'inherit' });
  console.log('[v0] Dependencies installed successfully');
} catch (error) {
  console.error('[v0] npm install failed:', error.message);
  process.exit(1);
}
