// ============================================
// PROFILE MANAGEMENT FUNCTIONS
// ============================================

let currentEditingAddressId = null;

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
  checkAuthAndLoadProfile();
  updateCartCount();
});

// Check authentication and load profile
function checkAuthAndLoadProfile() {
  // Check Firebase auth
  if (window.firebaseAuth) {
    window.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        loadUserProfile(user);
      } else {
        // Check localStorage as fallback
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
          loadUserProfileFromStorage();
        } else {
          // Redirect to login
          window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        }
      }
    });
  } else {
    // Fallback to localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      loadUserProfileFromStorage();
    } else {
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
    }
  }
}

// Load user profile from Firebase
function loadUserProfile(user) {
  // Update header info
  document.getElementById('profileDisplayName').textContent = user.displayName || user.email.split('@')[0];
  document.getElementById('profileEmail').textContent = user.email;
  
  // Check email verification
  if (user.emailVerified) {
    document.getElementById('emailVerifiedBadge').style.display = 'inline-block';
  }
  
  // Load profile data from localStorage or Firestore
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  // Populate form fields
  document.getElementById('profileFullName').value = userData.displayName || user.displayName || '';
  document.getElementById('profileEmail').value = user.email;
  document.getElementById('profilePhone').value = userData.phoneNumber || user.phoneNumber || '';
  document.getElementById('profileDateOfBirth').value = userData.dateOfBirth || '';
  document.getElementById('profileGender').value = userData.gender || '';
  
  // Set member since date
  if (userData.createdAt) {
    const memberDate = new Date(userData.createdAt);
    document.getElementById('memberSince').textContent = memberDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  } else if (user.metadata && user.metadata.creationTime) {
    const memberDate = new Date(user.metadata.creationTime);
    document.getElementById('memberSince').textContent = memberDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  }
  
  // Load addresses
  loadAddresses();
  
  // Load orders
  loadOrderHistory();
  
  // Load email verification status
  updateEmailVerificationStatus(user);
}

// Load user profile from localStorage (fallback)
function loadUserProfileFromStorage() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  if (!userData.email) {
    window.location.href = 'login.html';
    return;
  }
  
  document.getElementById('profileDisplayName').textContent = userData.displayName || userData.email.split('@')[0];
  document.getElementById('profileEmail').textContent = userData.email;
  
  document.getElementById('profileFullName').value = userData.displayName || '';
  document.getElementById('profileEmail').value = userData.email;
  document.getElementById('profilePhone').value = userData.phoneNumber || '';
  document.getElementById('profileDateOfBirth').value = userData.dateOfBirth || '';
  document.getElementById('profileGender').value = userData.gender || '';
  
  if (userData.createdAt) {
    const memberDate = new Date(userData.createdAt);
    document.getElementById('memberSince').textContent = memberDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  }
  
  loadAddresses();
  loadOrderHistory();
}

