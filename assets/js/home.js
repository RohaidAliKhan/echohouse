gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    smoothScroll();
    const container = document.querySelector(".horizontal-scroll");
    if (!container) return;
    let scrollTween = gsap.to(container, {
        x: -(container.scrollWidth - container.clientWidth),
        ease: "none",
        scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${container.scrollWidth}`,
        pin: true,
        scrub: 0.5,
        }
    });
    hoverExpand();
    initHoverCardsAnimation();
    effect015(scrollTween);
    effect005(scrollTween);
});

function smoothScroll() {
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

function effect015(parentTween) {

  document.querySelectorAll('[data-animation="effect015"] .word')
    .forEach(word => {

      gsap.to(word.children, {
        yPercent: "+=100",
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: word,
          containerAnimation: parentTween,
          start: "left 80%",
          end: "left 40%",
          scrub: 0.4,
          markers: false,
        }
      });

    });

}

function effect005(parentTween) {
    document.querySelectorAll("[data-animation='effect005']").forEach((section) => {

        const paragraph = section.querySelector(".paragraph");
        wrapWordsInSpan(paragraph); // wrap each word in <span>

        const container = section.querySelector(".container");
        const words = section.querySelectorAll(".word");

        const animItems = [];
        if (section.querySelector("h2")) animItems.push(section.querySelector("h2"));
        animItems.push(...words);
        if (section.querySelector(".button-wrapper")) animItems.push(section.querySelector(".button-wrapper"));

        // Set initial x outside viewport
        gsap.set(animItems, { x: "100vw" });

        // Total duration in px for all words
        const totalWidth = container.scrollWidth;

        animItems.forEach((item, i) => {
            gsap.to(item, {
                x: 0,
                ease: "power4.inOut",
                scrollTrigger: {
                    trigger: section,
                    containerAnimation: parentTween,
                    start: () => `left+=${i * 50} left`, // each word starts slightly after previous
                    end: () => `left+=${i * 50 + 300} left`, // duration of animation for this word
                    scrub: true,
                    markers: true,
                }
            });
        });
    });
}

function hoverExpand() {
    const headings = document.querySelectorAll("[data-animation='hover-expand'] h2");

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

function initHoverCardsAnimation() {

    const sections = document.querySelectorAll("[data-hover-cards]");
    if (!sections.length) return;

    sections.forEach(section => {

        const container = section.querySelector(".cards");
        if (!container) return;

        const cards = container.querySelectorAll(".card");
        const cardContent = container.querySelectorAll(".card .content");
        const cardsLength = cards.length;

        let currentPortion = 0;

        // Random initial position
        cards.forEach(card => {
            gsap.set(card, {
                xPercent: (Math.random() - 0.5) * 10,
                yPercent: (Math.random() - 0.5) * 10,
                rotation: (Math.random() - 0.5) * 20,
            });
        });

        container.addEventListener("mousemove", e => {

            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;

            // Horizontal scroll friendly
            const containerWidth = container.scrollWidth;

            const percentage = mouseX / rect.width; // visible width use karo
            const activePortion = Math.ceil(percentage * cardsLength);

            if (
                currentPortion !== activePortion &&
                activePortion > 0 &&
                activePortion <= cardsLength
            ) {

                if (currentPortion !== 0) resetPortion(currentPortion - 1);

                currentPortion = activePortion;
                newPortion(currentPortion - 1);
            }
        });

        container.addEventListener("mouseleave", () => {

            if (currentPortion !== 0) {
                resetPortion(currentPortion - 1);
            }

            currentPortion = 0;

            gsap.to(cardContent, {
                xPercent: 0,
                ease: "elastic.out(1, 0.75)",
                duration: 0.8,
            });
        });

        function resetPortion(index) {
            if (!cards[index]) return;

            gsap.to(cards[index], {
                xPercent: (Math.random() - 0.5) * 10,
                yPercent: (Math.random() - 0.5) * 10,
                rotation: (Math.random() - 0.5) * 20,
                scale: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.75)",
            });
        }

        function newPortion(i) {
            if (!cards[i]) return;

            gsap.to(cards[i], {
                xPercent: 0,
                yPercent: 0,
                rotation: 0,
                scale: 1.1,
                duration: 0.8,
                ease: "elastic.out(1, 0.75)",
            });

            cardContent.forEach((content, index) => {

                if (index !== i) {
                    gsap.to(content, {
                        xPercent: 80 / (index - i),
                        ease: "elastic.out(1, 0.75)",
                        duration: 0.8,
                    });
                } else {
                    gsap.to(content, {
                        xPercent: 0,
                        ease: "elastic.out(1, 0.75)",
                        duration: 0.8,
                    });
                }

            });
        }

    });

}