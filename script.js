document.getElementById("play-button").addEventListener("click", function () {
  const audio = document.getElementById("background-audio");

  audio.play().catch((error) => {
    console.error("Audio playback failed:", error);
  });

  // GSAP Animation for button
  const button = this;

  // Animate scale and color change on click
  gsap.to(button, {
    scale: 1.2,
    backgroundColor: "#ff0", // Change color to yellow
    duration: 0.2,
    ease: "power1.out",
    onComplete: () => {
      // Revert scale and color back
      gsap.to(button, {
        scale: 1,
        backgroundColor: "#fff", // Revert to original color
        duration: 0.2,
        ease: "power1.in",
      });
    },
  });

  // Rotate the button
  gsap.to(button, {
    rotation: 360,
    duration: 0.5,
    ease: "back.out(1.7)",
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  let isAnimating = false;

  const scrollToSection = (index) => {
    if (index < 0 || index >= sections.length || isAnimating) return;

    isAnimating = true;

    const tl = gsap.timeline();

    // Animate content entering
    tl.from(".content", {
      y: -500,
      x: -500,
      opacity: 0,
      scale: 0.1,
      ease: "sine.inOut",
      duration: 0.5,
    })
      .from(
        ".couple-name",
        {
          y: -500,
          x: 500,
          opacity: 0,
          scale: 5,
          ease: "power2.inOut",
          duration: 0.5,
        },
        "<"
      )
      .from(
        sections[index],
        {
          x: 500,
          opacity: 0,
          ease: "power4.inOut",
          scale: 10,
          duration: 0.5,
        },
        "<"
      );

    gsap.to(window, {
      scrollTo: sections[index],
      duration: 0.5,
      ease: "sine.inOut",
      onComplete: () => {
        isAnimating = false;
      },
    });
  };

  const getCurrentSectionIndex = () => {
    return Array.from(sections).findIndex((section) => {
      return (
        section.getBoundingClientRect().top >= 0 &&
        section.getBoundingClientRect().top < window.innerHeight
      );
    });
  };

  const handleScroll = (event) => {
    event.preventDefault();
    const currentSection = getCurrentSectionIndex();
    const direction = event.deltaY > 0 ? 1 : -1;
    scrollToSection(currentSection + direction);
  };

  let lastScrollTime = 0;
  const throttleScroll = (event) => {
    const now = Date.now();
    if (now - lastScrollTime >= 100) {
      handleScroll(event);
      lastScrollTime = now;
    }
  };

  document.addEventListener("wheel", throttleScroll, { passive: false });

  let touchStartY = 0;
  const handleTouchMove = (event) => {
    const touchEndY = event.touches[0].clientY;
    const deltaY = touchStartY - touchEndY;

    if (Math.abs(deltaY) > 50 && !isAnimating) {
      event.preventDefault();
      const currentSection = getCurrentSectionIndex();
      const direction = deltaY > 0 ? 1 : -1;
      scrollToSection(currentSection + direction);
    }
  };

  document.addEventListener(
    "touchstart",
    (event) => {
      touchStartY = event.touches[0].clientY;
    },
    { passive: false }
  );

  document.addEventListener("touchmove", handleTouchMove, { passive: false });

  // Countdown Timer
  const targetDate = new Date("November 14, 2024 07:30:00").getTime();

  const updateCountdownDisplay = () => {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(countdownFunction);
      gsap.to("#timer", {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          document.getElementById("timer").innerHTML = "Countdown Finished!";
          gsap.to("#timer", { opacity: 1, duration: 1 });
        },
      });
      return;
    }

    const timeComponents = {
      days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(
        2,
        "0"
      ),
      hours: String(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      ).padStart(2, "0"),
      minutes: String(
        Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      ).padStart(2, "0"),
      seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(
        2,
        "0"
      ),
    };

    Object.entries(timeComponents).forEach(([key, value]) => {
      gsap.to(`#${key}`, {
        textContent: value,
        duration: 1,
        snap: { textContent: 1 },
        ease: "power2.out",
        onStart: () => {
          gsap.fromTo(
            `#${key}`,
            { scale: 2.5, color: "#ffffff" },
            { scale: 1, color: "#FF6500", duration: 0.5 }
          );
        },
        onComplete: () => {
          gsap.to(`#${key}`, {
            scale: 1,
            duration: 0.5,
            ease: "bounce.out",
          });
        },
      });
    });
  };

  const countdownFunction = setInterval(updateCountdownDisplay, 1000);
});
