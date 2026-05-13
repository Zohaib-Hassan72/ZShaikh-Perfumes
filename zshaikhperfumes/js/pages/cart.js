const renderCart = () => {
    const cart = getCart();
    const items = cart.map(c => { const p = getProductById(c.id); return p ? {...p, qty:c.qty} : null; }).filter(Boolean);
    const total = items.reduce((s,i) => {
        const price = i.discount ? Math.round(i.price*(1-i.discount/100)) : i.price;
        return s + price * i.qty;
    }, 0);

    setTimeout(()=>{
        document.querySelectorAll('.cart-qty').forEach(input => {
            input.addEventListener('change', () => { updateCartQty(input.dataset.id, parseInt(input.value)||0); renderApp('cart'); });
        });
        document.querySelectorAll('.cart-remove').forEach(btn => {
            btn.addEventListener('click', () => { updateCartQty(btn.dataset.id, 0); renderApp('cart'); });
        });
    }, 100);

    if (!items.length) {
        return `<div style="padding:10rem 0;text-align:center;" class="container">
            <span class="material-icons-outlined" style="font-size:4rem;color:var(--text-secondary);margin-bottom:1rem;">shopping_bag</span>
            <h2>Your Cart is Empty</h2><p style="color:var(--text-secondary);margin:1rem 0 2rem;">Looks like you haven't added any fragrances yet.</p>
            <a href="#" data-route="home" class="btn btn-gold">Continue Shopping</a></div>`;
    }

    return `<div class="cart-page container">
        <h1 style="font-size:2.5rem;margin-bottom:2rem;">Your Cart</h1>
        <div class="cart-layout">
            <div class="cart-items">
                ${items.map(i => {
                    const price = i.discount ? Math.round(i.price*(1-i.discount/100)) : i.price;
                    const img = (i.images&&i.images[0])||i.image||'';
                    return `<div class="cart-item">
                        <img src="${img}" alt="${i.name}" class="cart-item-img">
                        <div class="cart-item-info">
                            <a href="#" data-route="product" data-id="${i.id}" class="cart-item-name">${i.name}</a>
                            <div class="cart-item-price">Rs. ${price.toLocaleString()}</div>
                            ${i.size?'<div style="font-size:0.8rem;color:var(--text-secondary);">'+i.size+'</div>':''}
                        </div>
                        <div class="cart-item-actions">
                            <input type="number" class="cart-qty" data-id="${i.id}" value="${i.qty}" min="1">
                            <button class="cart-remove" data-id="${i.id}"><span class="material-icons-outlined" style="font-size:1.2rem;">delete_outline</span></button>
                        </div>
                        <div class="cart-item-total">Rs. ${(price*i.qty).toLocaleString()}</div>
                    </div>`;
                }).join('')}
            </div>
            <div class="cart-summary">
                <h3>Order Summary</h3>
                <div class="cart-summary-row"><span>Subtotal</span><span>Rs. ${total.toLocaleString()}</span></div>
                <div class="cart-summary-row"><span>Shipping</span><span style="color:#4caf50;">Free</span></div>
                <div class="cart-summary-row cart-total"><span>Total</span><span>Rs. ${total.toLocaleString()}</span></div>
                <a href="#" data-route="checkout" class="btn btn-gold" style="width:100%;margin-top:1rem;">Proceed to Checkout</a>
                <a href="#" data-route="home" style="display:block;text-align:center;margin-top:1rem;color:var(--text-secondary);font-size:0.85rem;">Continue Shopping</a>
            </div>
        </div>
    </div>${renderFooter()}`;
};
