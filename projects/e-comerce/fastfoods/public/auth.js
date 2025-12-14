// ============================================
// FIREBASE AUTHENTICATION FUNCTIONS
// ============================================

// Check if Firebase is initialized
function checkFirebase() {
  if (typeof firebase === 'undefined' || !window.firebaseAuth) {
    showNotification('Firebase is not configured. Please set up your Firebase project.', 'error');
    return false;
  }
  return true;
}

// Switch between login and register tabs
function switchTab(tab) {
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginFormContainer');
  const registerForm = document.getElementById('registerFormContainer');
  
  if (tab === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    clearAllErrors();
  } else {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    clearAllErrors();
  }
}

// Clear all form errors
function clearAllErrors() {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(error => {
    error.textContent = '';
  });
  
  const errorInputs = document.querySelectorAll('.error');
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

// Show loading overlay
function showLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
  }
}

// Hide loading overlay
function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate password strength
function validatePassword(password) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
}

// Validate phone number (Kenyan format)
function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 9;
}

// Handle Firebase Login
async function handleFirebaseLogin(event) {
  event.preventDefault();
  
  if (!checkFirebase()) return;
  
  clearAllErrors();
  showLoading();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  
  // Validation
  if (!email || !validateEmail(email)) {
    hideLoading();
    showFieldError('loginEmail', 'Please enter a valid email address');
    return;
  }
  
  if (!password || password.length < 6) {
    hideLoading();
    showFieldError('loginPassword', 'Password must be at least 6 characters');
    return;
  }
  
  try {
    // Set persistence based on remember me
    const persistence = rememberMe 
      ? firebase.auth.Auth.Persistence.LOCAL 
      : firebase.auth.Auth.Persistence.SESSION;
    
    await window.firebaseAuth.setPersistence(persistence);
    
    // Sign in with email and password
    const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    hideLoading();
    showNotification('Login successful! Redirecting...', 'success');
    
    // Save user data to localStorage
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || email.split('@')[0],
      phoneNumber: user.phoneNumber || '',
      emailVerified: user.emailVerified
    };
    
    // Get additional user data from Firestore if available
    // For now, use localStorage
    const existingUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    localStorage.setItem('userData', JSON.stringify({ ...existingUserData, ...userData }));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect after short delay
    setTimeout(() => {
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
      window.location.href = redirectTo;
    }, 1500);
    
  } catch (error) {
    hideLoading();
    console.error('Login error:', error);
    
    let errorMessage = 'An error occurred during login. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        showFieldError('loginEmail', errorMessage);
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        showFieldError('loginPassword', errorMessage);
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        showFieldError('loginEmail', errorMessage);
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        showNotification(errorMessage, 'error');
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        showNotification(errorMessage, 'error');
        break;
      default:
        showNotification(errorMessage, 'error');
    }
  }
}

