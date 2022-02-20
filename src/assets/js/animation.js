(function () {
  // don't run the animation on browsers without CSS var support
  if (!(window.CSS && CSS.supports('color', 'var(--fake-var)'))) {
    return;
  }

  // motion check, hooray for accessible animation
  const animationIsOk = window.matchMedia(
    '(prefers-reduced-motion: no-preference)'
  ).matches;

  if (!animationIsOk) {
    return;
  }

  // add the image based on theme
  const image = document.querySelector('.anim__dropdown-img');
  if (document.documentElement.dataset.theme == 'dark') {
    image.src = '/assets/images/dropdown--dark.png';
  } else {
    image.src = '/assets/images/dropdown--light.png';
  }

  gsap.registerPlugin(Flip);

  const media = window.matchMedia('(min-width: 600px)');
  const words = document.querySelectorAll('.anim__word');
  const text = document.querySelector('.anim__text');
  let speed;
  let state;

  // speed for 'mask' adjusted for different screen sizes.
  if (media.matches) {
    speed = 800;
  } else {
    speed = 500;
  }

  //   initial visual state
  gsap.set('.anim', {
    autoAlpha: 1,
  });
  gsap.set('.anim__svg', {
    autoAlpha: 1,
  });
  gsap.set('.anim__dropdown', {
    autoAlpha: 1,
  });
  gsap.set('.anim__dropdown-img', {
    opacity: 0,
    yPercent: -10,
  });
  text.innerText = 'problmes';

  //  GSAP timeline
  let tl = gsap.timeline({ delay: 0.3 });

  words.forEach((word) => {
    tl.to(word, {
      '--scale': 0,
      ease: 'none',
      //   duration based on word length for consistency
      duration: word.clientWidth / speed,
    });
  });

  tl.to(
    '.anim__text',
    {
      '--squiggle-opacity': 1,
      duration: 0.3,
    },
    '+=0.3'
  )
    .to('.anim__dropdown-img', {
      opacity: 1,
      yPercent: 0,
      onComplete: () => {
        //   create a curve in the movement
        gsap.from('.anim__cursor--start', {
          rotate: -90,
          transformOrigin: '-200px -600px',
          duration: 1.3,
          delay: 0.2,
        });
        //   use Flip to grab state and ensure cursor always comes from top right of screen no matter the screen size
        state = Flip.getState('.anim__cursorCont');
        Flip.fit('.anim__cursorCont', '.anim__cursor--end', {
          duration: 1.3,
          delay: 0.2,
          ease: 'back.out',
        });
      },
    })
    .to(
      '.anim__text',
      {
        '--squiggle-opacity': 1,
        duration: 0.3,
      },
      '+=0.3'
    )
    .to(
      '.anim__cursor--start',
      {
        backgroundColor: '#fff',
        opacity: 0.9,
        duration: 0.2,
        scale: 0.92,
      },
      '+=1.2'
    )
    .to('.anim__cursor--start', {
      backgroundColor: '#d7d7d7',
      opacity: 0.6,
      scale: 1,
      duration: 0.1,
    })
    .to(
      '.anim__dropdown-img',
      {
        opacity: 0,
        yPercent: 10,
        onStart: () => {
          Flip.fit('.anim__cursorCont', state, {
            duration: 0.4,
            ease: 'sine.out',
            delay: 0.5,
          });
          gsap.to('.anim__cursor--start', {
            xPercent: -400,
            duration: 0.4,
            delay: 0.5,
            opacity: 0,
          });
        },
      },
      '<'
    )
    .to(
      '.anim__text',
      {
        '--squiggle-opacity': 0,
      },
      '<'
    )
    .to(
      '.anim__problems',
      {
        '--scale': 1,
        ease: 'sine.out',
        onComplete: () => {
          text.innerText = 'problems';
        },
      },
      '<+=0.1'
    )
    .to(
      '.anim__problems',
      {
        '--scale': 0,
        ease: 'power1.out',
      },
      '+=0.25'
    );
})();
