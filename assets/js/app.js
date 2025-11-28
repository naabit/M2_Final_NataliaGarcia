/* 
   app.js
   - Define un catálogo de productos.
   - Renderiza cards en index.html.
   - Maneja carrito con localStorage (agregar/eliminar, total, contador).
   - Implementa toggle de tema (light/dark) recordando preferencia.
   - Renderiza el detalle en product.html leyendo ?id=... */

/*Datos de productos*/

const PRODUCTS = [
  {
    id: 1,
    name: "Auriculares Indigo",
    price: 39990,
    image: "https://picsum.photos/seed/headphones/600/400",
    short: "Morbi lacinia porttitor iaculis.",
    description:
      "Morbi lacinia porttitor iaculis. Nunc nisl quam, lobortis quis elementum fringilla, volutpat a magna. In at leo sed justo egestas placerat.",
    badges: ["Nuevo", "Envío gratis"],
  },
  {
    id: 2,
    name: "Teclado Majorelle",
    price: 54990,
    image: "https://picsum.photos/seed/keyboard/600/400",
    short: "Morbi lacinia porttitor iaculis.",
    description:
      "Las imágenes son aleatorias y están sacadas de Lorem Picsum..",
    badges: ["Top Ventas"],
  },
  {
    id: 3,
    name: "Mouse Vodka",
    price: 24990,
    image: "https://picsum.photos/seed/mouse/600/400",
    short: "Lorem ipsum dolor sit amet.",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    badges: ["Oferta"],
  },
  {
    id: 4,
    name: "Parlante Max Blue",
    price: 29990,
    image: "https://picsum.photos/seed/maxblue-speaker/600/400",
    short: "Aliquam suscipit, sem vitae malesuada.",
    description:
      "Aliquam suscipit, sem vitae malesuada feugiat, dolor lectus venenatis ante.",
    badges: [],
  },
];

/* Utilidades de carrito en localStorage*/
const CART_KEY = "ps_cart_v1";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, qty = 1) {
  const cart = loadCart();
  const idx = cart.findIndex((i) => i.id === productId);
  if (idx >= 0) {
    cart[idx].qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  renderCartUI();
}

function removeFromCart(productId) {
  const cart = loadCart().filter((i) => i.id !== productId);
  saveCart(cart);
  renderCartUI();
}

function changeQty(productId, qty) {
  const cart = loadCart().map((i) => (i.id === productId ? { ...i, qty } : i));
  saveCart(cart);
  renderCartUI();
}

/* Render del carrito (offcanvas) y contador*/
function renderCartUI() {
  let cart = loadCart();
  const filteredCart = cart.filter((item) =>
    PRODUCTS.some((pd) => pd.id === item.id)
  );
  if (filteredCart.length !== cart.length) {
    saveCart(filteredCart);
  }
  cart = filteredCart;
  const $count = document.getElementById("cartCount");
  const $items = document.getElementById("cartItems");
  const $total = document.getElementById("cartTotal");

  // Contador del ícono de carrito
  if ($count) {
    const totalQty = cart.reduce((acc, it) => acc + it.qty, 0);
    $count.textContent = totalQty;
  }

  // Render del contenido del offcanvas
  if ($items && $total) {
    // Carro vacío
    if (cart.length === 0) {
      $items.innerHTML = `<p class="text-muted">Tu carro está vacío.</p>`;
      $total.textContent = "$0";
      return; // importante: salimos de la función
    }

    // Carro con productos
    let sum = 0;
    $items.innerHTML = cart
      .map((it) => {
        const p = PRODUCTS.find((pd) => pd.id === it.id);
        if (!p) return "";
        const subtotal = p.price * it.qty;
        sum += subtotal;

        return `
          <div class="cart-item d-flex align-items-center border rounded p-2 mb-2">
            <img src="${p.image}" alt="${p.name}"
                 width="64" height="64"
                 class="rounded me-2" style="object-fit:cover" />

            <div class="flex-grow-1">
              <!-- Nombre y precio unitario -->
              <div>
                <div class="fw-semibold">${p.name}</div>
                <div class="small text-muted">
                  $${p.price.toLocaleString("es-CL")} c/u
                </div>
              </div>

              <!-- Controles + subtotal en la misma fila -->
              <div class="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2">
                <div class="d-flex align-items-center gap-2">
                  <label class="small text-muted mb-0">Cant.</label>
                  <input
                    type="number"
                    min="1"
                    value="${it.qty}"
                    class="form-control form-control-sm"
                    style="width:80px"
                    onchange="changeQty(${p.id}, parseInt(this.value) || 1)" />
                  <button
                      class="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center p-1"
                      onclick="removeFromCart(${p.id})"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                          viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor" width="18" height="18">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16
                          19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25
                          2.25 0 0 1-2.244-2.077L4.772 5.79m14.456
                          0a48.108 48.108 0 0 0-3.478-.397m-12
                          .562c.34-.059.68-.114 1.022-.165m0
                          0a48.11 48.11 0 0 1 3.478-.397m7.5
                          0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964
                          51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09
                          2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                </div>

                <div class="fw-bold">
                  $${subtotal.toLocaleString("es-CL")}
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    $total.textContent = `$${sum.toLocaleString("es-CL")}`;
  }
}

/* Render del grid de productos del index*/
function renderProductGrid(list = PRODUCTS) {
  const $grid = document.getElementById("productGrid");
  if (!$grid) return;

  $grid.innerHTML = list
    .map((p) => {
      const badgeHtml = (p.badges || [])
        .map((b) => `<span class="badge badge-price me-1">${b}</span>`)
        .join("");

      // Enlace al detalle con ?id=...
      return `
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card h-100">
            <img src="${p.image}" class="card-img-top" alt="${p.name}" />
            <div class="card-body d-flex flex-column">
              <h3 class="h6 card-title mb-1">
                <a href="product.html?id=${
                  p.id
                }" class="link-underline link-underline-opacity-0">${p.name}</a>
              </h3>
              <p class="text-muted small mb-2">${p.short}</p>
              <div class="mb-2">${badgeHtml}</div>
              <div class="mt-auto d-flex justify-content-between align-items-center">
                <strong>$${p.price.toLocaleString("es-CL")}</strong>
                <button class="btn btn-majorelle btn-sm" onclick="addToCart(${
                  p.id
                })">Agregar</button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

/* Ordenamiento simple de index*/
function setupSort() {
  const sel = document.getElementById("sortSelect");
  if (!sel) return;
  sel.addEventListener("change", () => {
    let list = [...PRODUCTS];
    switch (sel.value) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // orden original
        list = [...PRODUCTS];
    }
    renderProductGrid(list);
  });
}

function setupAutoCollapseOnScroll() {
  const navCollapse = document.getElementById("mainNav"); // el div .collapse
  const navToggler = document.querySelector(".navbar-toggler"); // el botón hamburguesa

  if (!navCollapse || !navToggler) return;

  function onScroll() {
    const isDesktop = window.innerWidth >= 992; // breakpoint lg (navbar-expand-lg)
    const isOpen = navCollapse.classList.contains("show");

    if (!isDesktop && isOpen) {
      const instance =
        bootstrap.Collapse.getInstance(navCollapse) ||
        new bootstrap.Collapse(navCollapse, { toggle: false });

      instance.hide();
    }
  }

  window.addEventListener("scroll", onScroll);
}

/*Detalle de product.html*/
function renderProductDetail() {
  const $detail = document.getElementById("productDetail");
  if (!$detail) return;

  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));
  const p = PRODUCTS.find((x) => x.id === id);

  if (!p) {
    $detail.innerHTML = `<div class="col-12"><div class="alert alert-warning">Producto no encontrado.</div></div>`;
    return;
  }

  $detail.innerHTML = `
    <div class="col-lg-6">
      <img src="${p.image}" alt="${
    p.name
  }" class="img-fluid rounded shadow-sm" />
    </div>
    <div class="col-lg-6">
      <h1 class="h3 mb-2">${p.name}</h1>
      <div class="mb-3">
        ${(p.badges || [])
          .map((b) => `<span class="badge badge-price me-1">${b}</span>`)
          .join("")}
      </div>
      <p class="lead">$${p.price.toLocaleString("es-CL")}</p>
      <p>${p.description}</p>
      <div class="d-flex gap-2 align-items-center">
        <button class="btn btn-majorelle" onclick="addToCart(${
          p.id
        })">Agregar al carrito</button>
        <a href="index.html#productos" class="btn btn-outline-secondary">Volver</a>
      </div>
    </div>
  `;
}

