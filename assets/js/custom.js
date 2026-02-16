document.addEventListener('DOMContentLoaded', () => {
    // playVideoWithDelayAndLoop('heroVideo', 800);
    // animateWords('.heading-animation-section');
    // contentOnscroll();
    initMWGEffect001();
    // initMWGEffect026('.is-work .row');
    // initMWGEffect038();
    // mwgEffect031();
    // initMWGEffect020();
    // initMWGEffect004Full();
    initMWGEffect('.mwg_effect007');
});


// const lenis = new Lenis();

// lenis.on('scroll', ScrollTrigger.update);

// function raf(time) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }

// requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

function playVideoWithDelayAndLoop(videoId, delay = 500) {
    const video = document.getElementById(videoId);
    if (!video) return console.error("Video element not found");

    // Start video after delay
    setTimeout(() => {
        video.play().catch(e => console.log("Video play error:", e));
    }, delay);

    // Ensure loop works continuously
    video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
    });
}

function animateWords(sectionSelector) {
  document.querySelectorAll(sectionSelector).forEach(section => {
    // console.log(section)
    section.querySelectorAll('.word').forEach(word => {
        console.log(word.children)
      gsap.to(word.children, {
        yPercent: '+=100',
        ease: 'expo.inOut',
        scrollTrigger: {
          trigger: word,
          start: "top 100%",
          end: "bottom 10%",
          scrub: 0.4
        }
      });
    });
  });
}

function contentOnscroll() {

    // Loop through all .content-section sections
    document.querySelectorAll(".content-section").forEach(section => {

        if(!section) return;

        const heading = section.querySelector("h2");
        const paragraph = section.querySelector(".paragraph");
        const button = section.querySelector(".theme-button");
        const pinHeight = section.querySelector(".pin-height");
        const container = section.querySelector(".container");

        // Wrap all texts into words
        wrapWords(heading);
        wrapWords(paragraph);
        wrapWords(button);

        const words = section.querySelectorAll(".word");

        // Timeline for smooth scroll animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinHeight,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                pin: container,
            }
        });

        // Animate all words (h2, paragraph, button)
        tl.to(words, {
            x: 0,               // Slide from right to original position
            stagger: 0.02,      // Each word comes slightly after previous
            ease: 'power4.inOut',
            duration: 1
        });

    }); // end forEach
}

// Utility function to wrap element text into words
function wrapWords(element) {
    const text = element.textContent;
    element.innerHTML = text
        .split(' ')
        .map(word => `<span class="word">${word}</span>`)
        .join(' ');
}

function initMWGEffect001() {
    document.querySelectorAll('.work-section').forEach(section => {

        if(!section) return;
        const container = section.querySelector('.container');
        const cardsContainer = container.querySelector('.cards');
        const cards = container.querySelectorAll('.card');
        const distance = cardsContainer.clientWidth - window.innerWidth;

        // Fade out .scroll
        gsap.to(section.querySelectorAll('.scroll'), {
            autoAlpha: 0,
            duration: 0.2,
            scrollTrigger: {
                trigger: cardsContainer,
                start: 'top top',
                end: 'top top-=1',
                toggleActions: "play none reverse none"
            }
        });

        // Horizontal scroll tween for this section
        const scrollTween = gsap.to(cardsContainer, {
            x: -distance,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: true,
                start: 'top top',
                end: '+=' + distance
            }
        });

        // Animate each card in this section
        cards.forEach(card => {
            const values = {
                x: (Math.random() * 20 + 30) * (Math.random() < 0.5 ? 1 : -1),
                y: (Math.random() * 6 + 10) * (Math.random() < 0.5 ? 1 : -1),
                rotation: (Math.random() * 10 + 10) * (Math.random() < 0.5 ? 1 : -1)
            };

            gsap.fromTo(card, {
                rotation: values.rotation,
                xPercent: values.x,
                yPercent: values.y
            }, {
                rotation: -values.rotation,
                xPercent: -values.x,
                yPercent: -values.y,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: scrollTween,
                    start: 'left 120%',
                    end: 'right -20%',
                    scrub: true
                }
            });
        });
    });

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();
}

