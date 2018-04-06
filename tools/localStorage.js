const LocalStorage = require('node-localstorage').LocalStorage;
const path = require('path');
const localStorage = new LocalStorage(path.join(__dirname, '../temp/localstorage'));

module.exports = localStorage;