/* PulseFit - Premium Interactions and Animation Orchestrator */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Page-wide Premium Features
  initCounterTickers();
  initPricingToggle();
  initThemeSynchronizer();
  initMagneticCTAs();
  initParallaxEffects();
  initRippleButtons();
  initClassesMarquee();
});

// 1. Counter Animation Ticker
function initCounterTickers() {
  const counters = document.querySelectorAll('.counter-ticker');
  
  const animate = (counter) => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const decimals = parseInt(counter.getAttribute('data-decimals') || '0');
    
    let current = 0;
    const duration = 2000; // 2 seconds
    const stepTime = 16; // ~60fps
    const steps = duration / stepTime;
    const increment = target / steps;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = current.toFixed(decimals) + suffix;
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animate(entry.target);
        entry.target.classList.add('counted');
      }
    });
  }, { threshold: 0.1 });

  counters.forEach(c => observer.observe(c));
}

// 2. Monthly / Yearly Membership Price Calculator
function initPricingToggle() {
  const toggle = document.getElementById('pricingToggleInput');
  if (!toggle) return;

  const basicPrice = document.getElementById('basicPrice');
  const proPrice = document.getElementById('proPrice');
  const elitePrice = document.getElementById('elitePrice');
  
  const periodTexts = document.querySelectorAll('.plan-period');

  const updatePrices = () => {
    const isYearly = toggle.checked;
    if (isYearly) {
      if (basicPrice) animateValue(basicPrice, 49, 39);
      if (proPrice) animateValue(proPrice, 79, 59);
      if (elitePrice) animateValue(elitePrice, 149, 119);
      periodTexts.forEach(p => p.textContent = '/mo, billed yearly');
    } else {
      if (basicPrice) animateValue(basicPrice, 39, 49);
      if (proPrice) animateValue(proPrice, 59, 79);
      if (elitePrice) animateValue(elitePrice, 119, 149);
      periodTexts.forEach(p => p.textContent = '/month');
    }
  };

  toggle.addEventListener('change', updatePrices);
}

function animateValue(element, start, end) {
  let current = start;
  const range = end - start;
  const duration = 300;
  const steps = 10;
  const increment = range / steps;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current += increment;
    element.textContent = '$' + Math.round(current);
    if (step >= steps) {
      element.textContent = '$' + end;
      clearInterval(timer);
    }
  }, duration / steps);
}

// 3. Theme Toggle & Sync
function initThemeSynchronizer() {
  const themeToggles = document.querySelectorAll('#dashboardThemeToggle, #themeToggle, #themeToggleMobile');
  
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update all toggler icons
    themeToggles.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-sun fs-5' : 'bi bi-moon-stars fs-5';
      }
    });
  };

  themeToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  // Sync state initially
  const initialTheme = localStorage.getItem('theme') || 'light';
  applyTheme(initialTheme);
}

// 4. Magnetic CTA Button Offset Effects
function initMagneticCTAs() {
  const magnetics = document.querySelectorAll('.btn-magnetic');
  
  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// 5. Parallax Image / Blob Movement Tracker
function initParallaxEffects() {
  const sections = document.querySelectorAll('.home-hero, .workouts-hero, .about-hero');
  
  sections.forEach(sec => {
    sec.addEventListener('mousemove', (e) => {
      const orbs = sec.querySelectorAll('.gradient-orb');
      const speed = 20;
      
      const x = (window.innerWidth - e.pageX * 2) / speed;
      const y = (window.innerHeight - e.pageY * 2) / speed;
      
      orbs.forEach(orb => {
        orb.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  });
}

// 6. Ripple Button Action Triggers
function initRippleButtons() {
  const buttons = document.querySelectorAll('.btn-ripple');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple-span';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      // Inject inline styles for immediate ripple rendering
      ripple.style.position = 'absolute';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.25)';
      ripple.style.animation = 'ripple-effect 0.6s ease-out';
      ripple.style.pointerEvents = 'none';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Inject keyframes to document head
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-effect {
      to {
        width: 300px;
        height: 300px;
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// 7. Classes page horizontal loop marquee duplicator
function initClassesMarquee() {
  const marquee = document.querySelector('.classes-marquee-content');
  if (!marquee) return;

  // Duplicate items to ensure continuous flow
  const clone = marquee.cloneNode(true);
  marquee.parentNode.appendChild(clone);
}
