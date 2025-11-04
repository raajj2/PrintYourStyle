// === CART MANAGEMENT ===
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// === ADD TO CART ===
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  showCartPopup(`${product.name} added to cart`);
}

// === SHOW POPUP (like your screenshot) ===
function showCartPopup(message) {
  const oldPopup = document.getElementById('cart-popup');
  if (oldPopup) oldPopup.remove();

  const popup = document.createElement('div');
  popup.id = 'cart-popup';
  popup.className =
    'fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#1c1c1c] text-white text-sm font-medium px-6 py-3 rounded-full shadow-lg transition-all duration-500 opacity-0 translate-y-4 z-50';
  popup.textContent = message;

  document.body.appendChild(popup);

  // Animate in
  setTimeout(() => {
    popup.classList.remove('opacity-0', 'translate-y-4');
    popup.classList.add('opacity-100', 'translate-y-0');
  }, 50);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    popup.classList.remove('opacity-100', 'translate-y-0');
    popup.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => popup.remove(), 400);
  }, 3000);
}

// === QUICK VIEW ADD TO CART ===
function quickAddToCart(product) {
  addToCart(product);
  const modal = document.getElementById('quickViewModal');
  if (modal) modal.classList.add('hidden');
}

// === LOAD CART PAGE ===
if (document.getElementById('cart-items')) {
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalElement = document.getElementById('cart-total');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-center text-lg">Your cart is empty 🛍️</p>`;
    totalElement.textContent = '₹0';
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    container.innerHTML += `
      <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow">
        <div class="flex items-center gap-4">
          <img src="${item.image}" class="w-20 h-20 rounded-lg object-cover" alt="${item.name}">
          <div>
            <h3 class="font-semibold text-lg">${item.name}</h3>
            <p>₹${item.price} × ${item.quantity}</p>
          </div>
        </div>
        <button onclick="removeFromCart(${index})" class="text-red-500 font-semibold hover:underline">Remove</button>
      </div>
    `;
  });

  totalElement.textContent = `₹${total}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  showCartPopup('Item removed from cart');
}

function readCart(){ return JSON.parse(localStorage.getItem('cart') || '[]'); }
  function saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); }
  function renderCart(){
    const cart = readCart();
    const list = document.getElementById('cartList');
    const countNum = document.getElementById('cartCountNum');
    countNum.textContent = cart.reduce((s,i)=> s + (i.qty||0), 0);
    if(!cart.length){
      list.innerHTML = '<div class="text-center py-12 text-[#333]/70">Your cart is empty. <a href="index.html" class="text-[#a2c617] underline">Continue shopping</a></div>';
      document.getElementById('subtotal').textContent = '$0.00';
      document.getElementById('grandTotal').textContent = '$0.00';
      document.getElementById('shipping').textContent = '$0.00';
      return;
    }
    list.innerHTML = '';
    cart.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'flex items-center gap-4 border-b last:border-b-0 py-4';
      row.innerHTML = `
        <img src="${it.image||''}" alt="${it.title}" class="w-24 h-24 object-cover rounded-lg bg-gray-50"/>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-[#353c1b]">${it.title}</div>
              <div class="text-sm text-[#353c1b]/70 mt-1">$${(it.price||0).toFixed(2)}</div>
            </div>
            <div class="text-right">
              <div class="text-sm text-[#353c1b]/80">Total</div>
              <div class="font-semibold">$${((it.price||0) * (it.qty||1)).toFixed(2)}</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-3">
            <div class="flex items-center border rounded-md overflow-hidden border-[#a2c617]/30">
              <button class="px-3 py-1 change-qty" data-idx="${idx}" data-op="dec">−</button>
              <input class="w-16 text-center border-0 outline-none qty-input" data-idx="${idx}" value="${it.qty||1}" type="number" min="1"/>
              <button class="px-3 py-1 change-qty" data-idx="${idx}" data-op="inc">+</button>
            </div>
            <button class="px-3 py-1 border rounded remove-btn" data-idx="${idx}">Remove</button>
          </div>
        </div>
      `;
      list.appendChild(row);
    });
    // attach handlers
    document.querySelectorAll('.change-qty').forEach(b=>{
      b.addEventListener('click', ()=> {
        const idx = parseInt(b.getAttribute('data-idx'));
        const op = b.getAttribute('data-op');
        const cart = readCart();
        if(op==='dec') cart[idx].qty = Math.max(1, (cart[idx].qty||1) - 1);
        else cart[idx].qty = (cart[idx].qty||1) + 1;
        saveCart(cart); renderCart(); showToast('Quantity updated');
      });
    });
    document.querySelectorAll('.qty-input').forEach(inp=>{
      inp.addEventListener('change', ()=> {
        const idx = parseInt(inp.getAttribute('data-idx'));
        const val = Math.max(1, parseInt(inp.value || '1'));
        const cart = readCart();
        cart[idx].qty = val;
        saveCart(cart); renderCart();
      });
    });
    document.querySelectorAll('.remove-btn').forEach(b=>{
      b.addEventListener('click', ()=> {
        const idx = parseInt(b.getAttribute('data-idx'));
        const cart = readCart();
        cart.splice(idx,1);
        saveCart(cart); renderCart(); showToast('Removed item');
      });
    });
    // totals
    const subtotal = cart.reduce((s,i)=> s + ((i.price||0) * (i.qty||1)), 0);
    const shipping = subtotal > 50 ? 0 : 4.99;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('grandTotal').textContent = `$${(subtotal + shipping).toFixed(2)}`;
  }
  function showToast(text, t=1400){
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(()=> el.style.opacity = '1', 20);
    setTimeout(()=> { el.style.transition='opacity .28s'; el.style.opacity='0'; setTimeout(()=> el.remove(),300); }, t);
  }
  document.getElementById('clearBtn').addEventListener('click', ()=> {
    saveCart([]); renderCart(); showToast('Cart cleared');
  });
  document.getElementById('checkoutBtn').addEventListener('click', ()=> {
    showToast('Checkout demo — integrate your gateway');
  });
  // initial render
  renderCart();