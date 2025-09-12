// Мобильное меню
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const progressMobile = document.getElementById("progress-mobile");
const currentSection = document.getElementById("currentSection");
const mailForm = document.getElementById("mailForm");
const btnForm = document.getElementById("btnForm");
const mailTheme = document.getElementById("mailTheme");
const mailContent = document.getElementById("mailContent");


hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

btnForm.addEventListener("click", () => {
  mailForm.setAttribute("action", `mailto:test@test.com?subject=${mailTheme.value}&body=${mailContent.value}`);
  console.log(mailTheme.value);
  mailForm.submit();
});

// Получаем все прогресс-бары
const progressBars = {
  stats: document.getElementById('progress-stats'),
  about: document.getElementById('progress-about'),
  products: document.getElementById('progress-products'),
  team: document.getElementById('progress-team'),
  contacts: document.getElementById('progress-contacts')
};

// Все секции
const sections = {
  stats: document.getElementById('stats'),
  about: document.getElementById('about'),
  products: document.getElementById('products'),
  team: document.getElementById('team'),
  contacts: document.getElementById('contacts')
};

const section_names = {
  stats: "Показатели",
  about: "О компании",
  products: "Продукция",
  team: "Команда",
  contacts: "Контакты",
};

// Обнуление всех прогресс-баров
const resetAllProgress = (xVal = false, xBar) => {
  xBar.style.width = (xVal) ? "100%" : "0";
};

// Обновление прогресса для активной секции
const updateProgress = () => {
  const scrollPosition = window.scrollY + window.innerHeight / 2;

  for (const [key, section] of Object.entries(sections)) {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const bottom = top + height;

    if (scrollPosition >= top && scrollPosition <= bottom) {
      // Считаем прогресс внутри секции
      const sectionScroll = scrollPosition - top;
      const progress = Math.max(0, Math.min(100, (sectionScroll / height) * 100));
      progressBars[key].style.width = `${progress}%`;
      progressMobile.style.width = `${progress}%`;
      currentSection.textContent = section_names[key];
    } else if (scrollPosition >= top) {
      resetAllProgress(true, progressBars[key]);
    } else if (scrollPosition <= bottom) {
      resetAllProgress(false, progressBars[key]);
    }

  }
};

const sections_elms = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1, // Анимация запускается, когда 10% блока в зоне видимости
  rootMargin: '0px 0px -100px 0px' // Подгружаем чуть раньше, чем доскроллили
});

// Наблюдаем за каждой секцией
sections_elms.forEach(section => {
  sectionObserver.observe(section);
});

// Инициализация Swiper
const swiper = new Swiper('.product-slider', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  effect: "fade",
  fadeEffect: {
    crossFade: true
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 1,
    },
    1024: {
      slidesPerView: 1,
    }
  },
  on: {
    init: function () {
    },
    slideChange: function () {
      // Сброс анимации для старого слайда
      const prevSlide = this.slides[this.previousIndex];
      const currentSlide = this.slides[this.activeIndex];

      // Убираем классы/состояния
      prevSlide.classList.remove('animated');
    }
  }
});
// Слушатели
window.addEventListener('scroll', updateProgress);
window.addEventListener('resize', updateProgress);

// Инициализация
updateProgress();