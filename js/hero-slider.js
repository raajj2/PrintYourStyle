// hero-slider.js

const heroSlider = document.getElementById('hero-slider');
const heroImg = document.getElementById('hero-img');
const heroTitle = document.getElementById('hero-title');
const heroDesc = document.getElementById('hero-desc');

// Your image paths (update as needed)
const slides = [
  {
    img: 'assets/images/im1.jpg',
    title: 'Design Your Dream T-Shirt',
    desc: 'Bring your imagination to life with PrintYourStyle! Choose your color, upload your design, and wear your creativity.',
    bg: '#fee79c'
  },
  {
    img: 'assets/images/im2.jpg',
    title: 'Express Your Style',
    desc: 'Personalize your outfits effortlessly. Your creativity deserves to be seen!',
    bg: '#fec8d0'
  },
  {
    img: 'assets/images/im3.jpg',
    title: 'Wear Your Imagination',
    desc: 'Unique designs, made by you. Every shirt tells your story.',
    bg: '#d1a9e8'
  }
];

let current = 0;

// ✅ Function to update slide
function updateHeroSlide() {
  const slide = slides[current];

  heroImg.src = slide.img;
  heroTitle.textContent = slide.title;
  heroDesc.textContent = slide.desc;

  // Smooth color transition
  heroSlider.style.transition = 'background-color 0.7s ease-in-out';
  heroSlider.style.backgroundColor = slide.bg;
}

// ✅ Next & Prev functions
function heroNext() {
  current = (current + 1) % slides.length;
  updateHeroSlide();
}

function heroPrev() {
  current = (current - 1 + slides.length) % slides.length;
  updateHeroSlide();
}

// ✅ Auto change every 5 seconds
setInterval(heroNext, 5000);

// ✅ Initial load
updateHeroSlide();
