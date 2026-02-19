gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    smoothScroll();
    hoverExpand();
    effect001();
    effect015();
    effect005();
    effect020();
    effect004();
    effect026();
    effect038();
    effect007();
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
        const isInnerPage = section.classList.contains("innerpages-banner");
        const slide = section.querySelector('.slide');

        if (isInnerPage && slide) {
            const content = slide.querySelector('.content'); // Define content
            const words = section.querySelectorAll(".word");
            const wordChildren = [];
            words.forEach(word => {
                Array.from(word.children).forEach(child => wordChildren.push(child));
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section, // Triggering on the section makes sense for pinning
                    pin: section,
                    start: "top top", // Pin when section hits top of viewport
                    end: `+=${section.offsetHeight * 4}`, // Increase scroll distance
                    scrub: 0.4,
                    markers: false,
                }
            });

            // 1. Animate words
            tl.to(wordChildren, { // Use wordChildren array here
                yPercent: "+=100", // Increase the y position by 100%
            })
                // 2. Animate slide
                .from(slide, {
                    yPercent: 100,
                    scale: 0.5,
                    borderRadius: "200px",
                    duration: 1 // Relative duration within timeline
                })
                // 3. Transform content
                .to(content, {
                    rotationZ: (Math.random() - 0.5) * 10,
                    scale: 0.7,
                    rotationX: 40,
                    duration: 1
                })
                // 4. Fade out wordChildren
                .to(wordChildren, {
                    autoAlpha: 0
                }, "<")
                // 5. Fade out content
                .to(content, {
                    autoAlpha: 0,
                    duration: 0.5
                })
        }
        else {
            section.querySelectorAll(".word").forEach((word) => {
                gsap.to(word.children, {
                    yPercent: "+=100", // Increase the y position by 100%
                    ease: "expo.inOut",
                    scrollTrigger: {
                        trigger: word, // Listens to the position of word
                        start: isInnerPage ? "bottom center" : "bottom bottom",
                        end: isInnerPage ? `+=${word.offsetHeight * 2}` : "top 55%",
                        markers: false,
                        scrub: 0.4, // Smooth scrubbing, takes 0.4 seconds to complete
                    },
                });
            });
        }
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

        if (section.querySelector("h2") && section.querySelector(".button-wrapper")) {
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

        } else {

            tl.to(
                [...words],
                {
                    x: 0, // Animate the 'x' property to 0
                    stagger: 0.02, // Stagger the animation of each element by 0.02 seconds
                    ease: "power4.inOut", // Use a power4 easing function for smooth start and end
                },
                "-=0.05",
            );
        }
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

