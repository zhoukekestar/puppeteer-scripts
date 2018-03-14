(() => {
  if (location.href !== 'https://www.zhipin.com/chat/im/?mu=recommend') return;

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

  const waitForElement = ele => (new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      ele = document.querySelector(ele);
      if (!ele) return;

      if (elementInViewport(ele)) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  }));

  const checkResume = () => (new Promise(resolve => {
    console.log('check resume')
    var text = document.querySelector('.dialog-wrap.dialog-layer-full.dialog-resume-full');
    text = text.textContent;
    if (/360|腾讯|百度|京东|网易|奇虎|阿里巴巴|天猫|淘宝/.test(text)) {
      notify('找到优质简历');
      resumeConfirm().then(() => {
        resolve();
      })
    } else {
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
})();
//@ sourceURL=zhipin.js