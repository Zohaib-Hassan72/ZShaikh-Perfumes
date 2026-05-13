const renderContact = () => {
    setTimeout(() => {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for reaching out! We will get back to you shortly.');
                form.reset();
            });
        }
    }, 100);

    return `
    <div style="padding-top:80px;">
        <section class="section">
            <div class="container">
                <div class="section-header reveal">
                    <span class="section-label">Get in Touch</span>
                    <h2>Contact Us</h2>
                    <p>Have a question or want to place an order? We would love to hear from you.</p>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:4rem;max-width:1000px;margin:0 auto;">
                    <div class="reveal">
                        <form id="contact-form">
                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Message</label>
                                <textarea class="form-control" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-gold" style="width:100%;">Send Message</button>
                        </form>
                    </div>
                    <div class="reveal reveal-delay-1" style="display:flex;flex-direction:column;justify-content:center;">
                        <div style="margin-bottom:2.5rem;">
                            <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
                                <span class="material-icons-outlined" style="color:var(--gold);font-size:1.5rem;">location_on</span>
                                <div>
                                    <div style="font-weight:500;margin-bottom:0.2rem;">Our Boutique</div>
                                    <div style="color:var(--text-secondary);font-size:0.9rem;">Clifton Block 4, Karachi, Pakistan</div>
                                </div>
                            </div>
                            <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
                                <span class="material-icons-outlined" style="color:var(--gold);font-size:1.5rem;">phone</span>
                                <div>
                                    <div style="font-weight:500;margin-bottom:0.2rem;">Phone</div>
                                    <div style="color:var(--text-secondary);font-size:0.9rem;">+92 300 1234567</div>
                                </div>
                            </div>
                            <div style="display:flex;align-items:center;gap:1rem;">
                                <span class="material-icons-outlined" style="color:var(--gold);font-size:1.5rem;">email</span>
                                <div>
                                    <div style="font-weight:500;margin-bottom:0.2rem;">Email</div>
                                    <div style="color:var(--text-secondary);font-size:0.9rem;">info@zshaikhperfumes.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        ${renderFooter()}
    </div>`;
};
