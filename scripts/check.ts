import { chromium } from 'playwright';

const dir = new URL(`../${process.argv[2] ?? 'deck'}/`, import.meta.url).pathname;
const shots = process.argv[3];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors: string[] = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => m.type() === 'error' && errors.push(m.text()));

await page.goto(`file://${dir}index.html#1.1`);
const total = await page.evaluate(() => (window as any).Deck.slides.length);
const overflow: string[] = [];
let steps = 0;

while (true) {
  const hash = await page.evaluate(() => location.hash);
  await page.waitForTimeout(760);
  steps++;
  const out = await page.evaluate(() =>
    [...document.querySelectorAll('.slide *')].some(e => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && (r.right > innerWidth + 1 || r.bottom > innerHeight + 1);
    }));
  if (out) overflow.push(hash);
  if (shots) await page.screenshot({ path: `${shots}/${hash.slice(1)}.png` });
  await page.keyboard.press('ArrowRight');
  if ((await page.evaluate(() => location.hash)) === hash) break;
}

await browser.close();
console.log(`${total} slides, ${steps} steps`);
if (overflow.length) console.log('overflow:', overflow.join(' '));
if (errors.length) console.log('errors:', errors.join('\n'));
process.exit(errors.length || overflow.length ? 1 : 0);
