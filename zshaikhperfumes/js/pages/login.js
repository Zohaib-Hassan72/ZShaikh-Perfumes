const renderLogin = () => {
    const user = getUser();
    setTimeout(()=>{
        document.getElementById('login-user-form')?.addEventListener('submit',e=>{
            e.preventDefault(); loginUser(document.getElementById('u-name').value, document.getElementById('u-email').value);
            renderApp('home');
        });
        document.getElementById('btn-user-logout')?.addEventListener('click',e=>{e.preventDefault();logoutUser();renderApp('home');});
    },100);

    if (user) {
        return `<div class="container" style="padding:8rem 0;max-width:500px;text-align:center;">
            <span class="material-icons-outlined" style="font-size:4rem;color:var(--gold);margin-bottom:1rem;">account_circle</span>
            <h2 style="margin-bottom:0.5rem;">Welcome, ${user.name}</h2>
            <p style="color:var(--text-secondary);margin-bottom:2rem;">${user.email}</p>
            <a href="#" data-route="cart" class="btn btn-gold" style="margin-bottom:1rem;width:100%;">View Cart</a>
            <a href="#" id="btn-user-logout" class="btn btn-outline" style="width:100%;">Logout</a>
        </div>${renderFooter()}`;
    }

    return `<div class="container" style="padding:8rem 0;max-width:450px;">
        <div style="text-align:center;margin-bottom:2rem;">
            <h2 style="margin-bottom:0.5rem;">Login / Sign Up</h2>
            <p style="color:var(--text-secondary);">Enter your details to continue</p>
        </div>
        <form id="login-user-form">
            <div class="form-group"><label class="form-label">Full Name</label><input type="text" id="u-name" class="form-control" required></div>
            <div class="form-group"><label class="form-label">Email</label><input type="email" id="u-email" class="form-control" required></div>
            <button type="submit" class="btn btn-gold" style="width:100%;">Continue</button>
        </form>
    </div>${renderFooter()}`;
};
