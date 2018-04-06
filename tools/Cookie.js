const fs = require('fs');
const path = require('path');
const util = require('util');
const debuglog = util.debuglog('Cookie');
const localStorage = require('./localStorage');

module.exports = name => ({
  sync: async page => {
    try {
      const cookies = JSON.parse(localStorage.getItem(`cookie_${name}`));
      await page.setCookie(...cookies);
      debuglog('sync ok');
    } catch (e) {
      debuglog('sync fail', e);
    }
  },
  save: async page => {
    const cookies = await page.cookies();
    debuglog('get cookie.');
    localStorage.setItem(`cookie_${name}`, JSON.stringify(cookies, null, 2));
    debuglog('save done!');
  }
});