function effect020() {
    document.querySelectorAll("[data-animation='effect020']").forEach(section => {
        const root = section; // Use section as root
        const images = []

        // Check if .medias exists, or look for images directly in root
        const mediaContainer = root.querySelector('.medias');
        if (mediaContainer) {
            mediaContainer.querySelectorAll('img').forEach(image => {
                images.push(image.getAttribute('src'));
            });
            // Optionally hide original images if desired, but user didn't ask.
            // mediaContainer.style.display = 'none'; 
        } else {
            // Fallback if images are directly in root
            root.querySelectorAll('img').forEach(image => {
                images.push(image.getAttribute('src'));
            });
        }

        if (images.length === 0) return; // Exit if no images found

        let incr = 0,
            oldIncrX = 0,
            oldIncrY = 0,
            resetDist = window.innerWidth / 8,
            indexImg = 0

        // Initialize mouse tracking on first move
        root.addEventListener("mousemove", e => {
            oldIncrX = e.clientX
            oldIncrY = e.clientY
        }, { once: true })

        root.addEventListener("mousemove", e => {
            const valX = e.clientX
            const valY = e.clientY

            // Add the distance traveled on x + y
            incr += Math.abs(valX - oldIncrX) + Math.abs(valY - oldIncrY)

            if (incr > resetDist) {
                incr = 0 // Reset the variable incr
                createMedia(valX, valY - root.getBoundingClientRect().top, valX - oldIncrX, valY - oldIncrY)
            }

            // Reset after calculation to add the new delta on the next call
            oldIncrX = valX
            oldIncrY = valY
        })

        function createMedia(x, y, deltaX, deltaY) {
            // We create an image and set its url with the current item of the images array
            const image = document.createElement("img")
            image.setAttribute('src', images[indexImg])
            image.style.position = 'absolute'; // Ensure absolute positioning
            image.style.pointerEvents = 'none'; // Prevent interference
            image.style.top = '0';
            image.style.left = '0';

            // We add this image to the DOM
            root.appendChild(image)

            const tl = gsap.timeline({
                onComplete: () => {
                    // when our timeline is finished, we remove our image from the DOM
                    if (image.parentNode) root.removeChild(image);
                    tl && tl.kill()
                }
            })

            tl.fromTo(image, {
                // Add some randomness
                xPercent: -50 + (Math.random() - 0.5) * 80,
                yPercent: -50 + (Math.random() - 0.5) * 10,
                scaleX: 1.3,
                scaleY: 1.3
            }, {
                scaleX: 1,
                scaleY: 1,
                ease: 'elastic.out(2, 0.6)', // Easing property responsible of the rebound effect
                duration: 0.6
            })

            tl.fromTo(image, {
                // The first and second parameters are x and y (cursor position)
                // We set the image at the current cursor position
                x,
                y,
                rotation: (Math.random() - 0.5) * 20,
            }, {
                // We add deltaX and deltaY (the third and fourth parameters of the function)
                x: '+=' + deltaX * 4,
                y: '+=' + deltaY * 4,
                rotation: (Math.random() - 0.5) * 20,
                ease: 'power4.out',
                duration: 1.5
            }, '<') // Means that the animation starts at the start of the previous tween

            tl.to(image, {
                duration: 0.3,
                scale: 0.5, // Reduce the image later
                delay: 0.1,
                ease: 'back.in(1.5)'
            })

            // Loop back to the first item when we're out of range in our images array
            indexImg = (indexImg + 1) % images.length
        }
    });
}

