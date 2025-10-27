

// Мобильное меню
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const progressMobile = document.getElementById("progress-mobile");
const currentSection = document.getElementById("currentSection");
const mailForm = document.getElementById("mailForm");
const btnForm = document.getElementById("btnForm");
const mailTheme = document.getElementById("mailTheme");
const mailContent = document.getElementById("mailContent");
const logo_img_elm = document.getElementById("logo-img");
const agecontent_elm = document.getElementById("age-content");
const btnAgeYes_elm = document.getElementById("btnAgeYes");
const btnAgeNo_elm = document.getElementById("btnAgeNo");

const filterButtons = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';
let swiperInstance = null;
let cOnce = 0;

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

btnForm.addEventListener("click", () => {
  mailForm.setAttribute("action", `mailto:test@test.com?subject=${mailTheme.value}&body=${mailContent.value}`);
  mailForm.submit();
});

// Получаем все прогресс-бары
const progressBars = {
  stats: document.getElementById('progress-stats'),
  about: document.getElementById('progress-about'),
  guarantee: document.getElementById('progress-guarantee'),
  products: document.getElementById('progress-products'),
  partners: document.getElementById('progress-partners'),
  contacts: document.getElementById('progress-contacts')
};

// Все секции
const sections = {
  stats: document.getElementById('stats'),
  about: document.getElementById('about'),
  guarantee: document.getElementById('guarantee'),
  products: document.getElementById('products'),
  partners: document.getElementById('partners'),
  contacts: document.getElementById('contacts')
};

const section_names = {
  stats: "Показатели",
  about: "О компании",
  guarantee: "Производство",
  products: "Продукция",
  partners: "Партнёры",
  contacts: "Контакты",
};

const productIndexes = {
  whisky: 0,
  brandy: 0,
  rum: 0,
  gin: 0,
  vodka: 0,
};

// Обнуление всех прогресс-баров
const resetAllProgress = (xVal = false, xBar) => {
  xBar.style.width = (xVal) ? "100%" : "0";
};

// Обновление прогресса для активной секции
const updateProgress = () => {
  const scrollPosition = window.scrollY + window.innerHeight / 2;
  if (window.scrollY >= 350) {
    logo_img_elm.classList.add("logo-active");
  }

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

// Слушатели
window.addEventListener('scroll', updateProgress);
window.addEventListener('resize', updateProgress);
window.addEventListener("load", () => {
  const hVerify = localStorage.getItem("ageVerify");
  if (!hVerify) {
    console.log(agecontent_elm);
    agecontent_elm.style.display = "block";
  }
});
btnAgeYes_elm.addEventListener("click", () => {
  agecontent_elm.style.display = "none";
  localStorage.setItem("ageVerify", 1);
});
btnAgeNo_elm.addEventListener("click", () => {
  window.close();
});

// Инициализация
updateProgress();

function initSwiper() {
  if (swiperInstance) swiperInstance.destroy(true, true);

  swiperInstance = new Swiper('.product-slider', {
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
      768: { slidesPerView: 1 }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      init: function () {
        applyFilter(currentFilter);
      },
      slideChange: function () {
        animateSlide(this.activeIndex, this);
      }
    }
  });

  countCategories();
}

function countCategories() {
  const allElms = document.querySelectorAll("[data-category]");
  let prevCategory = "whisky";
  let counter = 0;
  for (const obj in allElms) {
    const objj = allElms[obj];
    if (objj.nodeType == 1) {
      if (objj.dataset.category !== prevCategory) {
        productIndexes[objj.dataset.category] = counter;
        prevCategory = objj.dataset.category;
      }
    }
    counter++;
  }
}

function applyFilter(category) {
  // swiperInstance.slideTo(0); // Сбрасываем на первый видимый

  if (category !== "all") {
    filterItems(category);
  }
}

function filterItems(xFilter) {
  const allElms = document.getElementsByClassName("product-item");

  for (const obj in allElms) {
    const hObj = allElms[obj];

    if (typeof(hObj) === "object") {
      const hData = hObj.dataset.filter;
      hObj.style.display = (hData === xFilter) ? "block" : "none"; 
    }
  }
}

// Обработчики для кнопок фильтрации
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // filterButtons.forEach(b => b.classList.remove('active'));
    // btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    applyFilter(currentFilter);
  });
});

