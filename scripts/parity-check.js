// Computed-style parity harness for Stage B semanticization.
// Dumps computed styles for every element under a container, keyed by a stable
// DOM-path (tag + child index) that is invariant to class renames. Run twice
// (before via `git stash`, after) and diff the two JSON dumps: any diff = a
// visual regression. Usage:
//   node scripts/parity-check.js <url> <containerSelector> <outFile>
// e.g. node scripts/parity-check.js http://localhost:4173/account.html "main" /tmp/after.json
const { chromium } = require('playwright');

const PROPS = [
  'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index',
  'color', 'background-color', 'background-image', 'opacity', 'visibility',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align', 'text-transform',
  'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
  'align-items', 'align-self', 'justify-content', 'gap',
  'grid-template-columns', 'box-shadow', 'transform', 'overflow-x', 'overflow-y', 'white-space',
];

const EXEC = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

(async () => {
  const [url, container, outFile] = process.argv.slice(2);
  if (!url || !container || !outFile) {
    console.error('usage: node scripts/parity-check.js <url> <containerSelector> <outFile>');
    process.exit(2);
  }
  const browser = await chromium.launch({ executablePath: EXEC });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600); // let JS-built content settle
  const dump = await page.evaluate(({ container, PROPS }) => {
    const root = document.querySelector(container);
    if (!root) return { error: 'container not found: ' + container };
    const out = {};
    const walk = (el, path) => {
      const cs = getComputedStyle(el);
      const rec = { tag: el.tagName.toLowerCase() };
      for (const p of PROPS) rec[p] = cs.getPropertyValue(p);
      out[path] = rec;
      let i = 0;
      for (const child of el.children) walk(child, path + '/' + i++ + ':' + child.tagName.toLowerCase());
    };
    walk(root, '0:' + root.tagName.toLowerCase());
    return out;
  }, { container, PROPS });
  require('fs').writeFileSync(outFile, JSON.stringify(dump, null, 1));
  const n = dump.error ? 0 : Object.keys(dump).length;
  console.log(dump.error ? 'ERROR ' + dump.error : 'dumped ' + n + ' elements -> ' + outFile);
  await browser.close();
  if (dump.error) process.exit(1);
})();
