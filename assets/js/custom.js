gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  smoothScroll();
  hoverExpand();
  effect001();
  effect015();
  effect005();
});

function smoothScroll() {
  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

function effect015() {
  document.querySelectorAll("[data-animation='effect015']").forEach((section) => {
    section.querySelectorAll(".word").forEach((word) => {
      gsap.to(word.children, {
        yPercent: "+=100", // Increase the y position by 100%
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: word, // Listens to the position of word
          start: "bottom bottom",
          end: "top 55%",
          markers: false,
          scrub: 0.4, // Smooth scrubbing, takes 0.4 seconds to complete
        },
      });
    });
  });
}

function effect005() {
  document.querySelectorAll("[data-animation='effect005']").forEach((section) => {
    const paragraph = section.querySelector(".paragraph");
    wrapWordsInSpan(paragraph);

    const pinHeight = section.querySelector(".pin-height");
    const container = section.querySelector(".container");
    const words = section.querySelectorAll(".word");

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinHeight, // We listen to pinHeight position
        start: "top top", // Start the animation when the top of the trigger hits the top of the viewport
        end: "bottom bottom", // End the animation when the bottom of the trigger hits the bottom of the viewport
        scrub: true, // Smoothly scrub the animation based on scroll position
        pin: container, // Let's pin our container while all the words animate
        markers: false,
      },
    });

    gsap.set([section.querySelector("h2"), section.querySelector(".button-wrapper")], {
      x: "100vw",
    });

    tl.to(
      [section.querySelector("h2"), ...words, section.querySelector(".button-wrapper")],
      {
        x: 0, // Animate the 'x' property to 0
        stagger: 0.02, // Stagger the animation of each element by 0.02 seconds
        ease: "power4.inOut", // Use a power4 easing function for smooth start and end
      },
      "-=0.05",
    );
  });
}

function effect001() {
  document.querySelectorAll("[data-animation='effect001']").forEach((section) => {
    const container = section.querySelector(".container");
    const cardsContainer = container.querySelector(".cards");
    const cards = cardsContainer.querySelectorAll(".card");
    const distance = cardsContainer.clientWidth - window.innerWidth;

    const scrollTween = gsap.to(cardsContainer, {
      x: -distance,
      ease: "none", // linear progression
      // let's pin our container while our cardsContainer is animating
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: true, // progress with the scroll
        start: "top top",
        end: "+=" + distance,
      },
    });

    cards.forEach((card) => {
      const values = {
        // get a value between 30 and 50 or -30 and -50
        x: (Math.random() * 20 + 30) * (Math.random() < 0.5 ? 1 : -1),
        // get a value between 10 and 16 or -16 and -10
        y: (Math.random() * 6 + 10) * (Math.random() < 0.5 ? 1 : -1),
        // get a value between 10 and 20 or -10 and -20
        rotation: (Math.random() * 10 + 10) * (Math.random() < 0.5 ? 1 : -1),
      };

      gsap.fromTo(
        card,
        {
          // let's start from this 3 values
          rotation: values.rotation,
          xPercent: values.x,
          yPercent: values.y,
        },
        {
          // and finish to its 3 opposite values
          rotation: -values.rotation,
          xPercent: -values.x,
          yPercent: -values.y,
          ease: "none", // linear progression
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween, // our tween will listen to our scrollTween container position
            start: "left 120%",
            end: "right -20%",
            scrub: true, // the animation progress with the scroll
          },
        },
      );
    });
  });
}

function hoverExpand() {
  const headings = document.querySelectorAll("[data-animation='hover-expand']");

  headings.forEach((heading) => {
    const split = SplitText.create(heading, {
      type: "chars", // only split into words
      charsClass: "char", // adds class="char" to each char
      tag: "span", // use <span> instead of default <div>
    });
    gsap.set(split.chars, {
      display: "inline-block",
    });

    const chars = split.chars;
    const first = chars[0];
    const last = chars[chars.length - 1];
    const middle = chars.slice(1, -1);

    gsap.set(middle, {
      autoAlpha: 0,
      width: 0,
    });

    const tl = gsap.timeline({ paused: true });

    tl.to(middle, {
      autoAlpha: 1,
      width: "auto",
      duration: 0.3,
      stagger: 0.03,
      ease: "power2.out",
    }).to(
      last,
      {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      "-=0.3",
    );

    heading.addEventListener("mouseenter", () => tl.play());
    heading.addEventListener("mouseleave", () => tl.reverse());
  });
}

// Helper functions
function wrapWordsInSpan(element) {
  return SplitText.create(element, {
    type: "words", // only split into words
    wordsClass: "word", // adds class="word" to each word
    tag: "span", // use <span> instead of default <div>
  });
}
