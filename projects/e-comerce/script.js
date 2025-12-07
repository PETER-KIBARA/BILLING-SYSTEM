// ============================================
// GLOBAL VARIABLES AND DATA
// ============================================

// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Product data with categories
const products = [
  { 
    id: 1,
    name: "Beef Burger", 
    price: 450, 
    img: "res/beef_burger.jpeg",
    description: "Juicy beef patty with fresh lettuce, tomato, cheese, and special sauce in a soft bun.",
    category: "burger"
  },
  { 
    id: 2,
    name: "Cheese Pizza", 
    price: 900, 
    img: "res/cheese_pizza.jpeg",
    description: "12-inch pizza with mozzarella cheese, tomato sauce, and your choice of toppings.",
    category: "pizza"
  },
  { 
    id: 3,
    name: "French Fries", 
    price: 200, 
    img: "res/french_fries.jpeg",
    description: "Crispy golden fries served with ketchup or mayonnaise.",
    category: "sides"
  },
  { 
    id: 4,
    name: "Chicken Wings", 
    price: 650, 
    img: "res/chicken_wings.jpeg",
    description: "Spicy or BBQ chicken wings served with ranch dressing.",
    category: "sides"
  },
  { 
    id: 5,
    name: "Sausage Roll", 
    price: 150, 
    img: "res/sausage_roll.jpeg",
    description: "Flaky pastry wrapped around seasoned sausage meat.",
    category: "sides"
  },
  { 
    id: 6,
    name: "Milkshake", 
    price: 300, 
    img: "res/milkshake.jpeg",
    description: "Creamy milkshake available in chocolate, vanilla, or strawberry flavor.",
    category: "drinks"
  },
  { 
    id: 7,
    name: "Double Cheeseburger", 
    price: 550, 
    img: "res/double_burger.jpeg",
    description: "Two juicy beef patties with double cheese, bacon, and special sauce.",
    category: "burger"
  },
  { 
    id: 8,
    name: "Veggie Pizza", 
    price: 850, 
    img: "res/veggie_pizza.jpeg",
    description: "12-inch pizza with fresh vegetables and mozzarella cheese.",
    category: "pizza"
  },
  { 
    id: 9,
    name: "Coca Cola", 
    price: 120, 
    img: "res/coke.jpeg",
    description: "330ml can of Coca Cola.",
    category: "drinks"
  }
];

// Family meal deals
const mealDeals = [
  {
    id: 100,
    name: "Family Feast",
    price: 2200,
    items: ["2 Large Pizzas", "1 Burger", "2 Fries", "2 Sodas"],
    oldPrice: 2800,
    img: "res/family_comb.jpeg"
  },
  {
    id: 101,
    name: "Burger Combo",
    price: 2800,
    items: ["4 Beef Burgers", "4 Fries", "4 Milkshakes"],
    oldPrice: 3400,
    img: "res/burger_combo.jpg"
  },
  {
    id: 102,
    name: "Pizza Party",
    price: 3000,
    items: ["3 Medium Pizzas", "Chicken Wings", "Garlic Bread", "2 Liter Soda"],
    oldPrice: 3600,
    img: "res/pizza_party.jpg"
  }
];

// Current category filter
let currentCategory = 'all';

// ============================================
// CORE CART FUNCTIONS
// ============================================

// Save cart to localStorage