function effect004() {
    document.querySelectorAll("[data-animation='effect004']").forEach(section => {
        const pinHeight = section.querySelector('.pin-height')
        const container = section.querySelector('.container')
        const paragraphs = section.querySelectorAll(".paragraph")

        if (paragraphs.length === 0) return; // Safety check

        paragraphs.forEach(paragraph => wrapWordsInSpan(paragraph));

        const words = section.querySelectorAll(".word")

        ScrollTrigger.create({
            trigger: pinHeight, // We listen to .pin-height position
            start: 'top top',
            end: `+=${pinHeight.offsetHeight}`,
            pin: container,// Progresses with the scroll
            markers: true
        })

        // We will have an array of lines that contain an array of words
        const lines = [[]];
        let lineIndex = 0;

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            // Distance of the top outer border of the word to to the top edge of its parent
            const offsetTop = word.offsetTop;

            // If distance is different from previous word we start a new line
            if (i > 0 && offsetTop !== words[i - 1].offsetTop) {
                // We start a new line
                lines.push([]);
                lineIndex++;
            }

            lines[lineIndex].push(word);
        }

        lines.forEach(lineWords => {
            gsap.to(lineWords, {
                x: 0, // Animate the 'x' property to 0
                stagger: 0.2, // Stagger the animation of each element by 0.2
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: section, // Element that triggers the animation
                    start: 'top top', // Start the animation when the top of the trigger hits the top of the viewport
                    end: 'bottom bottom', // End the animation when the bottom of the trigger hits the bottom of the viewport
                    scrub: true,// Scrub the animation based on scroll position
                }
            })
        });
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

function wrapTestimonialWordsInSpan(element) {
    const text = element.textContent;
    element.innerHTML = text
        .split(' ')
        .map(word => `<span class="word">${word}</span>`)
        .join(' ');
}

function effect026() {
    // Select all sections with data-animation="effect026"
    document.querySelectorAll("[data-animation='effect026']").forEach(section => {
        const container = section.querySelector('.row');
        if (!container) return;

        // Get container half dimensions
        const halfX = container.clientWidth / 2;
        const halfY = container.clientHeight / 2;

        // Wrap values for smooth looping
        const wrapX = gsap.utils.wrap(-halfX, 0);
        const wrapY = gsap.utils.wrap(-halfY, 0);

        // quickTo for smooth x/y updates
        const xTo = gsap.quickTo(container, 'x', {
            duration: 1.5,
            ease: "power4",
            modifiers: {
                x: gsap.utils.unitize(wrapX)
            }
        });

        const yTo = gsap.quickTo(container, 'y', {
            duration: 1.5,
            ease: "power4",
            modifiers: {
                y: gsap.utils.unitize(wrapY)
            }
        });

        // Incremental positions
        let incrX = 0, incrY = 0;

        // Observer to handle wheel, touch, and pointer drag
        Observer.create({
            target: window,
            type: "wheel,touch,pointer",
            onChangeX: (self) => {
                if(self.event.type === "wheel") {
                    incrX -= self.deltaX;
                } else {
                    incrX += self.deltaX * 2;
                }
                xTo(incrX);
            },
            onChangeY: (self) => {
                if(self.event.type === "wheel") {
                    incrY -= self.deltaY;
                } else {
                    incrY += self.deltaY * 2;
                }
                yTo(incrY);
            }
        });

        // Optional: Randomize positions of child media elements
        const contentEls = container.querySelectorAll('.content');
        contentEls.forEach(content => {
            const medias = content.querySelectorAll('.media');
            medias.forEach(el => {
                const randomX = (- 0.5) * 30;
                const randomY = (- 0.5) * 30;
                gsap.set(el, { xPercent: randomX, yPercent: randomY });
            });
        });

    });
}

function effect038() {
    // Only on large devices
    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {

        // Select all sections with data-animation="effect038"
        document.querySelectorAll("[data-animation='effect038']").forEach(section => {
            const container = section.querySelector('.container');
            if (!container) return;

            const projects = container.querySelectorAll('.project');
            if (!projects.length) return;

            // Set first project active
            projects[0].classList.add('on');
            let currentProject = projects[0];
            const numProjects = projects.length;

            // Calculate horizontal scroll distance
            const dist = container.clientWidth - document.body.clientWidth;

            // Create horizontal scroll animation
            gsap.to(container, {
                x: -dist,
                ease: 'none',
                scrollTrigger: {
                    trigger: section.querySelector('.pin-height') || section,
                    pin: container,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true,
                    onUpdate: self => {
                        // Determine the closest project based on scroll progress
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
    });
}

function effect007() {
    // Optional: Lenis smooth scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({ autoRaf: true });
    }

    // Select all sections with data-animation="effect007"
    document.querySelectorAll("[data-animation='effect007']").forEach(section => {
        const container = section.querySelector('.container');
        const pinHeight = section.querySelector('.pin-height');
        const circles = section.querySelectorAll('.circle');

        if (!container || !pinHeight || !circles.length) return;

        // Hide .scroll element on scroll
        const scrollEl = section.querySelector('.scroll');
        if (scrollEl) {
            gsap.to(scrollEl, {
                autoAlpha: 0,
                duration: 0.2,
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'top top-=1',
                    toggleActions: "play none reverse none"
                }
            });
        }

        // Pin container during scroll
        ScrollTrigger.create({
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container
        });

        // Rotate circles on scroll
        gsap.fromTo(circles, 
            { rotation: 30 },       // start rotation
            { 
                rotation: -30,      // end rotation
                ease: 'power2.inOut',
                stagger: 0.06,
                scrollTrigger: {
                    trigger: pinHeight,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true
                }
            }
        );
    });
}