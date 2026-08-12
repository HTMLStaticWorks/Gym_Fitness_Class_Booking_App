// CRO Optimize - Premium JavaScript

// ===== RTL Toggle =====
class RTLManager {
    constructor() {
        this.html = document.documentElement;
        this.rtlToggleDesktop = document.getElementById('rtlToggleBtn') || document.getElementById('rtlToggle');
        this.rtlToggleMobile = document.getElementById('rtlToggleMobile');
        this.init();
    }

    init() {
        const savedDirection = localStorage.getItem('dir') || 'ltr';
        this.setDirection(savedDirection);

        if (this.rtlToggleDesktop) {
            this.rtlToggleDesktop.addEventListener('click', () => this.toggleDirection());
        }

        if (this.rtlToggleMobile) {
            this.rtlToggleMobile.addEventListener('click', () => this.toggleDirection());
        }
    }

    setDirection(direction) {
        this.html.setAttribute('dir', direction);
        localStorage.setItem('dir', direction);
    }

    toggleDirection() {
        const currentDirection = this.html.getAttribute('dir') || 'ltr';
        const newDirection = currentDirection === 'rtl' ? 'ltr' : 'rtl';
        this.setDirection(newDirection);
    }
}

// ===== Mobile Menu =====
class MobileMenu {
    constructor() {
        this.hamburgerMenu = document.getElementById('hamburgerMenu');
        this.mobileSideMenu = document.getElementById('mobileSideMenu');
        this.closeMenuBtn = document.getElementById('closeMenu');
        this.sideMenuLinks = document.querySelectorAll('.side-menu-link');
        this.body = document.body;

        this.init();
    }

    init() {
        // Hamburger menu toggle
        if (this.hamburgerMenu) {
            this.hamburgerMenu.addEventListener('click', () => this.openMenu());
        }

        // Close menu
        if (this.closeMenuBtn) {
            this.closeMenuBtn.addEventListener('click', () => this.closeMenu());
        }

        // Close on link click
        this.sideMenuLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen()) {
                this.closeMenu();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen() &&
                !this.mobileSideMenu.contains(e.target) &&
                !this.hamburgerMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    openMenu() {
        this.mobileSideMenu.classList.add('active');
        this.hamburgerMenu.classList.add('active');
        this.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.mobileSideMenu.classList.remove('active');
        this.hamburgerMenu.classList.remove('active');
        this.body.style.overflow = '';
    }

    isMenuOpen() {
        return this.mobileSideMenu.classList.contains('active');
    }
}

// ===== Smooth Scrolling =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.scrollToElement(target);
                }
            });
        });
    }

    scrollToElement(element) {
        const headerHeight = document.querySelector('.navbar-header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// ===== Animation Observer =====
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        // Elements to animate
        const animatedElements = document.querySelectorAll('.service-card, .case-card, .expertise-card, .team-card');

        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Set initial state and observe
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
}

// ===== Counter Animation =====
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-item h3, .metric-value');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.5
        });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = element.innerText;
        const isPercentage = target.includes('%');
        const isDollar = target.includes('$');
        const isMultiplier = target.includes('x');
        const isPlus = target.includes('+');

        let numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
        const duration = 2000;
        const step = numericValue / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < numericValue) {
                let displayValue = Math.floor(current);

                if (isPercentage) {
                    element.innerText = `${isPlus ? '+' : ''}${displayValue}%`;
                } else if (isDollar) {
                    element.innerText = `$${displayValue}M`;
                } else if (isMultiplier) {
                    element.innerText = `${displayValue.toFixed(1)}x`;
                } else {
                    element.innerText = `${displayValue}%`;
                }

                requestAnimationFrame(updateCounter);
            } else {
                element.innerText = target;
            }
        };

        updateCounter();
    }
}

// ===== Form Validation =====
class FormValidation {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    handleSubmit(e) {
        const form = e.target;
        const isValid = this.validateForm(form);

        if (!isValid) {
            e.preventDefault();
            this.showFormError(form);
        } else {
            this.hideFormError(form);
        }
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (fieldType === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        // Password validation
        if (fieldType === 'password' && value && value.length < 8) {
            isValid = false;
            errorMessage = 'Password must be at least 8 characters';
        }

        // Phone validation
        if (fieldType === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }

        this.showFieldError(field, errorMessage);

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

        if (message) {
            field.classList.add('is-invalid');

            const errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            errorElement.textContent = message;

            field.parentNode.appendChild(errorElement);
        }
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showFormError(form) {
        const existingAlert = form.querySelector('.alert-danger');
        if (!existingAlert) {
            const alert = document.createElement('div');
            alert.className = 'alert alert-danger mt-3';
            alert.textContent = 'Please correct the errors below and try again.';
            form.appendChild(alert);
        }
    }

    hideFormError(form) {
        const alert = form.querySelector('.alert-danger');
        if (alert) {
            alert.remove();
        }
    }
}

// ===== Password Visibility Toggle =====
class PasswordToggle {
    constructor() {
        this.init();
    }

