/**
 * Premium Portfolio - GSAP Animations, Particles, Interactivity
 * Ultra-premium award-winning portfolio experience
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://jjhhwabwdujwmobfkidd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqaGh3YWJ3ZHVqd21vYmZraWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIwMzIsImV4cCI6MjA5Mjk1ODAzMn0.py1kpbzOqHvXxwtb8-7-7TIwAn8Sb71NjUSMI3ADD0g'
)

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  if (typeof gsap !== "undefined" && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
  }
  


  initParticles();
  initGSAPAnimations();
  initTypingEffect();
  initThemeToggle();
  initScrollProgress();
  initContactForm();
  initCursorGlow();
  initCounters();
  initMobileNav();
  initMagneticButtons();
  initLazyLoading();
  initSmoothScroll();
  initYear();
  trackVisitor();
  
});


function getVisitorInfo() {
  const ua = navigator.userAgent;

  let device = "Desktop";
  if (/mobile/i.test(ua)) device = "Mobile";
  if (/tablet/i.test(ua)) device = "Tablet";

  let browser = "Unknown";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";

  return { device, browser };
}

async function trackVisitor() {
  const { device, browser } = getVisitorInfo();

  let location = {};
  try {
    location = await getLocationData();
console.log("LOCATION DATA:", location);
  } catch (e) {
    console.warn("Location fetch failed");
  }

  const payload = {
    device,
    browser,
    ip: location?.ip || null,
    country: location?.country || null,
    state: location?.state || null,
    city: location?.city || null,
    visited_at: new Date().toISOString(),
  };

  console.log("SENDING:", payload);

  const { data, error } = await supabase
    .from("visitors")
    .insert([payload]);

  if (error) {
    console.error("Visitor tracking FAILED:", error.message);
  } else {
    console.log("Visitor tracked SUCCESS:", data);
  }
}
async function getLocationData() {
  try {
    const res = await fetch("https://ipwho.is/");

    const data = await res.json();

    if (!data.success) throw new Error("API failed");

    return {
      ip: data.ip,
      country: data.country,
      state: data.region,
      city: data.city
    };

  } catch (err) {
    console.error("Location fetch failed:", err);

    return {
      ip: null,
      country: "Unknown",
      state: "Unknown",
      city: "Unknown"
    };
  }
}
/* ============================================
   Particle Background - Canvas
   ============================================ */
function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationId;
  const particleCount = 80;
  const isDark = () =>
    document.documentElement.getAttribute("data-theme") !== "light";

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticleArray();
  }

  function initParticleArray() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = isDark() ? "255, 255, 255" : "99, 102, 241";

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach((b) => {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${color}, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      });
    });

    animationId = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

/* ============================================
   GSAP Animations - Hero & Scroll Reveals
   ============================================ */
function initGSAPAnimations() {
  if (typeof gsap === "undefined") {
    document.querySelectorAll("[data-hero]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  const heroElements = document.querySelectorAll("[data-hero]");
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.fromTo(
    heroElements,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      delay: 0.3,
    },
  );

  // Typing starts after hero CTA
  const typingEl = document.querySelector(".hero-typing");
  if (typingEl) {
    gsap.set(typingEl, { opacity: 0 });
    tl.to(typingEl, { opacity: 1, duration: 0.5 }, "-=0.3");
  }

  // Scroll-triggered section animations (exclude cards - they have stagger)
  gsap.utils.toArray("[data-animate]").forEach((el) => {
    if (el.closest(".project-card, .skill-card")) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  // Stagger project cards
  gsap.utils.toArray(".project-card").forEach((card, i) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: i * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card.closest(".projects-grid"),
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  // Stagger skill cards
  gsap.utils.toArray(".skill-card").forEach((card, i) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card.closest(".skills-grid"),
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  // Navbar reveal on scroll
  const nav = document.getElementById("navbar");
  if (nav) {
    gsap.fromTo(
      nav,
      { y: -20, opacity: 0.9 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
    );
  }
}

/* ============================================
   Magnetic Buttons
   ============================================ */
function initMagneticButtons() {
  if (typeof gsap === "undefined") return;

  document.querySelectorAll(".btn-magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      gsap.to(btn, { x, y, duration: 0.3, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    });
  });
}

/* ============================================
   Typing Effect - Hero Section
   ============================================ */
function initTypingEffect() {
  const typingElement = document.querySelector(".typing-text");
  if (!typingElement) return;

  const phrases = [
    "Building beautiful web experiences",
    "Creating scalable applications",
    "Transforming ideas into code",
    "Crafting pixel-perfect interfaces",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 50;
  const pauseTime = 2000;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 500; // Pause before next phrase
    }

    setTimeout(type, delay);
  }

  // Start after hero GSAP animation (give extra time for stagger)
  setTimeout(type, 2200);
}

/* ============================================
   Theme Toggle - Dark/Light Mode
   ============================================ */
function initThemeToggle() {
  const toggles = document.querySelectorAll(".theme-toggle");
  const html = document.documentElement;

  const setTheme = (theme) => {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    toggles.forEach((toggle) => {
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      );
      toggle.setAttribute("aria-pressed", String(theme === "light"));
    });
  };

  const toggleTheme = () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
  };

  // Load saved preference
  setTheme(localStorage.getItem("theme") || "dark");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", toggleTheme);
  });
}

