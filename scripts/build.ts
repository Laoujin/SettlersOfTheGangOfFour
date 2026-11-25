import { cp, rm } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url).pathname;
await rm(dist, { recursive: true, force: true });
await cp(new URL('../deck/', import.meta.url).pathname, dist, { recursive: true });
await Bun.write(dist + '.nojekyll', '');
console.log('built dist/');
