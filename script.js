// Global Variables
let currentSlide = 0
const totalSlides = 8
let autoSlideInterval
let countryData = null
let quizData = {
  currentCountry: null,
  options: [],
  score: 0,
  totalQuestions: 0,
  isCorrect: null,
  showResult: false,
}

// Destinations Data
const destinations = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    countryCode: "FR",
    image: "https://wallpapers.com/images/hd/paris-eiffel-tower-ah19sagu2co2m8s1.jpg",
    description: "The City of Light, famous for the Eiffel Tower, Louvre Museum, and romantic atmosphere.",
  },
  {
    id: 2,
    name: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    image: "https://wallpapers.com/images/hd/japanese-aesthetic-desktop-z8dya6kwqdvxxy93.jpg",
    description: "A vibrant metropolis blending ancient traditions with cutting-edge technology.",
  },
  {
    id: 3,
    name: "New York",
    country: "United States",
    countryCode: "US",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
    description: "The Big Apple, home to iconic landmarks like Times Square and Central Park.",
  },
  {
    id: 4,
    name: "London",
    country: "United Kingdom",
    countryCode: "GB",
    image: "https://i.pinimg.com/736x/53/df/df/53dfdfe34a87c1e15b5579b77cb38d3b.jpg",
    description: "Historic city featuring Big Ben, Buckingham Palace, and rich cultural heritage.",
  },
  {
    id: 5,
    name: "Sydney",
    country: "Australia",
    countryCode: "AU",
    image: "https://i.pinimg.com/736x/5f/de/77/5fde7793dda55578897c729dff6e1b54.jpg",
    description: "Beautiful harbor city known for the Opera House and stunning beaches.",
  },
  {
    id: 6,
    name: "Rome",
    country: "Italy",
    countryCode: "IT",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop",
    description: "The Eternal City, rich in history with the Colosseum and Vatican City.",
  },
  {
    id: 7,
    name: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    description: "Modern oasis with stunning architecture, luxury shopping, and desert adventures.",
  },
  {
    id: 8,
    name: "Barcelona",
    country: "Spain",
    countryCode: "ES",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop",
    description: "Vibrant city known for Gaudí's architecture, beaches, and incredible cuisine.",
  },
]

// Quiz Countries Data
const quizCountries = [
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "DE", name: "Germany" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
]

// DOM Elements
const carouselTrack = document.getElementById("carouselTrack")
const carouselIndicators = document.getElementById("carouselIndicators")
const prevBtn = document.getElementById("prevBtn")
const nextBtn = document.getElementById("nextBtn")
const learnMoreBtn = document.getElementById("learnMoreBtn")
const learnMoreText = document.getElementById("learnMoreText")
const countrySelect = document.getElementById("countrySelect")
const countryDisplay = document.getElementById("countryDisplay")
const loadingOverlay = document.getElementById("loadingOverlay")

// Quiz Elements
const quizStats = document.getElementById("quizStats")
const quizScore = document.getElementById("quizScore")
const quizTotal = document.getElementById("quizTotal")
const quizPercentage = document.getElementById("quizPercentage")
const quizStart = document.getElementById("quizStart")
const startQuizBtn = document.getElementById("startQuizBtn")
const quizQuestion = document.getElementById("quizQuestion")
const quizFlag = document.getElementById("quizFlag")
const quizOptions = document.getElementById("quizOptions")
const quizResult = document.getElementById("quizResult")
const resultMessage = document.getElementById("resultMessage")
const nextQuestionBtn = document.getElementById("nextQuestionBtn")
const resetQuizBtn = document.getElementById("resetQuizBtn")

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initializeTabs()
  initializeCarousel()
  initializeCountryDropdown()
  initializeQuiz()
  startAutoSlide()
})

// Tab Functionality
function initializeTabs() {
  const tabTriggers = document.querySelectorAll(".tab-trigger")
  const tabContents = document.querySelectorAll(".tab-content")

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetTab = trigger.getAttribute("data-tab")

      // Remove active class from all triggers and contents
      tabTriggers.forEach((t) => t.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked trigger and corresponding content
      trigger.classList.add("active")
      document.getElementById(targetTab).classList.add("active")
    })
  })
}

// Carousel Functionality
function initializeCarousel() {
  createCarouselSlides()
  createCarouselIndicators()
  updateCarousel()

  prevBtn.addEventListener("click", () => {
    stopAutoSlide()
    previousSlide()
    startAutoSlide()
  })

  nextBtn.addEventListener("click", () => {
    stopAutoSlide()
    nextSlide()
    startAutoSlide()
  })

  learnMoreBtn.addEventListener("click", () => {
    const currentDestination = destinations[currentSlide]
    fetchCountryData(currentDestination.countryCode)
  })
}

