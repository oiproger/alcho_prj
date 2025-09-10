// Мобильное меню
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const progressMobile = document.getElementById("progress-mobile");
const currentSection = document.getElementById("currentSection");

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
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
      console.log(progress);
      progressBars[key].style.width = `${progress}%`;
    } else if (scrollPosition >= top) {
      resetAllProgress(true, progressBars[key]);
    } else if (scrollPosition <= bottom) {
      resetAllProgress(false, progressBars[key]);
    }

  }
};

// Инициализация Swiper
new Swiper('.product-slider', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    }
  }
});

// Слушатели
window.addEventListener('scroll', updateProgress);
window.addEventListener('resize', updateProgress);

// Инициализация
updateProgress();