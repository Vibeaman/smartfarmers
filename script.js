document.addEventListener('DOMContentLoaded', function() {
  
  const welcomeModal = document.getElementById('welcomeModal');
  const closeWelcomeBtn = document.getElementById('closeWelcome');

  closeWelcomeBtn.addEventListener('click', function() {
    welcomeModal.classList.add('hidden');
    setTimeout(() => {
      welcomeModal.style.display = 'none';
    }, 500);
  });

  const sections = document.querySelectorAll('.animate-section');
  const scrollTopBtn = document.getElementById('scrollTop');
  const navbar = document.querySelector('.navbar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  sections.forEach(section => observer.observe(section));

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
      navbar.classList.add('scrolled');
    } else {
      scrollTopBtn.classList.remove('visible');
      navbar.classList.remove('scrolled');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  const counters = document.querySelectorAll('.counter');
  let hasAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'));
          const increment = target / 100;
          let current = 0;

          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target + (target === 24 ? '/7' : '+');
            }
          };

          updateCounter();
        });
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const initVanillaTilt = () => {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
      element.addEventListener('mousemove', handleTilt);
      element.addEventListener('mouseleave', resetTilt);
    });

    function handleTilt(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }

    function resetTilt() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
  };

  initVanillaTilt();

  const createParticles = () => {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = Math.random() * 3 + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = 'rgba(255, 255, 255, 0.5)';
      particle.style.borderRadius = '50%';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animation = `particleFloat ${Math.random() * 10 + 5}s linear infinite`;
      particle.style.animationDelay = Math.random() * 5 + 's';
      particlesContainer.appendChild(particle);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleFloat {
        0%, 100% { 
          transform: translate(0, 0) scale(1);
          opacity: 0;
        }
        10% { opacity: 1; }
        90% { opacity: 1; }
        50% { 
          transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
        }
      }
    `;
    document.head.appendChild(style);
  };

  createParticles();

  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    });
  });

  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  function animateParallax() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {
      const speed = (index + 1) * 20;
      const x = mouseX * speed;
      const y = mouseY * speed;
      icon.style.transform = `translate(${x}px, ${y}px)`;
    });
    requestAnimationFrame(animateParallax);
  }

  animateParallax();

  const observer3D = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInScale 0.6s ease-out forwards';
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.product-card, .feature-card, .testimonial-card').forEach(card => {
    observer3D.observe(card);
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  console.log('✨ Smart Farmers Ltd - 3D Enhanced Website Loaded Successfully! ✨');
});
