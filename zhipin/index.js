const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    devtools: true,
  });
  const page = await browser.newPage();
  await page.goto('https://www.zhipin.com/chat/im/');
  // await page.screenshot({path: 'example.png'});

  // await browser.close();
})();