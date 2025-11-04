
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mobileMenuBtn");
  const menu = document.getElementById("mobileMenu");
  const openIcon = document.getElementById("menuIcon");
  const closeIcon = document.getElementById("closeIcon");
  btn.addEventListener("click", () => {
    const isOpen = !menu.classList.contains("hidden");
    menu.classList.toggle("hidden", isOpen);
    openIcon.classList.toggle("hidden", !isOpen);
    closeIcon.classList.toggle("hidden", isOpen);
  });
});

AOS.init({
  duration: 800,     // Animation duration (ms)
  easing: 'ease-in-out',
  once: true,        // Animation happens once
  offset: 100,       // Trigger when 100px away from viewport
});





let galleryImages = [], currentIndex = 0, lastFocused = null, currentItem=null;

function openQuickView(d){
  lastFocused = document.activeElement;
  currentItem = d;
  document.getElementById('modalTitle').textContent = d.title || '';
  document.getElementById('modalPrice').textContent = d.price ? ('$' + (typeof d.price==='number' ? d.price.toFixed(2) : d.price)) : '';
  document.getElementById('modalDesc').textContent = d.desc || '';
  galleryImages = d.images || (d.image? [d.image] : []);
  currentIndex = 0;
  const main = document.getElementById('modalMainImage');
  const thumbs = document.getElementById('thumbs');
  thumbs.innerHTML = '';
  if(galleryImages.length){
    main.src = galleryImages[0];
    galleryImages.forEach((s,i)=>{
      const t = document.createElement('img');
      t.src = s;
      t.className = 'w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-[#a2c617]';
      t.style.minWidth='80px';
      t.onclick = ()=> setMainImage(i);
      if(i===0) t.classList.add('thumb-active');
      thumbs.appendChild(t);
    });
  } else {
    main.src = d.image || '';
  }
  document.getElementById('prevBtn').style.display = galleryImages.length>1? 'block':'none';
  document.getElementById('nextBtn').style.display = galleryImages.length>1? 'block':'none';
  document.getElementById('quickViewModal').classList.remove('hidden');
  document.body.style.overflow='hidden';
  document.getElementById('qtyInput').value = 1;
  // attach modal add button to add current item then redirect
  const modalAdd = document.getElementById('modalAddBtn');
  // modalAdd.onclick = ()=> {
  //   const qty = Math.max(1, parseInt(document.getElementById('qtyInput').value || '1'));
  //   addToCartAndGo({ id: d.id || d.title.toLowerCase().replace(/\s+/g,'-'), title: d.title, price: d.price, image: d.image || (galleryImages[0]||'') }, qty);
  // };
  modalAdd.onclick = () => {
  const qty = Math.max(1, parseInt(document.getElementById('qtyInput').value || '1'));
  addToCart({
    id: d.id || d.title.toLowerCase().replace(/\s+/g, '-'),
    title: d.title,
    price: d.price,
    image: d.image || (galleryImages[0] || '')
  }, qty);

  closeQuickView(); // 👈 Closes modal
  showToast(`${d.title} added to cart 🛒`);

};

  // key handlers
  window.addEventListener('keydown', modalKeyHandler);
}
function setMainImage(i){
  if(!galleryImages.length) return;
  currentIndex = i;
  document.getElementById('modalMainImage').src = galleryImages[i];
  document.querySelectorAll('#thumbs img').forEach((el,idx)=> el.classList.toggle('thumb-active', idx===i));
}
document.getElementById('prevBtn').onclick = ()=> { if(galleryImages.length) setMainImage((currentIndex-1+galleryImages.length)%galleryImages.length); };
document.getElementById('nextBtn').onclick = ()=> { if(galleryImages.length) setMainImage((currentIndex+1)%galleryImages.length); };
function closeQuickView(){
  document.getElementById('quickViewModal').classList.add('hidden');
  document.body.style.overflow='';
  window.removeEventListener('keydown', modalKeyHandler);
  if(lastFocused && lastFocused.focus) lastFocused.focus();
}
function modalKeyHandler(e){
  if(e.key==='Escape') closeQuickView();
  if(e.key==='ArrowLeft') { if(galleryImages.length) setMainImage((currentIndex-1+galleryImages.length)%galleryImages.length); }
  if(e.key==='ArrowRight') { if(galleryImages.length) setMainImage((currentIndex+1)%galleryImages.length); }
}
document.getElementById('quickViewModal').addEventListener('click', function(e){ if(e.target===this) closeQuickView(); });
// qty controls inside modal
document.getElementById('qtyPlus').addEventListener('click', ()=> { const q=document.getElementById('qtyInput'); q.value = parseInt(q.value||'1')+1; });
document.getElementById('qtyMinus').addEventListener('click', ()=> { const q=document.getElementById('qtyInput'); q.value = Math.max(1, parseInt(q.value||'1')-1); });
// color/sizes UI
document.querySelectorAll('#sizeGroup .size-btn').forEach(b=> b.addEventListener('click', ()=> { document.querySelectorAll('#sizeGroup .size-btn').forEach(x=> x.classList.remove('bg-[#a2c617]','text-white')); b.classList.add('bg-[#a2c617]','text-white'); }));
document.querySelectorAll('#colorGroup .color-swatch').forEach(c=> c.addEventListener('click', ()=> { document.querySelectorAll('#colorGroup .color-swatch').forEach(x=> x.classList.remove('swatch-active')); c.classList.add('swatch-active'); }));
// ensure update count on load
updateCartBadge();

function readCart(){ return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); }

function updateCartBadge(){
  const cart = readCart();
  const count = cart.reduce((s,i)=> s + (i.qty||0), 0);
  document.getElementById('cartCount').textContent = count;
}
updateCartBadge();

function showToast(text, t=1400){
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(()=> el.style.opacity = '1', 20);
  setTimeout(()=> { el.style.transition='opacity .28s'; el.style.opacity='0'; setTimeout(()=> el.remove(),300); }, t);
}

function addToCart(item, qty=1){
  const cart = readCart();
  const idx = cart.findIndex(x=>x.id===item.id);
  if(idx>-1){ cart[idx].qty = (cart[idx].qty||0) + qty; }
  else { cart.push({ id:item.id, title:item.title, price: item.price, image: item.image || '', qty }); }
  saveCart(cart);
  updateCartBadge();
  showToast(`${item.title} added to cart 🛒`);
}
// ✅ Add to cart without redirect, show toast at bottom
function addToCartAndGo(item, qty=1){
  addToCart(item, qty);
  showToast(`${item.title} added to cart 🛒`);
}

// Show or hide the Go to Top button when scrolling
window.addEventListener("scroll", function() {
  const goTopBtn = document.getElementById("goTopBtn");
  if (window.scrollY > 300) {
    goTopBtn.classList.remove("hidden");
  } else {
    goTopBtn.classList.add("hidden");
  }
});

// Smooth scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function toggleWishlist(btn,id){
  const w = JSON.parse(localStorage.getItem('wishlist')||'[]');
  const i = w.indexOf(id);
  if(i>-1){ w.splice(i,1); btn.textContent='🤍'; showToast('Removed from wishlist'); }
  else { w.push(id); btn.textContent='❤️'; showToast('Added to wishlist'); }
  localStorage.setItem('wishlist', JSON.stringify(w));
}
window.toggleWishlist = toggleWishlist;


// Initialize animations
AOS.init();
// Enable Lucide icons
lucide.createIcons();
// Scroll to top button logic
const scrollBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.remove('hidden');
  } else {
    scrollBtn.classList.add('hidden');
  }
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});