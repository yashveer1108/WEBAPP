// Product Data
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "smartphones",
    price: 1199,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 2847,
    image: "/placeholder.svg?height=250&width=280",
    badge: "New",
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    category: "laptops",
    price: 2499,
    originalPrice: 2699,
    rating: 4.9,
    reviews: 1523,
    image: "/placeholder.svg?height=250&width=280",
    badge: "Sale",
  },
  {
    id: 3,
    name: "AirPods Pro 2",
    category: "headphones",
    price: 249,
    originalPrice: 279,
    rating: 4.7,
    reviews: 3421,
    image: "/placeholder.svg?height=250&width=280",
    badge: "Popular",
  },
  {
    id: 4,
    name: "iPad Air 5th Gen",
    category: "accessories",
    price: 599,
    originalPrice: 649,
    rating: 4.6,
    reviews: 892,
    image: "/placeholder.svg?height=250&width=280",
    badge: "Sale",
  },
  {
    id: 5,
    name: "Samsung Galaxy S24 Ultra",
    category: "smartphones",
    price: 1299,
    originalPrice: 1399,
    rating: 4.8,
    reviews: 2156,
    image: "/placeholder.svg?height=250&width=280",
    badge: "New",
  },
  {
    id: 6,
    name: "Dell XPS 13",
    category: "laptops",
    price: 1199,
    originalPrice: 1299,
    rating: 4.5,
    reviews: 743,
    image: "/placeholder.svg?height=250&width=280",
    badge: "Sale",
  },
  {
    id: 7,
    name: "Sony WH-1000XM5",
    category: "headphones",
    price: 399,
    originalPrice: 429,
    rating: 4.9,
    reviews: 1876,
    image: "/placeholder.svg?height=250&width=280",
    badge: "Popular",
  },
  {
    id: 8,
    name: "Apple Watch Series 9",
    category: "accessories",
    price: 399,
    originalPrice: 429,
    rating: 4.7,
    reviews: 1234,
    image: "/placeholder.svg?height=250&width=280",
    badge: "New",
  },
  {
    id: 9,
    name: "Google Pixel 8 Pro",
    category: "smartphones",
    price: 999,
    originalPrice: 1099,
    rating: 4.6,
    reviews: 987,
    image: "/placeholder.svg?height=250&width=280",
    badge: "Sale",
  },
  {
    id: 10,
    name: "Surface Laptop 5",
    category: "laptops",
    price: 1299,
    originalPrice: 1399,
    rating: 4.4,
    reviews: 567,
    image: "/placeholder.svg?height=250&width=280",
    badge: "New",
  },
  {
    id: 11,
    name: "Bose QuietComfort 45",
    category: "headphones",
    price: 329,
    originalPrice: 379,
    rating: 4.5,
    reviews: 2341,
    image: "/placeholder.svg?height=250&width=280",
    badge: "Sale",
  },
  {
    id: 12,
    name: "Magic Keyboard",
    category: "accessories",
    price: 299,
    originalPrice: 329,
    rating: 4.3,
    reviews: 456,
    image: "/placeholder.svg?height=250&width=280",
    badge: "Popular",
  },
]

// Shopping Cart
let cart = JSON.parse(localStorage.getItem("cart")) || []

// DOM Elements
const cartSidebar = document.getElementById("cart-sidebar")
const cartItems = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const cartCount = document.querySelector(".cart-count")
const loadingSpinner = document.getElementById("loading-spinner")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI()
  loadFeaturedProducts()
  loadAllProducts()
  initializeLazyLoading()
  initializePerformanceOptimizations()
})

// Performance Optimizations
function initializePerformanceOptimizations() {
  // Debounce search input
  const searchInput = document.getElementById("search-input")
  if (searchInput) {
    let searchTimeout
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(filterProducts, 300)
    })
  }

  // Preload critical images
  const criticalImages = document.querySelectorAll('img[loading="eager"]')
  criticalImages.forEach((img) => {
    const newImg = new Image()
    newImg.crossOrigin = "anonymous"
    newImg.src = img.src
  })
}

// Lazy Loading Implementation
function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]')

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.src
          img.classList.add("loaded")
          observer.unobserve(img)
        }
      })
    })

    lazyImages.forEach((img) => imageObserver.observe(img))
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach((img) => {
      img.src = img.src
      img.classList.add("loaded")
    })
  }
}

// Product Display Functions
function createProductCard(product) {
  return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ""}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-text">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ""}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `
}

function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let stars = ""

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>'
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>'
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>'
  }

  return stars
}

function loadFeaturedProducts() {
  const featuredGrid = document.getElementById("featured-grid")
  if (featuredGrid) {
    const featuredProducts = products.slice(0, 6)
    featuredGrid.innerHTML = featuredProducts.map(createProductCard).join("")
  }
}

function loadAllProducts() {
  const allProductsGrid = document.getElementById("all-products-grid")
  if (allProductsGrid) {
    allProductsGrid.innerHTML = products.map(createProductCard).join("")
  }
}

