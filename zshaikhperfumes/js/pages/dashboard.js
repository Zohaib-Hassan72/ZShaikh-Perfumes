// ============================================================
//  DASHBOARD.JS  — Z Shaikh Perfumes Admin Panel
//  Uses functions from dataStore.js
// ============================================================

// Extra helpers not in dataStore.js
const getOrders          = () => JSON.parse(localStorage.getItem('zshaikh_orders')  || '[]');
const saveOrders         = (v) => localStorage.setItem('zshaikh_orders',  JSON.stringify(v));
const getSocial          = () => JSON.parse(localStorage.getItem('zshaikh_social')  || '{}');
const saveSocial         = (v) => localStorage.setItem('zshaikh_social',  JSON.stringify(v));
const getContact         = () => JSON.parse(localStorage.getItem('zshaikh_contact') || '{}');
const saveContact        = (v) => localStorage.setItem('zshaikh_contact', JSON.stringify(v));
const updateSocial       = (data) => saveSocial(data);
const updateContact      = (data) => saveContact(data);
const deleteOrder        = (id) => saveOrders(getOrders().filter(o => o.id !== id));
const updateOrderStatus  = (id, status) => saveOrders(getOrders().map(o => o.id === id ? { ...o, status } : o));
const reloadDashboard    = () => window.dispatchEvent(new CustomEvent('routeChange', { detail: 'dashboard' }));

const renderDashboard = () => {
    const isAuth = sessionStorage.getItem('zshaikh_admin_auth') === 'true';
    setTimeout(() => { isAuth ? attachDashboardEvents() : attachAdminLoginEvents(); }, 80);
    if (!isAuth) return renderAdminLoginPage();
    return renderAdminShell();
};

// ─── Login ───────────────────────────────────────────────────
const renderAdminLoginPage = () => `
<div class="db-login-bg">
    <div class="db-login-card">
        <div class="db-login-logo">
            <span class="material-icons-outlined" style="font-size:2rem;color:#c8a96e;">lock</span>
        </div>
        <h2 class="db-login-title">Admin Access</h2>
        <p class="db-login-sub">Enter your password to continue</p>
        <div id="login-error" class="db-alert db-alert-error" style="display:none;">Incorrect password. Try again.</div>
        <div class="db-form-group">
            <label class="db-label">Password</label>
            <input type="password" id="admin-password" class="db-input" placeholder="••••••••">
        </div>
        <button id="btn-login" class="db-btn db-btn-primary" style="width:100%;margin-top:0.5rem;">Login</button>
    </div>
</div>`;

const attachAdminLoginEvents = () => {
    const doLogin = () => {
        const pw = document.getElementById('admin-password')?.value;
        if (pw === 'admin123') {
            sessionStorage.setItem('zshaikh_admin_auth', 'true');
            reloadDashboard();
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    };
    document.getElementById('btn-login')?.addEventListener('click', doLogin);
    document.getElementById('admin-password')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doLogin();
    });
};

