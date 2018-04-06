const puppeteer = require('puppeteer');
const Cookie = require('../tools/Cookie')('zhipin');
const browserscript = require('./browser');

(async () => {
  const browser = await puppeteer.launch({
    devtools: true,
  });
  const page = await browser.newPage();
  await Cookie.sync(page);
  await page.goto('https://www.zhipin.com/chat/im/?mu=recommend');

  await page.evaluate(browserscript);
})();