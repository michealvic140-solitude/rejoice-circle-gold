#!/usr/bin/env python3
import json
import subprocess
import os

os.chdir('.')

print('[v0] Reading package.json...')
with open('package.json', 'r') as f:
    package = json.load(f)

print('[v0] Updating dependency versions...')
package['devDependencies']['vite'] = '^7.0.0'
package['devDependencies']['@vitejs/plugin-react'] = '^4.3.0'
package['devDependencies']['vitest'] = '^1.6.0'

if 'lovable-tagger' in package['devDependencies']:
    print('[v0] Removing lovable-tagger...')
    del package['devDependencies']['lovable-tagger']

print('[v0] Writing updated package.json...')
with open('package.json', 'w') as f:
    json.dump(package, f, indent=2)

print('[v0] Running npm install with legacy-peer-deps...')
result = subprocess.run(['npm', 'install', '--legacy-peer-deps', '--force'])
if result.returncode == 0:
    print('[v0] Dependencies installed successfully!')
else:
    print('[v0] npm install failed with return code:', result.returncode)
