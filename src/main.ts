interface PartnerFormData {
  company: string;
  contact: string;
  email: string;
  phone: string;
  partnershipType: string;
  message: string;
}

interface Event {
  day: string;
  month: string;
  title: string;
  location: string;
  description: string;
  link: string;
  type: 'upcoming' | 'recent';
}

class PartnerPage {
  private form: HTMLFormElement | null;
  private mobileMenuBtn: HTMLElement | null;
  private navMenu: HTMLElement | null;

  constructor() {
    this.form = document.querySelector('.application-form');
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.navMenu = document.querySelector('.nav-menu');
    this.init();
  }

  private init(): void {
    this.setupSmoothScrolling();
    this.setupFormHandling();
    this.setupMobileMenu();
    this.setupAnimations();
    this.updateFooterYear();
  }

  private setupSmoothScrolling(): void {
    document.querySelectorAll('a[href^="#"]').forEach((anchor: Element) => {
      anchor.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const href = (anchor as HTMLAnchorElement).getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  private setupFormHandling(): void {
    this.form?.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.handleFormSubmission();
    });
  }

  private handleFormSubmission(): void {
    if (!this.form) return;

    const formData = new FormData(this.form);
    const data: Partial<PartnerFormData> = Object.fromEntries(formData);

    if (!this.validateForm(data)) return;

    // Simulate API call
    this.showSuccessMessage();
    this.form.reset();
  }

  private validateForm(data: Partial<PartnerFormData>): boolean {
    if (!data.company || !data.contact || !data.email || !data.phone) {
      this.showError('Please fill in all required fields.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      this.showError('Please enter a valid email address.');
      return false;
    }

    return true;
  }

  private showError(message: string): void {
    alert(message); // In production, use a proper toast/modal
  }

  private showSuccessMessage(): void {
    alert('Thank you for your partnership application! We will contact you within 2-3 business days.');
  }

  private setupMobileMenu(): void {
    this.mobileMenuBtn?.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking nav links
    document.querySelectorAll('.nav-menu a').forEach((link: Element) => {
      link.addEventListener('click', () => {
        if (this.navMenu?.classList.contains('active')) {
          this.toggleMobileMenu();
        }
      });
    });
  }

  private toggleMobileMenu(): void {
    this.navMenu?.classList.toggle('active');
    
    const spans = this.mobileMenuBtn?.querySelectorAll('span');
    if (this.navMenu?.classList.contains('active')) {
      spans?.[0]?.setAttribute('style', 'transform: rotate(45deg) translate(5px, 5px)');
      spans?.[1]?.setAttribute('style', 'opacity: 0');
      spans?.[2]?.setAttribute('style', 'transform: rotate(-45deg) translate(7px, -6px)');
    } else {
      spans?.forEach(span => span.removeAttribute('style'));
    }
  }

  private setupAnimations(): void {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.partnership-card, .event-card').forEach((el: Element) => {
      const element = el as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  }

  private updateFooterYear(): void {
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
      footerYear.textContent = footerYear.textContent?.replace('2026', currentYear.toString()) || '';
    }
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new PartnerPage();
});