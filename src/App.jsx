import { useEffect, useMemo, useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Günlük sneaker',
    category: 'Moda',
    price: 1890,
    oldPrice: 2290,
    badge: 'ÇOK SATAN',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Minimal seramik vazo',
    category: 'Ev & Yaşam',
    price: 690,
    oldPrice: null,
    badge: 'YENİ',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Kablosuz kulaklık',
    category: 'Teknoloji',
    price: 2490,
    oldPrice: 2990,
    badge: '-17%',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Hafta sonu çantası',
    category: 'Moda',
    price: 1390,
    oldPrice: null,
    badge: '',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Kahve demleme seti',
    category: 'Ev & Yaşam',
    price: 1150,
    oldPrice: 1390,
    badge: 'FIRSAT',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Akıllı saat',
    category: 'Teknoloji',
    price: 3290,
    oldPrice: null,
    badge: 'YENİ',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    name: 'Günlük bakım seti',
    category: 'Bakım',
    price: 840,
    oldPrice: 990,
    badge: '-15%',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    name: 'Doğal not defteri',
    category: 'Ev & Yaşam',
    price: 320,
    oldPrice: null,
    badge: '',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80',
  },
];

const formatMoney = (value) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);

export default function App() {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('nova-cart');
    return saved ? JSON.parse(saved) : {};
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem('nova-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const categories = useMemo(
    () => ['Tümü', ...new Set(products.map((product) => product.category))],
    []
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('tr');

    return products.filter((product) => {
      const matchesCategory = activeCategory === 'Tümü' || product.category === activeCategory;
      const matchesSearch = !query || product.name.toLocaleLowerCase('tr').includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const cartEntries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  const cartCount = cartEntries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const subtotal = cartEntries.reduce((sum, [productId, quantity]) => {
    const product = products.find((item) => item.id === Number(productId));
    return product ? sum + product.price * quantity : sum;
  }, 0);

  const addToCart = (productId) => {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] || 0) + 1,
    }));
    setToast('Ürün sepetine eklendi');
  };

  const updateQuantity = (productId, delta) => {
    setCart((current) => {
      const nextQuantity = (current[productId] || 0) + delta;
      const next = { ...current };
      if (nextQuantity <= 0) delete next[productId];
      else next[productId] = nextQuantity;
      return next;
    });
  };

  const removeFromCart = (productId) => {
    setCart((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  };

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    setToast('Teşekkürler! Demo form başarıyla alındı.');
    event.target.reset();
  };

  return (
    <>
      <div className="announcement">🚚 <b>Ücretsiz kargo</b> — 750 TL ve üzeri alışverişlerde</div>

      <header className="wrap header">
        <a className="brand" href="#top" aria-label="Nova Market ana sayfa">
          <span className="brand-mark">✳</span>
          nova<span>market</span>
        </a>

        <nav className="nav" aria-label="Ana menü">
          <a href="#urunler">Ürünler</a>
          <a href="#kampanya">Kampanyalar</a>
          <a href="#hakkimizda">Hakkımızda</a>
        </nav>

        <div className="header-actions">
          <label className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ürün ara..."
              aria-label="Ürün ara"
            />
          </label>

          <button className="cart-button" onClick={() => setCartOpen(true)}>
            Sepetim <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="wrap hero" id="top">
          <div className="hero-copy">
            <span className="eyebrow">Günlük yaşam için seçildi</span>
            <h1>
              İyi seçimler,
              <br />
              iyi hissettirir.
            </h1>
            <p>
              Yaşamına değer katan özenle seçilmiş ürünleri keşfet. Kaliteli alışveriş,
              şimdi çok daha kolay.
            </p>
            <a className="primary" href="#urunler">
              Alışverişe başla <span>→</span>
            </a>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
              alt="Öne çıkan ürün"
            />
            <div className="hero-tag">
              Haftanın favorisi
              <span>Yeni sezon ürünleri</span>
            </div>
          </div>
        </section>

        <section className="wrap benefits" aria-label="Alışveriş avantajları">
          <div className="benefit">
            <span className="benefit-icon">📦</span>
            <div>
              <strong>Hızlı teslimat</strong>
              <small>Özenle paketlenir, hızlıca gelir</small>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">↩️</span>
            <div>
              <strong>Kolay iade</strong>
              <small>14 gün içinde ücretsiz iade</small>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🔒</span>
            <div>
              <strong>Güvenli alışveriş</strong>
              <small>Bilgilerin güvende</small>
            </div>
          </div>
        </section>

        <section className="wrap" id="urunler">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Sana özel seçkiler</span>
              <h2>Popüler ürünler</h2>
            </div>
            <p>Sevilen ürünlere göz at, favorini bul.</p>
          </div>

          <div className="filters">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={category === activeCategory ? 'filter active' : 'filter'}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {visibleProducts.length ? (
              visibleProducts.map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    {product.badge ? <span className="badge">{product.badge}</span> : null}
                  </div>

                  <div className="product-info">
                    <span className="category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <div className="product-bottom">
                      <div className="price">
                        {formatMoney(product.price)}
                        {product.oldPrice ? (
                          <span className="old-price">{formatMoney(product.oldPrice)}</span>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        className="add-button"
                        aria-label={`${product.name} sepete ekle`}
                        onClick={() => addToCart(product.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty">Aramana uygun ürün bulunamadı. Başka bir kelime deneyebilirsin.</div>
            )}
          </div>
        </section>

        <section className="wrap promo" id="kampanya">
          <div>
            <h2>
              İlk alışverişine
              <br />
              küçük bir sürpriz ✨
            </h2>
            <p>Sepetinde NOVA10 koduyla %10 indirim fırsatı seni bekliyor.</p>
          </div>
          <a className="primary" href="#urunler">
            Ürünleri keşfet <span>→</span>
          </a>
        </section>

        <section className="wrap newsletter" id="hakkimizda">
          <h2>Nova'dan haberin olsun</h2>
          <p>Yeni ürünler ve özel fırsatlar için e-posta listemize katıl.</p>
          <form onSubmit={handleNewsletterSubmit}>
            <input type="email" placeholder="E-posta adresin" aria-label="E-posta adresin" required />
            <button type="submit">Bana haber ver</button>
          </form>
        </section>
      </main>

      <footer className="wrap footer">
        <div>© 2026 Nova Market. Keyifli alışverişler.</div>
        <div>
          <a href="#hakkimizda">Gizlilik</a>
          <a href="#hakkimizda">İade koşulları</a>
          <a href="mailto:merhaba@novamarket.example">İletişim</a>
        </div>
      </footer>

      <div className={cartOpen ? 'overlay open' : 'overlay'} onClick={() => setCartOpen(false)} />

      <aside className={cartOpen ? 'cart-panel open' : 'cart-panel'} aria-label="Alışveriş sepeti">
        <div className="cart-head">
          <h2>Alışveriş sepetin</h2>
          <button type="button" className="close-cart" onClick={() => setCartOpen(false)} aria-label="Sepeti kapat">
            ×
          </button>
        </div>

        {cartEntries.length === 0 ? (
          <div className="cart-empty">Sepetin şimdilik boş.<br />Beğendiğin ürünleri eklemeye ne dersin? 🛍️</div>
        ) : (
          <>
            <div className="cart-items">
              {cartEntries.map(([productId, quantity]) => {
                const product = products.find((item) => item.id === Number(productId));
                if (!product) return null;

                return (
                  <div key={productId} className="cart-item">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <strong>{product.name}</strong>
                      <small>{formatMoney(product.price)}</small>
                      <div className="qty">
                        <button type="button" onClick={() => updateQuantity(productId, -1)} aria-label="Adedi azalt">−</button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => updateQuantity(productId, 1)} aria-label="Adedi artır">+</button>
                      </div>
                    </div>
                    <button type="button" className="remove" onClick={() => removeFromCart(productId)}>
                      Sil
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <div className="subtotal">
                <span>Ara toplam</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <button type="button" className="primary" onClick={() => setToast('Demo mağaza: ödeme entegrasyonu henüz eklenmedi.') }>
                Alışverişi tamamla <span>→</span>
              </button>
              <p className="cart-note">Bu demo sürümünde gerçek ödeme alınmaz.</p>
            </div>
          </>
        )}
      </aside>

      {toast ? <div className="toast show">{toast}</div> : null}
    </>
  );
}
