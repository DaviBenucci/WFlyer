import { firefox, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await firefox.launch();
const page = await browser.newPage();
const records = [];
await page.addInitScript(() => {
  window.__vp003 = [];
  let previous = '';
  const sample = () => {
    if (!document.body) return;
    const state = {
      route: location.pathname,
      bootstrap: document.querySelector('[data-story-bootstrap]')?.getAttribute('data-bootstrap-state') ?? null,
      brandActive: document.documentElement.getAttribute('data-brand-intro-active'),
      brandState: document.querySelector('[data-brand-intro]')?.getAttribute('data-brand-intro') ?? null,
      homeReady: document.querySelector('[data-brand-intro-home-state]')?.getAttribute('data-brand-intro-home-state') ?? null,
      main: !!document.querySelector('main'),
      mainInert: !!document.querySelector('main')?.closest('[inert]'),
      transitionLock: document.querySelector('[data-site-experience]')?.getAttribute('data-scroll-locked') ?? null,
      bodyOverflow: getComputedStyle(document.body).overflow,
      htmlOverflow: getComputedStyle(document.documentElement).overflow,
      cover: !!document.querySelector('[data-bootstrap-cover], [data-brand-intro]'),
    };
    const key = JSON.stringify(state);
    if (key !== previous) window.__vp003.push({ms: performance.now(), ...state});
    previous = key;
  };
  new MutationObserver(sample).observe(document, {subtree:true, childList:true, attributes:true});
  addEventListener('DOMContentLoaded', sample);
});
try {
  for (const route of ['/', '/sobre', '/servicos', '/processo', '/portfolio', '/contato']) {
    await page.goto('http://127.0.0.1:3000' + route);
    if (route === '/') await expect(page.locator('[data-brand-intro-home-state]')).toHaveAttribute('data-brand-intro-home-state', 'ready', {timeout:10000});
    await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
    await expect(page.getByRole('main')).toBeVisible();
    records.push({route, timeline: await page.evaluate(() => window.__vp003)});
  }
} finally {
  await writeFile(new URL('unmanaged-server-dom.json', import.meta.url), JSON.stringify(records,null,2)+'\n');
  await browser.close();
}