// Handle Firebase Registration
async function handleFirebaseRegister(event) {
  event.preventDefault();
  
  if (!checkFirebase()) return;
  
  clearAllErrors();
  showLoading();
  
  const fullName = document.getElementById('registerFullName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phone = document.getElementById('registerPhone').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  const address = document.getElementById('registerAddress').value.trim();
  const terms = document.getElementById('registerTerms').checked;
  
  // Validation
  let isValid = true;
  
  if (!fullName || fullName.length < 2) {
    showFieldError('registerFullName', 'Please enter your full name');
    isValid = false;
  }
  
  if (!email || !validateEmail(email)) {
    showFieldError('registerEmail', 'Please enter a valid email address');
    isValid = false;
  }
  
  if (!phone || !validatePhone(phone)) {
    showFieldError('registerPhone', 'Please enter a valid phone number');
    isValid = false;
  }
  
  if (!password || !validatePassword(password)) {
    showFieldError('registerPassword', 'Password must be at least 8 characters with letters and numbers');
    isValid = false;
  }
  
  if (!confirmPassword || password !== confirmPassword) {
    showFieldError('registerConfirmPassword', 'Passwords do not match');
    isValid = false;
  }
  
  if (!address || address.length < 10) {
    showFieldError('registerAddress', 'Please enter a complete delivery address');
    isValid = false;
  }
  
  if (!terms) {
    showFieldError('registerTerms', 'You must agree to the terms and conditions');
    isValid = false;
  }
  
  if (!isValid) {
    hideLoading();
    return;
  }
  
  try {
    // Create user with email and password
    const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Update user profile with display name
    await user.updateProfile({
      displayName: fullName
    });
    
    // Save additional user data to localStorage
    // In production, you would save this to Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: fullName,
      phoneNumber: phone,
      address: address,
      emailVerified: user.emailVerified,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    hideLoading();
    showNotification('Account created successfully! Please verify your email.', 'success');
    
    // Send email verification
    try {
      await user.sendEmailVerification();
      showNotification('Verification email sent! Please check your inbox.', 'info');
    } catch (verificationError) {
      console.error('Email verification error:', verificationError);
    }
    
    // Redirect after short delay
    setTimeout(() => {
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
      window.location.href = redirectTo;
    }, 2000);
    
  } catch (error) {
    hideLoading();
    console.error('Registration error:', error);
    
    let errorMessage = 'An error occurred during registration. Please try again.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists.';
        showFieldError('registerEmail', errorMessage);
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        showFieldError('registerEmail', errorMessage);
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Please use a stronger password.';
        showFieldError('registerPassword', errorMessage);
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled.';
        showNotification(errorMessage, 'error');
        break;
      default:
        showNotification(errorMessage, 'error');
    }
  }
}

// Sign in with Google
async function signInWithGoogle() {
  if (!checkFirebase()) return;
  
  showLoading();
  
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Add scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await window.firebaseAuth.signInWithPopup(provider);
    const user = result.user;
    
    // Save user data
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || '',
      emailVerified: user.emailVerified
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    hideLoading();
    showNotification('Login successful! Redirecting...', 'success');
    
    setTimeout(() => {
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
      window.location.href = redirectTo;
    }, 1500);
    
  } catch (error) {
    hideLoading();
    console.error('Google sign-in error:', error);
    
    let errorMessage = 'Google sign-in failed. Please try again.';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked. Please allow popups for this site.';
    }
    
    showNotification(errorMessage, 'error');
  }
}

// Handle logout
async function handleFirebaseLogout() {
  if (!checkFirebase()) return;
  
  if (!confirm('Are you sure you want to logout?')) {
    return;
  }
  
  showLoading();
  
  try {
    await window.firebaseAuth.signOut();
    
    // Clear local storage
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentOrder');
    
    hideLoading();
    showNotification('Logged out successfully!', 'success');
    
    // Redirect to login page
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
    
  } catch (error) {
    hideLoading();
    console.error('Logout error:', error);
    showNotification('An error occurred during logout.', 'error');
  }
}

// Handle forgot password
async function handleForgotPassword(event) {
  event.preventDefault();
  
  if (!checkFirebase()) return;
  
  const email = document.getElementById('loginEmail').value.trim();
  
  if (!email || !validateEmail(email)) {
    showFieldError('loginEmail', 'Please enter a valid email address to reset password');
    return;
  }
  
  showLoading();
  
  try {
    await window.firebaseAuth.sendPasswordResetEmail(email);
    hideLoading();
    showNotification('Password reset email sent! Please check your inbox.', 'success');
  } catch (error) {
    hideLoading();
    console.error('Password reset error:', error);
    
    let errorMessage = 'Failed to send password reset email.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
    }
    
    showNotification(errorMessage, 'error');
  }
}

// Check if user is already logged in
function checkAuthState() {
  if (window.firebaseAuth) {
    window.firebaseAuth.onAuthStateChanged((user) => {
      if (user && window.location.pathname.includes('login.html')) {
        // User is already logged in, redirect
        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
        window.location.href = redirectTo;
      }
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  checkAuthState();
  
  // Setup password visibility toggles
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  passwordInputs.forEach(input => {
    const wrapper = input.parentElement;
    if (wrapper.classList.contains('password-input-wrapper')) {
      // Already has toggle button
    }
  });
});

