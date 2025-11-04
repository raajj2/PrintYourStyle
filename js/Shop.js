/* ===========================================================
   PrintYourStyle — Shop.js
   Handles rendering, filters, sorting, search, pagination,
   quick view integration, and wishlist
   =========================================================== */

console.log("✅ Shop.js Loaded");

// ---------- Product Dataset (example — replace with your actual) ----------
const PRODUCTS = [
  {
    id: "p1",
    title: "OFFICIAL DISNEY MERCHANDISE",
    price: 999,
    desc: "Unisex White & Red Mickey Graphic Printed Plus Size T-shirt.",
    category: "men",
    image: "/assets/images/pr1/im1.jpg",
    images: [
      "/assets/images/pr1/im1.jpg",
      "/assets/images/pr1/im2.jpg",
      "/assets/images/pr1/im3.jpg",
      "/assets/images/pr1/im4.jpg",
      "/assets/images/pr1/im5.jpg"
    ],
    rating: 4.8,
    color: "red",
    tag: "Best Seller",
  },
  {
    id: "p2",
    title: "Classic White Tee",
    price: 499,
    desc: "Soft cotton comfort and breathable fit — classic silhouette.",
    category: "men",
    image: "/assets/images/tshirt1.png",
    images: ["/assets/images/tshirt1.png", "/assets/images/tshirt2.png"],
    rating: 4.6,
    color: "white",
    tag: "New",
  },
  {
    id: "p3",
    title: "Eco Green Tee",
    price: 599,
    desc: "Made from 100% organic fibers and eco inks.",
    category: "eco",
    image: "/assets/images/tshirt2.png",
    images: ["/assets/images/tshirt2.png"],
    rating: 4.9,
    color: "green",
    tag: "Eco",
  },
  {
    id: "p4",
    title: "Chic Pink Tee",
    price: 599,
    desc: "A lightweight pastel tee that brings elegance to casual wear.",
    category: "women",
    image: "/assets/images/tshirt3.png",
    images: ["/assets/images/tshirt3.png"],
    rating: 4.5,
    color: "pink",
  },
  {
    id: "p5",
    title: "Olive Comfort Tee",
    price: 549,
    desc: "Premium olive shade tee for smart-casual occasions.",
    category: "men",
    image: "/assets/images/tshirt7.png",
    images: ["/assets/images/tshirt7.png"],
    rating: 4.7,
    color: "green",
  },
  {
    id: "p6",
    title: "Sunny Yellow Tee",
    price: 529,
    desc: "Bright, cheerful, and perfect for sunny days.",
    category: "women",
    image: "/assets/images/tshirt8.png",
    images: ["/assets/images/tshirt8.png"],
    rating: 4.4,
    color: "yellow",
  },
];

// ---------- State ----------
const state = {
  all: PRODUCTS,
  filtered: PRODUCTS,
  page: 1,
  perPage: 8,
  filters: {
    category: "all",
    search: "",
    priceMin: null,
    priceMax: null,
    color: "",
    rating: 0,
  },
  sortBy: "featured",
  wishlist: JSON.parse(localStorage.getItem("pys_wishlist") || "[]"),
};

// ---------- DOM Elements ----------
const gridEl = document.getElementById("productGrid");
const paginationEl = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const sortByEl = document.getElementById("sortBy");

// ---------- Utility ----------
const formatINR = (v) => `₹${v.toLocaleString()}`;

// ---------- Apply Filters ----------
function applyFilters() {
  let products = [...state.all];

  const f = state.filters;

  // Category
  if (f.category !== "all") {
    products = products.filter((p) => p.category === f.category);
  }

  // Search
  if (f.search.trim() !== "") {
    const q = f.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
    );
  }

  // Price
  if (f.priceMin) products = products.filter((p) => p.price >= f.priceMin);
  if (f.priceMax) products = products.filter((p) => p.price <= f.priceMax);

  // Color
  if (f.color && f.color !== "") {
    products = products.filter((p) => (p.color || "").includes(f.color));
  }

  // Rating
  if (f.rating > 0) {
    products = products.filter((p) => p.rating >= f.rating);
  }

  // Sort
  switch (state.sortBy) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      products = products.reverse();
      break;
    case "popular":
      products.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  state.filtered = products;
  state.page = 1;
  renderGrid();
}

