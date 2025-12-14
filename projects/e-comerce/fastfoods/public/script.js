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
    img: "res/family_combo.jpeg"
  },
  {
    id: 101,
    name: "Burger Combo",
    price: 2800,
    items: ["4 Beef Burgers", "4 Fries", "4 Milkshakes"],
    oldPrice: 3400,
    img: "res/burger_combo.png"
  },
  {
    id: 102,
    name: "Pizza Party",
    price: 3000,
    items: ["3 Medium Pizzas", "Chicken Wings", "Garlic Bread", "2 Liter Soda"],
    oldPrice: 3600,
    img: "res/pizza_party.png"
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
      img: mealDeal.img || 'res/deal.jpeg',
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

// Proceed to checkout (legacy function - now opens modal)
function proceedToCheckout() {
  openCheckoutModal();
}

// ============================================
// MODAL FUNCTIONS (Week 6: Secure Forms)
// ============================================

// Open checkout modal
function openCheckoutModal() {
  if (cart.length === 0) {
    showNotification('Your cart is empty! Add some items first.');
    return;
  }
  
  // Check if user is logged in (Firebase or localStorage)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const hasFirebaseAuth = window.firebaseAuth && window.firebaseAuth.currentUser;
  
  if (!isLoggedIn && !hasFirebaseAuth) {
    // Redirect to login page with redirect parameter
    const currentUrl = window.location.href;
    window.location.href = `login.html?redirect=${encodeURIComponent(currentUrl)}`;
    return;
  }
  
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;
  
  // Load checkout items
  loadCheckoutItems();
  
  // Update totals
  updateCheckoutTotals();
  
  // Pre-fill form if user data exists
  prefillCheckoutForm();
  
  // Show modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Setup payment method change handler
  setupPaymentMethodHandlers();
}

// Close checkout modal
function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Open registration modal
function openRegistrationModal() {
  const modal = document.getElementById('registrationModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

// Close registration modal
function closeRegistrationModal() {
  const modal = document.getElementById('registrationModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    // Reset form
    document.getElementById('registrationForm').reset();
    clearFormErrors('registrationForm');
  }
}

// Open login modal
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

// Close login modal
function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    // Reset form
    document.getElementById('loginForm').reset();
    clearFormErrors('loginForm');
  }
}

// Load checkout items in modal
function loadCheckoutItems() {
  const container = document.getElementById('checkoutItemsList');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty</p>';
    return;
  }
  
  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'checkout-item';
    itemDiv.innerHTML = `
      <span class="checkout-item-name">${item.name} x${item.quantity}</span>
      <span class="checkout-item-price">Ksh ${item.price * item.quantity}</span>
    `;
    container.appendChild(itemDiv);
  });
}

// Update checkout totals in modal
function updateCheckoutTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;
  
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const deliveryFeeEl = document.getElementById('checkoutDeliveryFee');
  const totalEl = document.getElementById('checkoutTotal');
  
  if (subtotalEl) subtotalEl.textContent = `Ksh ${subtotal}`;
  if (deliveryFeeEl) deliveryFeeEl.textContent = `Ksh ${deliveryFee}`;
  if (totalEl) totalEl.textContent = `Ksh ${total}`;
}

// Setup payment method change handlers
function setupPaymentMethodHandlers() {
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
  const mpesaDetails = document.getElementById('mpesaDetails');
  const cardDetails = document.getElementById('cardDetails');
  
  paymentMethods.forEach(method => {
    method.addEventListener('change', function() {
      if (this.value === 'mpesa') {
        mpesaDetails.style.display = 'block';
        cardDetails.style.display = 'none';
        // Clear card fields
        document.getElementById('cardNumber').value = '';
        document.getElementById('cardExpiry').value = '';
        document.getElementById('cardCVV').value = '';
        document.getElementById('cardName').value = '';
      } else {
        mpesaDetails.style.display = 'none';
        cardDetails.style.display = 'block';
        // Clear M-Pesa field
        document.getElementById('mpesaPhone').value = '';
      }
    });
  });
}

// Format card number
function formatCardNumber(input) {
  let value = input.value.replace(/\s/g, '');
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
  input.value = formattedValue;
}

// Format card expiry
function formatCardExpiry(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  input.value = value;
}

// Toggle password visibility
function togglePasswordVisibility(inputId, icon) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