document.addEventListener('DOMContentLoaded', initSwiper);


// === POPUP "ПОДРОБНЕЕ" ===
const popup = document.getElementById('productPopup');
const popupClose = document.getElementById('popupClose');
const popupTitle = document.getElementById('popupTitle');
const popupDescription = document.getElementById('popupDescription');

// Описание для каждого бренда
const productDetails = {
  'louis-vernant-xo': `
    История, <strong>Louis Vernant XO</strong>
    начинается с истории
    французского дворянина, известного своим тонким
    вкусом. Его неустанное стремление к совершенству
    привело к созданию бренди, которому суждено было
    стать воплощением роскоши. Любимый королевскими особами и аристократией на протяжении
    многих
    поколений, <strong>Louis Vernant XO</strong> воплощает в себе
    величие ушедшей эпохи. Этот исключительный бренди, изготовленный с
    особой
    тщательностью,
    представляет
    собой
    гармоничную смесь отборных вручную французских
    коньячныхспиртов.
    Опыт наших мастеров-блендеровгарантирует,
    что
    каждая
    бутылка
    отражает суть видения Луи Вернана.
    Символ вечной элегантности, <strong>Louis Vernant XO</strong> - это
    больше, чем просто бренди; это опыт, который
    перенесет вас в мир изобилия и изысканности.
  `,
  'diplomat-whisky': `
    История путешественника по всему миру, который
    стремился запечатлеть суть глобальной гармонии в
    одном бокале. Легенда гласит о дипломате,
    путешествовавшем по миру, человеке мира, чьи поиски
    выходили за рамки дипломатии. Будучи знатоком
    крепких напитков, он стремился передать суть
    гармонии в одном бокале. Стремясь объединить мир с
    помощью вкуса, он отправился в путешествие, чтобы
    создать виски, который отражал бы его собственный
    мир. Результатом стал <strong>DIPLOMAT World Class Whisky</strong>.
    Изготовленный из индийского солода, свидетельствует
    о богатом наследии и непревзойденном мастерстве
    местных мастеров. Каждая капля несет в себе
    обещание изысканного вкуса, независимо от того,
    подан ли он в чистом виде в низком бокале или
    охлажденным до совершенства со льдом.
    <strong>DIPLOMAT World Class Whisky</strong> – это не просто виски.
    - Это
    приглашение в мир изысканного вкуса
  `,
  'green-label': `
    Наша легендарная бутылка Waali с бриллиантовой огранкой обладает богатым наследием,
    уходящим корнями в 1994 год. Фирменная цепочка бриллиантов, украшающая горлышко, придает
    каждой бутылке нотку ностальгии и удивительной изысканности, которые приходят только со
    временем. 
    Этот 100% зерновой виски выращен на богатых, зерновых полях, родине отборных солодовых и
    зерновых спиртов, гармонично сочетается с лучшим шотландским виски и терпеливо
    выдерживается в дубовых бочках. Насыщенный вкус, предлагает гладкую, округлую текстуру с
    отчетливыми нотами солода и дуба, завершающуюся мягким и легким послевкусием, создающим
    уникальный вкусовой профиль.
  `,
  'old-tavern-whisky': `
    С момента своего основания в 1976 Old
    Tavern Whisky был неизменным
    компаньоном для бесчисленных моментов.
    Тщательно подобранный из сочетания
    индийских зерновых спиртов и солода.
    Выдержанный до совершенства в дубовых
    бочках он обладает мягким и сочным вкусом,
    который выдержал испытание временем. Известный своим неизменным качеством
    и доступной ценой,
    <strong>Old Tavern</strong> занял особое место в сердцах
    любителей виски по всей Индии.
    Свидетельство непревзойденного
    мастерства - <strong>Old Tavern Whisky</strong> остаётся
    предпочтительным выбором настоящих
    ценителей незабываемых моментов.`,
  'honey-bee-brandy': `
    С момента своего дебюта в 1974 году <strong>Honey Bee
        Brandy</strong>стал отличительной чертой Индийского
    изобилия.
    Изготовленный
    из
    тщательно
    ферментированного
    и
    дистиллированного
    виноградного вина, он может похвастаться
    богатым, мягким вкусом, который покоряет
    гурманов на протяжении многих поколений. Его
    культовый золотистый оттенок свидетельствует о
    его качестве и утончённости. Идеально
    подходит
    для
    того,
    чтобы
    насладиться уютным вечером или разделить
    время с друзьями, Honey Bee Brandy
    предлагает
    разные
    впечатления
    от
    употребления напитка. Его можно пить в
    чистом виде со льдом или смешивать с
    небольшим
    количеством
    апельсиновой
    газировки. он придаст элегантности любому
    торжеству. Бренди Honey Bee, является
    символом
    неподвластной
    времени
    изысканности,
    по-прежнему
    остается
    предпочтительным
    выбором тех, кто ценит в
    жизни только лучшее
  `,
  'haywards-whisky': `
    Haywards Fine Whisky — история с 1886 года. 
    Символ стабильного качества и традиций. 
    Вкус индийского наследия, доступный каждому.
  `,
  'blue-riband-gin': `
    С 1959 года <strong>BLUE RIBAND GIN</strong> является главным-
    выбором
    избирательных
    ценителей
    джина.
    Созданный с особым вниманием, этот джин может
    похвастаться превосходным блендом, получившим
    международное
    признание,
    в
    том
    числе
    престижную награду Concours Mondial в Брюсселе. Обладая манящим ароматом можжевельника и
    кориандра, джин <strong>Blue Riband</strong> имеет классический
    вкус.
    Являясь свидетельством
    неизменного
    качества и мастерства, бренд на протяжении
    десятилетий завоевывал верных поклонников.
    Это больше, чем просто джин. Это символ
    изысканного вкуса и наслаждение, не зависящее
    от времени.
  `,
  'white-mischief-vodka': `
    Рожденная в 1996 году <strong>White Mischief Vodka</strong>
    изменила монотонные и однообразные
    принципы в мире спиртов. Созданная стать-
    чем-то большим, чем просто напиток, она
    воплощает молодость, веселье и немного
    озорства. Его матовый флакон, украшает
    игривый логотип, который мгновенно нашёл
    отклик у поколения ищущего смелый и
    нетрадиционный напиток. С самого начала <strong>White Mischief</strong> стремилась
    стать чем-то большим, чем просто продукт,
    это образ жизни. В коллаборациях с
    различными платформами и присутствуя в
    социальных сетях, бренд укрепил свои
    позиции как популярный среди молодежи и
    людей со свободным духом.
    <strong>White Mischief</strong> это не просто водка. Это
    приглашение принять игривую сторону
    жизни.
  `,
  'black-stallion-rum': `
    Смелый, но утонченный, этот уникальный
    ром захватывает богатство премиальных
    кофейных зерен в сочетании с глубоким
    характером старинного рома. В целом, выдержанный кофейный ром
    это сложный, ароматный и вкусный
    напиток, который ценится за свою
    богатую палитру вкусов и ароматов, а
    также, за возможность испольользования
    в различных гастрономических
    комбинациях.`,
  'old-cask': `
    В Индии ром часто производится из сахарного
    тростника, собранного в высокогорных районах, и
    включает в себя добавление специй и фруктов, что
    придает напитку сладкий, мягкий, слегка тягучий
    вкус с карамельным оттенком. Этот ром, родившийся на основе патоки индийского сахарного тростника, является
    свидетельством силы и утончения.
    Бескомпромиссная сила и характер, рожденный от моря.
    С 1993 года он является маяком для тех, кто ищет «смелую», но сглаживающую крепость.
  `,
  'haywards': `
    Haywards Fine Whisky — история с 1886 года. 
    Символ стабильного качества и традиций. 
    Вкус индийского наследия, доступный каждому.
  `
};

