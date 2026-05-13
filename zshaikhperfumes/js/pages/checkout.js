const renderCheckout = () => {
    const cart = getCart();
    const items = cart.map(c=>{const p=getProductById(c.id);return p?{...p,qty:c.qty}:null;}).filter(Boolean);
    const total = items.reduce((s,i)=>{const pr=i.discount?Math.round(i.price*(1-i.discount/100)):i.price;return s+pr*i.qty;},0);
    const user = getUser();

    if(!items.length) return `<div class="container" style="padding:10rem 0;text-align:center;"><h2>Nothing to checkout</h2><a href="#" data-route="home" class="btn btn-gold" style="margin-top:2rem;">Shop Now</a></div>`;

    setTimeout(()=>{
        document.getElementById('checkout-form')?.addEventListener('submit',e=>{
            e.preventDefault();
            const name=document.getElementById('co-name').value;
            const email=document.getElementById('co-email').value;
            loginUser(name,email);
            clearCart();
            document.getElementById('checkout-content').innerHTML=`
                <div style="text-align:center;padding:4rem 0;">
                    <span class="material-icons-outlined" style="font-size:4rem;color:#4caf50;margin-bottom:1rem;">check_circle</span>
                    <h2 style="margin-bottom:1rem;">Order Placed Successfully!</h2>
                    <p style="color:var(--text-secondary);margin-bottom:2rem;">Thank you, ${name}! We will contact you at ${email} with delivery details.</p>
                    <a href="#" data-route="home" class="btn btn-gold">Continue Shopping</a>
                </div>`;
            document.querySelectorAll('a[data-route]').forEach(l=>l.addEventListener('click',ev=>{ev.preventDefault();renderApp(ev.currentTarget.getAttribute('data-route'));}));
        });
    },100);

    return `<div class="checkout-page container" id="checkout-content">
        <h1 style="font-size:2.5rem;margin-bottom:2rem;">Checkout</h1>
        <div class="checkout-layout">
            <div>
                <div class="admin-card" style="background:var(--bg-card);border-color:var(--border);">
                    <h3 style="color:var(--text);margin-bottom:1.5rem;">Delivery Information</h3>
                    <form id="checkout-form">
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                            <div class="form-group"><label class="form-label">Full Name *</label><input type="text" id="co-name" class="form-control" required value="${user?.name||''}"></div>
                            <div class="form-group"><label class="form-label">Email *</label><input type="email" id="co-email" class="form-control" required value="${user?.email||''}"></div>
                        </div>
                        <div class="form-group"><label class="form-label">Phone *</label><input type="tel" id="co-phone" class="form-control" required></div>
                        <div class="form-group"><label class="form-label">Delivery Address *</label><textarea id="co-address" class="form-control" rows="3" required></textarea></div>
                        <div class="form-group"><label class="form-label">City *</label><input type="text" id="co-city" class="form-control" required></div>
                        <h3 style="color:var(--text);margin:2rem 0 1rem;">Payment</h3>
                        <div class="form-group"><label style="display:flex;align-items:center;gap:0.5rem;color:var(--text);cursor:pointer;"><input type="radio" name="payment" value="cod" checked> Cash on Delivery (COD)</label></div>
                        <button type="submit" class="btn btn-gold" style="width:100%;margin-top:1rem;">Place Order — Rs. ${total.toLocaleString()}</button>
                    </form>
                </div>
            </div>
            <div>
                <div class="admin-card" style="background:var(--bg-card);border-color:var(--border);">
                    <h3 style="color:var(--text);margin-bottom:1rem;">Order Summary</h3>
                    ${items.map(i=>{const pr=i.discount?Math.round(i.price*(1-i.discount/100)):i.price;const img=(i.images&&i.images[0])||'';
                        return `<div style="display:flex;gap:1rem;align-items:center;padding:0.75rem 0;border-bottom:1px solid var(--border);">
                            <img src="${img}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
                            <div style="flex:1;"><div style="font-weight:500;">${i.name}</div><div style="font-size:0.8rem;color:var(--text-secondary);">Qty: ${i.qty}</div></div>
                            <div>Rs. ${(pr*i.qty).toLocaleString()}</div></div>`;}).join('')}
                    <div style="display:flex;justify-content:space-between;padding-top:1rem;font-weight:600;font-size:1.1rem;"><span>Total</span><span>Rs. ${total.toLocaleString()}</span></div>
                </div>
            </div>
        </div>
    </div>${renderFooter()}`;
};