// Clear form errors
function clearFormErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  const errorMessages = form.querySelectorAll('.error-message');
  errorMessages.forEach(error => {
    error.textContent = '';
  });
  
  const errorInputs = form.querySelectorAll('.error');
  errorInputs.forEach(input => {
    input.classList.remove('error');
  });
}

// Show field error
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + 'Error');
  
  if (field) {
    field.classList.add('error');
  }
  
  if (errorEl) {
    errorEl.textContent = message;
  }
}

// Clear field error
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + 'Error');
  
  if (field) {
    field.classList.remove('error');
  }
  
  if (errorEl) {
    errorEl.textContent = '';
  }
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone (Kenyan format)
function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 9 && (cleaned.startsWith('254') || cleaned.startsWith('0') || cleaned.length === 9);
}

// Validate password
function validatePassword(password) {
  // At least 8 characters, contains letters and numbers
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
}

// Validate card number
function validateCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleaned);
}

// Validate card expiry
function validateCardExpiry(expiry) {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  
  const month = parseInt(match[1]);
  const year = parseInt('20' + match[2]);
  const now = new Date();
  const expiryDate = new Date(year, month - 1);
  
  return month >= 1 && month <= 12 && expiryDate > now;
}

// Validate CVV
function validateCVV(cvv) {
  return /^\d{3,4}$/.test(cvv);
}

// Handle registration form submission
function handleRegistration(event) {
  event.preventDefault();
  clearFormErrors('registrationForm');
  
  const form = event.target;
  let isValid = true;
  
  // Validate full name
  const fullName = document.getElementById('regFullName').value.trim();
  if (!fullName || fullName.length < 2) {
    showFieldError('regFullName', 'Please enter your full name');
    isValid = false;
  }
  
  // Validate email
  const email = document.getElementById('regEmail').value.trim();
  if (!email || !validateEmail(email)) {
    showFieldError('regEmail', 'Please enter a valid email address');
    isValid = false;
  }
  
  // Validate phone
  const phone = document.getElementById('regPhone').value.trim();
  if (!phone || !validatePhone(phone)) {
    showFieldError('regPhone', 'Please enter a valid phone number');
    isValid = false;
  }
  
  // Validate password
  const password = document.getElementById('regPassword').value;
  if (!password || !validatePassword(password)) {
    showFieldError('regPassword', 'Password must be at least 8 characters with letters and numbers');
    isValid = false;
  }
  
  // Validate password confirmation
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  if (!confirmPassword || password !== confirmPassword) {
    showFieldError('regConfirmPassword', 'Passwords do not match');
    isValid = false;
  }
  
  // Validate address
  const address = document.getElementById('regAddress').value.trim();
  if (!address || address.length < 10) {
    showFieldError('regAddress', 'Please enter a complete delivery address');
    isValid = false;
  }
  
  // Validate terms
  const terms = document.getElementById('regTerms').checked;
  if (!terms) {
    showFieldError('regTerms', 'You must agree to the terms and conditions');
    isValid = false;
  }
  
  if (!isValid) {
    return;
  }
  
  // Save user data (in real app, send to server)
  const userData = {
    fullName,
    email,
    phone,
    address,
    registeredAt: new Date().toISOString()
  };
  
  localStorage.setItem('userData', JSON.stringify(userData));
  localStorage.setItem('isLoggedIn', 'true');
  
  showNotification('Account created successfully!');
  
  setTimeout(() => {
    closeRegistrationModal();
    // Pre-fill checkout form if on cart page
    if (document.getElementById('checkoutFullName')) {
      document.getElementById('checkoutFullName').value = fullName;
      document.getElementById('checkoutEmail').value = email;
      document.getElementById('checkoutPhone').value = phone;
      document.getElementById('checkoutAddress').value = address;
    }
  }, 1500);
}

