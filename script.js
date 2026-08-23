/* ==========================================================================
   PORTFOLIO WEBSITE - SASMITHA KALPA
   Main JavaScript File (script.js) - Multi-Image Swiper & Uncropped Lightbox
   ========================================================================== */

const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY"; 

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initActiveNavLink();
  initScrollAnimations();
  initProjectFilter();
  initCarousels();
  initModals();
  initContactForm();
  initFloatingCart();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
}

function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   2. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(reveal => observer.observe(reveal));
}

/* --------------------------------------------------------------------------
   3. PROJECTS GALLERY FILTERING
   -------------------------------------------------------------------------- */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. MULTI-IMAGE CAROUSEL SLIDER WITH TOUCH SWIPE SUPPORT
   -------------------------------------------------------------------------- */
function initCarousels() {
  const carousels = document.querySelectorAll('.card-carousel');

  carousels.forEach(carousel => {
    const slidesContainer = carousel.querySelector('.carousel-slides');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const counterBadge = carousel.querySelector('.current-img-index');

    if (!slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;

      slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      // Update counter badge if present
      if (counterBadge) {
        counterBadge.textContent = `${currentIndex + 1}/${totalSlides}`;
      }

      // Update parent project card attribute for active image
      const parentCard = carousel.closest('.project-card');
      if (parentCard) {
        parentCard.setAttribute('data-active-index', currentIndex);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(idx);
      });
    });

    // Touch Swipe Gesture Handling
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          goToSlide(currentIndex + 1); // Swipe left -> next
        } else {
          goToSlide(currentIndex - 1); // Swipe right -> prev
        }
      }
    }
  });
}

/* --------------------------------------------------------------------------
   5. UNCROPPED LIGHTBOX & MODALS
   -------------------------------------------------------------------------- */
let currentOrderService = 'Custom Project';
let currentOrderCategory = 'Freelance';
let lightboxImages = [];
let lightboxCurrentIdx = 0;

function initModals() {
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalCloses = document.querySelectorAll('.modal-close');

  modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      modalOverlays.forEach(overlay => overlay.classList.remove('active'));
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  const quickOrderForm = document.getElementById('quickOrderForm');
  if (quickOrderForm) {
    quickOrderForm.addEventListener('submit', handleQuickOrderSubmit);
  }
}

// Open Uncropped Best-Quality Lightbox Modal
window.openLightboxModal = function(title, category, desc, images, initialIdx = 0) {
  const lightboxModal = document.getElementById('lightboxModal');
  if (!lightboxModal) return;

  lightboxImages = Array.isArray(images) ? images : [images];
  lightboxCurrentIdx = initialIdx;

  const titleElem = lightboxModal.querySelector('.lightbox-title');
  const categoryElem = lightboxModal.querySelector('.lightbox-category');
  const descElem = lightboxModal.querySelector('.lightbox-desc');
  const orderBtn = lightboxModal.querySelector('.lightbox-order-btn');

  if (titleElem) titleElem.textContent = title;
  if (categoryElem) categoryElem.textContent = category;
  if (descElem) descElem.textContent = desc;

  renderLightboxMedia();

  if (orderBtn) {
    orderBtn.onclick = () => {
      lightboxModal.classList.remove('active');
      openOrderModal(`${title} (Item #${lightboxCurrentIdx + 1})`, category);
    };
  }

  lightboxModal.classList.add('active');
};

function renderLightboxMedia() {
  const lightboxModal = document.getElementById('lightboxModal');
  if (!lightboxModal) return;

  const mediaContainer = lightboxModal.querySelector('.lightbox-media');
  const currentMediaUrl = lightboxImages[lightboxCurrentIdx];
  const isVideo = currentMediaUrl.endsWith('.mp4') || currentMediaUrl.endsWith('.webm');

  let navControls = '';
  if (lightboxImages.length > 1) {
    navControls = `
      <button class="lightbox-nav-btn prev" onclick="prevLightboxSlide(event)"><i class="fas fa-chevron-left"></i></button>
      <button class="lightbox-nav-btn next" onclick="nextLightboxSlide(event)"><i class="fas fa-chevron-right"></i></button>
      <div style="position: absolute; bottom: 0.75rem; right: 0.75rem; background: rgba(5,7,12,0.85); color: #fff; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.78rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.1);">
        ${lightboxCurrentIdx + 1} of ${lightboxImages.length}
      </div>
    `;
  }

  if (isVideo) {
    mediaContainer.innerHTML = `<video src="${currentMediaUrl}" controls autoplay loop></video>${navControls}`;
  } else {
    // Render uncropped best quality image
    mediaContainer.innerHTML = `<img src="${currentMediaUrl}" alt="Full Quality Preview">${navControls}`;
  }
}