// ---------- Render Grid ----------
function renderGrid() {
  gridEl.innerHTML = "";

  const start = (state.page - 1) * state.perPage;
  const paginated = state.filtered.slice(start, start + state.perPage);

  if (paginated.length === 0) {
    gridEl.innerHTML = `<div class="col-span-full text-center text-[#353c1b]/70 py-12">No products found.</div>`;
    paginationEl.innerHTML = "";
    return;
  }

  paginated.forEach((p) => {
    const card = document.createElement("div");
    card.className =
      "group relative rounded-2xl overflow-hidden border border-[#a2c617]/30 bg-white shadow-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] card-shadow";

    card.innerHTML = `
      <button onclick="toggleWishlist(this,'${p.id}')" class="absolute end-4 top-4 z-10 rounded-full bg-white/80 backdrop-blur p-2 text-[#353c1b] hover:text-[#a2c617]" aria-label="wishlist">
        ${state.wishlist.includes(p.id) ? "❤️" : "🤍"}
      </button>

      <div class="overflow-hidden cursor-pointer" onclick="openQuickView(${JSON.stringify(p).replaceAll('"', '&quot;')})">
        <img src="${p.image}" alt="${p.title}" class="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>

      <div class="p-6">
        ${
          p.tag
            ? `<span class="inline-block bg-[#fee79c] text-[#353c1b] px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide">${p.tag}</span>`
            : ""
        }
        <h3 class="mt-4 text-lg font-semibold text-[#353c1b] group-hover:text-[#a2c617]">${p.title}</h3>
        <p class="mt-1 text-[#353c1b]/80 text-sm">${p.desc}</p>
        <p class="mt-2 text-xl font-extrabold">${formatINR(p.price)}</p>
        <div class="mt-4 grid">
          <button class="rounded-xl bg-gradient-to-r from-[#a2c617] to-[#fee79c] text-[#353c1b] font-medium py-2" onclick="addToCartAndGo({id:'${p.id}',title:'${p.title}',price:${p.price},image:'${p.image}'})">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    `;

    gridEl.appendChild(card);
  });

  renderPagination();
}

// ---------- Pagination ----------
function renderPagination() {
  const total = state.filtered.length;
  const pages = Math.ceil(total / state.perPage);
  paginationEl.innerHTML = "";

  if (pages <= 1) return;

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `px-3 py-1 rounded-lg border ${
      state.page === i ? "bg-[#a2c617] text-white" : "bg-white"
    }`;
    btn.addEventListener("click", () => {
      state.page = i;
      renderGrid();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    paginationEl.appendChild(btn);
  }
}

// ---------- Wishlist Toggle ----------
window.toggleWishlist = function (el, id) {
  const index = state.wishlist.indexOf(id);
  if (index === -1) {
    state.wishlist.push(id);
    el.textContent = "❤️";
  } else {
    state.wishlist.splice(index, 1);
    el.textContent = "🤍";
  }
  localStorage.setItem("pys_wishlist", JSON.stringify(state.wishlist));
};

// ---------- Filter Button Clicks ----------
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.category;
    state.filters.category = cat;
    applyFilters();
  });
});

// ---------- Search ----------
searchInput?.addEventListener("input", (e) => {
  state.filters.search = e.target.value;
  applyFilters();
});

// ---------- Sort ----------
sortByEl?.addEventListener("change", (e) => {
  state.sortBy = e.target.value;
  applyFilters();
});

// ---------- Price Filter ----------
document.getElementById("applyPrice")?.addEventListener("click", () => {
  const min = parseFloat(document.getElementById("priceMin").value) || null;
  const max = parseFloat(document.getElementById("priceMax").value) || null;
  state.filters.priceMin = min;
  state.filters.priceMax = max;
  applyFilters();
});

// ---------- Rating Filter ----------
document.getElementById("ratingFilter")?.addEventListener("change", (e) => {
  state.filters.rating = Number(e.target.value);
  applyFilters();
});

// ---------- Color Filter ----------
document.querySelectorAll(".color-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const color = btn.dataset.color;
    state.filters.color = color;
    applyFilters();
  });
});

// ---------- Reset Filters ----------
document.getElementById("resetFilters")?.addEventListener("click", () => {
  state.filters = {
    category: "all",
    search: "",
    priceMin: null,
    priceMax: null,
    color: "",
    rating: 0,
  };
  document.getElementById("priceMin").value = "";
  document.getElementById("priceMax").value = "";
  document.getElementById("ratingFilter").value = "0";
  state.sortBy = "featured";
  applyFilters();
});

// ---------- Init ----------
applyFilters();

console.log("🛍️ Shop initialized successfully");
