initStore();
const app = document.getElementById('app');

const renderHeaderBanner = () => {
    const h = getHeader();
    if (!h.enabled) return '';
    return `<div class="header-banner"><div class="header-banner-track"><span>${h.text}</span><span>${h.text}</span></div></div>`;
};

const renderNavbar = (currentRoute) => {
    const user = getUser();
    const cartCount = getCartCount();
    return `
    ${renderHeaderBanner()}
    <nav class="navbar">
        <div class="nav-inner">
            <a href="#" class="nav-logo" data-route="home">
                <img src="images/logo.png.png" alt="Z Shaikh Perfumes" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';">
                <span style="display:none;">Z Shaikh</span>
            </a>
            <div class="nav-menu">
                <a href="#" data-route="home" class="${currentRoute==='home'?'active':''}">Home</a>
                <a href="#" id="shop-now-link">Shop Now</a>
                <a href="#" data-route="about" class="${currentRoute==='about'?'active':''}">About</a>
                <a href="#" data-route="contact" class="${currentRoute==='contact'?'active':''}">Contact</a>
            </div>
            <div class="nav-right">
                <button id="nav-search-btn" class="nav-icon-btn"><span class="material-icons-outlined">search</span></button>
                <a href="#" data-route="login" class="nav-icon-btn" title="${user?user.name:'Login'}">
                    <span class="material-icons-outlined">${user?'person':'person_outline'}</span>
                </a>
                <a href="#" data-route="cart" class="nav-icon-btn cart-icon-wrap">
                    <span class="material-icons-outlined">shopping_bag</span>
                    ${cartCount>0?'<span class="cart-badge">'+cartCount+'</span>':''}
                </a>
            </div>
        </div>
        <div id="search-bar" class="search-bar" style="display:none;">
            <div class="container" style="display:flex;align-items:center;gap:1rem;padding:0.75rem 2.5rem;">
                <span class="material-icons-outlined" style="color:var(--text-secondary);">search</span>
                <input type="text" id="search-input" class="search-input" placeholder="Search fragrances...">
                <button id="search-close" style="background:none;color:var(--text-secondary);padding:0.3rem;"><span class="material-icons-outlined">close</span></button>
            </div>
            <div id="search-results" class="search-results container"></div>
        </div>
    </nav>`;
};

const renderFooter = () => `
    <footer class="footer"><div class="container">
        <div class="footer-grid">
            <div><div class="footer-brand">Z Shaikh Perfumes</div><p class="footer-desc">Handcrafted premium fragrances for the modern connoisseur.</p></div>
            <div><h4>Quick Links</h4><ul class="footer-links"><li><a href="#" data-route="home">Home</a></li><li><a href="#" data-route="about">About Us</a></li><li><a href="#" data-route="contact">Contact</a></li></ul></div>
            <div><h4>Collections</h4><ul class="footer-links"><li><a href="#">Oud Collection</a></li><li><a href="#">Floral Notes</a></li><li><a href="#">Citrus Fresh</a></li></ul></div>
            <div><h4>Contact</h4><ul class="footer-links"><li><a href="#">Karachi, Pakistan</a></li><li><a href="#">+92 300 1234567</a></li><li><a href="#">info@zshaikhperfumes.com</a></li></ul></div>
        </div>
        <div class="footer-bottom">&copy; ${new Date().getFullYear()} Z Shaikh Perfumes. All rights reserved.</div>
    </div></footer>`;

const renderApp = (route='home', param=null) => {
    // Dashboard is full-page standalone — no store navbar
    if (route === 'dashboard') {
        app.innerHTML = renderDashboard();
        return;
    }
    let html = '';
    if (route==='home') html=renderHome();
    else if (route==='about') html=renderAbout();
    else if (route==='contact') html=renderContact();
    else if (route==='product') html=renderProduct(param);
    else if (route==='cart') html=renderCart();
    else if (route==='checkout') html=renderCheckout();
    else if (route==='login') html=renderStoreLogin();
    app.innerHTML = renderNavbar(route) + html;
    attachNavEvents(); window.scrollTo(0,0); initScrollReveal();
};

const attachNavEvents = () => {
    document.querySelectorAll('a[data-route]').forEach(l=>l.addEventListener('click',e=>{
        e.preventDefault(); renderApp(e.currentTarget.getAttribute('data-route'),e.currentTarget.getAttribute('data-id'));
    }));
    document.getElementById('shop-now-link')?.addEventListener('click',e=>{
        e.preventDefault();
        const s=document.getElementById('products-section');
        if(s) s.scrollIntoView({behavior:'smooth'});
        else { renderApp('home'); setTimeout(()=>document.getElementById('products-section')?.scrollIntoView({behavior:'smooth'}),200); }
    });
    document.getElementById('nav-search-btn')?.addEventListener('click',()=>{
        const bar=document.getElementById('search-bar');
        bar.style.display=bar.style.display==='none'?'block':'none';
        if(bar.style.display==='block') document.getElementById('search-input').focus();
    });
    document.getElementById('search-close')?.addEventListener('click',()=>{document.getElementById('search-bar').style.display='none';document.getElementById('search-results').innerHTML='';});
    document.getElementById('search-input')?.addEventListener('input',e=>{
        const q=e.target.value.toLowerCase().trim();const r=document.getElementById('search-results');
        if(q.length<2){r.innerHTML='';return;}
        const ps=getProducts().filter(p=>p.name.toLowerCase().includes(q)||(p.description||'').toLowerCase().includes(q)||(p.notes||'').toLowerCase().includes(q));
        if(!ps.length){r.innerHTML='<div class="search-empty">No results found</div>';return;}
        r.innerHTML=ps.map(p=>{const img=(p.images&&p.images[0])||'';
            return `<a href="#" class="search-item" data-route="product" data-id="${p.id}"><img src="${img}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;"><div><div style="font-weight:500;">${p.name}</div><div style="font-size:0.8rem;color:var(--text-secondary);">Rs. ${p.price.toLocaleString()}</div></div></a>`;
        }).join('');
        r.querySelectorAll('a[data-route]').forEach(l=>l.addEventListener('click',e=>{e.preventDefault();document.getElementById('search-bar').style.display='none';renderApp('product',e.currentTarget.getAttribute('data-id'));}));
    });
};

const initScrollReveal = () => {
    const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:0.1});
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
};

// Global helper for adding to cart from anywhere
window.addItemToCart = (id, qty) => { addToCart(id, qty||1); renderApp('cart'); };

window.addEventListener('routeChange',e=>{
    if(typeof e.detail==='string') renderApp(e.detail);
    else if(e.detail?.path) renderApp(e.detail.path,e.detail.id);
});

const checkHash=()=>{if(window.location.hash==='#admin')renderApp('dashboard');else renderApp('home');};
window.addEventListener('hashchange',checkHash); checkHash();
