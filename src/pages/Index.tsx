import { useState } from "react";
import Icon from "@/components/ui/icon";

const PRODUCTS = [
  {
    id: 1,
    name: "Облако Speaker X1",
    category: "Аудио",
    price: 8990,
    image: "https://cdn.poehali.dev/projects/0eabc405-662c-4f7e-8f7b-7d2da46e16c3/files/7c9e2c10-eb8a-4e24-b185-a4f70d16d40f.jpg",
    description: "Умная колонка с голосовым управлением и объёмным звуком 360°",
    specs: { "Мощность": "20 Вт", "Bluetooth": "5.2", "Батарея": "12 ч" },
    badge: "Хит",
  },
  {
    id: 2,
    name: "Облако Book Pro",
    category: "Компьютеры",
    price: 89990,
    image: "https://cdn.poehali.dev/projects/0eabc405-662c-4f7e-8f7b-7d2da46e16c3/files/1d8d81aa-c831-42a6-af65-8f0de37f5382.jpg",
    description: "Ультратонкий ноутбук с облачной синхронизацией и 18 часами работы",
    specs: { "Процессор": "M3 Ultra", "ОЗУ": "32 ГБ", "Дисплей": "14\"" },
    badge: "Новинка",
  },
  {
    id: 3,
    name: "Облако Buds Air",
    category: "Аудио",
    price: 5490,
    image: "https://cdn.poehali.dev/projects/0eabc405-662c-4f7e-8f7b-7d2da46e16c3/files/49ad456c-231e-4ec4-aa26-558c31a17a53.jpg",
    description: "Беспроводные наушники с активным шумоподавлением и кристальным звуком",
    specs: { "ANC": "Активное", "Батарея": "30 ч", "Влагозащита": "IPX5" },
    badge: null,
  },
  {
    id: 4,
    name: "Облако Watch S2",
    category: "Носимые",
    price: 14990,
    image: "https://cdn.poehali.dev/projects/0eabc405-662c-4f7e-8f7b-7d2da46e16c3/files/e59e2af5-0a8d-48e6-9041-2b8ac5a5f14f.jpg",
    description: "Смарт-часы с мониторингом здоровья и стильным облачным дизайном",
    specs: { "Дисплей": "AMOLED", "Датчики": "8 типов", "GPS": "Есть" },
    badge: null,
  },
  {
    id: 5,
    name: "Облако Phone 15",
    category: "Смартфоны",
    price: 59990,
    image: "https://cdn.poehali.dev/projects/0eabc405-662c-4f7e-8f7b-7d2da46e16c3/files/71652882-3216-435c-8de7-4f5e82df12ed.jpg",
    description: "Флагманский смартфон с камерой 200 МП и облачным хранилищем 1 ТБ",
    specs: { "Камера": "200 МП", "Батарея": "6000 мАч", "Экран": "6.7\"" },
    badge: "Топ продаж",
  },
  {
    id: 6,
    name: "Облако Keys Pro",
    category: "Компьютеры",
    price: 12490,
    image: "https://cdn.poehali.dev/projects/0eabc405-662c-4f7e-8f7b-7d2da46e16c3/files/38673532-00fc-4d44-96d3-b049b98be686.jpg",
    description: "Механическая беспроводная клавиатура с тактильными переключателями",
    specs: { "Переключатели": "Blue Cloud", "Bluetooth": "5.3", "Батарея": "3 мес" },
    badge: null,
  },
];

const CATEGORIES = ["Все", "Смартфоны", "Компьютеры", "Аудио", "Носимые"];

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "about", label: "О нас" },
  { id: "catalog", label: "Каталог" },
  { id: "contacts", label: "Контакты" },
];

function CloudLogo({ size = 32 }: { size?: number }) {
  return (
    <img
      src="https://cdn.poehali.dev/projects/0eabc405-662c-4f7e-8f7b-7d2da46e16c3/bucket/e5ca8753-e679-4c2f-9056-08630433dea4.png"
      alt="Облако"
      width={size * 2.5}
      height={size}
      style={{ objectFit: "contain" }}
    />
  );
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  specs: Record<string, string>;
  badge: string | null;
}

