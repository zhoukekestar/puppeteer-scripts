const puppeteer = require('puppeteer');

const Cookie = require('../tools/Cookie')('zhipin');
const localStorage = require('../tools/localStorage');
const timeout = 600e3;

(async () => {
  const browser = await puppeteer.launch({
    devtools: true,
  });
  const page = await browser.newPage();

  // 百度登录测试代码
  // page.waitForSelector('#s_username_top > span', { timeout }).then(async () => {
  //   console.log('login');
  //   await Cookie.save(page);
  //   console.log('save ok')
  // })
  // await page.goto('https://www.baidu.com');

  page.waitForSelector('#main > div.side-wrap > div > div.figure > a', { timeout }).then(async () => {
    console.log('login');
    await Cookie.save(page);
    console.log('save ok')
  })
  await page.goto('https://www.zhipin.com/chat/im/');
})();