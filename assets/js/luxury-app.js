// Luxury App - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  
  // ========== HEADER SCROLL EFFECT ==========
  const header = document.querySelector('[data-header]');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // ========== SCROLL REVEAL ANIMATIONS ==========
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });

  // ========== PRODUCT GALLERY ==========
  const mainImage = document.getElementById('main-image');
  const galleryThumbs = document.querySelectorAll('.gallery-thumb');
  
  galleryThumbs.forEach(thumb => {
    thumb.addEventListener('click', function() {
      const imageUrl = this.dataset.image;
      mainImage.src = imageUrl;
      
      // Update active thumbnail
      galleryThumbs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ========== QUANTITY SELECTOR ==========
  const quantityInput = document.getElementById('quantity');
  const qtyMinus = document.querySelector('.qty-minus');
  const qtyPlus = document.querySelector('.qty-plus');

  if (qtyMinus && qtyPlus && quantityInput) {
    qtyMinus.addEventListener('click', function() {
      let qty = parseInt(quantityInput.value);
      if (qty > 1) quantityInput.value = qty - 1;
    });

    qtyPlus.addEventListener('click', function() {
      let qty = parseInt(quantityInput.value);
      quantityInput.value = qty + 1;
    });
  }

  // ========== TABS ==========
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      
      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Add active class to clicked button and corresponding pane
      this.classList.add('active');
      document.getElementById(tabName + '-tab')?.classList.add('active');
    });
  });

  // ========== FAQ ACCORDION ==========
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', function() {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });

  // ========== CART SIDEBAR ==========
  const cartToggle = document.querySelector('[data-cart-toggle]');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCart = document.querySelector('[data-close-cart]');

  cartToggle?.addEventListener('click', function() {
    cartSidebar?.classList.add('active');
  });

  closeCart?.addEventListener('click', function() {
    cartSidebar?.classList.remove('active');
  });

  // ========== SMOOTH SCROLLING ==========
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

  // ========== NEWSLETTER FORM ==========
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      if (email) {
        // Add to Shopify newsletter
        fetch('/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'contact[email]=' + encodeURIComponent(email)
        }).then(() => {
          // Show success message
          alert('Thank you for subscribing!');
          this.reset();
        });
      }
    });
  }

  // ========== LAZY LOADING IMAGES ==========
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // ========== PRODUCT FORM SUBMISSION ==========
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = {
        items: [{
          id: formData.get('id'),
          quantity: parseInt(formData.get('quantity'))
        }]
      };

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        // Show success animation
        const button = this.querySelector('[type="submit"]');
        const originalText = button.textContent;
        button.textContent = '✓ Added to Bag';
        button.style.backgroundColor = '#D4AF37';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = '';
          // Open cart sidebar
          cartSidebar?.classList.add('active');
        }, 1500);
      })
      .catch(error => console.error('Error:', error));
    });
  }

  // ========== MOBILE MENU TOGGLE ==========
  const mobileMenuButton = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  mobileMenuButton?.addEventListener('click', function() {
    mobileMenu?.classList.toggle('active');
  });

  // ========== SEARCH TOGGLE ==========
  const searchToggle = document.querySelector('[data-search-toggle]');
  const searchForm = document.querySelector('[data-search-form]');

  searchToggle?.addEventListener('click', function() {
    searchForm?.classList.toggle('active');
  });

});

// ========== PAGE PERFORMANCE ==========
// Image optimization
document.addEventListener('DOMContentLoaded', function() {
  // Preload critical images
  const criticalImages = document.querySelectorAll('[data-preload]');
  criticalImages.forEach(img => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = img.src;
    document.head.appendChild(link);
  });
});

console.log('Luminoso App Loaded ✓');
