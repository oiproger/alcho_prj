

// Мобильное меню
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const progressMobile = document.getElementById("progress-mobile");
const currentSection = document.getElementById("currentSection");
const mailForm = document.getElementById("mailForm");
const btnForm = document.getElementById("btnForm");
const mailTheme = document.getElementById("mailTheme");
const mailContent = document.getElementById("mailContent");

const filterButtons = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';
let swiperInstance = null;

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
    swiperInstance.slideTo(productIndexes[category]);
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
    <strong class="louis"><em>Французские коньячные спирты, ручной отбор. Символ вечной
                                        элегантности.</em></strong>
                                История, <strong class="louis">Louis Vernant XO</strong>
                                начинается с истории
                                французского дворянина, известного своим тонким
                                вкусом. Его неустанное стремление к совершенству
                                привело к созданию бренди, которому суждено было
                                стать воплощением роскоши. Любимый королевскими особами и аристократией на протяжении
                                многих
                                поколений, <strong class="louis">Louis Vernant XO</strong> воплощает в себе
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
                                Символ вечной элегантности, <strong class="louis">Louis Vernant XO</strong> - это
                                больше, чем просто бренди; это опыт, который
                                перенесет вас в мир изобилия и изысканности.
  `,
  'diplomat-whisky': `
    <strong class="diplomat"><em>Смесь индийского солода и шотландского виски. Легенда
                                        дипломата.</em></strong>

                                История путешественника по всему миру, который
                                стремился запечатлеть суть глобальной гармонии в
                                одном бокале. Легенда гласит о дипломате,
                                путешествовавшем по миру, человеке мира, чьи поиски
                                выходили за рамки дипломатии. Будучи знатоком
                                крепких напитков, он стремился передать суть
                                гармонии в одном бокале. Стремясь объединить мир с
                                помощью вкуса, он отправился в путешествие, чтобы
                                создать виски, который отражал бы его собственный
                                мир. Результатом стал <strong class="diplomat">DIPLOMAT World Class Whisky</strong>.
                                Изготовленный из индийского солода, свидетельствует
                                о богатом наследии и непревзойденном мастерстве
                                местных мастеров. Каждая капля несет в себе
                                обещание изысканного вкуса, независимо от того,
                                подан ли он в чистом виде в низком бокале или
                                охлажденным до совершенства со льдом.
                                <strong class="diplomat">DIPLOMAT World Class Whisky</strong> – это не просто виски.
                                - Это
                                приглашение в мир изысканного вкуса
  `,
  'green-label': `
    <strong class="green-label"><em>С 1994 г. Выдержка в дубовых бочках. Бриллиантовая
                                        огранка
                                        бутылки. Поразительный. Настоящий. Честный. </em></strong>
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
  <strong class="oldtavern"><em>Неизменный
                                        компаньон для бесчисленных моментов</em></strong>
                                С момента своего основания в 1976 Old
                                Tavern Whisky был неизменным
                                компаньоном для бесчисленных моментов.
                                Тщательно подобранный из сочетания
                                индийских зерновых спиртов и солода.
                                Выдержанный до совершенства в дубовых
                                бочках он обладает мягким и сочным вкусом,
                                который выдержал испытание временем. Известный своим неизменным качеством
                                и доступной ценой,
                                <strong class="oldtavern">Old Tavern</strong> занял особое место в сердцах
                                любителей виски по всей Индии.
                                Свидетельство непревзойденного
                                мастерства - <strong class="oldtavern">Old Tavern Whisky</strong> остаётся
                                предпочтительным выбором настоящих
                                ценителей незабываемых моментов.`,
  'honey-bee-brandy': `
    <strong class="bee"><em>Золотистый бренди с фруктовыми нотами. С 1974 г.</em></strong>
                                С момента своего дебюта в 1974 году <strong class="bee">Honey Bee
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
      <strong class="haywards">Haywards</strong>
    прекрасный виски –
    Это смесь
    импортированного
    шотландского солода
    и индийского
    зернового спирта,
    выдержанный в
    дубовых бочках для
    достижения гладкого
    и мягкого вкуса. Виски <strong class="haywards">Haywards</strong> -
    это мягкий, приятный напиток с хорошо
    сбалансированным вкусом, который
    оставляет приятное послевкусие. Он
    подходит как для употребления в чистом
    виде, так и для создания коктейлей.
  `,
  'blue-riband-gin': `
    <strong class="riband"><em>С 1994 г. Выдержка в дубовых бочках. Бриллиантовая огранка
                                        бутылки.</em></strong>

                                С 1959 года <strong class="riband">BLUE RIBAND GIN</strong> является главным-
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
                                кориандра, джин <strong class="riband">Blue Riband</strong> имеет классический
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
    <strong class="mischief"><em>Матовая бутылка. Молодежный бренд. С 1996 г.</em></strong>
                                Рожденная в 1996 году <strong class="mischief">White Mischief Vodka</strong>
                                изменила монотонные и однообразные
                                принципы в мире спиртов. Созданная стать-
                                чем-то большим, чем просто напиток, она
                                воплощает молодость, веселье и немного
                                озорства. Его матовый флакон, украшает
                                игривый логотип, который мгновенно нашёл
                                отклик у поколения ищущего смелый и
                                нетрадиционный напиток. С самого начала <strong class="mischief">White Mischief</strong> стремилась
                                стать чем-то большим, чем просто продукт,
                                это образ жизни. В коллаборациях с
                                различными платформами и присутствуя в
                                социальных сетях, бренд укрепил свои
                                позиции как популярный среди молодежи и
                                людей со свободным духом.
                                <strong class="mischief">White Mischief</strong> это не просто водка. Это
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
    <strong class="oldcask"><em>Бескомпромиссная сила и характер, рожденный от
                                        моря.</em></strong>
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

// Открытие попапа
document.querySelectorAll('.btn-details').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const parentSlide = this.closest('.product-slide');
    const imgSrc = parentSlide.querySelector('img').src;
    const productName = parentSlide.querySelector('img').alt;

    // Определяем ключ по названию
    const key = productName.toLowerCase().replace(/\s+/g, '-');

    popupTitle.textContent = productName;
    console.log("key");
    popupDescription.innerHTML = productDetails[key] || 'Описание недоступно.';

    popup.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл
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