    init() {
        const passwordInputs = document.querySelectorAll('input[type="password"]');

        passwordInputs.forEach(input => {
            // Skip inputs that already have a hardcoded toggle button
            if (input.parentNode.querySelector('button')) {
                return;
            }

            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            wrapper.style.width = '100%';

            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);

            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'btn btn-link position-absolute';
            toggle.style.right = '10px';
            toggle.style.top = '50%';
            toggle.style.transform = 'translateY(-50%)';
            toggle.style.zIndex = '10';
            toggle.innerHTML = '<i class="bi bi-eye"></i>';

            wrapper.appendChild(toggle);

            toggle.addEventListener('click', () => {
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                toggle.innerHTML = type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
            });
        });
    }
}

// ===== Chart Animation =====
class ChartAnimation {
    constructor() {
        this.init();
    }

    init() {
        const charts = document.querySelectorAll('.chart-bars, .line-chart');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateChart(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.5
        });

        charts.forEach(chart => observer.observe(chart));
    }

    animateChart(chart) {
        if (chart.classList.contains('chart-bars')) {
            const bars = chart.querySelectorAll('.chart-bar');
            bars.forEach((bar, index) => {
                const height = bar.style.height;
                bar.style.height = '0';
                setTimeout(() => {
                    bar.style.height = height;
                }, index * 100);
            });
        }
    }
}

// ===== Dashboard Interactions =====
class DashboardInteractions {
    constructor() {
        this.init();
    }

    init() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.querySelector('.dashboard-sidebar');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }

        // Chart type switching
        const chartTypeButtons = document.querySelectorAll('.chart-type-btn');
        chartTypeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chartType = e.target.dataset.chartType;
                this.switchChartType(chartType);
            });
        });

        // Date range picker
        const dateRangeButtons = document.querySelectorAll('.date-range-btn');
        dateRangeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const range = e.target.dataset.range;
                this.updateDateRange(range);
            });
        });
    }

    switchChartType(type) {
        // Implementation for switching chart types
        console.log('Switching to chart type:', type);
    }

    updateDateRange(range) {
        // Implementation for updating date range
        console.log('Updating date range to:', range);
    }
}

// ===== Loading States =====
class LoadingStates {
    constructor() {
        this.init();
    }

    init() {
        // Add loading states to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.classList.contains('btn-loading')) {
                    this.setButtonLoading(btn, true);

                    // Simulate loading
                    setTimeout(() => {
                        this.setButtonLoading(btn, false);
                    }, 2000);
                }
            });
        });
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<i class="bi bi-arrow-clockwise me-2"></i>Loading...';
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText;
        }
    }
}

// ===== Tooltip Initialization =====
class TooltipManager {
    constructor() {
        this.init();
    }

    init() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');

        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });

            element.addEventListener('mouseleave', (e) => {
                this.hideTooltip(e.target);
            });
        });
    }

    showTooltip(element) {
        const text = element.dataset.tooltip;
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--saas-navy);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            z-index: 1000;
            pointer-events: none;
            white-space: nowrap;
        `;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';

        element.tooltip = tooltip;
    }

    hideTooltip(element) {
        if (element.tooltip) {
            element.tooltip.remove();
            element.tooltip = null;
        }
    }
}

// ===== Back to Top =====
class BackToTop {
    constructor() {
        this.btn = null;
        this.init();
    }

    init() {
        // Create the button dynamically
        this.btn = document.createElement('button');
        this.btn.id = 'backToTop';
        this.btn.className = 'btn btn-primary back-to-top';
        this.btn.setAttribute('aria-label', 'Back to Top');
        this.btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
        document.body.appendChild(this.btn);

        // Toggle visibility on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.btn.classList.add('show');
            } else {
                this.btn.classList.remove('show');
            }
        });

        // Scroll to top on click
        this.btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new RTLManager();
    new MobileMenu();
    new SmoothScroll();
    new AnimationObserver();
    new CounterAnimation();
    new FormValidation();
    new PasswordToggle();
    new ChartAnimation();
    new DashboardInteractions();
    new LoadingStates();
    new TooltipManager();
    new BackToTop();

    // Add page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    console.log('CRO Optimize - All components initialized');
});

// ===== Utility Functions =====
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // Format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format percentage
    formatPercentage(value) {
        return `${value.toFixed(1)}%`;
    },

    // Get random color
    getRandomColor() {
        const colors = ['#2563EB', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy:', err);
            this.showNotification('Failed to copy', 'error');
        }
    },

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            color: white;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;

        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#2563EB'
        };

        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