function createCarouselSlides() {
  carouselTrack.innerHTML = ""

  destinations.forEach((destination, index) => {
    const slide = document.createElement("div")
    slide.className = "carousel-slide"
    slide.innerHTML = `
            <img src="${destination.image}" alt="${destination.name}" class="slide-image">
            <div class="slide-overlay"></div>
            <div class="slide-content">
                <h2 class="slide-title">${destination.name}</h2>
                <div class="slide-location">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${destination.country}</span>
                </div>
                <p class="slide-description">${destination.description}</p>
            </div>
        `
    carouselTrack.appendChild(slide)
  })
}

function createCarouselIndicators() {
  carouselIndicators.innerHTML = ""

  destinations.forEach((_, index) => {
    const indicator = document.createElement("button")
    indicator.className = "indicator"
    if (index === 0) indicator.classList.add("active")
    indicator.addEventListener("click", () => {
      stopAutoSlide()
      goToSlide(index)
      startAutoSlide()
    })
    carouselIndicators.appendChild(indicator)
  })
}

function updateCarousel() {
  const translateX = -currentSlide * 12.5 // 12.5% per slide (100% / 8 slides)
  carouselTrack.style.transform = `translateX(${translateX}%)`

  // Update indicators
  const indicators = document.querySelectorAll(".indicator")
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentSlide)
  })

  // Update learn more button text
  learnMoreText.textContent = `Learn About ${destinations[currentSlide].country}`
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides
  updateCarousel()
}

function previousSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
  updateCarousel()
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex
  updateCarousel()
}

function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 5000)
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval)
}

// Country Buttons
function initializeCountryDropdown() {
  countrySelect.innerHTML = '<option value="">Choose a destination...</option>'

  destinations.forEach((destination) => {
    const option = document.createElement("option")
    option.value = destination.countryCode
    option.textContent = `${destination.name}, ${destination.country}`
    countrySelect.appendChild(option)
  })

  countrySelect.addEventListener("change", (e) => {
    const selectedCountryCode = e.target.value
    if (selectedCountryCode) {
      fetchCountryData(selectedCountryCode)
    } else {
      // Clear the country display when no destination is selected
      countryDisplay.style.display = "none"
      countryData = null
    }
  })
}

// API Functions
async function fetchCountryData(countryCode) {
  showLoading()

  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
    if (response.ok) {
      const data = await response.json()
      countryData = data[0]
      displayCountryData()

      // Switch to facts tab
      document.querySelector('.tab-trigger[data-tab="facts"]').click()
    } else {
      throw new Error("Failed to fetch country data")
    }
  } catch (error) {
    console.error("Error fetching country data:", error)
    showError("Failed to load country information. Please try again.")
  } finally {
    hideLoading()
  }
}

function displayCountryData() {
  if (!countryData) return

  const currencies = formatCurrency(countryData.currencies)
  const languages = formatLanguages(countryData.languages)

  countryDisplay.innerHTML = `
        <div class="country-card">
            <div class="country-header">
                <div class="country-flag-container">
                    <img src="${countryData.flags.png}" alt="${countryData.name.common} flag" class="country-flag">
                    <div>
                        <h3 class="country-name">${countryData.name.common}</h3>
                        <p class="country-official">${countryData.name.official}</p>
                    </div>
                </div>
            </div>
            <div class="country-content">
                <div class="country-details">
                    <div class="detail-item capital">
                        <svg class="detail-icon capital" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <div class="detail-content">
                            <div class="detail-label capital">Capital</div>
                            <div class="detail-value">${countryData.capital ? countryData.capital.join(", ") : "N/A"}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item currency">
                        <svg class="detail-icon currency" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        <div class="detail-content">
                            <div class="detail-label currency">Currency</div>
                            <div class="detail-value">${currencies}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item population">
                        <svg class="detail-icon population" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <div class="detail-content">
                            <div class="detail-label population">Population</div>
                            <div class="detail-value">${countryData.population.toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item region">
                        <svg class="detail-icon region" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        <div class="detail-content">
                            <div class="detail-label region">Region</div>
                            <div class="detail-value">${countryData.region} - ${countryData.subregion}</div>
                        </div>
                    </div>
                </div>
                
                ${
                  languages
                    ? `
                    <div class="languages-section">
                        <div class="languages-label">Languages</div>
                        <div class="languages-list">
                            ${Object.values(countryData.languages)
                              .map((lang) => `<span class="language-badge">${lang}</span>`)
                              .join("")}
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        </div>
    `

  countryDisplay.style.display = "block"
}

// Quiz Functionality
function initializeQuiz() {
  startQuizBtn.addEventListener("click", generateQuizQuestion)
  nextQuestionBtn.addEventListener("click", generateQuizQuestion)
  resetQuizBtn.addEventListener("click", resetQuiz)
}

async function generateQuizQuestion() {
  showLoading()

  try {
    // Select a random country for the question
    const randomCountry = quizCountries[Math.floor(Math.random() * quizCountries.length)]

    // Fetch the country data
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${randomCountry.code}`)
    if (response.ok) {
      const data = await response.json()
      const correctCountry = data[0]

      // Generate 3 wrong options
      const wrongOptions = quizCountries
        .filter((c) => c.code !== randomCountry.code)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((c) => c.name)

      // Mix correct answer with wrong options
      const allOptions = [...wrongOptions, correctCountry.name.common].sort(() => 0.5 - Math.random())

      quizData.currentCountry = correctCountry
      quizData.options = allOptions
      quizData.isCorrect = null
      quizData.showResult = false

      displayQuizQuestion()
    }
  } catch (error) {
    console.error("Error generating quiz question:", error)
    showError("Failed to load quiz question. Please try again.")
  } finally {
    hideLoading()
  }
}

