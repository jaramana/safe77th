// Changes each pinned picture as a step reaches the line, marks the current
// section in the nav, and opens the nav's menu on phones.

(function () {
  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  var stories = Array.prototype.map.call(document.querySelectorAll('.story'), function (story) {
    return {
      story: story,
      steps: Array.prototype.slice.call(story.querySelectorAll('.step')),
      layers: Array.prototype.slice.call(story.querySelectorAll('.layer')),
      current: null
    };
  });

  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav-links > li > a'));
  var targets = links.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  });

  function show(entry, name) {
    if (name === entry.current) return;
    entry.current = name;
    entry.layers.forEach(function (layer) {
      layer.classList.toggle('on', layer.dataset.layer === name);
    });
  }

  // A step takes over as its text enters. Narrow screens rest cards at the
  // bottom of the window, so the line sits lower there.
  function updateStories() {
    var line = window.innerHeight * (window.innerWidth <= 960 ? 0.96 : 0.75);
    stories.forEach(function (entry) {
      var active = entry.steps[0];
      entry.steps.forEach(function (step) {
        if (step.firstElementChild.getBoundingClientRect().top <= line) active = step;
      });
      show(entry, active.dataset.show);
    });
  }

  function updateNav() {
    var line = window.innerHeight * 0.4;
    var active = -1;
    targets.forEach(function (target, i) {
      if (target && target.getBoundingClientRect().top <= line) active = i;
    });
    links.forEach(function (link, i) {
      if (i === active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function update() {
    updateStories();
    updateNav();
  }

  var queued = false;
  window.addEventListener('scroll', function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();

  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.site-nav-toggle');
  function setOpen(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  toggle.addEventListener('click', function () {
    setOpen(!nav.classList.contains('open'));
  });

  // A chosen link closes the phone menu and the dropdown. The dropdown can open
  // again once the pointer has left it.
  var sub = document.querySelector('.has-sub');
  each('.site-nav-links a', function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
      link.blur();
      if (sub.contains(link)) sub.classList.add('shut');
    });
  });
  sub.addEventListener('mouseleave', function () { sub.classList.remove('shut'); });
})();