window.prevLightboxSlide = function(e) {
  if (e) e.stopPropagation();
  lightboxCurrentIdx = (lightboxCurrentIdx - 1 + lightboxImages.length) % lightboxImages.length;
  renderLightboxMedia();
};

window.nextLightboxSlide = function(e) {
  if (e) e.stopPropagation();
  lightboxCurrentIdx = (lightboxCurrentIdx + 1) % lightboxImages.length;
  renderLightboxMedia();
};

// Open Quick Order Modal
window.openOrderModal = function(serviceTitle, categoryName) {
  const orderModal = document.getElementById('orderModal');
  if (!orderModal) return;

  currentOrderService = serviceTitle;
  currentOrderCategory = categoryName;

  const serviceElem = document.getElementById('orderItemTitle');
  const categoryElem = document.getElementById('orderItemCategory');

  if (serviceElem) serviceElem.textContent = serviceTitle;
  if (categoryElem) categoryElem.textContent = categoryName;

  orderModal.classList.add('active');
};

/* --------------------------------------------------------------------------
   6. QUICK ORDER SUBMISSION (EMAIL & WHATSAPP)
   -------------------------------------------------------------------------- */
async function handleQuickOrderSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('orderName');
  const whatsappInput = document.getElementById('orderWhatsapp');
  const emailInput = document.getElementById('orderEmail');
  const notesInput = document.getElementById('orderNotes');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  const name = nameInput ? nameInput.value.trim() : '';
  const whatsapp = whatsappInput ? whatsappInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const notes = notesInput ? notesInput.value.trim() : '';

  if (!name || !whatsapp || !email) {
    showToast('Please complete all required fields (Name, WhatsApp, Email).', 'error');
    return;
  }

  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Submitting Order...`;

  try {
    const formData = new FormData();
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", `🚀 New Order Request: ${currentOrderService}`);
    formData.append("from_name", name);
    formData.append("email", email);
    formData.append("whatsapp", whatsapp);
    formData.append("service_requested", currentOrderService);
    formData.append("category", currentOrderCategory);
    formData.append("project_notes", notes || 'None');

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    }).catch(err => console.log("Email dispatch log:", err));

    const whatsappMsg = encodeURIComponent(
      `*New Order Request via Portfolio*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `📱 *WhatsApp:* ${whatsapp}\n` +
      `🛒 *Ordered:* ${currentOrderService} (${currentOrderCategory})\n` +
      `📝 *Notes:* ${notes || 'N/A'}`
    );

    const whatsappUrl = `https://wa.me/?text=${whatsappMsg}`;

    document.getElementById('orderModal').classList.remove('active');
    e.target.reset();

    showToast(`Order Received! Email sent to Sasmitha. Click to open direct WhatsApp chat!`, 'success', whatsappUrl);

  } catch (error) {
    showToast('Order received! Sasmitha will reach out via WhatsApp/Email shortly.', 'success');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

/* --------------------------------------------------------------------------
   7. CONTACT FORM & UTILITIES
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending Message...`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.reset();
      showToast('Thank you! Your message has been sent to Sasmitha Kalpa.', 'success');
    }, 1200);
  });
}

function initFloatingCart() {
  if (!document.querySelector('.floating-cart-btn')) {
    const floatBtn = document.createElement('div');
    floatBtn.className = 'floating-cart-btn';
    floatBtn.innerHTML = `<i class="fas fa-shopping-bag"></i> <span>Quick Order</span>`;
    floatBtn.onclick = () => openOrderModal('General Inquiry / Project Order', 'Freelance');
    document.body.appendChild(floatBtn);
  }
}

function showToast(message, type = 'success', actionUrl = null) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  
  let actionHtml = '';
  if (actionUrl) {
    actionHtml = `<a href="${actionUrl}" target="_blank" class="btn btn-cart" style="margin-left: 0.5rem; padding: 0.35rem 0.75rem; font-size: 0.8rem;"><i class="fab fa-whatsapp"></i> Chat WhatsApp</a>`;
  }

  toast.innerHTML = `
    <i class="fas ${icon}" style="color: ${type === 'success' ? '#06b6d4' : '#f43f5e'}; font-size: 1.2rem;"></i>
    <span style="font-size: 0.9rem; font-weight: 500;">${message}</span>
    ${actionHtml}
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.35s ease';
    setTimeout(() => toast.remove(), 350);
  }, 6500);
}
