(function () {
  // don't run the animation on browsers without CSS var support
  if (!(window.CSS && CSS.supports('color', 'var(--fake-var)'))) {
    return;
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
    .to('.anim__dropdown', {
      opacity: 1,
      yPercent: 0,
      onComplete: () => {
        //   create a curve in the movement
        gsap.from('.anim__cursorDOM', {
          rotate: -90,
          transformOrigin: '-200px -600px',
          duration: 1.3,
          delay: 0.2,
        });
        //   use Flip to grab state and ensure cursor always comes from top right of screen no matter the screen size
        state = Flip.getState('.anim__cursorCont');
        Flip.fit('.anim__cursorCont', '.anim__cursorSVG', {
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
      '.anim__cursorDOM',
      {
        backgroundColor: '#fff',
        opacity: 0.9,
        duration: 0.2,
        scale: 0.92,
      },
      '+=1.2'
    )
    .to('.anim__cursorDOM', {
      backgroundColor: '#d7d7d7',
      opacity: 0.6,
      scale: 1,
      duration: 0.1,
    })
    .to(
      '.anim__dropdown',
      {
        opacity: 0,
        yPercent: 10,
        onStart: () => {
          Flip.fit('.anim__cursorCont', state, {
            duration: 0.4,
            ease: 'sine.out',
            delay: 0.5,
          });
          gsap.to('.anim__cursorDOM', {
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