/* ============================================
   Scroll Progress Indicator
   ============================================ */
function initScrollProgress() {
  const progressBar = document.getElementById("scrollProgress");
  if (!progressBar) return;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  });
}

/* initScrollAnimations removed - replaced by GSAP ScrollTrigger */

/* ============================================
   Counter Animation - About Stats
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px",
  };

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    if (typeof gsap !== "undefined") {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(obj.val);
        },
      });
    } else {
      let current = 0;
      const step = target / 60;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(interval);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 33);
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => observer.observe(counter));
}

/* ============================================
   Contact Form - Validation & Submit
   ============================================ */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const submitBtn = form.querySelector('button[type="submit"]');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showError = (input, errorEl, message) => {
    input.closest(".form-group").classList.add("invalid");
    errorEl.textContent = message;
  };

  const clearError = (input, errorEl) => {
    input.closest(".form-group").classList.remove("invalid");
    errorEl.textContent = "";
  };

  const validate = () => {
    let isValid = true;

    if (!nameInput.value.trim()) {
      showError(nameInput, nameError, "Name is required");
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    if (!emailInput.value.trim()) {
      showError(emailInput, emailError, "Email is required");
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      showError(emailInput, emailError, "Please enter a valid email");
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    if (!messageInput.value.trim()) {
      showError(messageInput, messageError, "Message is required");
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(
        messageInput,
        messageError,
        "Message must be at least 10 characters",
      );
      isValid = false;
    } else {
      clearError(messageInput, messageError);
    }

    return isValid;
  };
  form.addEventListener("submit", async function (e) {
  e.preventDefault();

  console.log("FORM SUBMIT TRIGGERED");

  if (!validate()) return;

  submitBtn.classList.add("sending");
  submitBtn.disabled = true;

  const name = nameInput.value;
  const email = emailInput.value;
  const message = messageInput.value;

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        name: name,
        email: email,
        message: message,
        device: navigator.userAgent,
      }
    ]);

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    alert("Error saving message ❌");
  } else {
    alert("Message stored successfully ✅");
    form.reset();
  }

  submitBtn.disabled = false;
  submitBtn.classList.remove("sending");
});
}


 
  

/* ============================================
   Cursor Glow Effect
   ============================================ */
function initCursorGlow() {
  const glow = document.getElementById("cursorGlow");
  if (!glow) return;

  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.classList.add("active");
  });

  document.addEventListener("mouseleave", () => {
    glow.classList.remove("active");
  });

  // Smooth follow animation
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

/* ============================================
   Mobile Navigation Toggle
   ============================================ */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const close = document.getElementById("navClose");
  const overlay = document.getElementById("navOverlay");
  const navLinks = document.querySelector(".nav-links");
  const mobileQuery = window.matchMedia("(max-width: 768px)");
  let lastFocusedElement = null;

  if (!toggle || !navLinks) return;

  const setMenuState = (isOpen) => {
    toggle.classList.toggle("active", isOpen);
    navLinks.classList.toggle("active", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

    if (isOpen) {
      lastFocusedElement = document.activeElement;
      close?.focus();
    } else if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  const closeMenu = () => setMenuState(false);
  const openMenu = () => setMenuState(true);

  toggle.addEventListener("click", () => {
    navLinks.classList.contains("active") ? closeMenu() : openMenu();
  });

  close?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);

  // Close on link click (for anchor links)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks
        .querySelectorAll("a")
        .forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("active")) {
      closeMenu();
    }
  });

  const handleViewportChange = (event) => {
    if (!event.matches) {
      closeMenu();
    }
  };

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", handleViewportChange);
  } else {
    mobileQuery.addListener(handleViewportChange);
  }
}

/* ============================================
   Navbar Scroll Effect
   ============================================ */
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar?.classList.add("scrolled");
  } else {
    navbar?.classList.remove("scrolled");
  }
});

/* ============================================
   Lazy Loading Images
   ============================================ */
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("loading" in HTMLImageElement.prototype) {
    // Native lazy loading supported
    images.forEach((img) => {
      img.src = img.src || img.dataset.src || "";
    });
  } else {
    // Fallback: Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src || img.dataset.src || "";
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

/* ============================================
   Smooth Scroll for Anchor Links
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

/* ============================================
   Footer Year
   ============================================ */
function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
window.addEventListener("scroll", () => {
  const indicator = document.querySelector(".scroll-indicator");
  indicator.style.opacity = window.scrollY > 50 ? "0" : "0.8";
});
document.querySelectorAll(".skill-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--y", `${e.clientY - rect.top}px`);
  });
});
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log("CTA clicked:", btn.textContent);
  });
});
let clickCount = 0;

document.getElementById('logo').addEventListener('click', () => {
  clickCount++;

  if (clickCount === 3) {
    window.location.href = '/admin/index.html';
  }

  setTimeout(() => {
    clickCount = 0;
  }, 800);
});


async function generateReply(message) {
  const res = await fetch("/api/generate-reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  console.log("AI RESPONSE:", data);

  return data.reply;
}
window.generateReply = generateReply;