function initMWGEffect026(selector) {

  const container = document.querySelector(selector);
  if (!container) return;

  gsap.registerPlugin(Observer);

  const halfX = container.clientWidth / 2;
  const wrapX = gsap.utils.wrap(-halfX, 0);

  const xTo = gsap.quickTo(container, 'x', {
    duration: 1.5,
    ease: "power4",
    modifiers: {
      x: gsap.utils.unitize(wrapX)
    }
  });

  const halfY = container.clientHeight / 2;
  const wrapY = gsap.utils.wrap(-halfY, 0);

  const yTo = gsap.quickTo(container, 'y', {
    duration: 1.5,
    ease: "power4",
    modifiers: {
      y: gsap.utils.unitize(wrapY)
    }
  });

  let incrX = 0,
      incrY = 0;

  Observer.create({
    target: window,
    type: "wheel,touch,pointer",
    onChangeX: (self) => {
      if (self.event.type === "wheel")
        incrX -= self.deltaX;
      else
        incrX += self.deltaX * 2;

      xTo(incrX);
    },
    onChangeY: (self) => {
      if (self.event.type === "wheel")
        incrY -= self.deltaY;
      else
        incrY += self.deltaY * 2;

      yTo(incrY);
    }
  });
}

function initMWGEffect038() {

  gsap.registerPlugin(ScrollTrigger);

  // LENIS (optional)
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      autoRaf: true,
    });
  }

  const mm = gsap.matchMedia();

  mm.add("(min-width: 769px)", () => {

    const projects = document.querySelectorAll('.verticle-services .project');
    if (!projects.length) return;

    projects[0].classList.add('on');

    const numProjects = projects.length;
    let currentProject = projects[0];

    const container = document.querySelector('.verticle-services .container');
    const pinHeight = document.querySelector('.verticle-services .pin-height');

    if (!container || !pinHeight) return;

    const dist = container.clientWidth - document.body.clientWidth;

    gsap.to(container, {
      x: -dist,
      ease: 'none',
      scrollTrigger: {
        trigger: pinHeight,
        pin: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: self => {

          const closestIndex = Math.round(self.progress * (numProjects - 1));
          const closestProject = projects[closestIndex];

          if (closestProject !== currentProject) {
            currentProject.classList.remove('on');
            closestProject.classList.add('on');
            currentProject = closestProject;
          }
        }
      }
    });

  });

}

function mwgEffect031() {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    const lenis = new Lenis({
        autoRaf: true,
    });

    /* Hide Scroll Indicator */
    gsap.to('.scroll', {
        autoAlpha: 0,
        duration: 0.2,
        scrollTrigger: {
            trigger: '.mwg_effect031',
            start: 'top top',
            end: 'top top-=1',
            toggleActions: "play none reverse none"
        }
    });

    const slides = document.querySelectorAll('.mwg_effect031 .slide');

    slides.forEach(slide => {

        const contentWrapper = slide.querySelector('.content-wrapper');
        const content = slide.querySelector('.content');

        // 3D Rotate + Scale Animation
        gsap.to(content, {
            rotationZ: (Math.random() - 0.5) * 10,
            scale: 0.7,
            rotationX: 40,
            ease: 'power1.in',
            scrollTrigger: {
                pin: contentWrapper,
                trigger: slide,
                start: 'top top',
                end: '+=' + window.innerHeight,
                scrub: true
            }
        });

        // Fade Out Animation
        gsap.to(content, {
            autoAlpha: 0,
            ease: 'power1.in',
            scrollTrigger: {
                trigger: content,
                start: 'top -80%',
                end: '+=' + (0.2 * window.innerHeight),
                scrub: true
            }
        });

    });

}