interface CartItem {
  product: Product;
  qty: number;
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showBuyPopup, setShowBuyPopup] = useState(false);
  const [filterCategory, setFilterCategory] = useState("Все");
  const [filterMaxPrice, setFilterMaxPrice] = useState(100000);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProducts = PRODUCTS.filter((p) => {
    const catMatch = filterCategory === "Все" || p.category === filterCategory;
    const priceMatch = p.price <= filterMaxPrice;
    return catMatch && priceMatch;
  });

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  }

  function navigate(section: string) {
    setActiveSection(section);
    setSelectedProduct(null);
    setShowCart(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background font-golos">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("home")} className="flex items-center group">
            <CloudLogo size={36} />
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`nav-link text-sm font-medium transition-colors ${activeSection === item.id ? "text-primary active" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-md"
            >
              <Icon name="ShoppingCart" size={16} />
              <span className="hidden sm:inline">Корзина</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1 animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`text-left text-sm font-medium py-2.5 px-2 rounded-lg transition-colors ${activeSection === item.id ? "text-primary bg-blue-50" : "text-foreground hover:bg-muted"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main>
        {/* ===== HOME ===== */}
        {activeSection === "home" && (
          <div className="animate-fade-in">
            {/* Hero */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 cloud-gradient-light" />
              <div className="absolute top-10 right-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-48 h-48 bg-sky-200/40 rounded-full blur-2xl" />
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 text-center lg:text-left animate-slide-up">
                  <div className="inline-flex items-center gap-2 bg-white/70 border border-blue-100 px-4 py-1.5 rounded-full text-sm text-primary font-medium mb-6">
                    <Icon name="Sparkles" size={14} />
                    Техника нового поколения
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-cloud-dark leading-none mb-6">
                    Твоя жизнь<br />
                    <span className="text-gradient">в облаке</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                    Умные устройства, которые синхронизируются с вашей жизнью. Минимализм в дизайне, максимум в технологиях.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <button
                      onClick={() => navigate("catalog")}
                      className="cloud-gradient text-white px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-blue-200"
                    >
                      Смотреть каталог
                    </button>
                    <button
                      onClick={() => navigate("about")}
                      className="bg-white border border-border text-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-muted transition-all"
                    >
                      О компании
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex justify-center animate-float">
                  <CloudLogo size={220} />
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="bg-white border-y border-border py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { value: "12+", label: "Лет на рынке" },
                  { value: "2М+", label: "Довольных клиентов" },
                  { value: "50+", label: "Устройств в линейке" },
                  { value: "30+", label: "Стран присутствия" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-4xl font-black text-gradient mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-sm text-primary font-medium uppercase tracking-widest mb-2">Ассортимент</p>
                  <h2 className="text-3xl lg:text-4xl font-black text-cloud-dark">Популярные товары</h2>
                </div>
                <button
                  onClick={() => navigate("catalog")}
                  className="hidden sm:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all text-sm"
                >
                  Все товары <Icon name="ArrowRight" size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {PRODUCTS.slice(0, 3).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={(p) => { setSelectedProduct(p); setActiveSection("product"); }}
                    onBuy={() => setShowBuyPopup(true)}
                    onCart={addToCart}
                  />
                ))}
              </div>
            </section>

            {/* Features */}
            <section className="cloud-gradient-light py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                  <p className="text-sm text-primary font-medium uppercase tracking-widest mb-2">Преимущества</p>
                  <h2 className="text-3xl lg:text-4xl font-black text-cloud-dark">Почему Облако?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: "Cloud", title: "Облачная экосистема", text: "Все устройства синхронизируются мгновенно. Ваши данные всегда под рукой." },
                    { icon: "Shield", title: "5 лет гарантии", text: "Уверены в качестве каждого устройства. Честная гарантия без звёздочек." },
                    { icon: "Zap", title: "Быстрая доставка", text: "Отправляем в день заказа. Доставка по всей России за 2–3 дня." },
                  ].map((f) => (
                    <div key={f.title} className="glass-card rounded-2xl p-8 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 cloud-gradient rounded-xl flex items-center justify-center mb-4">
                        <Icon name={f.icon as "Cloud"} size={22} className="text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-cloud-dark mb-2">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===== ABOUT ===== */}
        {activeSection === "about" && (
          <div className="animate-fade-in">
            <div className="cloud-gradient-light py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">О нас</p>
                <h1 className="text-4xl lg:text-6xl font-black text-cloud-dark">Мы — Облако</h1>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
              <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                <div>
                  <h2 className="text-3xl font-black text-cloud-dark mb-6">Технологии без границ</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Облако — российская компания-производитель умных устройств, основанная в 2012 году. Мы верим, что технологии должны быть простыми, красивыми и объединёнными в единую экосистему.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Наши инженеры и дизайнеры работают в Москве и Санкт-Петербурге. Каждое устройство проходит 200+ тестов качества перед выпуском. Мы не гонимся за количеством — мы создаём идеальные устройства.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Экосистема Облако объединяет все ваши устройства: смартфон синхронизируется с часами, ноутбук подхватывает музыку с колонки. Всё — в одном облаке.
                  </p>
                </div>
                <div className="cloud-gradient rounded-3xl p-12 flex items-center justify-center">
                  <CloudLogo size={140} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                  { year: "2012", event: "Основание компании в Москве" },
                  { year: "2015", event: "Первый смартфон Облако Phone" },
                  { year: "2019", event: "Запуск облачной экосистемы" },
                  { year: "2024", event: "2 миллиона довольных клиентов" },
                ].map((item) => (
                  <div key={item.year} className="bg-white border border-border rounded-2xl p-6">
                    <div className="text-3xl font-black text-gradient mb-2">{item.year}</div>
                    <p className="text-sm text-muted-foreground">{item.event}</p>
                  </div>
                ))}
              </div>

              <div className="cloud-gradient rounded-3xl p-10 text-white text-center">
                <h3 className="text-2xl font-black mb-3">Наша миссия</h3>
                <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
                  Сделать умные технологии доступными для каждого, создавая устройства, которые работают вместе как единое целое.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===== CATALOG ===== */}
        {activeSection === "catalog" && (
          <div className="animate-fade-in">
            <div className="cloud-gradient-light py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Магазин</p>
                <h1 className="text-4xl lg:text-6xl font-black text-cloud-dark">Каталог товаров</h1>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar filters */}
                <aside className="lg:w-64 flex-shrink-0">
                  <div className="bg-white border border-border rounded-2xl p-6 sticky top-24">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <Icon name="SlidersHorizontal" size={16} />
                      Фильтры
                    </h3>

                    <div className="mb-6">
                      <p className="text-sm font-medium text-muted-foreground mb-3">Категория</p>
                      <div className="flex flex-col gap-1">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${filterCategory === cat ? "bg-primary text-white font-medium" : "hover:bg-muted text-foreground"}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">
                        Цена до: <span className="text-primary font-bold">{filterMaxPrice.toLocaleString()} ₽</span>
                      </p>
                      <input
                        type="range"
                        min={1000}
                        max={100000}
                        step={1000}
                        value={filterMaxPrice}
                        onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1 000 ₽</span>
                        <span>100 000 ₽</span>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Products grid */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-muted-foreground text-sm">
                      Найдено: <span className="text-foreground font-medium">{filteredProducts.length} товаров</span>
                    </p>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                      <Icon name="PackageSearch" size={48} className="mx-auto mb-4 opacity-30" />
                      <p className="text-lg">Товары не найдены</p>
                      <p className="text-sm">Попробуйте изменить фильтры</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onView={(p) => { setSelectedProduct(p); setActiveSection("product"); }}
                          onBuy={() => setShowBuyPopup(true)}
                          onCart={addToCart}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== PRODUCT DETAIL ===== */}
        {activeSection === "product" && selectedProduct && (
          <div className="animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <button
                onClick={() => navigate("catalog")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm"
              >
                <Icon name="ArrowLeft" size={16} />
                Назад в каталог
              </button>

              <div className="grid lg:grid-cols-2 gap-12">
                <div className="cloud-gradient-light rounded-3xl p-8 flex items-center justify-center min-h-80">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full max-w-sm h-72 object-cover rounded-2xl shadow-lg"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  {selectedProduct.badge && (
                    <span className="inline-flex w-fit items-center cloud-gradient text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                      {selectedProduct.badge}
                    </span>
                  )}
                  <p className="text-primary text-sm font-medium mb-1">{selectedProduct.category}</p>
                  <h1 className="text-3xl lg:text-4xl font-black text-cloud-dark mb-4">{selectedProduct.name}</h1>
                  <p className="text-muted-foreground leading-relaxed mb-6">{selectedProduct.description}</p>

                  <div className="bg-muted/50 rounded-2xl p-5 mb-6">
                    <h3 className="font-bold text-sm text-cloud-dark mb-3 uppercase tracking-wide">Характеристики</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedProduct.specs).map(([key, val]) => (
                        <div key={key}>
                          <p className="text-xs text-muted-foreground">{key}</p>
                          <p className="text-sm font-semibold text-foreground">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-4xl font-black text-cloud-dark mb-6">
                    {selectedProduct.price.toLocaleString()} ₽
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowBuyPopup(true)}
                      className="flex-1 cloud-gradient text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all hover:shadow-lg"
                    >
                      Купить сейчас
                    </button>
                    <button
                      onClick={() => addToCart(selectedProduct)}
                      className="px-5 bg-secondary text-secondary-foreground py-4 rounded-2xl font-medium hover:bg-secondary/80 transition-colors"
                    >
                      <Icon name="ShoppingCart" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== CONTACTS ===== */}
        {activeSection === "contacts" && (
          <div className="animate-fade-in">
            <div className="cloud-gradient-light py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Связаться</p>
                <h1 className="text-4xl lg:text-6xl font-black text-cloud-dark">Контакты</h1>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-black text-cloud-dark mb-8">Мы всегда на связи</h2>
                  <div className="flex flex-col gap-4">
                    {[
                      { icon: "MapPin", title: "Адрес", text: "Москва, ул. Технологическая, 12" },
                      { icon: "Phone", title: "Телефон", text: "+7 (800) 555-CLOUD" },
                      { icon: "Mail", title: "Email", text: "hello@oblako.ru" },
                      { icon: "Clock", title: "Режим работы", text: "Пн–Пт: 9:00–20:00" },
                    ].map((c) => (
                      <div key={c.title} className="flex items-start gap-4 bg-white border border-border rounded-2xl p-5">
                        <div className="w-10 h-10 cloud-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon name={c.icon as "Mail"} size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">{c.title}</p>
                          <p className="font-semibold text-foreground">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-border rounded-3xl p-8">
                  <h3 className="text-xl font-black text-cloud-dark mb-6">Написать нам</h3>
                  <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Имя</label>
                      <input
                        type="text"
                        placeholder="Ваше имя"
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Сообщение</label>
                      <textarea
                        rows={4}
                        placeholder="Расскажите, чем мы можем помочь..."
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="cloud-gradient text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
                    >
                      Отправить сообщение
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-cloud-dark text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CloudLogo size={28} />
              </div>
              <p className="text-white/50 text-sm max-w-xs">Техника и гаджеты нового поколения для вашей жизни в облаке.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <p className="font-semibold text-sm mb-3 text-white/80">Магазин</p>
                {[
                  { label: "Каталог", section: "catalog" },
                  { label: "Новинки", section: "catalog" },
                  { label: "Акции", section: "catalog" },
                  { label: "Гарантия", section: "about" },
                ].map((l) => (
                  <button key={l.label} onClick={() => navigate(l.section)} className="block text-white/40 text-sm py-0.5 hover:text-white/80 transition-colors text-left">{l.label}</button>
                ))}
              </div>
              <div>
                <p className="font-semibold text-sm mb-3 text-white/80">Компания</p>
                {[
                  { label: "О нас", section: "about" },
                  { label: "Карьера", section: "about" },
                  { label: "Пресса", section: "about" },
                  { label: "Контакты", section: "contacts" },
                ].map((l) => (
                  <button key={l.label} onClick={() => navigate(l.section)} className="block text-white/40 text-sm py-0.5 hover:text-white/80 transition-colors text-left">{l.label}</button>
                ))}
              </div>
              <div>
                <p className="font-semibold text-sm mb-3 text-white/80">Поддержка</p>
                {[
                  { label: "Помощь", section: "contacts" },
                  { label: "Доставка", section: "contacts" },
                  { label: "Возврат", section: "contacts" },
                  { label: "FAQ", section: "contacts" },
                ].map((l) => (
                  <button key={l.label} onClick={() => navigate(l.section)} className="block text-white/40 text-sm py-0.5 hover:text-white/80 transition-colors text-left">{l.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-sm">© 2026 Облако. Все права защищены.</p>
            <p className="text-white/20 text-xs">Сделано с ☁️ в России</p>
          </div>
        </div>
      </footer>

      {/* CART SIDEBAR */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-black text-cloud-dark">Корзина</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Корзина пуста</p>
                  <button
                    onClick={() => { setShowCart(false); navigate("catalog"); }}
                    className="mt-4 text-primary text-sm font-medium hover:underline"
                  >
                    Перейти в каталог
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 bg-muted/40 rounded-2xl p-4">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-xl" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground mb-2">{item.product.category}</p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-primary">{(item.product.price * item.qty).toLocaleString()} ₽</p>
                          <div className="flex items-center gap-2 text-sm">
                            <button
                              onClick={() => {
                                if (item.qty === 1) removeFromCart(item.product.id);
                                else setCart(prev => prev.map(i => i.product.id === item.product.id ? { ...i, qty: i.qty - 1 } : i));
                              }}
                              className="w-7 h-7 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Icon name="Minus" size={12} />
                            </button>
                            <span className="font-medium w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => addToCart(item.product)}
                              className="w-7 h-7 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Icon name="Plus" size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Итого:</span>
                  <span className="text-2xl font-black text-cloud-dark">{cartTotal.toLocaleString()} ₽</span>
                </div>
                <button
                  onClick={() => setShowBuyPopup(true)}
                  className="w-full cloud-gradient text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all"
                >
                  Оформить заказ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BUY POPUP */}
      {showBuyPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBuyPopup(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-scale-in">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CloudLogo size={48} />
            </div>
            <h3 className="text-2xl font-black text-cloud-dark mb-3">Ой!</h3>
            <p className="text-muted-foreground leading-relaxed mb-6 text-base">
              Это РП, тут мы деньги с людей не берём ☁️
            </p>
            <button
              onClick={() => setShowBuyPopup(false)}
              className="w-full cloud-gradient text-white py-3.5 rounded-2xl font-semibold hover:opacity-90 transition-all text-base"
            >
              Понятно, буду ждать!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  onView,
  onBuy,
  onCart,
}: {
  product: Product;
  onView: (p: Product) => void;
  onBuy: () => void;
  onCart: (p: Product) => void;
}) {
  return (
    <div
      className="product-card bg-white border border-border rounded-3xl overflow-hidden cursor-pointer"
      onClick={() => onView(product)}
    >
      <div className="cloud-gradient-light h-52 flex items-center justify-center overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-primary font-medium bg-blue-50 px-2 py-0.5 rounded-full">{product.category}</span>
          {product.badge && (
            <span className="text-xs cloud-gradient text-white font-bold px-2 py-0.5 rounded-full">{product.badge}</span>
          )}
        </div>
        <h3 className="font-bold text-foreground mb-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-black text-cloud-dark">{product.price.toLocaleString()} ₽</span>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onCart(product)}
              className="p-2 border border-border rounded-xl hover:bg-muted transition-colors text-foreground"
            >
              <Icon name="ShoppingCart" size={16} />
            </button>
            <button
              onClick={onBuy}
              className="cloud-gradient text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            >
              Купить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}