function loadAllFoods() {
  const container = document.getElementById('allFoodsGrid');
  if (!container) return;
  
  container.innerHTML = '';
  
  products.forEach(p => {
    container.innerHTML += `
      <div class="card" onclick="viewProductDetail(${p.id})">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='res/default-food.jpg'">
        <div class="card-category">${p.category.charAt(0).toUpperCase() + p.category.slice(1)}</div>
        <h3>${p.name}</h3>
        <p class="price">Ksh ${p.price}</p>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
  });
}

function filterAllFoods(category) {
  // Update active button
  document.querySelectorAll('.home-category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  const container = document.getElementById('allFoodsGrid');
  if (!container) return;
  
  container.innerHTML = '';
  
  let filteredProducts = products;
  
  if (category !== 'all') {
    filteredProducts = products.filter(p => p.category === category);
  }
  
  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search" style="font-size: 48px; color: #ddd;"></i>
        <h3>No items found in this category</h3>
        <p>Try another category or browse all foods</p>
      </div>
    `;
    return;
  }
  
  filteredProducts.forEach(p => {
    container.innerHTML += `
      <div class="card" onclick="viewProductDetail(${p.id})">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='res/default-food.jpg'">
        <div class="card-category">${p.category.charAt(0).toUpperCase() + p.category.slice(1)}</div>
        <h3>${p.name}</h3>
        <p class="price">Ksh ${p.price}</p>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
  });
}

function searchAllFoods() {
  const query = document.getElementById('homeSearchInput').value.toLowerCase();
  const container = document.getElementById('allFoodsGrid');
  if (!container) return;
  
  container.innerHTML = '';
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.description.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
  
  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search" style="font-size: 48px; color: #ddd;"></i>
        <h3>No foods found</h3>
        <p>Try a different search term</p>
      </div>
    `;
    return;
  }
  
  filteredProducts.forEach(p => {
    container.innerHTML += `
      <div class="card" onclick="viewProductDetail(${p.id})">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='res/default-food.jpg'">
        <div class="card-category">${p.category.charAt(0).toUpperCase() + p.category.slice(1)}</div>
        <h3>${p.name}</h3>
        <p class="price">Ksh ${p.price}</p>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
  });
}

// Update your initializePage function to include:
function initializePage() {
  updateCartCount();
  
  const path = window.location.pathname;
  
  // Homepage
  if (path.includes("index.html") || path === "/" || path.endsWith("/")) {
    loadAllFoods();
    
    // Setup homepage search and filters
    const homeSearchInput = document.getElementById('homeSearchInput');
    if (homeSearchInput) {
      homeSearchInput.addEventListener('keyup', searchAllFoods);
    }
    
    document.querySelectorAll('.home-category-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        filterAllFoods(category);
      });
    });
  }
  
  // ... rest of your existing initialization code
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // Refresh cart-related displays
  if (window.location.pathname.includes('cart.html')) {
    loadCart();
  }
  if (window.location.pathname.includes('menu.html')) {
    loadCartPreview();
  }
}

// Update cart count in header
function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  countElements.forEach(element => {
    element.textContent = totalItems;
  });
}

// Add item to cart
function addToCart(productId, quantity = 1, instructions = '') {
  // Check if it's a regular product or a meal deal
  const product = products.find(p => p.id === productId);
  const mealDeal = mealDeals.find(m => m.id === productId);
  
  let itemToAdd;
  
  if (product) {
    itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: quantity,
      instructions: instructions,
      type: 'product'
    };
  } else if (mealDeal) {
    itemToAdd = {
      id: mealDeal.id,
      name: mealDeal.name,
      price: mealDeal.price,
      img: mealDeal.img || 'res/deal.jpg',
      quantity: quantity,
      instructions: "Family Meal Deal",
      type: 'mealDeal'
    };
  } else {
    console.error('Product not found');
    return;
  }
  
  const existingItem = cart.find(item => item.id === productId && item.type === itemToAdd.type);
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.instructions = instructions || existingItem.instructions;
  } else {
    cart.push(itemToAdd);
  }
  
  saveCart();
  
  // Show notification
  showNotification(`${quantity} ${itemToAdd.name}(s) added to cart!`);
}

// Remove item from cart
function removeCartItem(index) {
  if (confirm('Remove this item from cart?')) {
    cart.splice(index, 1);
    saveCart();
  }
}

// Update cart item quantity
function updateCartItemQuantity(index, change) {
  cart[index].quantity += change;
  
  if (cart[index].quantity < 1) {
    cart.splice(index, 1);
  }
  
  saveCart();
}

// ============================================
// PRODUCT DISPLAY FUNCTIONS
// ============================================

// Load products with filtering
function loadProducts(filter = 'all') {
  const list = document.getElementById("productList");
  if (!list) return;
  
  list.innerHTML = "";
  
  let filteredProducts = products;
  
  if (filter !== 'all') {
    filteredProducts = products.filter(p => p.category === filter);
  }
  
  filteredProducts.forEach(p => {
    list.innerHTML += `
      <div class="card" onclick="viewProductDetail(${p.id})">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='res/default-food.jpg'">
        <h3>${p.name}</h3>
        <p class="price">Ksh ${p.price}</p>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
  });
}

// Load featured products on homepage
function loadFeaturedProducts() {
  const container = document.getElementById("featuredProducts");
  if (!container) return;
  
  container.innerHTML = "";
  
  // Show first 3 products as featured
  products.slice(0, 3).forEach(p => {
    container.innerHTML += `
      <div class="card" onclick="viewProductDetail(${p.id})">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='res/default-food.jpg'">
        <h3>${p.name}</h3>
        <p class="price">Ksh ${p.price}</p>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
  });
}

// Load meal deals
function loadMealDeals() {
  const container = document.getElementById("dealsGrid");
  if (!container) return;
  
  container.innerHTML = "";
  
  mealDeals.forEach(deal => {
    container.innerHTML += `
      <div class="deal-card">
        <div class="deal-badge">${deal.id === 100 ? 'Most Popular' : deal.id === 101 ? 'Best Value' : 'New'}</div>
        <h3>${deal.name}</h3>
        <ul>
          ${deal.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <p class="price">Ksh ${deal.price} <span class="old-price">Ksh ${deal.oldPrice}</span></p>
        <button class="deal-btn" onclick="addToCart(${deal.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
  });
}

// ============================================
// PRODUCT DETAIL FUNCTIONS
// ============================================

// View product detail
function viewProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    sessionStorage.setItem('currentProduct', JSON.stringify(product));
    window.location.href = 'product-detail.html';
  }
}

// Load product detail page
function loadProductDetail() {
  if (!window.location.pathname.includes('product-detail.html')) return;
  
  const product = JSON.parse(sessionStorage.getItem('currentProduct'));
  if (!product) {
    window.location.href = 'menu.html';
    return;
  }
  
  document.getElementById('detailName').textContent = product.name;
  document.getElementById('detailDescription').textContent = product.description;
  document.getElementById('detailPrice').textContent = `Ksh ${product.price}`;
  document.getElementById('detailImage').src = product.img;
  document.getElementById('detailImage').alt = product.name;
  
  // Set fallback image
  document.getElementById('detailImage').onerror = function() {
    this.src = 'res/default-food.jpg';
  };
}

// Add to cart from detail page
function addToCartFromDetail() {
  const product = JSON.parse(sessionStorage.getItem('currentProduct'));
  const quantity = parseInt(document.getElementById('quantity').value) || 1;
  const instructions = document.getElementById('instructions').value;
  
  addToCart(product.id, quantity, instructions);
}

// Update quantity in detail page
function updateQuantity(change) {
  const input = document.getElementById('quantity');
  let value = parseInt(input.value) + change;
  
  if (value < 1) value = 1;
  if (value > 10) value = 10;
  
  input.value = value;
}

// Buy now function
function buyNow() {
  const product = JSON.parse(sessionStorage.getItem('currentProduct'));
  const quantity = parseInt(document.getElementById('quantity').value) || 1;
  
  addToCart(product.id, quantity);
  proceedToCheckout();
}

// ============================================
// CART PAGE FUNCTIONS
// ============================================

// Load cart items
function loadCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart" style="font-size: 60px; color: #ddd;"></i>
        <h3>Your cart is empty</h3>
        <p>Add some delicious items from our menu!</p>
        <button class="cta-btn" onclick="window.location.href='menu.html'">Browse Menu</button>
      </div>
    `;
    updateCartSummary();
    return;
  }
  
  cart.forEach((item, index) => {
    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" onerror="this.src='res/default-food.jpg'">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p class="cart-item-price">Ksh ${item.price * item.quantity}</p>
          <p>Quantity: ${item.quantity}</p>
          ${item.instructions ? `<p><small>Note: ${item.instructions}</small></p>` : ''}
        </div>
        <div class="cart-item-actions">
          <button onclick="updateCartItemQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateCartItemQuantity(${index}, 1)">+</button>
          <span class="remove-item" onclick="removeCartItem(${index})">
            <i class="fas fa-trash"></i> Remove
          </span>
        </div>
      </div>
    `;
  });
  
  updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;
  
  const subtotalEl = document.getElementById('subtotal');
  const totalAmountEl = document.getElementById('totalAmount');
  
  if (subtotalEl) subtotalEl.textContent = `Ksh ${subtotal}`;
  if (totalAmountEl) totalAmountEl.textContent = `Ksh ${total}`;
}

