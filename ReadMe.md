# Ecommerce Frontend con Bootstrap y JavaScript

Este proyecto es el **frontend de una tienda e-commerce** creada como parte de un módulo de desarrollo web. La idea es practicar:

- Maquetación con **HTML5**
- Sistema de diseño y componentes con **Bootstrap 5.3**
- Lógica de interfaz con **JavaScript**
- Uso básico de **localStorage** para persistir el carrito
- Separación de responsabilidades en archivos (`index.html`, `product.html`, `styles.css`, `app.js`)

---

## Características principales

- **Barra de navegación** con links a secciones de la página.
- **Listado de productos** en tarjetas (cards de Bootstrap).
- **Botones de “Agregar al carrito”** en cada producto.
- **Carrito de compras** mostrado en un componente `offcanvas` de Bootstrap.
- **Contador de ítems en el carrito** (badge en el botón del carro).
- **Página de detalle de producto** (`product.html`) que lee el parámetro `?id=`.
- **Modo claro/oscuro** usando `data-bs-theme` y `localStorage`.
- **Iconos dinámicos** para el botón de tema (Sun/Moon con SVG).

---

## Tecnologías usadas

- **HTML5** para la estructura de la página.
- **CSS3** para estilos personalizados.
- **Bootstrap 5.3** (CDN) para:
  - Grid responsive
  - Navbar
  - Cards
  - Offcanvas
  - Botones y utilidades
- **JavaScript** para:
  - Render dinámico de productos desde un arreglo `PRODUCTS`.
  - Manejo del carrito de compras (agregar, eliminar, cambiar cantidad).
  - Persistencia en **`localStorage`**.
  - Lectura de parámetros de la URL (`URLSearchParams`) en `product.html`.
  - Cambio de tema claro/oscuro con `data-bs-theme`.
- **SVG** para el favicon y para los iconos de tema (Sun/Moon) y carro.

---

## 📂 Estructura del proyecto

.M2_Final_NataliaGarcia
├─ index.html               # Página principal, listado de productos
├─ product.html             # Página de detalle de producto
├─ assets/
│  ├─ css/
│  │  └─ styles.css         # Colores, tipografía, overrides de Bootstrap
│  └─ js/
│     └─ app.js             # Lógica de productos, carrito y tema
└─ assets/icon/
   └─ icon.svg              # Icono sencillo de la tienda