function displayQuizQuestion() {
  // Hide start screen and result
  quizStart.style.display = "none"
  quizResult.style.display = "none"

  // Show question
  quizQuestion.style.display = "block"

  // Update flag
  quizFlag.src = quizData.currentCountry.flags.png

  // Create options
  quizOptions.innerHTML = ""
  quizData.options.forEach((option) => {
    const button = document.createElement("button")
    button.className = "quiz-option"
    button.textContent = option
    button.addEventListener("click", () => handleQuizAnswer(option))
    quizOptions.appendChild(button)
  })

  // Show stats if there are questions answered
  if (quizData.totalQuestions > 0) {
    updateQuizStats()
    quizStats.style.display = "flex"
  }
}

function handleQuizAnswer(selectedAnswer) {
  if (!quizData.currentCountry) return

  const isCorrect = selectedAnswer === quizData.currentCountry.name.common
  quizData.isCorrect = isCorrect
  quizData.showResult = true

  if (isCorrect) {
    quizData.score++
  }
  quizData.totalQuestions++

  displayQuizResult()
  updateQuizStats()
}

function displayQuizResult() {
  // Hide question
  quizQuestion.style.display = "none"

  // Show result
  quizResult.style.display = "block"

  // Update result message
  const isCorrect = quizData.isCorrect
  resultMessage.className = `result-message ${isCorrect ? "correct" : "incorrect"}`
  resultMessage.innerHTML = `
        <div class="result-title">
            ${isCorrect ? "🎉 Correct!" : "❌ Incorrect"}
        </div>
        <div>
            The correct answer is: <strong>${quizData.currentCountry.name.common}</strong>
        </div>
    `
}

function updateQuizStats() {
  quizScore.textContent = quizData.score
  quizTotal.textContent = quizData.totalQuestions

  const percentage = quizData.totalQuestions > 0 ? Math.round((quizData.score / quizData.totalQuestions) * 100) : 0
  quizPercentage.textContent = percentage
}

function resetQuiz() {
  quizData = {
    currentCountry: null,
    options: [],
    score: 0,
    totalQuestions: 0,
    isCorrect: null,
    showResult: false,
  }

  // Hide all quiz sections
  quizQuestion.style.display = "none"
  quizResult.style.display = "none"
  quizStats.style.display = "none"

  // Show start screen
  quizStart.style.display = "block"
}

// Utility Functions
function formatCurrency(currencies) {
  if (!currencies) return "N/A"

  const currencyEntries = Object.entries(currencies)
  if (currencyEntries.length === 0) return "N/A"

  return currencyEntries.map(([code, info]) => `${info.name} (${info.symbol || code})`).join(", ")
}

function formatLanguages(languages) {
  if (!languages) return ""
  return Object.values(languages).join(", ")
}

function showLoading() {
  loadingOverlay.style.display = "flex"
}

function hideLoading() {
  loadingOverlay.style.display = "none"
}

function showError(message) {
  // Simple error display - you could enhance this with a proper modal
  alert(message)
}

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      stopAutoSlide()
      previousSlide()
      startAutoSlide()
      break
    case "ArrowRight":
      stopAutoSlide()
      nextSlide()
      startAutoSlide()
      break
  }
})

// Pause auto-slide when page is not visible
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoSlide()
  } else {
    startAutoSlide()
  }
})
