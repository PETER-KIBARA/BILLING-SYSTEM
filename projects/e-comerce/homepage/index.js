// ============================================
// SIMPLE & FOCUSED FUNCTIONALITY
// ============================================

// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Product data - ALL FOODS
const products = [
  { 
    id: 1,
    name: "Beef Burger", 
    price: 450, 
    img: "res/beef_burger.jpeg",
    description: "Juicy beef patty with fresh lettuce, tomato, cheese, and special sauce in a soft bun."
  },
  { 
    id: 2,
    name: "Cheese Pizza", 
    price: 900, 
    img: "res/cheese_pizza.jpeg",
    description: "12-inch pizza with mozzarella cheese, tomato sauce, and your choice of toppings."
  },
  { 
    id: 3,
    name: "French Fries", 
    price: 200, 
    img: "res/french_fries.jpeg",
    description: "Crispy golden fries served with ketchup or mayonnaise."
  },
  { 
    id: 4,
    name: "Chicken Wings", 
    price: 650, 
    img: "res/chicken_wings.jpg",
    description: "Spicy or BBQ chicken wings served with ranch dressing."
  },
  { 
    id: 5,
    name: "Sausage Roll", 
    price: 150, 
    img: "res/sausage_roll.jpg",
    description: "Flaky pastry wrapped around seasoned sausage meat."
  },
  { 
    id: 6,
    name: "Milkshake", 
    price: 300, 
    img: "res/milkshake.jpg",
    description: "Creamy milkshake available in chocolate, vanilla, or strawberry flavor."
  },
  { 
    id: 7,
    name: "Double Cheeseburger", 
    price: 550, 
    img: "res/double_burger.jpg",
    description: "Two juicy beef patties with double cheese, bacon, and special sauce."
  },
  { 
    id: 8,
    name: "Veggie Pizza", 
    price: 850, 
    img: "res/veggie_pizza.jpg",
    description: "12-inch pizza with fresh vegetables and mozzarella cheese."
  },
  { 
    id: 9,
    name: "Coca Cola", 
    price: 120, 
    img: "res/coke.jpg",
    description: "330ml can of Coca Cola."
  }
];

// 1. Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// 2. Toggle mobile menu (Hamburger functionality)
function toggleMenu() {
  let menu = document.getElementById("mobileMenu");
  if (menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}

// 3. View product detail
function viewProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    sessionStorage.setItem('currentProduct', JSON.stringify(product));
    window.location.href = 'product-detail.html';
  }
}

// 4. Add to cart
function addToCart(productId, quantity = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: quantity
    });
  }
  
  saveCart();
  alert(`${product.name} added to cart!`);
}

// 5. Initialize page
function initializePage() {
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    
    if (mobileMenu && hamburger && 
        !mobileMenu.contains(event.target) && 
        !hamburger.contains(event.target) &&
        mobileMenu.style.display === 'flex') {
      mobileMenu.style.display = 'none';
    }
  });
  
  // Add click handlers to all cards for product detail view
  document.querySelectorAll('.card').forEach(card => {
    card.style.cursor = 'pointer';
  });
  
  // Setup search functionality
  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    searchBar.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
          sessionStorage.setItem('searchQuery', query);
          window.location.href = 'menu.html';
        }
      }
    });
  }
}

// Run initialization when page loads
document.addEventListener('DOMContentLoaded', initializePage);

// Also initialize when navigating back/forward
window.addEventListener('pageshow', initializePage);