const productSlangs = {
  'louis-vernant-xo': `
    Французские коньячные спирты, ручной отбор. Символ вечной
                                        элегантности.
  `,
  'diplomat-whisky': `
    Смесь индийского солода и шотландского виски. Легенда
                                        дипломата.
  `,
  'green-label': `
    С 1994 г. Поразительный. Настоящий. Честный.
  `,
  'old-tavern-whisky': `
  Неизменный компаньон для бесчисленных моментов`,
  'honey-bee-brandy': `
    Золотистый бренди с фруктовыми нотами.
  `,
  'haywards-whisky': `
      Вкус индийского наследия, доступный каждому.
  `,
  'blue-riband-gin': `
    Cимвол изысканного вкуса и наслаждение, не зависящее от времени.
  `,
  'white-mischief-vodka': `Матовая бутылка. Молодежный бренд. С 1996 г.
  `,
  'black-stallion-rum': `
  Смелый, но утонченный`,
  'old-cask': `
    Бескомпромиссная сила и характер, рожденный от
                                        моря.
  `,
  'haywards': `
    Вкус индийского наследия, доступный каждому.`
};

const productInfo = {
  'louis-vernant-xo': {
    name: "Louis Vernant XO",
    abv: 40,
    taste: "Сушеные фрукты, Ваниль, Специи, очень мягкий, насыщеный",
    smell: "Фруктовый, Медовый, Хересный, Пряный",
    afterTaste: "Долгое со стойкой сладостью",
    color: "8a6222",
    img: "images/louis-vernant.png",
  },
  'diplomat-whisky': {
    name: "Diplomat Whisky",
    abv: 40,
    taste: "Смесь сладких нот, остроты и тонкая горечь, которая уравновешивает сладость.",
    smell: "Солод, древесные оттенки, оттенки сладкого меда, фруктовых нот и оттенка орехового вкуса.",
    afterTaste: "Гладкое, теплое, с мягким переходом",
    color: "c88d31",
    img: "images/diplomat.png",
  },
  'green-label': {
    name: "Green Label",
    abv: 40,
    taste: "Насыщенный, солодовый, зернистый, слегка древесный",
    smell: "Фруктовый, зрелый, солодовый, зернистый",
    afterTaste: "Гладкий, средней плотности, округлый",
    color: "144E35",
    img: "images/green-label.png",
  },
  'old-tavern-whisky': {
    name: "Old Tavern Whisky",
    abv: 40,
    taste: "Сочетание сладкого, землистого и острого с нежной горечью",
    smell: "Солод, дуб, с цветочными и пряными оттенками",
    afterTaste: "Короткое, плавное, округлое",
    color: "b47f04",
    img: "images/old-tavern.png",
  },
  'honey-bee-brandy': {
    name: "Honey Bee Brandy",
    abv: 40,
    taste: "Насыщенный, но мягкий. Первый глоток раскрывает нежную медовую сладость",
    smell: "Наполнен теплом и сладостью, в нём слышны ноты спелых тропических фруктов и пряностей",
    afterTaste: "Лёгкие древесные нотки и оттенки ванили",
    color: "9b3746",
    img: "images/honey-bee.png",
  },
  'haywards-whisky': {
    name: "Haywards Whisky",
    abv: 42.8,
    smell: "Легкий и свежий, с доминирующими фруктовыми нотами, такими как яблоки и груши, а также с легкими оттенками ванили и древесины",
    taste: "Мягкий и сбалансированный, с гармоничным сочетанием сладких фруктовых нот (яблоки, груши) и легкой пряности.",
    afterTaste: "Долгое, гладкое, согревающее с нежной дымностью и прикосновение горечи",
    color: "b88715",
    img: "images/haywards.png",
  },
  'blue-riband-gin': {
    name: "Blue Riband Gin",
    abv: 42.8,
    taste: "Сочетание цитруса, кориандра и можжевельника",
    smell: "Можжевельник, цитрус, пряный кориандр",
    afterTaste: "Сухое, средней плотности",
    color: "32315C",
    img: "images/blue-riband.png",
  },
  'white-mischief-vodka': {
    name: "White Mischief Vodka",
    abv: 42.8,
    taste: "Тонкий, мягкий вкус с оттенками пряных ноток",
    smell: "Нейтральный деликатный",
    afterTaste: "Краткое послевкусие с чистым вкусом",
    color: "3a5cca",
    img: "images/white-mischief.png",
  },
  'black-stallion-rum': {
    name: "Black Stallion Rum",
    abv: 42.8,
    taste: "Сложный, сбалансированный, с нотами кофе, ванили, карамели, сухофруктов, дерева, специй, с приятной горчинкой",
    smell: "Насыщенный, с тонами кофе, сухофруктов, ванили, карамели",
    afterTaste: "Долгое, согревающее",
    color: "815317",
    img: "images/black-stallion.png",
  },
  'old-cask': {
    name: "Old Cask",
    abv: 40,
    taste: "Гладкий и фруктовый с оттенком карамели сливок, восточных пряностей, цитрусовых",
    smell: "Богатый, сладкий, напоминающий запах конфет, в букете сочетаются оттенки сухофруктов, кофе, душистой выпечки и шоколада",
    afterTaste: "Затяжная сладость",
    color: "c99a2e",
    img: "images/old-cask.png",
  },
};

