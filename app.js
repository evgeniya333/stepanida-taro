const dialog=document.querySelector('#reading-dialog');
const descriptions={
'Отношения и чувства':'Расклад для разговора о ваших ожиданиях, границах и потребностях в отношениях. Посмотрим, какие темы требуют внимания и что вы можете обсудить с партнёром.',
'Ситуация и выбор':'Исследуем вашу ситуацию с нескольких сторон: что притягивает в каждом варианте, что вызывает сомнения и на какие личные опоры можно опереться при выборе.',
'Путь к себе':'Обратим внимание на ваши желания, ресурсы и привычные реакции. Образы карт станут отправной точкой для размышления о том, что помогает вам двигаться дальше.'};
document.querySelectorAll('[data-topic]').forEach(button=>button.addEventListener('click',()=>{const topic=button.dataset.topic;document.querySelector('#dialog-title').textContent=topic;document.querySelector('#dialog-copy').textContent=descriptions[topic];document.querySelector('#topic-link').href='https://wa.me/77713533422?text='+encodeURIComponent('Здравствуйте, Степанида! Хочу обсудить расклад «'+topic+'». Подскажите формат и стоимость консультации.');document.querySelector('#topic-link').target='_blank';document.querySelector('#topic-link').rel='noopener';dialog.showModal()}));
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
const cards=[['✦','Звезда','Что даёт вам надежду? Выберите один небольшой шаг в сторону того, что вас вдохновляет.'],['☾','Луна','Какое чувство сейчас просит вашего внимания? Дайте ему название, прежде чем действовать.'],['☼','Солнце','Что принесло бы вам простую радость сегодня? Найдите для этого немного времени.'],['✧','Умеренность','Где вам нужен более спокойный ритм? Подумайте, какую задачу можно сделать без спешки.'],['❋','Мир','За что вы можете поблагодарить себя? Заметьте то, что уже удалось завершить.'],['✴','Маг','Какой ресурс уже есть у вас под рукой? Начните с того, на что можете повлиять.']];
let previous=-1;document.querySelector('#draw').addEventListener('click',()=>{let n;do{n=Math.floor(Math.random()*cards.length)}while(n===previous);previous=n;const c=cards[n];document.querySelector('.daily-symbol').textContent=c[0];document.querySelector('#daily-result h3').textContent=c[1];document.querySelector('#daily-result p').textContent=c[2];document.querySelector('#draw').innerHTML='Другая карта <span>✧</span>'});
document.querySelector('#year').textContent=new Date().getFullYear();

// Reveal each section once; keep all content visible when motion is disabled.
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('.section-top, .service, .approach-grid > *, #process > .eyebrow, #process > h2, .steps article, .daily > div, .faq > div, .contact > .wrap');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -20px 0px'});
  targets.forEach(target => {
    target.classList.add('reveal');
    if (target.classList.contains('service')) {
      const index = Array.from(target.parentElement.children).indexOf(target);
      target.style.setProperty('--reveal-delay', `${(index % 2) * 80}ms`);
    }
    observer.observe(target);
  });
  document.documentElement.classList.add('motion-ready');
  const disableMotion = event => {
    if (!event.matches) return;
    observer.disconnect();
    document.documentElement.classList.remove('motion-ready');
  };
  preference.addEventListener('change', disableMotion);
  document.querySelector('#draw').addEventListener('click', () => {
    if (preference.matches) return;
    const result = document.querySelector('#daily-result');
    if (!result.animate) return;
    result.getAnimations().forEach(animation => animation.cancel());
    result.animate([{opacity: .25, transform: 'translateY(8px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 450, easing: 'ease-out'});
  });
})();

// Play silent clips only while visible; visitors can pause each animation.
(() => {
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 const players=[...document.querySelectorAll('.animated-player')];
 const sync=player=>{const video=player.querySelector('video');const paused=video?video.paused:player.classList.contains('is-paused');const button=player.querySelector('.media-toggle');button.textContent=paused?'▶ Воспроизвести':'Ⅱ Пауза';button.setAttribute('aria-label',paused?'Воспроизвести анимацию':'Приостановить анимацию');};
 const start=player=>{const video=player.querySelector('video');if(video){video.muted=true;video.play().catch(()=>sync(player));}else{player.classList.remove('is-paused');}sync(player);};
 const stop=player=>{const video=player.querySelector('video');if(video)video.pause();else player.classList.add('is-paused');sync(player);};
 players.forEach(player=>{const video=player.querySelector('video');player.dataset.userPaused=preference.matches?'true':'false';if(video){video.muted=true;video.pause();video.addEventListener('playing',()=>sync(player));video.addEventListener('pause',()=>sync(player));}if(preference.matches)stop(player);player.querySelector('.media-toggle').addEventListener('click',()=>{const paused=video?video.paused:player.classList.contains('is-paused');player.dataset.userPaused=paused?'false':'true';if(paused){player.classList.add('explicit-play');start(player);}else{player.classList.remove('explicit-play');stop(player);}});sync(player);});
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{entry.target.dataset.inView=entry.isIntersecting?'true':'false';if(entry.isIntersecting&&entry.target.dataset.userPaused!=='true')start(entry.target);else stop(entry.target);}),{threshold:.2});players.forEach(player=>observer.observe(player));}else if(!preference.matches){players.forEach(start);}
 preference.addEventListener('change',event=>{if(event.matches)players.forEach(player=>{player.dataset.userPaused='true';player.classList.remove('explicit-play');stop(player);});});
 document.addEventListener('visibilitychange',()=>players.forEach(player=>{if(document.hidden)stop(player);else if(player.dataset.inView==='true'&&player.dataset.userPaused!=='true')start(player);}));
})();
