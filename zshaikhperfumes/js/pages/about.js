const renderAbout = () => {
    return `
    <div style="padding-top:80px;">
        <section class="section">
            <div class="container" style="max-width:800px;">
                <div class="section-header reveal">
                    <span class="section-label">Our Story</span>
                    <h2>About Z Shaikh Perfumes</h2>
                </div>
                <div class="reveal" style="color:var(--text-secondary);line-height:2;font-size:1.05rem;">
                    <p style="margin-bottom:1.5rem;">Welcome to <strong style="color:var(--text);">Z Shaikh Perfumes</strong> — where fragrance is more than just a scent. It is an identity. Founded with a deep passion for the art of perfumery, our brand is dedicated to bringing you the most exquisite, long-lasting, and premium fragrances.</p>
                    <p style="margin-bottom:1.5rem;">We believe that a great perfume has the power to evoke memories, boost confidence, and leave a lasting impression. That is why we source only the finest ingredients from around the world, blending them meticulously to create scents that resonate with luxury and elegance.</p>
                    <p style="margin-bottom:2.5rem;">Whether you are looking for the deep, rich notes of Oud, the fresh burst of citrus, or the delicate embrace of floral arrangements, our carefully curated collections are designed to cater to every personality and occasion.</p>
                    <p style="font-family:var(--font-display);font-size:2rem;color:var(--gold);text-align:center;font-style:italic;">"Your Signature Scent Awaits."</p>
                </div>
            </div>
        </section>
        ${renderFooter()}
    </div>`;
};