// Switch profile tabs
function switchProfileTab(tab) {
  // Hide all tabs
  document.querySelectorAll('.profile-tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active from all tab buttons
  document.querySelectorAll('.profile-tab').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(tab + 'Tab').classList.add('active');
  
  // Add active to clicked button
  event.target.classList.add('active');
}

// Save personal information
async function savePersonalInfo(event) {
  event.preventDefault();
  
  const fullName = document.getElementById('profileFullName').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();
  const dateOfBirth = document.getElementById('profileDateOfBirth').value;
  const gender = document.getElementById('profileGender').value;
  
  // Validation
  if (!fullName || fullName.length < 2) {
    showFieldError('profileFullName', 'Please enter your full name');
    return;
  }
  
  if (!phone || !validatePhone(phone)) {
    showFieldError('profilePhone', 'Please enter a valid phone number');
    return;
  }
  
  // Get current user data
  let userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  // Update user data
  userData.displayName = fullName;
  userData.phoneNumber = phone;
  userData.dateOfBirth = dateOfBirth;
  userData.gender = gender;
  userData.updatedAt = new Date().toISOString();
  
  // Update Firebase profile if available
  if (window.firebaseAuth && window.firebaseAuth.currentUser) {
    try {
      await window.firebaseAuth.currentUser.updateProfile({
        displayName: fullName
      });
    } catch (error) {
      console.error('Error updating Firebase profile:', error);
    }
  }
  
  // Save to localStorage
  localStorage.setItem('userData', JSON.stringify(userData));
  
  // Update display
  document.getElementById('profileDisplayName').textContent = fullName;
  
  showNotification('Profile updated successfully!', 'success');
}

// Load addresses
function loadAddresses() {
  const addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
  const container = document.getElementById('addressesList');
  
  if (addresses.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-map-marker-alt"></i>
        <h3>No addresses saved</h3>
        <p>Add your first delivery address to get started</p>
        <button class="cta-btn" onclick="openAddAddressModal()">
          <i class="fas fa-plus"></i> Add Address
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = addresses.map((address, index) => {
    const isDefault = address.isDefault || index === 0;
    return `
      <div class="address-card ${isDefault ? 'default' : ''}">
        <div class="address-header">
          <div>
            <h3>
              <i class="fas fa-${getAddressIcon(address.label)}"></i>
              ${address.label}
              ${isDefault ? '<span class="default-badge">Default</span>' : ''}
            </h3>
          </div>
          <div class="address-actions">
            <button class="icon-btn" onclick="editAddress(${index})" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="icon-btn danger" onclick="deleteAddress(${index})" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="address-body">
          <p><i class="fas fa-road"></i> ${address.street}</p>
          <p><i class="fas fa-city"></i> ${address.city}, ${address.county}</p>
          ${address.postalCode ? `<p><i class="fas fa-mail-bulk"></i> ${address.postalCode}</p>` : ''}
          ${address.instructions ? `<p class="instructions"><i class="fas fa-info-circle"></i> ${address.instructions}</p>` : ''}
        </div>
        ${!isDefault ? `
          <button class="set-default-btn" onclick="setDefaultAddress(${index})">
            Set as Default
          </button>
        ` : ''}
      </div>
    `;
  }).join('');
}

// Get icon for address label
function getAddressIcon(label) {
  const labelLower = label.toLowerCase();
  if (labelLower.includes('home')) return 'home';
  if (labelLower.includes('work') || labelLower.includes('office')) return 'briefcase';
  if (labelLower.includes('other')) return 'map-marker-alt';
  return 'map-marker-alt';
}

// Open add address modal
function openAddAddressModal() {
  currentEditingAddressId = null;
  document.getElementById('addressModalTitle').textContent = 'Add Delivery Address';
  document.getElementById('addressForm').reset();
  document.getElementById('addressId').value = '';
  document.getElementById('addressModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Close address modal
function closeAddressModal() {
  document.getElementById('addressModal').classList.remove('show');
  document.body.style.overflow = '';
  currentEditingAddressId = null;
}

// Edit address
function editAddress(index) {
  const addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
  const address = addresses[index];
  
  if (!address) return;
  
  currentEditingAddressId = index;
  document.getElementById('addressModalTitle').textContent = 'Edit Delivery Address';
  document.getElementById('addressLabel').value = address.label;
  document.getElementById('addressStreet').value = address.street;
  document.getElementById('addressCity').value = address.city;
  document.getElementById('addressCounty').value = address.county;
  document.getElementById('addressPostalCode').value = address.postalCode || '';
  document.getElementById('addressInstructions').value = address.instructions || '';
  document.getElementById('addressIsDefault').checked = address.isDefault || false;
  document.getElementById('addressId').value = index;
  
  document.getElementById('addressModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Save address
function saveAddress(event) {
  event.preventDefault();
  
  const label = document.getElementById('addressLabel').value.trim();
  const street = document.getElementById('addressStreet').value.trim();
  const city = document.getElementById('addressCity').value.trim();
  const county = document.getElementById('addressCounty').value.trim();
  const postalCode = document.getElementById('addressPostalCode').value.trim();
  const instructions = document.getElementById('addressInstructions').value.trim();
  const isDefault = document.getElementById('addressIsDefault').checked;
  
  // Validation
  if (!label || !street || !city || !county) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  let addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
  
  const addressData = {
    label,
    street,
    city,
    county,
    postalCode,
    instructions,
    isDefault: isDefault || addresses.length === 0, // First address is default
    createdAt: new Date().toISOString()
  };
  
  if (currentEditingAddressId !== null) {
    // Update existing address
    addresses[currentEditingAddressId] = addressData;
  } else {
    // Add new address
    addresses.push(addressData);
  }
  
  // If this is set as default, unset others
  if (isDefault) {
    addresses.forEach((addr, index) => {
      if (index !== currentEditingAddressId) {
        addr.isDefault = false;
      }
    });
  }
  
  localStorage.setItem('userAddresses', JSON.stringify(addresses));
  loadAddresses();
  closeAddressModal();
  showNotification('Address saved successfully!', 'success');
}

// Delete address
function deleteAddress(index) {
  if (!confirm('Are you sure you want to delete this address?')) {
    return;
  }
  
  let addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
  addresses.splice(index, 1);
  
  // If deleted address was default, set first one as default
  if (addresses.length > 0 && !addresses.some(addr => addr.isDefault)) {
    addresses[0].isDefault = true;
  }
  
  localStorage.setItem('userAddresses', JSON.stringify(addresses));
  loadAddresses();
  showNotification('Address deleted successfully!', 'success');
}

// Set default address
function setDefaultAddress(index) {
  let addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
  
  addresses.forEach((addr, i) => {
    addr.isDefault = (i === index);
  });
  
  localStorage.setItem('userAddresses', JSON.stringify(addresses));
  loadAddresses();
  showNotification('Default address updated!', 'success');
}

// Load order history
function loadOrderHistory() {
  const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
  const container = document.getElementById('ordersList');
  
  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-shopping-bag"></i>
        <h3>No orders yet</h3>
        <p>Your order history will appear here</p>
        <button class="cta-btn" onclick="window.location.href='menu.html'">
          <i class="fas fa-utensils"></i> Start Shopping
        </button>
      </div>
    `;
    return;
  }
  
  // Sort by date (newest first)
  orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  container.innerHTML = orders.map((order, index) => {
    const orderDate = new Date(order.timestamp);
    return `
      <div class="order-card">
        <div class="order-header">
          <div>
            <h3>Order #${order.orderId || index + 1}</h3>
            <p class="order-date">
              <i class="fas fa-calendar"></i> ${orderDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div class="order-status">
            <span class="status-badge ${order.status || 'pending'}">${(order.status || 'pending').toUpperCase()}</span>
          </div>
        </div>
        <div class="order-items">
          <p><strong>${order.items.length} item(s)</strong></p>
          <ul>
            ${order.items.slice(0, 3).map(item => `<li>${item.name} x${item.quantity}</li>`).join('')}
            ${order.items.length > 3 ? `<li>+${order.items.length - 3} more</li>` : ''}
          </ul>
        </div>
        <div class="order-footer">
          <div class="order-total">
            <strong>Total: Ksh ${order.total || 0}</strong>
          </div>
          <button class="view-order-btn" onclick="viewOrderDetails(${index})">
            <i class="fas fa-eye"></i> View Details
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// View order details
function viewOrderDetails(index) {
  const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
  const order = orders[index];
  
  if (!order) return;
  
  const orderDate = new Date(order.timestamp);
  const details = `
Order #${order.orderId || index + 1}
Date: ${orderDate.toLocaleString()}
Status: ${(order.status || 'pending').toUpperCase()}

Items:
${order.items.map(item => `- ${item.name} x${item.quantity} - Ksh ${item.price * item.quantity}`).join('\n')}

Subtotal: Ksh ${order.subtotal || 0}
Delivery: Ksh ${order.deliveryFee || 150}
Total: Ksh ${order.total || 0}

Delivery Address:
${order.customer?.address || 'N/A'}
  `;
  
  alert(details);
}

// Change password
async function changePassword(event) {
  event.preventDefault();
  
  if (!window.firebaseAuth || !window.firebaseAuth.currentUser) {
    showNotification('You must be logged in to change password', 'error');
    return;
  }
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmNewPassword').value;
  
  // Validation
  if (!currentPassword) {
    showFieldError('currentPassword', 'Please enter your current password');
    return;
  }
  
  if (!newPassword || !validatePassword(newPassword)) {
    showFieldError('newPassword', 'Password must be at least 8 characters with letters and numbers');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showFieldError('confirmNewPassword', 'Passwords do not match');
    return;
  }
  
  try {
    const user = window.firebaseAuth.currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    
    // Re-authenticate user
    await user.reauthenticateWithCredential(credential);
    
    // Update password
    await user.updatePassword(newPassword);
    
    document.getElementById('changePasswordForm').reset();
    showNotification('Password updated successfully!', 'success');
    
  } catch (error) {
    console.error('Password change error:', error);
    
    let errorMessage = 'Failed to update password.';
    
    switch (error.code) {
      case 'auth/wrong-password':
        errorMessage = 'Current password is incorrect.';
        showFieldError('currentPassword', errorMessage);
        break;
      case 'auth/weak-password':
        errorMessage = 'New password is too weak.';
        showFieldError('newPassword', errorMessage);
        break;
      default:
        showNotification(errorMessage, 'error');
    }
  }
}

// Update email verification status
function updateEmailVerificationStatus(user) {
  const container = document.getElementById('emailVerificationStatus');
  
  if (user.emailVerified) {
    container.innerHTML = `
      <div class="verification-success">
        <i class="fas fa-check-circle"></i>
        <div>
          <strong>Email Verified</strong>
          <p>Your email address has been verified.</p>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="verification-pending">
        <i class="fas fa-exclamation-circle"></i>
        <div>
          <strong>Email Not Verified</strong>
          <p>Please verify your email address to secure your account.</p>
          <button class="cta-btn" onclick="sendVerificationEmail()">
            <i class="fas fa-envelope"></i> Send Verification Email
          </button>
        </div>
      </div>
    `;
  }
}

// Send verification email
async function sendVerificationEmail() {
  if (!window.firebaseAuth || !window.firebaseAuth.currentUser) {
    showNotification('You must be logged in', 'error');
    return;
  }
  
  try {
    await window.firebaseAuth.currentUser.sendEmailVerification();
    showNotification('Verification email sent! Please check your inbox.', 'success');
  } catch (error) {
    console.error('Verification email error:', error);
    showNotification('Failed to send verification email. Please try again.', 'error');
  }
}

// Confirm delete account
function confirmDeleteAccount() {
  if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    return;
  }
  
  if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) {
    return;
  }
  
  // In production, this would delete from Firebase
  // For now, just clear local data and logout
  localStorage.clear();
  sessionStorage.clear();
  
  if (window.firebaseAuth && window.firebaseAuth.currentUser) {
    window.firebaseAuth.currentUser.delete().then(() => {
      showNotification('Account deleted successfully', 'success');
      window.location.href = 'index.html';
    }).catch(error => {
      console.error('Delete account error:', error);
      showNotification('Error deleting account. Please contact support.', 'error');
    });
  } else {
    window.location.href = 'index.html';
  }
}

// Close modal on outside click
window.addEventListener('click', function(event) {
  const addressModal = document.getElementById('addressModal');
  if (event.target === addressModal) {
    closeAddressModal();
  }
});

