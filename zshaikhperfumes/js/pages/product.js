const renderProduct = (productId) => {
    const product = getProductById(productId);
    if (!product) return `<div class="container" style="padding:10rem 0;text-align:center;"><h2>Product Not Found</h2><a href="#" data-route="home" class="btn btn-gold" style="margin-top:2rem;">Back to Home</a></div>`;

    const cat = getCatalogs().find(c=>c.id===product.categoryId)?.name||'';
    const hasDiscount = product.discount && product.discount>0;
    const finalPrice = hasDiscount ? Math.round(product.price*(1-product.discount/100)) : product.price;
    const imgs = product.images||(product.image?[product.image]:[]);
    const mainImg = imgs[0]||'';
    const reviews = product.reviews||[];
    const avgRating = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : 0;
    const faqs = product.faqs||[];

    const stars = (rating) => {
        let s=''; for(let i=1;i<=5;i++) s+=`<span class="material-icons-outlined" style="font-size:1rem;color:${i<=Math.round(rating)?'#f59e0b':'#3a3a3a'};">star</span>`; return s;
    };

    const thumbs = imgs.map((img,i)=>`<div class="pd-thumb ${i===0?'active':''}" data-idx="${i}"><img src="${img}" alt="View ${i+1}"></div>`).join('');

    setTimeout(()=>{
        document.querySelectorAll('.pd-thumb').forEach(t=>t.addEventListener('click',()=>{
            document.getElementById('pd-main-img').src=imgs[t.dataset.idx];
            document.querySelectorAll('.pd-thumb').forEach(x=>x.classList.remove('active')); t.classList.add('active');
        }));
        document.querySelectorAll('.pd-accordion-header').forEach(h=>h.addEventListener('click',()=>{
            const b=h.nextElementSibling;const ic=h.querySelector('.material-icons-outlined');
            const open=b.style.maxHeight&&b.style.maxHeight!=='0px';
            b.style.maxHeight=open?'0px':b.scrollHeight+'px'; ic.textContent=open?'add':'remove';
        }));
        document.getElementById('pd-add-cart')?.addEventListener('click',()=>{
            const qty=parseInt(document.getElementById('pd-qty-input').value)||1;
            addToCart(product.id,qty); renderApp('cart');
        });
        document.getElementById('review-form')?.addEventListener('submit',(e)=>{
            e.preventDefault();
            const name=document.getElementById('rev-name').value;
            const rating=parseInt(document.getElementById('rev-rating').value);
            const text=document.getElementById('rev-text').value;
            addReview(product.id,{name,rating,text,date:new Date().toISOString().split('T')[0]});
            renderApp('product',product.id);
        });
    },150);

    return `
    <div class="pd-page container">
        <div class="pd-breadcrumb"><a href="#" data-route="home">Home</a> <span>/</span> <a href="#" data-route="home">Shop</a> <span>/</span> <span>${product.name}</span></div>
        <div class="pd-layout">
            <div class="pd-gallery reveal">
                ${imgs.length>1?'<div class="pd-thumbs">'+thumbs+'</div>':''}
                <div class="pd-main-img-wrap"><img id="pd-main-img" src="${mainImg}" alt="${product.name}"></div>
            </div>
            <div class="pd-info reveal reveal-delay-1">
                ${reviews.length?'<div class="pd-rating-row">'+stars(avgRating)+' <span class="pd-rating-count">'+avgRating+' ('+reviews.length+' Reviews)</span></div>':''}
                <div class="pd-cat">${cat}</div>
                <h1 class="pd-title">${product.name}</h1>
                <div class="pd-price-row">
                    <span class="pd-price-val">Rs. ${finalPrice.toLocaleString()}</span>
                    ${hasDiscount?'<span class="price-old" style="font-size:1.1rem;">Rs. '+product.price.toLocaleString()+'</span> <span class="pd-save-badge">'+product.discount+'% OFF</span>':''}
                </div>
                <p class="pd-desc">${product.description||''}</p>
                ${product.notes?'<div class="pd-meta-row"><strong>Featuring:</strong> '+product.notes+'</div>':''}
                ${product.size?'<div class="pd-meta-row"><strong>Size:</strong> '+product.size+'</div>':''}

                <div class="pd-trust-icons">
                    <div class="pd-trust"><span class="material-icons-outlined">spa</span><span>Finest<br>Ingredients</span></div>
                    <div class="pd-trust"><span class="material-icons-outlined">verified</span><span>100% Authentic<br>Guaranteed</span></div>
                    <div class="pd-trust"><span class="material-icons-outlined">local_shipping</span><span>Free Shipping<br>Nationwide</span></div>
                </div>

                <div class="pd-actions">
                    <div class="pd-qty-wrap"><button class="pd-qty-btn" onclick="var i=document.getElementById('pd-qty-input');i.value=Math.max(1,parseInt(i.value)-1);">−</button><input type="number" id="pd-qty-input" value="1" min="1" class="pd-qty"><button class="pd-qty-btn" onclick="var i=document.getElementById('pd-qty-input');i.value=parseInt(i.value)+1;">+</button></div>
                    <button class="sq-add-btn" id="pd-add-cart" style="flex:1;">+ Add To Cart</button>
                </div>

                <div class="pd-accordions">
                    <div class="pd-accordion"><div class="pd-accordion-header"><span>Shipping Information</span><span class="material-icons-outlined">add</span></div><div class="pd-accordion-body"><p>Free nationwide delivery across Pakistan. Orders processed within 1-2 business days, delivered in 3-5 days.</p></div></div>
                    <div class="pd-accordion"><div class="pd-accordion-header"><span>Return Policy</span><span class="material-icons-outlined">add</span></div><div class="pd-accordion-body"><p>7-day return policy on unopened products. Contact support for hassle-free returns.</p></div></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Detail Description Section -->
    <section class="pd-detail-section">
        <div class="container"><div class="pd-detail-grid reveal">
            <div class="pd-detail-text">
                <span class="section-label">${cat}</span>
                <h2 style="font-size:2.5rem;margin-bottom:1rem;">${product.name}</h2>
                <p style="color:var(--text-secondary);line-height:1.8;margin-bottom:1.5rem;">${product.description||''}</p>
                ${product.notes?product.notes.split(',').map(n=>'<div class="pd-ingredient"><span class="material-icons-outlined" style="color:var(--gold);">fiber_manual_record</span> <strong>'+n.trim().split(' ')[0]+'</strong> '+n.trim()+'</div>').join(''):''}
            </div>
            <div class="pd-detail-img"><img src="${mainImg}" alt="${product.name}" style="width:100%;border-radius:8px;"></div>
        </div></div>
    </section>

    <!-- FAQs -->
    ${faqs.length?`<section class="section"><div class="container" style="max-width:800px;">
        <div class="section-header reveal"><span class="section-label">Have Questions?</span><h2>FAQs</h2></div>
        <div class="pd-accordions reveal">${faqs.map(f=>`
            <div class="pd-accordion"><div class="pd-accordion-header"><span>${f.q}</span><span class="material-icons-outlined">add</span></div><div class="pd-accordion-body"><p>${f.a}</p></div></div>
        `).join('')}</div>
    </div></section>`:''}

    <!-- Reviews -->
    <section class="section" style="border-top:1px solid var(--border);"><div class="container" style="max-width:900px;">
        <div class="section-header reveal"><span class="section-label">Customer Reviews</span><h2>${reviews.length?avgRating+' out of 5':'Be the first to review'}</h2>
            ${reviews.length?'<div style="margin-top:0.5rem;">'+stars(avgRating)+' <span style="color:var(--text-secondary);font-size:0.9rem;">('+reviews.length+' reviews)</span></div>':''}
        </div>
        <div class="reviews-list reveal">${reviews.map(r=>`
            <div class="review-card"><div class="review-header"><div>${stars(r.rating)}</div><span class="review-date">${r.date}</span></div>
            <p class="review-text">${r.text}</p><div class="review-author">— ${r.name}</div></div>`).join('')}
        </div>
        <div class="review-form-wrap reveal" style="margin-top:2rem;">
            <h3 style="font-size:1.3rem;margin-bottom:1rem;">Write a Review</h3>
            <form id="review-form">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                    <div class="form-group"><label class="form-label">Your Name</label><input type="text" id="rev-name" class="form-control" required></div>
                    <div class="form-group"><label class="form-label">Rating</label><select id="rev-rating" class="form-control" required><option value="5">★★★★★ (5)</option><option value="4">★★★★ (4)</option><option value="3">★★★ (3)</option><option value="2">★★ (2)</option><option value="1">★ (1)</option></select></div>
                </div>
                <div class="form-group"><label class="form-label">Your Review</label><textarea id="rev-text" class="form-control" rows="3" required></textarea></div>
                <button type="submit" class="btn btn-gold">Submit Review</button>
            </form>
        </div>
    </div></section>

    <div class="ticker" style="margin-top:2rem;"><div class="ticker-track"><span>✦ PREMIUM QUALITY</span><span>✦ LONG LASTING</span><span>✦ HANDCRAFTED</span><span>✦ AUTHENTIC</span><span>✦ FREE SHIPPING</span><span>✦ PREMIUM QUALITY</span><span>✦ LONG LASTING</span><span>✦ HANDCRAFTED</span><span>✦ AUTHENTIC</span><span>✦ FREE SHIPPING</span></div></div>
    ${renderFooter()}`;
};
