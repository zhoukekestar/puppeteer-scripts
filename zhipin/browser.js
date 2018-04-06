const browser = () => {
  alert('begin');
  console.log('browser script start...');
  if (location.href.indexOf('https://www.zhipin.com/chat/im') == -1) return;

  const scroll = () => {
    var container = document.querySelector('div#container');
    container.scrollTop += 100;
  }

  const sleep = t => (new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, t);
  }));

  const resumeConfirm = msg => (new Promise(resolve => {

    var div = document.createElement('div');
    div.innerHTML = `<button style='display: block; width: 100%; height: 100%;'>ok</button>`
    document.body.appendChild(div);

    div.style = `
    position: fixed;
    left: 50%;
    top: 50%;
    width: 200px;
    height: 200px;
    box-shadow: 0 0 6px 1px #000;
    background: #fff;`

    div.querySelector('button').onclick = () => {
      div.remove();
      resolve();
    }
  }))


  const notify = msg => {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(msg);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification(msg);
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }

  const elementInViewport = (el) => {
    var rect = el.getBoundingClientRect()

    // For invisible element.
    if (rect.top + rect.bottom + rect.left + rect.right + rect.height + rect.width === 0) {
      return false;
    }

    return (
       rect.top   >= 0
    // Pre load.
    && rect.top   <= ((window.innerHeight || document.documentElement.clientHeight) + 100)
    && rect.left  >= 0
    // Hide carousel except first image. Do not add equal sign.
    && rect.left  < (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  const waitForElement = elestr => (new Promise((resolve, reject) => {
      console.log('wait for element');
    let interval = setInterval(() => {
      console.log('check element');
      var ele = document.querySelector(elestr);
      if (!ele) return;

      if (elementInViewport(ele)) {
          console.log('element is in viewport');
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  }));

  const checkResume = () => (new Promise(resolve => {
    console.log('check resume')
    // var text = document.querySelector('.dialog-wrap.dialog-layer-full.dialog-resume-full');
    // text = text.textContent;


    var money = document.querySelector('.dialog-wrap.dialog-layer-full.dialog-resume-full').textContent.match(/(\d*)k-(\d*)k/);
    if (money) {
        if (Math.max(+money[1], +money[2]) < 21) {
            console.log(`money: ${money[1]} ${money[2]} not matched skip`);
            resolve();
            return;
        }
    }

    // company name
    var text = Array.from(document.querySelectorAll('.dialog-wrap.dialog-layer-full.dialog-resume-full h4')).map(item => item.textContent).join(',')
    if (/360|腾讯|百度|京东|网易|奇虎|阿里|淘宝|天猫|QQ|搜狐|搜狗|有道|携程|唯品|苏宁|美团|大众点评|小米|新浪|微博|乐视|华为/.test(text)) {
      notify('找到优质简历');
      console.log('good resume, waiting for human check...');
      resumeConfirm().then(() => {
        resolve();
      })
    } else {
      console.log('company name not matched. skip')
      resolve();
    }
  }));

  const closeResume = () => {
    try {
      document.querySelector('a.close').click();
    } catch (e) {
      console.log('resume is closed by user');
    }
  }

  const clickAndShowResume = (link) => {

    link.click();

    return new Promise(resolve => {
      waitForElement('.dialog-wrap.dialog-layer-full.dialog-resume-full').then(async () => {
        console.log('resume is showing...');

        await checkResume();
        await sleep(3000);

        setTimeout(() => {
          closeResume();
          resolve();
        }, 1000);
      })
    })

  }

  const checkedList = JSON.parse(localStorage['checkedList'] || '{}');
  const hasChecked = (uid) => {
    if (!checkedList[uid]) {
      checkedList[uid] = 1;
      localStorage['checkedList'] = JSON.stringify(checkedList);
      return false;
    }

    return true;
  }



  if (confirm('Auto find?')) {
    async function start() {
      console.log(`${Date.now()} start find...`);
      scroll();
      var links = document.querySelectorAll('#recommend-list ul li a');

      for (let i = 0; i < links.length; i++) {
        let link = links[i];
        if (elementInViewport(link) && !hasChecked(link.dataset.uid)) {
          console.log(`check ${link.dataset.uid}`);
          await clickAndShowResume(link);
          break;
        }
      }

      await sleep(3000);
      start();
    }

    setTimeout(start, 5000);
  }
};

module.exports = browser;
//@ sourceURL=zhipin.js