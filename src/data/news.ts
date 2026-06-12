export interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  source: string;
  sourceUrl: string;
  category: string;
  time: string;
  readTime: number;
  upvotes: number;
  comments: Comment[];
  image?: string;
  trending?: boolean;
}

export const NEWS: NewsItem[] = [
  {
    id: 1,
    title: "OpenAI представила GPT-5 с рекордными показателями производительности",
    excerpt: "Новая модель превосходит предыдущие версии по всем ключевым бенчмаркам и впервые достигает уровня эксперта в области медицины и права.",
    source: "The Verge",
    sourceUrl: "#",
    category: "AI",
    time: "2 ч. назад",
    readTime: 4,
    upvotes: 2847,
    trending: true,
    comments: [
      { id: 1, author: "tech_insider", avatar: "T", text: "Ждал этого момента. Интересно, как это повлияет на рынок труда в ближайшие 2 года.", time: "1 ч. назад", likes: 34 },
      { id: 2, author: "skeptic_42", avatar: "S", text: "Каждый раз одно и то же — «рекордные показатели». Посмотрим на реальное применение.", time: "45 мин. назад", likes: 18 },
      { id: 3, author: "ai_researcher", avatar: "A", text: "Медицинские бенчмарки — это серьёзно. Это меняет всю игру для диагностики.", time: "20 мин. назад", likes: 51 },
    ]
  },
  {
    id: 2,
    title: "Apple анонсировала революционный чип M4 Ultra с 512 ГБ унифицированной памяти",
    excerpt: "Новый процессор ориентирован на профессиональных пользователей и задачи машинного обучения. Mac Studio с M4 Ultra появится в продаже уже в следующем месяце.",
    source: "9to5Mac",
    sourceUrl: "#",
    category: "Hardware",
    time: "4 ч. назад",
    readTime: 3,
    upvotes: 1934,
    comments: [
      { id: 1, author: "mac_pro_user", avatar: "M", text: "Наконец-то достаточно памяти для работы с большими языковыми моделями локально!", time: "3 ч. назад", likes: 67 },
      { id: 2, author: "linux_chad", avatar: "L", text: "За $10k? Нет, спасибо. Лучше куплю GPU кластер.", time: "2 ч. назад", likes: 29 },
    ]
  },
  {
    id: 3,
    title: "Google Chrome получит встроенный AI-ассистент для работы с веб-страницами",
    excerpt: "Функция Gemini в Chrome позволит суммировать страницы, отвечать на вопросы по содержимому и автоматически заполнять формы без отправки данных на серверы.",
    source: "TechCrunch",
    sourceUrl: "#",
    category: "Browsers",
    time: "6 ч. назад",
    readTime: 5,
    upvotes: 1456,
    trending: true,
    comments: [
      { id: 1, author: "privacy_first", avatar: "P", text: "«Без отправки данных на серверы» — покажите исходный код, тогда поверю.", time: "5 ч. назад", likes: 94 },
      { id: 2, author: "webdev_2024", avatar: "W", text: "Для работы это было бы очень удобно. Особенно для анализа длинных документаций.", time: "4 ч. назад", likes: 45 },
    ]
  },
  {
    id: 4,
    title: "SpaceX успешно запустила Starship в 8-й раз, впервые поймав ускоритель на плавучей платформе",
    excerpt: "Это исторический прорыв в космической инженерии. Многоразовый ускоритель был пойман механическими руками в открытом океане — впервые в истории.",
    source: "Ars Technica",
    sourceUrl: "#",
    category: "Space",
    time: "8 ч. назад",
    readTime: 6,
    upvotes: 5623,
    comments: [
      { id: 1, author: "space_nerd", avatar: "S", text: "Я смотрел в прямом эфире. Когда руки его поймали, у меня мурашки по коже.", time: "7 ч. назад", likes: 203 },
      { id: 2, author: "aerospace_eng", avatar: "A", text: "Это меняет всю экономику запусков. Стоимость может упасть на порядок.", time: "6 ч. назад", likes: 156 },
    ]
  },
  {
    id: 5,
    title: "Microsoft выпустила Windows 12 с нативной поддержкой AI-агентов",
    excerpt: "Новая операционная система переосмысляет интерфейс вокруг ИИ-помощника Copilot, который теперь может выполнять задачи автономно от имени пользователя.",
    source: "The Register",
    sourceUrl: "#",
    category: "OS",
    time: "10 ч. назад",
    readTime: 4,
    upvotes: 987,
    comments: [
      { id: 1, author: "windows_fan", avatar: "W", text: "Наконец-то что-то интересное после Windows 11. Жду публичного релиза.", time: "9 ч. назад", likes: 42 },
    ]
  },
  {
    id: 6,
    title: "Стартап из Кремниевой долины привлёк $500 млн на разработку квантовых компьютеров",
    excerpt: "Компания QubitCore заявляет о прорыве в создании стабильных кубитов при комнатной температуре. Если это правда, это переписывает всю историю квантовых вычислений.",
    source: "Bloomberg",
    sourceUrl: "#",
    category: "Quantum",
    time: "12 ч. назад",
    readTime: 5,
    upvotes: 743,
    comments: []
  },
  {
    id: 7,
    title: "Meta открыла исходный код Llama 4 — самой мощной открытой языковой модели",
    excerpt: "Модель с 1 триллионом параметров доступна для коммерческого использования. Эксперты называют это самым важным шагом к democratization of AI.",
    source: "Wired",
    sourceUrl: "#",
    category: "AI",
    time: "1 д. назад",
    readTime: 7,
    upvotes: 4102,
    trending: true,
    comments: [
      { id: 1, author: "open_source_dev", avatar: "O", text: "Это огромно. Теперь можно запускать SOTA модель на своём железе.", time: "23 ч. назад", likes: 178 },
      { id: 2, author: "zuck_watcher", avatar: "Z", text: "Meta понимает, что открытость — это их конкурентное преимущество против закрытых OpenAI.", time: "20 ч. назад", likes: 134 },
    ]
  },
  {
    id: 8,
    title: "Tesla представила робота Optimus 3 — он теперь умеет готовить еду",
    excerpt: "На презентации робот самостоятельно приготовил омлет и сварил кофе. Маск обещает начать серийное производство к концу года по цене $20 000.",
    source: "Electrek",
    sourceUrl: "#",
    category: "Robotics",
    time: "1 д. назад",
    readTime: 3,
    upvotes: 3241,
    comments: [
      { id: 1, author: "robot_skeptic", avatar: "R", text: "Покажите это без подготовленной кухни и идеальных условий — тогда поверю.", time: "22 ч. назад", likes: 89 },
    ]
  },
];

export const CATEGORIES = ["Все", "AI", "Hardware", "Space", "OS", "Browsers", "Quantum", "Robotics"];