// Filter and Search Functions
function filterByCategory(category) {
  const productCards = document.querySelectorAll(".product-card")
  const filterButtons = document.querySelectorAll(".filter-btn")

  // Update active button
  filterButtons.forEach((btn) => btn.classList.remove("active"))
  event.target.classList.add("active")

  // Show loading
  showLoading()

  setTimeout(() => {
    productCards.forEach((card) => {
      if (category === "all" || card.dataset.category === category) {
        card.style.display = "block"
        card.style.animation = "fadeIn 0.5s ease"
      } else {
        card.style.display = "none"
      }
    })
    hideLoading()
  }, 300)
}

function filterProducts() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase()
  const productCards = document.querySelectorAll(".product-card")

  showLoading()

  setTimeout(() => {
    productCards.forEach((card) => {
      const productName = card.querySelector(".product-name").textContent.toLowerCase()
      const productCategory = card.querySelector(".product-category").textContent.toLowerCase()

      if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
        card.style.display = "block"
        card.style.animation = "fadeIn 0.5s ease"
      } else {
        card.style.display = "none"
      }
    })
    hideLoading()
  }, 300)
}

function sortProducts() {
  const sortValue = document.getElementById("sort-select").value
  const productGrid = document.getElementById("all-products-grid")
  const productCards = Array.from(productGrid.children)

  showLoading()

  setTimeout(() => {
    productCards.sort((a, b) => {
      switch (sortValue) {
        case "name":
          return a
            .querySelector(".product-name")
            .textContent.localeCompare(b.querySelector(".product-name").textContent)
        case "price-low":
          return (
            Number.parseFloat(a.querySelector(".price").textContent.replace("$", "")) -
            Number.parseFloat(b.querySelector(".price").textContent.replace("$", ""))
          )
        case "price-high":
          return (
            Number.parseFloat(b.querySelector(".price").textContent.replace("$", "")) -
            Number.parseFloat(a.querySelector(".price").textContent.replace("$", ""))
          )
        case "rating":
          const ratingA = a.querySelector(".stars").children.length
          const ratingB = b.querySelector(".stars").children.length
          return ratingB - ratingA
        default:
          return 0
      }
    })

    productGrid.innerHTML = ""
    productCards.forEach((card) => {
      card.style.animation = "fadeIn 0.5s ease"
      productGrid.appendChild(card)
    })

    hideLoading()
  }, 300)
}

// Cart Functions
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartUI()
  showNotification("Product added to cart!")
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartUI()
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(productId)
    } else {
      localStorage.setItem("cart", JSON.stringify(cart))
      updateCartUI()
    }
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  cartCount.textContent = totalItems
  cartTotal.textContent = totalPrice.toFixed(2)

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `,
    )
    .join("")
}

function toggleCart() {
  cartSidebar.classList.toggle("open")
}

function checkout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!")
    return
  }

  showLoading()

  // Simulate checkout process
  setTimeout(() => {
    cart = []
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartUI()
    toggleCart()
    hideLoading()
    showNotification("Order placed successfully! Thank you for your purchase.")
  }, 2000)
}

// Navigation Functions
function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu")
  const hamburger = document.querySelector(".hamburger")

  navMenu.classList.toggle("active")
  hamburger.classList.toggle("active")
}

function scrollToProducts() {
  const productsSection = document.getElementById("products")
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: "smooth" })
  }
}

// Form Functions
function subscribeNewsletter(event) {
  event.preventDefault()
  const email = event.target.querySelector('input[type="email"]').value

  showLoading()

  setTimeout(() => {
    hideLoading()
    showNotification("Thank you for subscribing to our newsletter!")
    event.target.reset()
  }, 1000)
}

function submitContactForm(event) {
  event.preventDefault()
  const formData = new FormData(event.target)

  showLoading()

  setTimeout(() => {
    hideLoading()
    showNotification("Thank you for your message! We'll get back to you soon.")
    event.target.reset()
  }, 1500)
}

// FAQ Functions
function toggleFAQ(element) {
  const faqItem = element.parentElement
  const isActive = faqItem.classList.contains("active")

  // Close all FAQ items
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active")
  })

  // Open clicked item if it wasn't active
  if (!isActive) {
    faqItem.classList.add("active")
  }
}

// Utility Functions
function showLoading() {
  if (loadingSpinner) {
    loadingSpinner.style.display = "flex"
  }
}

function hideLoading() {
  if (loadingSpinner) {
    loadingSpinner.style.display = "none"
  }
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `
  notification.textContent = message

  document.body.appendChild(notification)

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`
document.head.appendChild(style)

// Close mobile menu when clicking outside
document.addEventListener("click", (event) => {
  const navMenu = document.querySelector(".nav-menu")
  const hamburger = document.querySelector(".hamburger")
  const navContainer = document.querySelector(".nav-container")

  if (navMenu && navMenu.classList.contains("active") && !navContainer.contains(event.target)) {
    navMenu.classList.remove("active")
    hamburger.classList.remove("active")
  }
})

// Close cart when clicking outside
document.addEventListener("click", (event) => {
  if (
    cartSidebar &&
    cartSidebar.classList.contains("open") &&
    !cartSidebar.contains(event.target) &&
    !event.target.closest(".cart-icon")
  ) {
    cartSidebar.classList.remove("open")
  }
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Performance monitoring
if ("performance" in window) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType("navigation")[0]
      console.log("Page Load Time:", perfData.loadEventEnd - perfData.loadEventStart, "ms")
    }, 0)
  })
}
