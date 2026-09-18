(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const running = new Set();
  function reveal(node, delay = 0, spring = false) {
    if (reduce.matches || !node.animate) return;
    const frames = spring ? [
      {opacity:0,transform:'translateY(22px) scale(.96)'},
      {opacity:1,transform:'translateY(-3px) scale(1.008)',offset:.78},
      {opacity:1,transform:'none'}
    ] : [{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}];
    const animation = node.animate(frames,{duration:420,delay,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
    running.add(animation);
    animation.onfinish = animation.oncancel = () => running.delete(animation);
  }
  document.querySelectorAll('.name-word').forEach((node,i) => reveal(node,i*65,true));
  document.querySelectorAll('.hero h1,.resume-actions,.hero-bottom > *').forEach((node,i) => reveal(node,120+i*55,true));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const siblings = [...entry.target.parentElement.children];
        const stagger = entry.target.matches('article,.tags span') ? Math.min(siblings.indexOf(entry.target)*65,195) : 0;
        reveal(entry.target,stagger,entry.target.matches('.skill-grid article,.tags span'));
      });
    },{threshold:.08});
    document.querySelectorAll('.section-top,.section-title,.timeline article,.about-grid > *,.skill-grid article,.tags span,.activity-grid article,.connect').forEach(node => observer.observe(node));
  }
  document.addEventListener('focusin',event => {
    for (const animation of running) if (animation.effect.target.contains(event.target)) animation.finish();
  });
  const magnetic = [...document.querySelectorAll('.button,.nav-contact')];
  magnetic.forEach(button => {
    const inner = document.createElement('span');
    inner.className = 'button-inner';
    while(button.firstChild) inner.append(button.firstChild);
    button.append(inner);
    button.addEventListener('pointermove',event => {
      if(reduce.matches || !fine.matches) return;
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--mx',`${Math.max(-5,Math.min(5,(event.clientX-rect.left-rect.width/2)*.1))}px`);
      button.style.setProperty('--my',`${Math.max(-4,Math.min(4,(event.clientY-rect.top-rect.height/2)*.15))}px`);
    });
    const reset=()=>{button.style.removeProperty('--mx');button.style.removeProperty('--my');};
    button.addEventListener('pointerleave',reset);button.addEventListener('blur',reset);
  });
  const cards = [...document.querySelectorAll('.project')];
  cards.forEach(card => {
    card.addEventListener('pointermove',event => {
      if(reduce.matches || !fine.matches) return;
      const rect=card.getBoundingClientRect();
      card.style.setProperty('--rx',`${-(event.clientY-rect.top-rect.height/2)/rect.height*4}deg`);
      card.style.setProperty('--ry',`${(event.clientX-rect.left-rect.width/2)/rect.width*4}deg`);
    });
    card.addEventListener('pointerleave',()=>{card.style.removeProperty('--rx');card.style.removeProperty('--ry');});
  });
  const progress=document.querySelector('.scroll-progress');
  const top=document.querySelector('.back-top');
  const navLinks=[...document.querySelectorAll('.navlinks a,.nav-contact')];
  const sections=[...document.querySelectorAll('main section[id]')];
  let scheduled=false;
  function syncScroll(){
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${max>0?Math.max(0,Math.min(1,scrollY/max)):0})`;
    top.hidden=scrollY<500;
    let active='home';
    const offset=document.querySelector('header').getBoundingClientRect().bottom+35;
    sections.forEach(section=>{if(section.getBoundingClientRect().top<=offset) active=section.id;});
    navLinks.forEach(link=>{if(link.hash===`#${active}`) link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    scheduled=false;
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(syncScroll);}}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);syncScroll();
  if('ResizeObserver' in window)new ResizeObserver(schedule).observe(document.body);
  reduce.addEventListener('change',()=>{
    if(reduce.matches) for(const animation of running) animation.cancel();
    [...cards,...magnetic].forEach(node=>['--rx','--ry','--mx','--my'].forEach(key=>node.style.removeProperty(key)));
  });
})();
