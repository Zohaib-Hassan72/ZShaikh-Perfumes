const STORAGE_KEYS = { PRODUCTS:'zshaikh_products', CATALOGS:'zshaikh_catalogs', BANNER:'zshaikh_banner', CART:'zshaikh_cart', USER:'zshaikh_user', HEADER:'zshaikh_header' };

const defaultCatalogs = [
    { id:'cat-1', name:'Oud Collection', description:'Rich and woody fragrances.' },
    { id:'cat-2', name:'Floral Notes', description:'Light, blooming scents.' },
    { id:'cat-3', name:'Citrus Fresh', description:'Invigorating and crisp.' }
];

const defaultProducts = [
    { id:'prod-1', name:'Royal Midnight Oud', price:12000, discount:0, categoryId:'cat-1',
      description:'A luxurious blend of dark oud, amber, and subtle spices. This premium fragrance opens with warm saffron and deepens into a rich base of sandalwood and musk.',
      images:['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80'],
      stock:25, size:'100ml', featured:true, notes:'Oud, Amber, Saffron, Sandalwood',
      reviews:[{name:'Ahmed K.',rating:5,text:'Absolutely stunning fragrance. Lasts all day!',date:'2025-04-12'},{name:'Sara M.',rating:4,text:'Beautiful oud scent, very premium quality.',date:'2025-03-20'}],
      faqs:[{q:'How long does the scent last?',a:'Our Oud fragrances are highly concentrated and last 12-14 hours.'},{q:'Is this suitable for daily wear?',a:'Yes, while rich, it is versatile enough for daily and evening wear.'}]
    },
    { id:'prod-2', name:'Velvet Rose', price:8500, discount:10, categoryId:'cat-2',
      description:'A delicate and romantic rose fragrance with hints of vanilla. The perfect balance of floral elegance and warm sweetness that lingers beautifully.',
      images:['https://images.unsplash.com/photo-1595535373192-fc89b0ba4b30?w=800&q=80'],
      stock:40, size:'50ml', featured:true, notes:'Rose, Vanilla, Jasmine, Musk',
      reviews:[{name:'Fatima R.',rating:5,text:'My absolute favorite! So elegant and feminine.',date:'2025-04-05'}],
      faqs:[{q:'Is this a unisex fragrance?',a:'While designed with feminine notes, many find it beautifully unisex.'}]
    },
    { id:'prod-3', name:'Sicilian Bergamot', price:9500, discount:0, categoryId:'cat-3',
      description:'Fresh and energetic citrus blend perfect for summer days. A vibrant opening of bergamot transitions into a clean, woody dry-down.',
      images:['https://images.unsplash.com/photo-1594034183956-62021d746815?w=800&q=80'],
      stock:18, size:'100ml', featured:true, notes:'Bergamot, Lemon, Cedar, Vetiver',
      reviews:[{name:'Ali H.',rating:5,text:'Perfect summer fragrance, so refreshing!',date:'2025-03-15'}],
      faqs:[{q:'Best season to wear this?',a:'Ideal for spring and summer, but works year-round.'}]
    }
];

const defaultBanner = { title:'New Arrivals', subtitle:'Discover our latest collection of premium fragrances.', buttonText:'Shop Now', bgImage:'', enabled:true };
const defaultHeader = { text:'FREE SHIPPING ON ALL ORDERS • USE CODE ZSHAIKH10 FOR 10% OFF', enabled:true };

const initStore = () => {
    if (!localStorage.getItem(STORAGE_KEYS.CATALOGS)) localStorage.setItem(STORAGE_KEYS.CATALOGS, JSON.stringify(defaultCatalogs));
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
    if (!localStorage.getItem(STORAGE_KEYS.BANNER)) localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(defaultBanner));
    if (!localStorage.getItem(STORAGE_KEYS.HEADER)) localStorage.setItem(STORAGE_KEYS.HEADER, JSON.stringify(defaultHeader));
};

const getCatalogs = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.CATALOGS)||'[]');
const addCatalog = (c) => { const a=getCatalogs(); c.id='cat-'+Date.now(); a.push(c); localStorage.setItem(STORAGE_KEYS.CATALOGS,JSON.stringify(a)); };
const deleteCatalog = (id) => localStorage.setItem(STORAGE_KEYS.CATALOGS,JSON.stringify(getCatalogs().filter(c=>c.id!==id)));

const getProducts = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)||'[]');
const getProductById = (id) => getProducts().find(p=>p.id===id);
const addProduct = (p) => { const a=getProducts(); p.id='prod-'+Date.now(); if(!p.reviews) p.reviews=[]; if(!p.faqs) p.faqs=[]; a.push(p); localStorage.setItem(STORAGE_KEYS.PRODUCTS,JSON.stringify(a)); };
const updateProduct = (id,d) => localStorage.setItem(STORAGE_KEYS.PRODUCTS,JSON.stringify(getProducts().map(p=>p.id===id?{...p,...d}:p)));
const deleteProduct = (id) => localStorage.setItem(STORAGE_KEYS.PRODUCTS,JSON.stringify(getProducts().filter(p=>p.id!==id)));
const addReview = (productId, review) => { const p = getProductById(productId); if(p){ const reviews = p.reviews||[]; reviews.push(review); updateProduct(productId, {reviews}); } };

const getBanner = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.BANNER)||'{}');
const updateBanner = (d) => localStorage.setItem(STORAGE_KEYS.BANNER,JSON.stringify({...getBanner(),...d}));
const getHeader = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.HEADER)||'{}');
const updateHeader = (d) => localStorage.setItem(STORAGE_KEYS.HEADER,JSON.stringify({...getHeader(),...d}));

// Cart
const getCart = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)||'[]');
const addToCart = (productId, qty=1) => {
    const cart = getCart(); const idx = cart.findIndex(c=>c.id===productId);
    if(idx>=0) cart[idx].qty += qty; else cart.push({id:productId, qty});
    localStorage.setItem(STORAGE_KEYS.CART,JSON.stringify(cart)); return cart;
};
const updateCartQty = (productId, qty) => {
    let cart = getCart();
    if(qty<=0) cart = cart.filter(c=>c.id!==productId);
    else cart = cart.map(c=>c.id===productId?{...c,qty}:c);
    localStorage.setItem(STORAGE_KEYS.CART,JSON.stringify(cart)); return cart;
};
const clearCart = () => localStorage.setItem(STORAGE_KEYS.CART,'[]');
const getCartCount = () => getCart().reduce((s,c)=>s+c.qty,0);

// User
const getUser = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)||'null');
const loginUser = (name, email) => { localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({name,email})); };
const logoutUser = () => localStorage.removeItem(STORAGE_KEYS.USER);