// ─── Admin Shell ─────────────────────────────────────────────
const renderAdminShell = () => {
    const catalogs = getCatalogs();
    const products = getProducts();
    const orders   = getOrders();
    const banner   = getBanner();
    const social   = getSocial();
    const contact  = getContact();

    return `
<style>
/* ── Reset & Base ── */
.db-wrap *{box-sizing:border-box;margin:0;padding:0;}
.db-wrap{display:flex;min-height:100vh;background:#f4f1ee;font-family:'Cormorant Garamond',Georgia,serif;}

/* ── Sidebar ── */
.db-sidebar{
    width:220px;min-height:100vh;background:#1a1410;
    display:flex;flex-direction:column;padding:1.5rem 0;
    position:sticky;top:0;align-self:flex-start;
    flex-shrink:0;
}
.db-sidebar-logo{
    padding:0 1.25rem 1.5rem;
    border-bottom:1px solid #2e2318;
    font-family:'Cormorant Garamond',serif;
    font-size:1.15rem;font-weight:700;
    color:#c8a96e;letter-spacing:0.05em;
    display:flex;align-items:center;gap:0.5rem;
}
.db-nav{list-style:none;padding:1rem 0;flex:1;}
.db-nav li a{
    display:flex;align-items:center;gap:0.6rem;
    padding:0.65rem 1.25rem;font-size:0.85rem;
    color:#9e8c78;text-decoration:none;
    transition:all 0.15s;font-family:'Cormorant Garamond',serif;
    font-weight:600;letter-spacing:0.03em;
    border-left:3px solid transparent;
}
.db-nav li a:hover{color:#c8a96e;background:#221c14;}
.db-nav li a.active{color:#c8a96e;background:#221c14;border-left-color:#c8a96e;}
.db-nav li a .material-icons-outlined{font-size:1.1rem;}
.db-nav-divider{height:1px;background:#2e2318;margin:0.75rem 1.25rem;}
.db-nav-label{
    padding:0.4rem 1.25rem;font-size:0.65rem;
    color:#5a4e3e;text-transform:uppercase;
    letter-spacing:0.1em;font-weight:700;
}

/* ── Main ── */
.db-main{flex:1;padding:2rem;min-width:0;}
.db-topbar{
    display:flex;align-items:center;justify-content:space-between;
    margin-bottom:2rem;
}
.db-topbar-title{
    font-size:1.5rem;font-weight:700;color:#1a1410;
    font-family:'Cormorant Garamond',serif;letter-spacing:0.02em;
}
.db-topbar-badge{
    font-size:0.7rem;background:#c8a96e;color:#1a1410;
    padding:0.2rem 0.6rem;border-radius:20px;font-weight:700;
    margin-left:0.5rem;font-family:sans-serif;
}

/* ── Stats Bar ── */
.db-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem;}
.db-stat{
    background:#fff;border-radius:10px;padding:1.25rem 1.5rem;
    border:1px solid #e8e0d8;
}
.db-stat-val{font-size:1.8rem;font-weight:700;color:#1a1410;font-family:'Cormorant Garamond',serif;}
.db-stat-label{font-size:0.72rem;color:#9e8c78;text-transform:uppercase;letter-spacing:0.08em;margin-top:0.2rem;font-family:sans-serif;}
.db-stat-icon{font-size:1.4rem;color:#c8a96e;margin-bottom:0.5rem;}

/* ── Cards ── */
.db-card{
    background:#fff;border-radius:12px;padding:1.5rem;
    border:1px solid #e8e0d8;margin-bottom:1.5rem;
}
.db-card-header{
    display:flex;align-items:center;justify-content:space-between;
    margin-bottom:1.25rem;padding-bottom:1rem;
    border-bottom:1px solid #f0ebe4;
}
.db-card-title{
    font-size:1rem;font-weight:700;color:#1a1410;
    font-family:'Cormorant Garamond',serif;
}

/* ── Buttons ── */
.db-btn{
    display:inline-flex;align-items:center;gap:0.4rem;
    padding:0.55rem 1.1rem;border-radius:7px;font-size:0.78rem;
    font-weight:700;letter-spacing:0.04em;cursor:pointer;
    border:none;transition:all 0.15s;font-family:sans-serif;
}
.db-btn-primary{background:#c8a96e;color:#1a1410;}
.db-btn-primary:hover{background:#b8956a;}
.db-btn-outline{background:transparent;border:1.5px solid #c8a96e;color:#c8a96e;}
.db-btn-outline:hover{background:#fdf8f0;}
.db-btn-ghost{background:transparent;border:1.5px solid #e8e0d8;color:#9e8c78;}
.db-btn-ghost:hover{border-color:#c8a96e;color:#c8a96e;}
.db-btn-danger{background:#fef2f2;border:1.5px solid #fca5a5;color:#dc2626;}
.db-btn-danger:hover{background:#fee2e2;}
.db-btn-sm{padding:0.3rem 0.65rem;font-size:0.7rem;}
.db-btn-icon{padding:0.35rem;border-radius:6px;}

/* ── Forms ── */
.db-form-group{margin-bottom:1rem;}
.db-label{display:block;font-size:0.75rem;font-weight:700;color:#5a4e3e;margin-bottom:0.35rem;letter-spacing:0.04em;text-transform:uppercase;font-family:sans-serif;}
.db-input,.db-select,.db-textarea{
    width:100%;padding:0.6rem 0.85rem;border:1.5px solid #e8e0d8;
    border-radius:7px;font-size:0.87rem;color:#1a1410;
    background:#fff;transition:border-color 0.15s;
    font-family:'Cormorant Garamond',serif;
}
.db-input:focus,.db-select:focus,.db-textarea:focus{outline:none;border-color:#c8a96e;}
.db-textarea{resize:vertical;min-height:80px;}
.db-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
.db-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;}

/* ── Table ── */
.db-table-wrap{overflow-x:auto;}
.db-table{width:100%;border-collapse:collapse;font-size:0.83rem;}
.db-table th{
    text-align:left;padding:0.6rem 0.85rem;
    background:#faf7f4;color:#9e8c78;
    font-size:0.68rem;text-transform:uppercase;
    letter-spacing:0.07em;font-weight:700;
    border-bottom:1px solid #e8e0d8;font-family:sans-serif;
}
.db-table td{
    padding:0.75rem 0.85rem;border-bottom:1px solid #f4f1ee;
    color:#1a1410;vertical-align:middle;
}
.db-table tr:last-child td{border-bottom:none;}
.db-table tr:hover td{background:#fdfaf7;}
.db-table-thumb{width:38px;height:38px;object-fit:cover;border-radius:6px;border:1px solid #e8e0d8;}
.db-empty{text-align:center;padding:2.5rem;color:#9e8c78;font-size:0.85rem;}

/* ── Badges ── */
.db-badge{display:inline-block;padding:0.18rem 0.55rem;border-radius:20px;font-size:0.68rem;font-weight:700;letter-spacing:0.04em;font-family:sans-serif;}
.db-badge-green{background:#d1fae5;color:#065f46;}
.db-badge-yellow{background:#fef9c3;color:#854d0e;}
.db-badge-red{background:#fee2e2;color:#991b1b;}
.db-badge-blue{background:#dbeafe;color:#1e40af;}
.db-badge-gray{background:#f3f4f6;color:#6b7280;}

/* ── Image Drop Zone ── */
.db-drop-zone{
    border:2px dashed #e8e0d8;border-radius:8px;
    padding:1.5rem;text-align:center;cursor:pointer;
    transition:border-color 0.15s;background:#fdfaf7;
}
.db-drop-zone:hover{border-color:#c8a96e;}
.db-drop-zone.dragover{border-color:#c8a96e;background:#fdf6ea;}
.db-img-previews{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.75rem;}
.db-img-thumb{position:relative;width:72px;height:72px;}
.db-img-thumb img{width:100%;height:100%;object-fit:cover;border-radius:6px;border:1px solid #e8e0d8;}
.db-img-thumb-remove{
    position:absolute;top:-5px;right:-5px;
    width:18px;height:18px;border-radius:50%;
    background:#dc2626;color:#fff;border:none;
    font-size:11px;cursor:pointer;display:flex;
    align-items:center;justify-content:center;line-height:1;
}

/* ── Alerts ── */
.db-alert{padding:0.7rem 1rem;border-radius:7px;font-size:0.82rem;margin-bottom:1rem;font-family:sans-serif;}
.db-alert-error{background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;}
.db-alert-success{background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;}

/* ── Tabs ── */
.db-view{display:none;}
.db-view.active{display:block;}

/* ── Product form panel ── */
.db-form-panel{
    background:#faf7f4;border:1.5px solid #e8e0d8;
    border-radius:10px;padding:1.5rem;margin-bottom:1.5rem;
    display:none;
}
.db-form-panel.open{display:block;}

/* ── Checkbox toggle ── */
.db-toggle-wrap{display:flex;align-items:center;gap:0.6rem;cursor:pointer;font-size:0.87rem;color:#1a1410;}
.db-toggle-wrap input{accent-color:#c8a96e;width:16px;height:16px;}

/* ── Login page ── */
.db-login-bg{
    min-height:100vh;display:flex;align-items:center;
    justify-content:center;background:#1a1410;
}
.db-login-card{
    background:#fff;border-radius:16px;padding:2.5rem;
    width:100%;max-width:380px;
}
.db-login-logo{text-align:center;margin-bottom:0.5rem;}
.db-login-title{text-align:center;font-size:1.5rem;font-weight:700;color:#1a1410;font-family:'Cormorant Garamond',serif;margin-bottom:0.25rem;}
.db-login-sub{text-align:center;font-size:0.82rem;color:#9e8c78;margin-bottom:1.5rem;font-family:sans-serif;}

/* ── Responsive ── */
@media(max-width:900px){
    .db-sidebar{width:180px;}
    .db-stats{grid-template-columns:1fr 1fr;}
}
@media(max-width:650px){
    .db-wrap{flex-direction:column;}
    .db-sidebar{width:100%;min-height:auto;flex-direction:row;padding:0.5rem;}
    .db-sidebar-logo{display:none;}
    .db-nav{display:flex;padding:0;overflow-x:auto;}
    .db-nav li a{padding:0.6rem 0.75rem;font-size:0.75rem;border-left:none;border-bottom:3px solid transparent;}
    .db-nav li a.active{border-bottom-color:#c8a96e;border-left-color:transparent;}
    .db-stats{grid-template-columns:1fr 1fr;}
    .db-grid-2,.db-grid-3{grid-template-columns:1fr;}
}
</style>

<div class="db-wrap">
    <!-- SIDEBAR -->
    <aside class="db-sidebar">
        <div class="db-sidebar-logo">
            <span class="material-icons-outlined" style="font-size:1.2rem;">auto_awesome</span>
            Z. Shaikh Admin
        </div>
        <ul class="db-nav">
            <li class="db-nav-label">Store</li>
            <li><a href="#" id="tab-products" class="active">
                <span class="material-icons-outlined">inventory_2</span> Products
            </a></li>
            <li><a href="#" id="tab-catalogs">
                <span class="material-icons-outlined">category</span> Catalogs
            </a></li>
            <li><a href="#" id="tab-orders">
                <span class="material-icons-outlined">receipt_long</span> Orders
                ${orders.length ? `<span class="db-topbar-badge">${orders.length}</span>` : ''}
            </a></li>
            <div class="db-nav-divider"></div>
            <li class="db-nav-label">Appearance</li>
            <li><a href="#" id="tab-banner">
                <span class="material-icons-outlined">photo</span> Banner
            </a></li>
            <div class="db-nav-divider"></div>
            <li class="db-nav-label">Business</li>
            <li><a href="#" id="tab-social">
                <span class="material-icons-outlined">share</span> Social Links
            </a></li>
            <li><a href="#" id="tab-contact">
                <span class="material-icons-outlined">contacts</span> Contact Info
            </a></li>
            <div class="db-nav-divider"></div>
            <li><a href="#" id="btn-back-store">
                <span class="material-icons-outlined">storefront</span> View Store
            </a></li>
            <li><a href="#" id="btn-logout" style="color:#f87171;">
                <span class="material-icons-outlined">logout</span> Logout
            </a></li>
        </ul>
    </aside>

    <!-- MAIN -->
    <main class="db-main">
        <div class="db-topbar">
            <div>
                <span class="db-topbar-title">Dashboard</span>
            </div>
            <div style="font-size:0.75rem;color:#9e8c78;font-family:sans-serif;">
                ${new Date().toLocaleDateString('en-PK',{weekday:'short',year:'numeric',month:'short',day:'numeric'})}
            </div>
        </div>

        <!-- STATS -->
        <div class="db-stats">
            <div class="db-stat">
                <div class="db-stat-icon"><span class="material-icons-outlined">inventory_2</span></div>
                <div class="db-stat-val">${products.length}</div>
                <div class="db-stat-label">Total Products</div>
            </div>
            <div class="db-stat">
                <div class="db-stat-icon"><span class="material-icons-outlined">category</span></div>
                <div class="db-stat-val">${catalogs.length}</div>
                <div class="db-stat-label">Catalogs</div>
            </div>
            <div class="db-stat">
                <div class="db-stat-icon"><span class="material-icons-outlined">receipt_long</span></div>
                <div class="db-stat-val">${orders.length}</div>
                <div class="db-stat-label">Orders</div>
            </div>
            <div class="db-stat">
                <div class="db-stat-icon"><span class="material-icons-outlined">paid</span></div>
                <div class="db-stat-val">
                    Rs. ${orders.reduce((s,o) => s + (o.total||0), 0).toLocaleString()}
                </div>
                <div class="db-stat-label">Total Revenue</div>
            </div>
        </div>

        <!-- ── PRODUCTS TAB ── -->
        <div id="view-products" class="db-view active">
            <div class="db-card">
                <div class="db-card-header">
                    <span class="db-card-title">Products (${products.length})</span>
                    <button class="db-btn db-btn-primary" id="btn-add-product">
                        <span class="material-icons-outlined" style="font-size:1rem;">add</span> Add Product
                    </button>
                </div>

                <!-- Product Form -->
                <div id="product-form-panel" class="db-form-panel">
                    <h4 id="prod-form-title" style="font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:700;color:#1a1410;margin-bottom:1.25rem;"></h4>
                    <div id="prod-alert" class="db-alert db-alert-success" style="display:none;">Product saved successfully.</div>

                    <input type="hidden" id="prod-id">

                    <div class="db-grid-2">
                        <div class="db-form-group">
                            <label class="db-label">Product Name *</label>
                            <input type="text" id="prod-name" class="db-input" placeholder="e.g. Oud Al Layl">
                        </div>
                        <div class="db-form-group">
                            <label class="db-label">Price (Rs.) *</label>
                            <input type="number" id="prod-price" class="db-input" placeholder="0" min="0">
                        </div>
                    </div>
                    <div class="db-grid-3">
                        <div class="db-form-group">
                            <label class="db-label">Discount (%)</label>
                            <input type="number" id="prod-discount" class="db-input" value="0" min="0" max="100">
                        </div>
                        <div class="db-form-group">
                            <label class="db-label">Size</label>
                            <input type="text" id="prod-size" class="db-input" placeholder="e.g. 100ml">
                        </div>
                        <div class="db-form-group">
                            <label class="db-label">Stock Qty</label>
                            <input type="number" id="prod-stock" class="db-input" value="0" min="0">
                        </div>
                    </div>
                    <div class="db-form-group">
                        <label class="db-label">Category *</label>
                        <select id="prod-category" class="db-select">
                            <option value="" disabled selected>Select category…</option>
                            ${catalogs.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="db-form-group">
                        <label class="db-label">Product Images</label>
                        <div id="prod-images-drop" class="db-drop-zone">
                            <span class="material-icons-outlined" style="font-size:2rem;color:#c8a96e;">cloud_upload</span>
                            <div style="font-size:0.8rem;color:#9e8c78;margin-top:0.25rem;font-family:sans-serif;">Click or drag images here (multiple)</div>
                            <input type="file" id="prod-images-file" accept="image/*" multiple style="display:none;">
                        </div>
                        <div id="prod-images-previews" class="db-img-previews"></div>
                    </div>
                    <div class="db-form-group">
                        <label class="db-label">Scent Notes (comma separated)</label>
                        <input type="text" id="prod-notes" class="db-input" placeholder="e.g. Oud, Amber, Musk">
                    </div>
                    <div class="db-form-group">
                        <label class="db-label">Description</label>
                        <textarea id="prod-desc" class="db-textarea" rows="3"></textarea>
                    </div>
                    <div class="db-form-group">
                        <label class="db-toggle-wrap">
                            <input type="checkbox" id="prod-featured" checked>
                            Show as Featured on Home
                        </label>
                    </div>
                    <div style="display:flex;gap:0.75rem;justify-content:flex-end;margin-top:0.5rem;">
                        <button class="db-btn db-btn-ghost" id="btn-cancel-product">Cancel</button>
                        <button class="db-btn db-btn-primary" id="btn-save-product">
                            <span class="material-icons-outlined" style="font-size:1rem;">save</span> Save Product
                        </button>
                    </div>
                </div>

                <!-- Products Table -->
                <div class="db-table-wrap">
                    <table class="db-table">
                        <thead>
                            <tr>
                                <th>Product</th><th>Price</th><th>Discount</th>
                                <th>Size</th><th>Stock</th><th>Category</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${products.length ? products.map(p => `
                            <tr>
                                <td>
                                    <div style="display:flex;align-items:center;gap:0.65rem;">
                                        ${(p.images&&p.images[0])||p.image ? `<img src="${(p.images&&p.images[0])||p.image}" class="db-table-thumb" alt="">` : `<div class="db-table-thumb" style="background:#f4f1ee;display:flex;align-items:center;justify-content:center;"><span class="material-icons-outlined" style="font-size:1rem;color:#c9cccf;">image</span></div>`}
                                        <span style="font-weight:600;">${p.name}</span>
                                    </div>
                                </td>
                                <td>Rs. ${p.price.toLocaleString()}</td>
                                <td>${p.discount ? `<span class="db-badge db-badge-yellow">${p.discount}%</span>` : '-'}</td>
                                <td>${p.size || '-'}</td>
                                <td>
                                    ${p.stock > 0
                                        ? `<span class="db-badge db-badge-green">${p.stock}</span>`
                                        : `<span class="db-badge db-badge-red">Out</span>`}
                                </td>
                                <td>${catalogs.find(c=>c.id===p.categoryId)?.name || '-'}</td>
                                <td>
                                    <div style="display:flex;gap:0.4rem;">
                                        <button class="db-btn db-btn-ghost db-btn-sm db-btn-icon edit-prod-btn" data-id="${p.id}" title="Edit">
                                            <span class="material-icons-outlined" style="font-size:1rem;">edit</span>
                                        </button>
                                        <button class="db-btn db-btn-danger db-btn-sm db-btn-icon del-prod-btn" data-id="${p.id}" title="Delete">
                                            <span class="material-icons-outlined" style="font-size:1rem;">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>`).join('')
                        : `<tr><td colspan="7" class="db-empty">No products yet. Click "Add Product" to get started.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- ── CATALOGS TAB ── -->
        <div id="view-catalogs" class="db-view">
            <div class="db-card">
                <div class="db-card-header">
                    <span class="db-card-title">Add New Catalog</span>
                </div>
                <div id="cat-alert" class="db-alert db-alert-success" style="display:none;">Catalog added.</div>
                <div class="db-grid-2">
                    <div class="db-form-group">
                        <label class="db-label">Catalog Name *</label>
                        <input type="text" id="cat-name" class="db-input" placeholder="e.g. Oud Collection">
                    </div>
                    <div class="db-form-group">
                        <label class="db-label">Description</label>
                        <input type="text" id="cat-desc" class="db-input" placeholder="Short description…">
                    </div>
                </div>
                <button class="db-btn db-btn-primary" id="btn-add-catalog">
                    <span class="material-icons-outlined" style="font-size:1rem;">add</span> Add Catalog
                </button>
            </div>

            <div class="db-card">
                <div class="db-card-header">
                    <span class="db-card-title">All Catalogs (${catalogs.length})</span>
                </div>
                <div class="db-table-wrap">
                    <table class="db-table">
                        <thead><tr><th>Name</th><th>Description</th><th>Products</th><th>Actions</th></tr></thead>
                        <tbody>
                        ${catalogs.length ? catalogs.map(c => `
                            <tr>
                                <td style="font-weight:600;">${c.name}</td>
                                <td>${c.description || '-'}</td>
                                <td><span class="db-badge db-badge-blue">${products.filter(p=>p.categoryId===c.id).length}</span></td>
                                <td>
                                    <button class="db-btn db-btn-danger db-btn-sm del-cat-btn" data-id="${c.id}">
                                        <span class="material-icons-outlined" style="font-size:1rem;">delete</span> Delete
                                    </button>
                                </td>
                            </tr>`).join('')
                        : `<tr><td colspan="4" class="db-empty">No catalogs yet.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- ── ORDERS TAB ── -->
        <div id="view-orders" class="db-view">
            <div class="db-card">
                <div class="db-card-header">
                    <span class="db-card-title">Orders (${orders.length})</span>
                </div>
                <div class="db-table-wrap">
                    <table class="db-table">
                        <thead>
                            <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                        ${orders.length ? orders.map(o => `
                            <tr>
                                <td style="font-family:monospace;font-size:0.75rem;">#${o.id?.slice(-6).toUpperCase()}</td>
                                <td>
                                    <div style="font-weight:600;">${o.customerName || '-'}</div>
                                    <div style="font-size:0.72rem;color:#9e8c78;">${o.customerPhone || ''}</div>
                                </td>
                                <td>${(o.items||[]).length} item(s)</td>
                                <td style="font-weight:600;">Rs. ${(o.total||0).toLocaleString()}</td>
                                <td>
                                    <select class="db-select order-status-select" data-id="${o.id}" style="padding:0.25rem 0.5rem;font-size:0.75rem;width:auto;">
                                        <option value="pending"   ${o.status==='pending'   ?'selected':''}>Pending</option>
                                        <option value="confirmed" ${o.status==='confirmed' ?'selected':''}>Confirmed</option>
                                        <option value="shipped"   ${o.status==='shipped'   ?'selected':''}>Shipped</option>
                                        <option value="delivered" ${o.status==='delivered' ?'selected':''}>Delivered</option>
                                        <option value="cancelled" ${o.status==='cancelled' ?'selected':''}>Cancelled</option>
                                    </select>
                                </td>
                                <td style="font-size:0.75rem;color:#9e8c78;">${o.date ? new Date(o.date).toLocaleDateString() : '-'}</td>
                                <td>
                                    <button class="db-btn db-btn-danger db-btn-sm db-btn-icon del-order-btn" data-id="${o.id}" title="Delete">
                                        <span class="material-icons-outlined" style="font-size:1rem;">delete</span>
                                    </button>
                                </td>
                            </tr>`).join('')
                        : `<tr><td colspan="7" class="db-empty">No orders yet.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- ── BANNER TAB ── -->
        <div id="view-banner" class="db-view">
            <div class="db-card">
                <div class="db-card-header">
                    <span class="db-card-title">Home Page Banner</span>
                </div>
                <div id="banner-alert" class="db-alert db-alert-success" style="display:none;">Banner saved!</div>
                <div class="db-form-group">
                    <label class="db-toggle-wrap">
                        <input type="checkbox" id="banner-enabled" ${banner.enabled ? 'checked' : ''}>
                        Enable Banner
                    </label>
                </div>
                <div class="db-grid-2">
                    <div class="db-form-group">
                        <label class="db-label">Banner Title</label>
                        <input type="text" id="banner-title" class="db-input" value="${banner.title || ''}">
                    </div>
                    <div class="db-form-group">
                        <label class="db-label">Subtitle</label>
                        <input type="text" id="banner-subtitle" class="db-input" value="${banner.subtitle || ''}">
                    </div>
                </div>
                <div class="db-form-group">
                    <label class="db-label">Button Text</label>
                    <input type="text" id="banner-btn-text" class="db-input" value="${banner.buttonText || ''}" style="max-width:280px;">
                </div>
                <div class="db-form-group">
                    <label class="db-label">Background Image</label>
                    <input type="hidden" id="banner-bg" value="${banner.bgImage || ''}">
                    <div id="banner-img-drop" class="db-drop-zone" style="max-width:400px;">
                        ${banner.bgImage
                            ? `<img src="${banner.bgImage}" style="max-height:140px;border-radius:6px;max-width:100%;">`
                            : `<span class="material-icons-outlined" style="font-size:2rem;color:#c8a96e;">cloud_upload</span>
                               <div style="font-size:0.8rem;color:#9e8c78;margin-top:0.25rem;font-family:sans-serif;">Click or drag image here</div>`}
                        <input type="file" id="banner-img-file" accept="image/*" style="display:none;">
                    </div>
                </div>
                <button class="db-btn db-btn-primary" id="btn-save-banner">
                    <span class="material-icons-outlined" style="font-size:1rem;">save</span> Save Banner
                </button>
            </div>
        </div>

        <!-- ── SOCIAL LINKS TAB ── -->
        <div id="view-social" class="db-view">
            <div class="db-card">
                <div class="db-card-header">
                    <span class="db-card-title">Social Media Links</span>
                </div>
                <div id="social-alert" class="db-alert db-alert-success" style="display:none;">Social links saved!</div>
                <div class="db-grid-2">
                    ${[
                        ['instagram', 'Instagram URL', 'instagram'],
                        ['facebook',  'Facebook URL',  'facebook'],
                        ['tiktok',    'TikTok URL',    'play_circle'],
                        ['whatsapp',  'WhatsApp Number (with country code)', 'chat'],
                        ['twitter',   'Twitter / X URL', 'alternate_email'],
                        ['youtube',   'YouTube Channel URL', 'play_arrow'],
                    ].map(([key, label, icon]) => `
                        <div class="db-form-group">
                            <label class="db-label">
                                <span class="material-icons-outlined" style="font-size:0.9rem;vertical-align:middle;">${icon}</span>
                                ${label}
                            </label>
                            <input type="text" id="social-${key}" class="db-input" value="${social[key] || ''}" placeholder="https://…">
                        </div>
                    `).join('')}
                </div>
                <button class="db-btn db-btn-primary" id="btn-save-social">
                    <span class="material-icons-outlined" style="font-size:1rem;">save</span> Save Links
                </button>
            </div>
        </div>

        <!-- ── CONTACT TAB ── -->
        <div id="view-contact" class="db-view">
            <div class="db-card">
                <div class="db-card-header">
                    <span class="db-card-title">Contact & Business Info</span>
                </div>
                <div id="contact-alert" class="db-alert db-alert-success" style="display:none;">Contact info saved!</div>
                <div class="db-grid-2">
                    <div class="db-form-group">
                        <label class="db-label">Business Name</label>
                        <input type="text" id="contact-name" class="db-input" value="${contact.name || ''}">
                    </div>
                    <div class="db-form-group">
                        <label class="db-label">Email Address</label>
                        <input type="email" id="contact-email" class="db-input" value="${contact.email || ''}">
                    </div>
                    <div class="db-form-group">
                        <label class="db-label">Phone Number</label>
                        <input type="text" id="contact-phone" class="db-input" value="${contact.phone || ''}">
                    </div>
                    <div class="db-form-group">
                        <label class="db-label">City</label>
                        <input type="text" id="contact-city" class="db-input" value="${contact.city || ''}">
                    </div>
                </div>
                <div class="db-form-group">
                    <label class="db-label">Full Address</label>
                    <textarea id="contact-address" class="db-textarea" rows="2">${contact.address || ''}</textarea>
                </div>
                <div class="db-form-group">
                    <label class="db-label">Google Maps Embed URL</label>
                    <input type="text" id="contact-map" class="db-input" value="${contact.mapUrl || ''}" placeholder="https://maps.google.com/…">
                </div>
                <div class="db-form-group">
                    <label class="db-label">Business Hours</label>
                    <input type="text" id="contact-hours" class="db-input" value="${contact.hours || ''}" placeholder="e.g. Mon–Sat 10am–9pm">
                </div>
                <button class="db-btn db-btn-primary" id="btn-save-contact">
                    <span class="material-icons-outlined" style="font-size:1rem;">save</span> Save Info
                </button>
            </div>
        </div>

    </main>
</div>`;
};

// ============================================================
//  ATTACH ALL EVENTS
// ============================================================
const attachDashboardEvents = () => {

    // ── Nav / Tabs ──────────────────────────────────────────
    const tabMap = {
        'tab-products': 'view-products',
        'tab-catalogs': 'view-catalogs',
        'tab-orders':   'view-orders',
        'tab-banner':   'view-banner',
        'tab-social':   'view-social',
        'tab-contact':  'view-contact',
    };
    Object.entries(tabMap).forEach(([tabId, viewId]) => {
        document.getElementById(tabId)?.addEventListener('click', (e) => {
            e.preventDefault();
            Object.keys(tabMap).forEach(id => document.getElementById(id)?.classList.remove('active'));
            Object.values(tabMap).forEach(id => {
                const el = document.getElementById(id);
                if (el) { el.classList.remove('active'); }
            });
            document.getElementById(tabId)?.classList.add('active');
            document.getElementById(viewId)?.classList.add('active');
        });
    });

    document.getElementById('btn-logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('zshaikh_admin_auth');
        window.dispatchEvent(new CustomEvent('routeChange', { detail: 'home' }));
    });
    document.getElementById('btn-back-store')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('routeChange', { detail: 'home' }));
    });

    // ── Product Images ──────────────────────────────────────
    let productImages = [];

    const renderImgPreviews = () => {
        const wrap = document.getElementById('prod-images-previews');
        if (!wrap) return;
        wrap.innerHTML = productImages.map((src, i) => `
            <div class="db-img-thumb">
                <img src="${src}" alt="">
                <button class="db-img-thumb-remove" data-idx="${i}">&times;</button>
            </div>`).join('');
        wrap.querySelectorAll('.db-img-thumb-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                productImages.splice(parseInt(btn.dataset.idx), 1);
                renderImgPreviews();
            });
        });
    };

    const readImageFiles = (files) => {
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (ev) => { productImages.push(ev.target.result); renderImgPreviews(); };
            reader.readAsDataURL(file);
        });
    };

    const imgDrop = document.getElementById('prod-images-drop');
    const imgFile = document.getElementById('prod-images-file');
    if (imgDrop && imgFile) {
        imgDrop.addEventListener('click', () => imgFile.click());
        imgDrop.addEventListener('dragover', e => { e.preventDefault(); imgDrop.classList.add('dragover'); });
        imgDrop.addEventListener('dragleave', () => imgDrop.classList.remove('dragover'));
        imgDrop.addEventListener('drop', e => {
            e.preventDefault(); imgDrop.classList.remove('dragover');
            readImageFiles(e.dataTransfer.files);
        });
        imgFile.addEventListener('change', () => { readImageFiles(imgFile.files); imgFile.value = ''; });
    }

    // ── Product Form ─────────────────────────────────────────
    const panel = document.getElementById('product-form-panel');

    const openProductForm = (isEdit = false) => {
        document.getElementById('prod-form-title').textContent = isEdit ? 'Edit Product' : 'Add New Product';
        document.getElementById('prod-alert').style.display = 'none';
        panel.classList.add('open');
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const closeProductForm = () => {
        panel.classList.remove('open');
        document.getElementById('prod-id').value = '';
        document.getElementById('prod-name').value = '';
        document.getElementById('prod-price').value = '';
        document.getElementById('prod-discount').value = '0';
        document.getElementById('prod-size').value = '';
        document.getElementById('prod-stock').value = '0';
        document.getElementById('prod-category').value = '';
        document.getElementById('prod-notes').value = '';
        document.getElementById('prod-desc').value = '';
        document.getElementById('prod-featured').checked = true;
        productImages = [];
        renderImgPreviews();
    };

    document.getElementById('btn-add-product')?.addEventListener('click', () => {
        closeProductForm();
        openProductForm(false);
    });

    document.getElementById('btn-cancel-product')?.addEventListener('click', closeProductForm);

    // Edit buttons
    document.querySelectorAll('.edit-prod-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const p = getProductById(btn.dataset.id);
            if (!p) return;
            document.getElementById('prod-id').value      = p.id;
            document.getElementById('prod-name').value    = p.name;
            document.getElementById('prod-price').value   = p.price;
            document.getElementById('prod-discount').value= p.discount || 0;
            document.getElementById('prod-size').value    = p.size || '';
            document.getElementById('prod-stock').value   = p.stock || 0;
            document.getElementById('prod-category').value= p.categoryId || '';
            document.getElementById('prod-notes').value   = p.notes || '';
            document.getElementById('prod-desc').value    = p.description || '';
            document.getElementById('prod-featured').checked = p.featured !== false;
            productImages = (p.images && p.images.length ? p.images : (p.image ? [p.image] : [])).slice();
            renderImgPreviews();
            openProductForm(true);
        });
    });

    // Save product
    document.getElementById('btn-save-product')?.addEventListener('click', () => {
        const name  = document.getElementById('prod-name').value.trim();
        const price = parseFloat(document.getElementById('prod-price').value);
        const catId = document.getElementById('prod-category').value;

        if (!name)          { alert('Product name is required.'); return; }
        if (isNaN(price))   { alert('Enter a valid price.'); return; }
        if (!catId)         { alert('Please select a category.'); return; }

        const data = {
            name,
            price,
            discount: parseInt(document.getElementById('prod-discount').value) || 0,
            size:     document.getElementById('prod-size').value.trim(),
            stock:    parseInt(document.getElementById('prod-stock').value) || 0,
            categoryId: catId,
            images:   productImages.slice(),
            notes:    document.getElementById('prod-notes').value.trim(),
            description: document.getElementById('prod-desc').value.trim(),
            featured: document.getElementById('prod-featured').checked,
        };

        const editId = document.getElementById('prod-id').value;
        if (editId) updateProduct(editId, data);
        else        addProduct(data);

        const alertEl = document.getElementById('prod-alert');
        alertEl.style.display = 'block';
        setTimeout(() => reloadDashboard(), 800);
    });

    // Delete product
    document.querySelectorAll('.del-prod-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Delete this product? This cannot be undone.')) {
                deleteProduct(btn.dataset.id);
                reloadDashboard();
            }
        });
    });

    // ── Catalogs ─────────────────────────────────────────────
    document.getElementById('btn-add-catalog')?.addEventListener('click', () => {
        const name = document.getElementById('cat-name').value.trim();
        if (!name) { alert('Catalog name is required.'); return; }
        addCatalog({ name, description: document.getElementById('cat-desc').value.trim() });
        const alertEl = document.getElementById('cat-alert');
        alertEl.style.display = 'block';
        setTimeout(() => reloadDashboard(), 600);
    });

    document.querySelectorAll('.del-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Delete this catalog? Products in it will become uncategorized.')) {
                deleteCatalog(btn.dataset.id);
                reloadDashboard();
            }
        });
    });

    // ── Orders ───────────────────────────────────────────────
    document.querySelectorAll('.order-status-select').forEach(sel => {
        sel.addEventListener('change', () => {
            updateOrderStatus(sel.dataset.id, sel.value);
        });
    });

    document.querySelectorAll('.del-order-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Delete this order?')) {
                deleteOrder(btn.dataset.id);
                reloadDashboard();
            }
        });
    });

    // ── Banner ───────────────────────────────────────────────
    const bannerDrop = document.getElementById('banner-img-drop');
    const bannerFile = document.getElementById('banner-img-file');
    if (bannerDrop && bannerFile) {
        bannerDrop.addEventListener('click', () => bannerFile.click());
        bannerDrop.addEventListener('dragover', e => { e.preventDefault(); bannerDrop.classList.add('dragover'); });
        bannerDrop.addEventListener('dragleave', () => bannerDrop.classList.remove('dragover'));
        const onBannerFile = (f) => {
            const r = new FileReader();
            r.onload = ev => {
                document.getElementById('banner-bg').value = ev.target.result;
                bannerDrop.innerHTML = `<img src="${ev.target.result}" style="max-height:140px;border-radius:6px;max-width:100%;">
                    <input type="file" id="banner-img-file" accept="image/*" style="display:none;">`;
            };
            r.readAsDataURL(f);
        };
        bannerDrop.addEventListener('drop', e => { e.preventDefault(); bannerDrop.classList.remove('dragover'); if (e.dataTransfer.files[0]) onBannerFile(e.dataTransfer.files[0]); });
        bannerFile.addEventListener('change', () => { if (bannerFile.files[0]) onBannerFile(bannerFile.files[0]); });
    }

    document.getElementById('btn-save-banner')?.addEventListener('click', () => {
        updateBanner({
            enabled:    document.getElementById('banner-enabled').checked,
            title:      document.getElementById('banner-title').value,
            subtitle:   document.getElementById('banner-subtitle').value,
            buttonText: document.getElementById('banner-btn-text').value,
            bgImage:    document.getElementById('banner-bg').value,
        });
        const al = document.getElementById('banner-alert');
        al.style.display = 'block';
        setTimeout(() => al.style.display = 'none', 2500);
    });

    // ── Social Links ─────────────────────────────────────────
    document.getElementById('btn-save-social')?.addEventListener('click', () => {
        updateSocial({
            instagram: document.getElementById('social-instagram').value.trim(),
            facebook:  document.getElementById('social-facebook').value.trim(),
            tiktok:    document.getElementById('social-tiktok').value.trim(),
            whatsapp:  document.getElementById('social-whatsapp').value.trim(),
            twitter:   document.getElementById('social-twitter').value.trim(),
            youtube:   document.getElementById('social-youtube').value.trim(),
        });
        const al = document.getElementById('social-alert');
        al.style.display = 'block';
        setTimeout(() => al.style.display = 'none', 2500);
    });

    // ── Contact Info ─────────────────────────────────────────
    document.getElementById('btn-save-contact')?.addEventListener('click', () => {
        updateContact({
            name:    document.getElementById('contact-name').value.trim(),
            email:   document.getElementById('contact-email').value.trim(),
            phone:   document.getElementById('contact-phone').value.trim(),
            city:    document.getElementById('contact-city').value.trim(),
            address: document.getElementById('contact-address').value.trim(),
            mapUrl:  document.getElementById('contact-map').value.trim(),
            hours:   document.getElementById('contact-hours').value.trim(),
        });
        const al = document.getElementById('contact-alert');
        al.style.display = 'block';
        setTimeout(() => al.style.display = 'none', 2500);
    });
};
