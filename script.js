const nav = document.querySelector('nav[role="navigation"]')
const menuToggleButton = document.getElementById("menu-toggle")
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]')

function toggleMenu(forceState) {
  if (!nav || !menuToggleButton) {
    return
  }

  const shouldOpen =
    typeof forceState === "boolean"
      ? forceState
      : !nav.classList.contains("nav-open")

  nav.classList.toggle("nav-open", shouldOpen)
  menuToggleButton.classList.toggle("is-active", shouldOpen)
  menuToggleButton.setAttribute("aria-expanded", String(shouldOpen))
}

if (menuToggleButton) {
  menuToggleButton.addEventListener("click", () => {
    toggleMenu()
  })
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href")

    if (!targetId || !targetId.startsWith("#")) {
      return
    }

    const targetSection = document.querySelector(targetId)

    if (!targetSection) {
      return
    }

    event.preventDefault()
    targetSection.scrollIntoView({ behavior: "smooth", block: "start" })

    if (window.innerWidth <= 768) {
      toggleMenu(false)
    }
  })
})

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    toggleMenu(false)
  }
})

const projectCards = document.querySelectorAll(".project-card")
const filterButtons = document.querySelectorAll(".filter-button")

function filterProjects(category) {
  projectCards.forEach((projectCard) => {
    const projectCategory = projectCard.dataset.category
    const shouldShow = category === "all" || category === projectCategory
    projectCard.hidden = !shouldShow
  })
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter || "all"

    filterButtons.forEach((otherButton) => {
      otherButton.classList.remove("is-active")
    })

    button.classList.add("is-active")
    filterProjects(category)
  })
})

const lightbox = document.getElementById("lightbox")
const lightboxImage = document.getElementById("lightbox-image")
const lightboxCaption = document.getElementById("lightbox-caption")
const lightboxCloseButton = document.getElementById("lightbox-close")
const projectImages = document.querySelectorAll(".project-image")
let lastLightboxTrigger = null

function openLightbox(imageElement) {
  if (!lightbox || !lightboxImage || !lightboxCaption) {
    return
  }

  lastLightboxTrigger = imageElement
  lightboxImage.src = imageElement.src
  lightboxImage.alt = imageElement.alt
  lightboxCaption.textContent = imageElement.alt
  lightbox.classList.add("is-open")
  lightbox.setAttribute("aria-hidden", "false")
  document.body.style.overflow = "hidden"
  lightboxCloseButton?.focus()
}

function closeLightbox() {
  if (!lightbox || !lightboxImage || !lightboxCaption) {
    return
  }

  const activeElement = document.activeElement
  if (activeElement && lightbox.contains(activeElement)) {
    if (lastLightboxTrigger instanceof HTMLElement) {
      lastLightboxTrigger.focus()
    } else {
      menuToggleButton?.focus()
    }
  }

  lightbox.classList.remove("is-open")
  lightbox.setAttribute("aria-hidden", "true")
  lightboxImage.src = ""
  lightboxImage.alt = ""
  lightboxCaption.textContent = ""
  document.body.style.overflow = ""
}

projectImages.forEach((imageElement) => {
  imageElement.addEventListener("click", () => {
    openLightbox(imageElement)
  })

  imageElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openLightbox(imageElement)
    }
  })
})

if (lightboxCloseButton) {
  lightboxCloseButton.addEventListener("click", closeLightbox)
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox()
    }
  })
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
    closeLightbox()
  }
})

const contactForm = document.getElementById("contact-form")
const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const messageInput = document.getElementById("message")
const nameError = document.getElementById("name-error")
const emailError = document.getElementById("email-error")
const messageError = document.getElementById("message-error")
const formFeedback = document.getElementById("form-feedback")

function setFieldError(inputElement, errorElement, errorMessage) {
  if (!inputElement || !errorElement) {
    return
  }

  errorElement.textContent = errorMessage
  inputElement.classList.toggle("input-error", Boolean(errorMessage))
  inputElement.setAttribute("aria-invalid", String(Boolean(errorMessage)))
}

function validateName() {
  const value = nameInput?.value.trim() || ""

  if (value.length < 2) {
    setFieldError(nameInput, nameError, "Please enter at least 2 characters for your name.")
    return false
  }

  setFieldError(nameInput, nameError, "")
  return true
}

function validateEmail() {
  const value = emailInput?.value.trim() || ""
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(value)) {
    setFieldError(emailInput, emailError, "Please enter a valid email address.")
    return false
  }

  setFieldError(emailInput, emailError, "")
  return true
}

function validateMessage() {
  const value = messageInput?.value.trim() || ""

  if (value.length < 10) {
    setFieldError(
      messageInput,
      messageError,
      "Please enter at least 10 characters in your message."
    )
    return false
  }

  setFieldError(messageInput, messageError, "")
  return true
}

if (nameInput) {
  nameInput.addEventListener("input", validateName)
}

if (emailInput) {
  emailInput.addEventListener("input", validateEmail)
}

if (messageInput) {
  messageInput.addEventListener("input", validateMessage)
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const isNameValid = validateName()
    const isEmailValid = validateEmail()
    const isMessageValid = validateMessage()

    if (isNameValid && isEmailValid && isMessageValid) {
      if (formFeedback) {
        formFeedback.textContent = "Thanks! Your message was validated successfully."
        formFeedback.classList.remove("error")
        formFeedback.classList.add("success")
      }

      contactForm.reset()
      setFieldError(nameInput, nameError, "")
      setFieldError(emailInput, emailError, "")
      setFieldError(messageInput, messageError, "")
      return
    }

    if (formFeedback) {
      formFeedback.textContent = "Please fix the highlighted fields before submitting."
      formFeedback.classList.remove("success")
      formFeedback.classList.add("error")
    }
  })
}
