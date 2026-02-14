document.addEventListener('DOMContentLoaded', () => {
    // playVideoWithDelayAndLoop('heroVideo', 800);
    // animateWords('.heading-animation-section');
    // initMWGEffect005();
    initMWGEffect001();
});

// const lenis = new Lenis();

// lenis.on('scroll', ScrollTrigger.update);

// function raf(time) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }

// requestAnimationFrame(raf);

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

function initMWGEffect005() {

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