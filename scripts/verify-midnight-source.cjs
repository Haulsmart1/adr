#!/usr/bin/env node
'use strict';

// Read-only release guard. This command never connects to Vercel or deploys.
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const fail = message => { console.error(message); process.exit(1); };
const expected = process.argv[2];
if (!/^[a-f0-9]{40}$/.test(expected || '')) fail('Supply the reviewed full 40-character commit SHA.');
if (git('rev-parse', 'HEAD') !== expected) fail('Checkout differs from the reviewed commit.');
if (git('status', '--porcelain')) fail('Checkout has uncommitted or untracked files. Use a clean isolated checkout.');
const remote = git('remote', 'get-url', 'origin');
if (!/^(https:\/\/github\.com\/Haulsmart1\/adr(?:\.git)?|git@github\.com:Haulsmart1\/adr(?:\.git)?)$/.test(remote)) fail('Wrong source repository: expected Haulsmart1/adr Midnight snapshot.');
try { git('merge-base', '--is-ancestor', '830cf3ad0bab4244e09af0aa9506255a05dcd717', 'HEAD'); }
catch { fail('Candidate does not descend from the reviewed Midnight authority snapshot.'); }
for (const file of ['package.json', 'package-lock.json', 'vercel.json', 'lib/server/enquiryRepository.cjs', 'docs/CONSOLIDATED-CANDIDATE.md']) {
  if (!fs.existsSync(path.join(root, file))) fail(`Missing Midnight source file: ${file}`);
}
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
if (pkg.name !== 'midex' || pkg.engines?.node !== '22.x' || pkg.scripts?.build !== 'next build' || config.installCommand !== 'npm ci' || config.buildCommand !== 'npm run build') fail('Unexpected root, Node or build configuration; review before proceeding.');
console.log(JSON.stringify({ repository: 'Haulsmart1/adr', commit: expected, rootDirectory: '.', node: '22.x', projectId: 'prj_ssFhW39cgBpDO7aZsP5ifUnj0iJw', teamId: 'team_4s3slf7RDwc6sdOHUHIp2NoJ', deploymentPerformed: false }, null, 2));
