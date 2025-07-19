// Global variables
let currentUser = "Tamu"

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Initialize application
function initializeApp() {
  setupNavigation()
  setupFormValidation()
  setupMobileMenu()
}

// Set welcome message
function setWelcomeMessage() {
  const userNameInput = document.getElementById("userName")
  const displayName = document.getElementById("displayName")

  if (userNameInput.value.trim() !== "") {
    currentUser = userNameInput.value.trim()
    displayName.textContent = currentUser
    userNameInput.value = ""

    // Show success message
    showNotification("Nama berhasil diatur!", "success")
  } else {
    showNotification("Silakan masukkan nama Anda!", "error")
  }
}

// Setup smooth scrolling navigation
function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetSection.offsetTop - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }

      // Close mobile menu if open
      const nav = document.querySelector(".nav")
      nav.classList.remove("active")
    })
  })
}

// Setup mobile menu
function setupMobileMenu() {
  const hamburger = document.querySelector(".hamburger")
  const nav = document.querySelector(".nav")

  hamburger.addEventListener("click", () => {
    nav.classList.toggle("active")
  })
}

// Form validation setup
function setupFormValidation() {
  const form = document.getElementById("contactForm")
  const inputs = form.querySelectorAll("input, textarea")

  // Real-time validation
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this)
    })

    input.addEventListener("input", function () {
      clearError(this)
    })
  })

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    handleFormSubmission()
  })
}

// Validate individual field
function validateField(field) {
  const fieldName = field.name
  const fieldValue = field.value.trim()
  const errorElement = document.getElementById(fieldName + "Error")

  let isValid = true
  let errorMessage = ""

  // Clear previous styling
  field.classList.remove("error", "success")

  switch (fieldName) {
    case "name":
      if (fieldValue === "") {
        errorMessage = "Nama harus diisi"
        isValid = false
      } else if (fieldValue.length < 2) {
        errorMessage = "Nama minimal 2 karakter"
        isValid = false
      } else if (!/^[a-zA-Z\s]+$/.test(fieldValue)) {
        errorMessage = "Nama hanya boleh berisi huruf dan spasi"
        isValid = false
      }
      break

    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (fieldValue === "") {
        errorMessage = "Email harus diisi"
        isValid = false
      } else if (!emailRegex.test(fieldValue)) {
        errorMessage = "Format email tidak valid"
        isValid = false
      }
      break

    case "phone":
      const phoneRegex = /^[+]?[0-9\-$$$$\s]+$/
      if (fieldValue === "") {
        errorMessage = "Nomor telepon harus diisi"
        isValid = false
      } else if (fieldValue.length < 10) {
        errorMessage = "Nomor telepon minimal 10 digit"
        isValid = false
      } else if (!phoneRegex.test(fieldValue)) {
        errorMessage = "Format nomor telepon tidak valid"
        isValid = false
      }
      break

    case "message":
      if (fieldValue === "") {
        errorMessage = "Pesan harus diisi"
        isValid = false
      } else if (fieldValue.length < 10) {
        errorMessage = "Pesan minimal 10 karakter"
        isValid = false
      }
      break
  }

  // Display error or success
  if (isValid) {
    field.classList.add("success")
    errorElement.textContent = ""
  } else {
    field.classList.add("error")
    errorElement.textContent = errorMessage
  }

  return isValid
}

// Clear error styling
function clearError(field) {
  field.classList.remove("error")
  const errorElement = document.getElementById(field.name + "Error")
  if (errorElement) {
    errorElement.textContent = ""
  }
}

// Handle form submission
function handleFormSubmission() {
  const form = document.getElementById("contactForm")
  const formData = new FormData(form)

  // Validate all fields
  let isFormValid = true
  const fields = form.querySelectorAll("input, textarea")

  fields.forEach((field) => {
    if (!validateField(field)) {
      isFormValid = false
    }
  })

  if (isFormValid) {
    // Collect form data
    const submissionData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      timestamp: new Date().toLocaleString("id-ID"),
    }

    // Display submitted data
    displaySubmissionData(submissionData)

    // Reset form
    form.reset()
    fields.forEach((field) => {
      field.classList.remove("success", "error")
    })

    showNotification("Pesan berhasil dikirim!", "success")
  } else {
    showNotification("Silakan perbaiki kesalahan pada form!", "error")
  }
}

// Display submission data
function displaySubmissionData(data) {
  const submissionDisplay = document.getElementById("submissionDisplay")
  const submittedDataDiv = document.getElementById("submittedData")

  const dataHTML = `
        <div class="submitted-item">
            <strong>Nama:</strong> ${data.name}
        </div>
        <div class="submitted-item">
            <strong>Email:</strong> ${data.email}
        </div>
        <div class="submitted-item">
            <strong>Nomor Telepon:</strong> ${data.phone}
        </div>
        <div class="submitted-item">
            <strong>Pesan:</strong> ${data.message}
        </div>
        <div class="submitted-item">
            <strong>Waktu Pengiriman:</strong> ${data.timestamp}
        </div>
    `

  submittedDataDiv.innerHTML = dataHTML
  submissionDisplay.style.display = "flex"

  // Add CSS for submitted items
  const style = document.createElement("style")
  style.textContent = `
        .submitted-item {
            margin-bottom: 1rem;
            padding: 0.5rem;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #4285f4;
        }
        .submitted-item strong {
            color: #4285f4;
        }
    `
  document.head.appendChild(style)
}

// Close submission display
function closeSubmissionDisplay() {
  const submissionDisplay = document.getElementById("submissionDisplay")
  submissionDisplay.style.display = "none"
}

// Show notification
function showNotification(message, type) {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Add notification styles
  const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 1500;
            animation: slideIn 0.3s ease;
        }
        .notification.success {
            background: #34a853;
        }
        .notification.error {
            background: #ea4335;
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `

  // Add styles if not already added
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style")
    style.id = "notification-styles"
    style.textContent = notificationStyles
    document.head.appendChild(style)
  }

  // Add notification to page
  document.body.appendChild(notification)

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Scroll to top functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Add scroll to top button
let scrollButton // Declare scrollButton here to avoid redeclaration
window.addEventListener("scroll", () => {
  scrollButton = document.getElementById("scrollToTop") // Initialize scrollButton here

  if (!scrollButton) {
    const button = document.createElement("button")
    button.id = "scrollToTop"
    button.innerHTML = "↑"
    button.onclick = scrollToTop

    const buttonStyles = `
            #scrollToTop {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #4285f4;
                color: white;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                display: none;
                z-index: 1000;
                transition: all 0.3s ease;
            }
            #scrollToTop:hover {
                background: #3367d6;
                transform: translateY(-2px);
            }
            #scrollToTop.show {
                display: block;
            }
        `

    if (!document.querySelector("#scroll-button-styles")) {
      const style = document.createElement("style")
      style.id = "scroll-button-styles"
      style.textContent = buttonStyles
      document.head.appendChild(style)
    }

    document.body.appendChild(button)
  }

  if (window.pageYOffset > 300) {
    scrollButton.classList.add("show")
  } else {
    scrollButton.classList.remove("show")
  }
})

// Handle Enter key for name input
document.addEventListener("keypress", (e) => {
  if (e.target.id === "userName" && e.key === "Enter") {
    setWelcomeMessage()
  }
})

// Close submission display when clicking outside
document.addEventListener("click", (e) => {
  const submissionDisplay = document.getElementById("submissionDisplay")
  const submissionContent = document.querySelector(".submission-content")

  if (submissionDisplay.style.display === "flex" && !submissionContent.contains(e.target)) {
    closeSubmissionDisplay()
  }
})