// ============================================
// MENU PAGE SPECIFIC FUNCTIONS
// ============================================

// Filter products by category
function filterProducts(category) {
  currentCategory = category;
  
  // Update active button
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.includes(category.charAt(0).toUpperCase() + category.slice(1)) || 
        (category === 'all' && btn.textContent.includes('All'))) {
      btn.classList.add('active');
    }
  });
  
  loadProducts(category);
}

// Load cart preview in menu sidebar
function loadCartPreview() {
  const preview = document.getElementById('cartPreview');
  if (!preview) return;
  
  if (cart.length === 0) {
    preview.innerHTML = '<p>Your cart is empty</p>';
    return;
  }
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  preview.innerHTML = `
    <p>${totalItems} item${totalItems !== 1 ? 's' : ''} in cart</p>
    <p class="preview-total">Total: Ksh ${totalPrice}</p>
  `;
}

// Add today's special to cart
function addSpecialToCart() {
  const specialProduct = products.find(p => p.name === "Double Cheeseburger") || products[0];
  addToCart(specialProduct.id, 1, "Today's Special");
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

// Search products
function searchProducts() {
  let searchInput;
  
  // Check which search input to use
  if (document.getElementById('menuSearchInput')) {
    searchInput = document.getElementById('menuSearchInput');
  } else if (document.getElementById('searchInput')) {
    searchInput = document.getElementById('searchInput');
  } else {
    return;
  }
  
  const query = searchInput.value.toLowerCase();
  const list = document.getElementById("productList");

  if (!list) return;
  
  list.innerHTML = "";

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.description.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  if (filteredProducts.length === 0) {
    list.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search" style="font-size: 48px; color: #ddd;"></i>
        <h3>No products found</h3>
        <p>Try a different search term</p>
      </div>
    `;
    return;
  }

  filteredProducts.forEach(p => {
    list.innerHTML += `
      <div class="card" onclick="viewProductDetail(${p.id})">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='res/default-food.jpg'">
        <h3>${p.name}</h3>
        <p class="price">Ksh ${p.price}</p>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
  });
}

