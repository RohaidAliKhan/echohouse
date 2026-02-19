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
    initThemeButtonHover();
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
document.querySelectorAll("[data-animation='effect015']").forEach((section ,i) => {

  section.querySelectorAll('.word')
    .forEach(word => {

      gsap.to(word.children, {
        yPercent: "+=100",
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: word,
          containerAnimation: i==0?null:parentTween,
          start: i==0?"bottom bottom":"top center",
          end: i==0?"top 55%":"bottom center",
          scrub: 0.4,
          markers: false,
        }
      });
    });
});
}

function effect005(parentTween) {
    document.querySelectorAll("[data-animation='effect005']").forEach((section) => {

        const paragraph = section.querySelector(".paragraph")
        wrapWordsInSpan(paragraph)

        const pinHeight = section.querySelector(".pin-height")
        const container = section.querySelector(".container")
        const words = section.querySelectorAll(".word")

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinHeight, // We listen to pinHeight position
                start: 'top+=20% bottom', // Start the animation when the top of the trigger hits the top of the viewport
                end: 'bottom bottom', // End the animation when the bottom of the trigger hits the bottom of the viewport
                scrub: true, // Smoothly scrub the animation based on scroll position
                // pin: container, // Let's pin our container while all the words animate
                containerAnimation: parentTween, // Link the scrollTrigger to the parent horizontal scroll tween
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

function initThemeButtonHover() {
    document.querySelectorAll(".theme-button").forEach(button => {

        const svg = button.querySelector("svg");
        if (!svg) return;

        const path = svg.querySelector("polyline, path");
        if (!path) return;

        const length = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: -length,
            opacity: 0,
            visibility: "visible"
        });

        const hoverTL = gsap.timeline({ paused: true });

        hoverTL.to(path, {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        }, 0);

        hoverTL.to(svg, {
            scale: 1.2,
            duration: 0.25,
            ease: "back.out(3)"
        }, 0);

        hoverTL.to(svg, {
            scale: 1,
            duration: 0.4,
            ease: "elastic.out(1, 0.4)"
        });

        button.addEventListener("mouseenter", () => {
            hoverTL.restart();
        });

        button.addEventListener("mouseleave", () => {
            gsap.to(path, {
                strokeDashoffset: -length,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in"
            });
        });

    });
}