/*Tema claro/oscuro (persistente)*/
const THEME_KEY = "ps_theme";
function applyTheme(theme) {
  // theme: "light" | "dark"
  document.documentElement.setAttribute("data-bs-theme", theme);
}

// Heroicons SVG
const ICON_MOON = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75
           c-5.385 0-9.75-4.365-9.75-9.75
           0-1.33.266-2.597.748-3.752A9.753 
           9.753 0 0 0 3 11.25C3 16.635 
           7.365 21 12.75 21a9.753 9.753 
           0 0 0 9.002-5.998Z" />
</svg>`;

const ICON_SUN = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 
           12h-2.25m-.386 6.364-1.591-1.591M12 
           18.75V21m-4.773-4.227-1.591 1.591M5.25 
           12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 
           3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
</svg>`;

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Estado actual
  const isDark = saved === "dark" || (!saved && prefersDark);

  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");

  function applyIcon(darkMode) {
    if (!icon) return;
    icon.innerHTML = darkMode ? ICON_SUN : ICON_MOON;
  }

  // Aplica estado inicial
  applyTheme(isDark ? "dark" : "light");
  applyIcon(isDark);

  // Listener del botón
  if (btn) {
    btn.addEventListener("click", () => {
      const currentlyDark = root.getAttribute("data-bs-theme") === "dark";
      const next = currentlyDark ? "light" : "dark";

      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
      applyIcon(next === "dark");
    });
  }
}

/*Inicialización común a todas las páginas*/
function boot() {
  // año en el footer
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  initTheme();
  renderCartUI();
  renderProductGrid(); // sólo afecta si existe #productGrid
  setupSort(); // idem
  renderProductDetail(); // sólo afecta si existe #productDetail
  setupAutoCollapseOnScroll();

  // demo: botón de pagar del offcanvas
  const checkout = document.getElementById("checkoutBtn");
  if (checkout) {
    checkout.addEventListener("click", () => {
      alert("Aquí iría el flujo de pago/checkout.");
    });
  }
}

document.addEventListener("DOMContentLoaded", boot);