// #b47f04ff
// Открытие попапа
document.querySelectorAll('.btn-details').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const parentSlide = this.closest('.product-item');
    const imgSrc = parentSlide.querySelector('img').src;
    const productName = parentSlide.querySelector('img').alt;

    // Определяем ключ по названию
    const key = productName.toLowerCase().replace(/\s+/g, '-');
    popupDescription.innerHTML = productDetails[key] || 'Описание недоступно.';

    const hItmInf = productSlangs[key];
    const hItmParams = productInfo[key];

    const itmSlang_elm = document.getElementById("aboutProduct");
    itmSlang_elm.innerText = hItmInf;

    const itmParams_elms = [
      document.getElementById("popupTitle"),
      document.getElementById("abvElm"),
      document.getElementById("smellElm"),
      document.getElementById("tasteElm"),
      document.getElementById("afterTasteElm"),
      document.getElementById("popup-image"),
    ];

    itmParams_elms[0].innerText = hItmParams.name;
    itmParams_elms[1].innerText = `${hItmParams.abv}%`;
    itmParams_elms[2].innerText = hItmParams.smell;
    itmParams_elms[3].innerText = hItmParams.taste;
    itmParams_elms[4].innerText = hItmParams.afterTaste;
    itmParams_elms[5].src = hItmParams.img;

    const itmColors_elms = [
      document.getElementById("wheel-center"),
      document.getElementById("wheel-values"),
      document.getElementById("wheel-proposition"),
      document.getElementById("wheel-pillars"),
      document.getElementById("wheel-benefits"),
      document.getElementById("wheel-essence"),
      document.getElementById("wheel-personality"),
      document.getElementById("pop-descr"),
    ];

    itmColors_elms[0].style.backgroundColor = `#${hItmParams.color}`;
    itmColors_elms[1].style.backgroundColor = `#${hItmParams.color}4d`;
    itmColors_elms[2].style.backgroundColor = `#${hItmParams.color}4d`;
    itmColors_elms[3].style.backgroundColor = `#${hItmParams.color}4d`;
    itmColors_elms[4].style.backgroundColor = `#${hItmParams.color}4d`;
    itmColors_elms[5].style.backgroundColor = `#${hItmParams.color}4d`;
    itmColors_elms[6].style.backgroundColor = `#${hItmParams.color}4d`;
    itmColors_elms[7].style.backgroundColor = `#${hItmParams.color}`;

    popup.classList.add('active');
    // document.body.style.overflow = 'hidden'; // Блокируем скролл
  });
});

