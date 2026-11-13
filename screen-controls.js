(() => {
  const root = document.getElementById('root');
  if (!root || document.querySelector('.game-stage')) return;

  const stage = document.createElement('div');
  stage.className = 'game-stage';
  root.parentNode.insertBefore(stage, root);
  stage.appendChild(root);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'fullscreen-toggle';
  const enterIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/></svg>';
  const exitIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h5V3M21 8h-5V3M3 16h5v5M21 16h-5v5"/></svg>';
  function updateFullscreenButton() {
    const active = document.fullscreenElement === stage;
    button.innerHTML = active ? exitIcon : enterIcon;
    button.setAttribute('aria-label', active ? '離開全螢幕' : '進入全螢幕');
    button.title = active ? '離開全螢幕' : '進入全螢幕';
    button.setAttribute('aria-pressed', String(active));
  }
  button.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === stage) await document.exitFullscreen();
      else await stage.requestFullscreen();
    } catch (error) {
      console.warn('無法切換全螢幕', error);
    }
  });
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  updateFullscreenButton();
  stage.appendChild(button);

  const copyright = document.createElement('footer');
  copyright.className = 'site-copyright';
  copyright.textContent = '© 傑尼爾教育文化事業集團 版權所有';
  stage.appendChild(copyright);
  function updateCopyright() {
    copyright.hidden = !root.querySelector('main.home');
  }
  new MutationObserver(updateCopyright).observe(root, { childList: true, subtree: true });
  updateCopyright();
})();