// ============================================
// CHECKOUT AND ORDER FUNCTIONS
// ============================================

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty! Add some items first.');
    return;
  }
  
  // Store order details
  const order = {
    items: cart,
    subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    deliveryFee: 150,
    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 150,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('currentOrder', JSON.stringify(order));
  
  // For demo purposes - in real app, redirect to payment page
  showNotification(`Order total: Ksh ${order.total}\nRedirecting to payment...`);
  
  // Simulate payment processing
  setTimeout(() => {
    if (confirm('Payment Successful!\n\nYour order has been placed.\nClear cart?')) {
      cart = [];
      saveCart();
      window.location.href = 'index.html';
    }
  }, 1000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Toggle mobile menu
function toggleMenu() {
  let menu = document.getElementById("mobileMenu");
  if (menu) {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
  }
}

// Show notification
function showNotification(message) {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create new notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;
  
  // Add styles if not already present
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideIn 0.3s ease;
      }
      .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}

// ============================================
// PAGE INITIALIZATION
// ============================================

// Initialize page
function initializePage() {
  // Always update cart count
  updateCartCount();
  
  const path = window.location.pathname;
  
  // Homepage
  if (path.includes("index.html") || path === "/" || path.endsWith("/")) {
    loadFeaturedProducts();
  }
  
  // Menu page
  if (path.includes("menu.html") || path.includes("product.html")) {
    loadProducts(currentCategory);
    loadCartPreview();
    loadMealDeals();
    
    // Setup category filter buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const category = this.getAttribute('onclick').match(/'([^']+)'/)[1];
        filterProducts(category);
      });
    });
  }
  
  // Product detail page
  if (path.includes("product-detail.html")) {
    loadProductDetail();
  }
  
  // Cart page
  if (path.includes("cart.html")) {
    loadCart();
  }
  
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
}

// Run initialization when page loads
document.addEventListener('DOMContentLoaded', initializePage);

// Also run when navigating back/forward
window.addEventListener('pageshow', initializePage);