// Handle login form submission
function handleLogin(event) {
  event.preventDefault();
  clearFormErrors('loginForm');
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !validateEmail(email)) {
    showFieldError('loginEmail', 'Please enter a valid email address');
    return;
  }
  
  if (!password || password.length < 6) {
    showFieldError('loginPassword', 'Please enter your password');
    return;
  }
  
  // In real app, verify credentials with server
  // For demo, check if user exists in localStorage
  const userData = JSON.parse(localStorage.getItem('userData'));
  
  if (userData && userData.email === email) {
    localStorage.setItem('isLoggedIn', 'true');
    showNotification('Login successful!');
    
    setTimeout(() => {
      closeLoginModal();
      // Pre-fill checkout form if on cart page
      if (document.getElementById('checkoutFullName')) {
        document.getElementById('checkoutFullName').value = userData.fullName || '';
        document.getElementById('checkoutEmail').value = userData.email || '';
        document.getElementById('checkoutPhone').value = userData.phone || '';
        document.getElementById('checkoutAddress').value = userData.address || '';
      }
    }, 1500);
  } else {
    showFieldError('loginEmail', 'Invalid email or password');
    showFieldError('loginPassword', 'Invalid email or password');
  }
}

// Handle checkout form submission
function handleCheckout(event) {
  event.preventDefault();
  clearFormErrors('checkoutForm');
  
  let isValid = true;
  
  // Validate customer information
  const fullName = document.getElementById('checkoutFullName').value.trim();
  if (!fullName || fullName.length < 2) {
    showFieldError('checkoutFullName', 'Please enter your full name');
    isValid = false;
  }
  
  const email = document.getElementById('checkoutEmail').value.trim();
  if (!email || !validateEmail(email)) {
    showFieldError('checkoutEmail', 'Please enter a valid email address');
    isValid = false;
  }
  
  const phone = document.getElementById('checkoutPhone').value.trim();
  if (!phone || !validatePhone(phone)) {
    showFieldError('checkoutPhone', 'Please enter a valid phone number');
    isValid = false;
  }
  
  const address = document.getElementById('checkoutAddress').value.trim();
  if (!address || address.length < 10) {
    showFieldError('checkoutAddress', 'Please enter a complete delivery address');
    isValid = false;
  }
  
  // Validate payment method
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
  if (!paymentMethod) {
    showNotification('Please select a payment method');
    isValid = false;
  }
  
  // Validate payment details based on method
  if (paymentMethod) {
    if (paymentMethod.value === 'mpesa') {
      const mpesaPhone = document.getElementById('mpesaPhone').value.trim();
      if (!mpesaPhone || !validatePhone(mpesaPhone)) {
        showFieldError('mpesaPhone', 'Please enter a valid M-Pesa phone number');
        isValid = false;
      }
    } else {
      // Validate card details
      const cardNumber = document.getElementById('cardNumber').value.trim();
      if (!cardNumber || !validateCardNumber(cardNumber)) {
        showFieldError('cardNumber', 'Please enter a valid card number');
        isValid = false;
      }
      
      const cardExpiry = document.getElementById('cardExpiry').value.trim();
      if (!cardExpiry || !validateCardExpiry(cardExpiry)) {
        showFieldError('cardExpiry', 'Please enter a valid expiry date (MM/YY)');
        isValid = false;
      }
      
      const cardCVV = document.getElementById('cardCVV').value.trim();
      if (!cardCVV || !validateCVV(cardCVV)) {
        showFieldError('cardCVV', 'Please enter a valid CVV');
        isValid = false;
      }
      
      const cardName = document.getElementById('cardName').value.trim();
      if (!cardName || cardName.length < 2) {
        showFieldError('cardName', 'Please enter cardholder name');
        isValid = false;
      }
    }
  }
  
  // Validate terms
  const terms = document.getElementById('checkoutTerms').checked;
  if (!terms) {
    showFieldError('checkoutTerms', 'You must agree to the terms and conditions');
    isValid = false;
  }
  
  if (!isValid) {
    return;
  }
  
  // Save order to user's order history
  const orderId = Date.now();
  const order = {
    orderId: orderId,
    items: cart,
    customer: {
      fullName,
      email,
      phone,
      address
    },
    subtotal,
    deliveryFee,
    total,
    paymentMethod: paymentMethod.value,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  // Save to order history
  const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
  userOrders.push(order);
  localStorage.setItem('userOrders', JSON.stringify(userOrders));
  
  // Process payment
  processPayment(paymentMethod.value, {
    fullName,
    email,
    phone,
    address,
    paymentMethod: paymentMethod.value
  });
}

// Process payment
function processPayment(method, customerData) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;
  
  // Store order details
  const order = {
    items: cart,
    customer: customerData,
    subtotal,
    deliveryFee,
    total,
    paymentMethod: method,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('currentOrder', JSON.stringify(order));
  
  // Show processing message
  const submitBtn = document.querySelector('.checkout-submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
  
  // Simulate payment processing
  setTimeout(() => {
    // In real app, this would communicate with payment gateway
    showNotification(`Payment successful! Order total: Ksh ${total}`);
    
    setTimeout(() => {
      if (confirm('Payment Successful!\n\nYour order has been placed.\nOrder ID: ' + Date.now() + '\n\nClear cart and return to homepage?')) {
        cart = [];
        saveCart();
        closeCheckoutModal();
        window.location.href = 'index.html';
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }, 1000);
  }, 2000);
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

// Show notification (enhanced with types)
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create new notification
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  // Add icon based on type
  let icon = '';
  switch(type) {
    case 'success':
      icon = '<i class="fas fa-check-circle"></i>';
      break;
    case 'error':
      icon = '<i class="fas fa-exclamation-circle"></i>';
      break;
    case 'info':
      icon = '<i class="fas fa-info-circle"></i>';
      break;
    case 'warning':
      icon = '<i class="fas fa-exclamation-triangle"></i>';
      break;
    default:
      icon = '<i class="fas fa-bell"></i>';
  }
  
  notification.innerHTML = `
    ${icon}
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after appropriate time
  const duration = type === 'error' ? 5000 : 3000;
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, duration);
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
        const category = this.getAttribute('data-category');
        if (category) {
          filterProducts(category);
        }
      });
    });
    
    // Setup search
    const menuSearchInput = document.getElementById('menuSearchInput');
    if (menuSearchInput) {
      menuSearchInput.addEventListener('keyup', searchProducts);
    }
    
    // Check for search query in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && menuSearchInput) {
      menuSearchInput.value = searchQuery;
      searchProducts();
    }
  }
  
  // Product detail page
  if (path.includes("product-detail.html")) {
    loadProductDetail();
  }
  
  // Cart page
  if (path.includes("cart.html")) {
    loadCart();
    
    // Setup card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', function() {
        formatCardNumber(this);
      });
    }
    
    // Setup card expiry formatting
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', function() {
        formatCardExpiry(this);
      });
    }
    
    // Setup CVV input (numbers only)
    const cardCVVInput = document.getElementById('cardCVV');
    if (cardCVVInput) {
      cardCVVInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
      });
    }
    
    // Setup phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
      input.addEventListener('input', function() {
        // Allow only numbers and + for phone
        this.value = this.value.replace(/[^\d+]/g, '');
      });
    });
    
    // Pre-fill checkout form if user is logged in
    const userData = JSON.parse(localStorage.getItem('userData'));
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn && userData) {
      // Pre-fill when modal opens
      const checkoutBtn = document.querySelector('.checkout-btn');
      if (checkoutBtn) {
        const originalOnclick = checkoutBtn.getAttribute('onclick');
        checkoutBtn.setAttribute('onclick', originalOnclick + '; prefillCheckoutForm();');
      }
    }
  }
  
  // Setup modal close on outside click
  setupModalCloseHandlers();
  
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

// Setup modal close handlers
function setupModalCloseHandlers() {
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        openModal.classList.remove('show');
        document.body.style.overflow = '';
      }
    }
  });
}

// Pre-fill checkout form with user data
function prefillCheckoutForm() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
  
  // Get default address or first address
  const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
  
  setTimeout(() => {
    if (document.getElementById('checkoutFullName')) {
      document.getElementById('checkoutFullName').value = userData.displayName || userData.fullName || '';
      document.getElementById('checkoutEmail').value = userData.email || '';
      document.getElementById('checkoutPhone').value = userData.phoneNumber || userData.phone || '';
      
      // Use default address if available
      if (defaultAddress) {
        const fullAddress = `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.county}${defaultAddress.postalCode ? ', ' + defaultAddress.postalCode : ''}`;
        document.getElementById('checkoutAddress').value = fullAddress;
      } else {
        document.getElementById('checkoutAddress').value = userData.address || '';
      }
    }
  }, 100);
}

// Run initialization when page loads
document.addEventListener('DOMContentLoaded', initializePage);

// Also run when navigating back/forward
window.addEventListener('pageshow', initializePage);