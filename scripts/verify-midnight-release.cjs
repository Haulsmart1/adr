#!/usr/bin/env node
// Offline release-review gate only. Never configures, deploys, sends or migrates a service.
'use strict';
const { spawnSync, execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = '66696d34a6d0ce17b1b29f679c2b0cec8a198363';
const sourceTree = 'b36edef8cd179db541dae3a4921751ed87d6c71b';
const metadata = new Set(['docs/MIDNIGHT_RELEASE_REVIEW_2026-10-18.md', 'scripts/verify-midnight-release.cjs', 'scripts/midnight-sql-review.cjs', 'tools/midnight-review/package.json', 'tools/midnight-review/package-lock.json']);
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
if (git('rev-parse', source + '^{tree}') !== sourceTree) throw Error('Reviewed Midnight source tree mismatch.');
git('merge-base', '--is-ancestor', source, 'HEAD');
for (const file of git('diff', '--name-only', source, 'HEAD').split('\n').filter(Boolean)) {
  if (!metadata.has(file)) throw Error('Unreviewed runtime/source drift: ' + file);
}
if (process.versions.node.split('.')[0] !== '22') throw Error('Use reviewed Node 22.x; production targets Node 22.x.');
for (const name of fs.readdirSync(root)) {
  if (/^\.env(?:\.|$)/.test(name) && name !== '.env.example') throw Error('Use a clean checkout without environment files.');
}
// Do not inherit application credentials or opt-in integration-test URLs.
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) =>
  /^(PATH|HOME|TMPDIR|TMP|TEMP|SystemRoot|COMSPEC|LANG|LC_.*|CI)$/.test(key)));
env.NODE_PATH = path.join(root, 'tools/midnight-review/node_modules');
env.NEXT_TELEMETRY_DISABLED = '1';
// Legacy ADR pages instantiate a browser client during static collection.
// These deliberately non-routable, non-credential fixtures prove build only.
env.NEXT_PUBLIC_SUPABASE_URL = 'https://midnight-build.example.invalid';
env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'synthetic-build-fixture-not-a-credential';
const run = args => {
  console.log('\nReview gate:', args.join(' '));
  const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: 'inherit', timeout: 300000 });
  if (result.error || result.status !== 0) throw Error('Review gate failed: ' + args.join(' '));
};
run(['scripts/verify-midnight-source.cjs', process.argv[2] || '']);
const core = ['freight', 'security', 'routing', 'workspace', 'release-dependencies', 'p0-release', 'square-boundary', 'public-quote', 'enquiry', 'enquiry-capture', 'admin-authority', 'enquiry-database-config', 'enquiry-receipt-retry', 'enquiry-smtp-options'];
run(['--experimental-vm-modules', '--test', ...core.map(name => 'scripts/' + name + '.test.cjs')]);
for (const name of ['enquiry-owner-browser', 'enquiry-loading-component', 'enquiry-document-retention-component', 'operations-record-component', 'operations-document-component', 'operations-action-component']) run(['scripts/' + name + '.cjs']);
run(['--test', 'scripts/midnight-sql-review.cjs']);
run(['node_modules/next/dist/bin/next', 'build']);
console.log(JSON.stringify({ offlineReviewPassed: true, hostedAcceptance: false, deployed: false, multiSessionPostgres: false }));