function initMWGEffect020() {

    const root = document.querySelector('.image-movement-section')
    if (!root) return

    const images = []
    root.querySelectorAll('.medias img').forEach(image => {
        images.push(image.getAttribute('src'))
    })

    let incr = 0,
        oldIncrX = 0,
        oldIncrY = 0,
        resetDist = window.innerWidth / 8,
        indexImg = 0

    root.addEventListener("mousemove", e => {
        oldIncrX = e.clientX
        oldIncrY = e.clientY
    }, { once: true })

    root.addEventListener("mousemove", e => {
        const valX = e.clientX
        const valY = e.clientY

        incr += Math.abs(valX - oldIncrX) + Math.abs(valY - oldIncrY)

        if (incr > resetDist) {
            incr = 0
            createMedia(
                valX,
                valY - root.getBoundingClientRect().top,
                valX - oldIncrX,
                valY - oldIncrY
            )
        }

        oldIncrX = valX
        oldIncrY = valY
    })

    function createMedia(x, y, deltaX, deltaY) {

        const image = document.createElement("img")
        image.setAttribute('src', images[indexImg])
        root.appendChild(image)

        const tl = gsap.timeline({
            onComplete: () => {
                root.removeChild(image)
                tl.kill()
            }
        })

        tl.fromTo(image, {
            xPercent: -50 + (Math.random() - 0.5) * 80,
            yPercent: -50 + (Math.random() - 0.5) * 10,
            scaleX: 1.3,
            scaleY: 1.3
        }, {
            scaleX: 1,
            scaleY: 1,
            ease: 'elastic.out(2, 0.6)',
            duration: 0.6
        })

        tl.fromTo(image, {
            x,
            y,
            rotation: (Math.random() - 0.5) * 20,
        }, {
            x: '+=' + deltaX * 4,
            y: '+=' + deltaY * 4,
            rotation: (Math.random() - 0.5) * 20,
            ease: 'power4.out',
            duration: 1.5
        }, '<')

        tl.to(image, {
            duration: 0.3,
            scale: 0.5,
            delay: 0.1,
            ease: 'back.in(1.5)'
        })

        indexImg = (indexImg + 1) % images.length
    }
}

function initMWGEffect004Full() {

    gsap.registerPlugin(ScrollTrigger)

    const section = document.querySelector('.testimonials-card-section')
    if (!section) return

    const pinHeight = section.querySelector('.pin-height')
    const container = section.querySelector('.container')
    const paragraph = section.querySelector('.paragraph')
    const scrollElement = document.querySelector('.scroll')

    if (!pinHeight || !container || !paragraph) return

    // LENIS
    const lenis = new Lenis({
        autoRaf: true,
    })

    // Wait for fonts
    document.fonts.ready.then(() => {

        // Hide scroll icon
        if (scrollElement) {
            gsap.to(scrollElement, {
                autoAlpha: 0,
                duration: 0.2,
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'top top-=1',
                    toggleActions: "play none reverse none"
                }
            })
        }

        // Wrap words inside spans
        const text = paragraph.textContent
        paragraph.innerHTML = text
            .split(' ')
            .map(word => `<span class="word">${word}</span>`)
            .join(' ')

        const words = paragraph.querySelectorAll(".word")

        // Pin section
        ScrollTrigger.create({
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container
        })

        // Detect lines
        const lines = [[]]
        let lineIndex = 0

        words.forEach((word, i) => {
            const offsetTop = word.offsetTop

            if (i > 0 && offsetTop !== words[i - 1].offsetTop) {
                lines.push([])
                lineIndex++
            }

            lines[lineIndex].push(word)
        })

        // Animate lines
        lines.forEach(lineWords => {
            gsap.to(lineWords, {
                x: 0,
                stagger: 0.2,
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true
                }
            })
        })

    })
}

function initMWGEffect(selector) {

    const root = document.querySelector(selector);
    if (!root) return;

    // LENIS (optional)
    const lenis = new Lenis({
        autoRaf: true,
    });

    const pinHeight = root.querySelector('.pin-height');
    const container = root.querySelector('.container');
    const circles = root.querySelectorAll('.circle');

    // Scroll text fade
    gsap.to(root.querySelector('.scroll'), {
        autoAlpha: 0,
        duration: 0.2,
        scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'top top-=1',
            toggleActions: "play none reverse none"
        }
    });

    // Pin section
    ScrollTrigger.create({
        trigger: pinHeight,
        start: 'top top',
        end: 'bottom bottom',
        pin: container
    });

    // Circles rotation animation
    gsap.fromTo(circles, {
        rotation: 30
    }, {
        rotation: -30,
        ease: 'power2.inOut',
        stagger: 0.06,
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true
        }
    });
}