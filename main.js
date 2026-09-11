// main.js - DuoReveal Interactive Website (Creato4 Lab / Prince Tagadiya)

document.addEventListener("DOMContentLoaded", () => {
  syncRemotePolicy();
});

// Dynamically check remote business model policy from backend
async function syncRemotePolicy() {
  try {
    const res = await fetch("http://localhost:8080/api/device/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        installation_id: "web-visitor",
        public_key: "web-visitor-key",
        app_version: "1.0.0"
      })
    });

    if (res.ok) {
      const data = await res.json();
      const configJson = JSON.parse(atob(data.config.data));

      const mainCta = document.getElementById("main-cta-btn");
      const navCta = document.querySelector(".cta-button");

      if (configJson.beta_enabled) {
        // Free Beta Mode
        if (mainCta) mainCta.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download Public Beta — Free`;
        if (navCta) navCta.textContent = "Download Beta — Free";
      } else if (configJson.trial_enabled) {
        // Free Trial Mode
        if (mainCta) mainCta.innerHTML = `Start 3-Day Free Trial`;
        if (navCta) navCta.textContent = "Start Free Trial";
      } else if (configJson.payment_enabled) {
        // ₹99 One-Time Mode
        if (mainCta) mainCta.innerHTML = `Unlock DuoReveal — ${configJson.currency} ${configJson.price}`;
        if (navCta) navCta.textContent = `Get DuoReveal — ${configJson.currency} ${configJson.price}`;
      }
    }
  } catch (e) {
    // Graceful offline fallback: keep default Public Beta CTA
  }
}