// Закрытие попапа
popupClose.addEventListener('click', () => {
  popup.classList.remove('active');
  setTimeout(() => { document.body.style.overflow = ''; }, 400);
});

popup.addEventListener('click', (e) => {
  if (e.target === popup) {
    popup.classList.remove('active');
    setTimeout(() => { document.body.style.overflow = ''; }, 400);
  }
});


// Функция анимации активного слайда
function animateSlide(index, slideRef) {
  const slide = slideRef.slides[index];
  const bottle = slide.querySelector('.bottle-img');
  const infoLeft = slide.querySelector('.product-info-left');
  const infoRight = slide.querySelector('.product-info-right');

  if (bottle) bottle.style.transitionDelay = '0.1s';
  if (infoLeft) infoLeft.style.transitionDelay = '0.2s';
  if (infoRight) infoRight.style.transitionDelay = '0.3s';

  // Принудительно сбрасываем и применяем
  // void bottle.offsetWidth;
  // void infoLeft.offsetWidth;
  // void infoRight.offsetWidth;

  if (bottle) bottle.style.opacity = 1;
  if (bottle) bottle.style.transform = 'translateY(0)';

  if (infoLeft) infoLeft.style.opacity = 1;
  if (infoLeft) infoLeft.style.transform = 'translateY(0)';

  if (infoRight) infoRight.style.opacity = 1;
  if (infoRight) infoRight.style.transform = 'translateY(0)';
}