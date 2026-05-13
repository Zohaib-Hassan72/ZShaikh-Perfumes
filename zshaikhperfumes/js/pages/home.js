const renderHome = () => {
    const products = getProducts();
    const catalogs = getCatalogs();
    const banner = getBanner();
    const getCat = (id) => catalogs.find(c => c.id === id)?.name || '';

    const cards = products.filter(p => p.featured !== false).map((p, i) => {
        const hasDiscount = p.discount && p.discount > 0;
        const finalPrice = hasDiscount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
        const img = (p.images && p.images[0]) || p.image || '';
        return `
        <div class="sq-card reveal reveal-delay-${(i % 3) + 1}">
            ${hasDiscount ? '<div class="sq-badge">-' + p.discount + '%</div>' : ''}
            <a href="#" class="sq-card-img" data-route="product" data-id="${p.id}">
                <img src="${img}" alt="${p.name}">
            </a>
            <div class="sq-card-body">
                <div class="sq-card-cat">${getCat(p.categoryId)}</div>
                <a href="#" class="sq-card-name" data-route="product" data-id="${p.id}">${p.name}</a>
                <div class="sq-card-price">
                    ${hasDiscount ? '<span class="price-old">Rs. ' + p.price.toLocaleString() + '</span>' : ''}
                    Rs. ${finalPrice.toLocaleString()}
                </div>
                <p class="sq-card-desc">${(p.description || '').substring(0, 80)}${(p.description || '').length > 80 ? '...' : ''}</p>
                <button class="sq-add-btn" onclick="alert('Added to cart!')">+ Add To Cart</button>
            </div>
        </div>`;
    }).join('');

    const bannerHtml = banner.enabled ? `
    <section class="promo-banner reveal" style="${banner.bgImage ? 'background-image:url(' + banner.bgImage + ');background-size:cover;background-position:center;' : ''}">
        <div class="promo-overlay"></div>
        <div class="container" style="position:relative;z-index:2;padding:5rem 2.5rem;">
            <div class="promo-content">
                <span class="section-label">${banner.title || 'Featured'}</span>
                <h2>${banner.subtitle || ''}</h2>
                ${banner.buttonText ? '<a href="#" class="btn btn-gold" onclick="event.preventDefault();document.getElementById(\'products-section\')?.scrollIntoView({behavior:\'smooth\'})">' + banner.buttonText + '</a>' : ''}
            </div>
        </div>
    </section>` : '';

    return `
    <section class="hero">
        <div class="hero-bg">
            <div class="hero-smoke"></div><div class="hero-smoke"></div><div class="hero-smoke"></div>
        </div>
        <div class="hero-content">
            <span class="section-label" style="animation:fadeSlideUp 0.8s ease forwards;">Premium Fragrances</span>
            <h1 style="animation:fadeSlideUp 0.8s 0.2s ease both;">Discover Your <em>Signature</em> Scent</h1>
            <p style="animation:fadeSlideUp 0.8s 0.4s ease both;">Handcrafted luxury perfumes that capture the essence of elegance. Each fragrance is a masterpiece.</p>
            <a href="#products-section" class="btn btn-gold" style="animation:fadeSlideUp 0.8s 0.6s ease both;" onclick="event.preventDefault(); document.getElementById('products-section').scrollIntoView({behavior:'smooth'})">
                Explore Collection
            </a>
        </div>
    </section>

    <!-- Scrolling Ticker -->
    <div class="ticker">
        <div class="ticker-track">
            <span>✦ PREMIUM QUALITY</span><span>✦ LONG LASTING</span><span>✦ HANDCRAFTED</span><span>✦ AUTHENTIC INGREDIENTS</span><span>✦ FREE SHIPPING</span><span>✦ NATIONWIDE DELIVERY</span>
            <span>✦ PREMIUM QUALITY</span><span>✦ LONG LASTING</span><span>✦ HANDCRAFTED</span><span>✦ AUTHENTIC INGREDIENTS</span><span>✦ FREE SHIPPING</span><span>✦ NATIONWIDE DELIVERY</span>
        </div>
    </div>

    ${bannerHtml}

    <section class="section" id="products-section">
        <div class="container">
            <div class="section-header reveal">
                <span class="section-label">The Collection</span>
                <h2>Featured Fragrances</h2>
                <p>Explore our curated selection of premium scents.</p>
            </div>
            <div class="sq-grid">
                ${cards || '<p style="text-align:center;color:var(--text-secondary);grid-column:1/-1;">No products yet.</p>'}
            </div>
        </div>
    </section>

    <!-- Why Choose Us -->
    <section class="section" style="border-top:1px solid var(--border);">
        <div class="container">
            <div class="section-header reveal">
                <span class="section-label">Why Z Shaikh</span>
                <h2>What Sets Us Apart</h2>
            </div>
            <div class="features-grid">
                <div class="feature-card reveal reveal-delay-1">
                    <span class="material-icons-outlined" style="font-size:2.5rem;color:var(--gold);margin-bottom:1rem;">science</span>
                    <h3>Premium Ingredients</h3>
                    <p>Sourced from the finest regions worldwide — Arabian Oud, French Lavender, Sicilian Citrus.</p>
                </div>
                <div class="feature-card reveal reveal-delay-2">
                    <span class="material-icons-outlined" style="font-size:2.5rem;color:var(--gold);margin-bottom:1rem;">schedule</span>
                    <h3>Long Lasting</h3>
                    <p>Our concentrated formulas provide 12+ hours of captivating fragrance from a single application.</p>
                </div>
                <div class="feature-card reveal reveal-delay-3">
                    <span class="material-icons-outlined" style="font-size:2.5rem;color:var(--gold);margin-bottom:1rem;">local_shipping</span>
                    <h3>Free Delivery</h3>
                    <p>Complimentary nationwide shipping across Pakistan on every order. No minimum required.</p>
                </div>
                <div class="feature-card reveal reveal-delay-1">
                    <span class="material-icons-outlined" style="font-size:2.5rem;color:var(--gold);margin-bottom:1rem;">verified</span>
                    <h3>100% Authentic</h3>
                    <p>Every bottle is quality-checked and sealed to guarantee authenticity and freshness.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="banner">
        <div class="container" style="display:flex;align-items:center;padding:4rem 2.5rem;">
            <div class="banner-content reveal">
                <span class="section-label">The Art of Perfumery</span>
                <h2>Crafted With Passion</h2>
                <p>Every bottle from Z Shaikh Perfumes is a journey through the world's most exotic ingredients.</p>
                <a href="#" class="btn btn-outline" data-route="about">Our Story</a>
            </div>
        </div>
    </section>

    ${renderFooter()}`;
};
