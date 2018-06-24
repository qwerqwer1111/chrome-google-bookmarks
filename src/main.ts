fetch('https://www.google.com/bookmarks/?output=xml', {credentials: 'include'})
  .then(r => r.text())
  .then(text => {
    const e = document.getElementById('app');
    if (e) {
      e.innerText = text;
    }
  })
  .catch(err => {
    console.error(err);

    const e = document.getElementById('app');
    if (e) {
      e.innerHTML = '<a id="login-link" href="#">login</a>';
    }

    const a = document.getElementById('login-link');
    if (a) {
      a.addEventListener('click', () => {
        chrome.tabs.create({url: 'http://www.google.com/bookmarks'});
      });
    }
  });
