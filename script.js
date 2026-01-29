// Array of available moss images
const mossImages = Array.from({ length: 201 }, (_, i) => `Moss Images/${i}.jpg`);

// DOM Elements
const mossImage = document.getElementById('mossImage');
const dayCount = document.getElementById('dayCount');
const dayDescription = document.getElementById('dayDescription');
const infoMessage = document.getElementById('infoMessage');
const themeToggle = document.getElementById('themeToggle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

// State
const startDate = new Date(2026, 0, 28); // Month is 0-indexed
let currentDayOffset = 0; // Offset from today

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  updateDisplay();
  setupEventListeners();
  preloadImages();
});

// Get today's day number
function getTodayDayNumber() {
  const today = new Date();
  const timeDiff = today - startDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}

// Update display based on current offset
function updateDisplay() {
  const todayDayNumber = getTodayDayNumber();
  const currentDay = todayDayNumber + currentDayOffset;
  const imageIndex = currentDay % mossImages.length;

  // Update day count with animation
  const newDay = currentDay + 1;
  animateNumber(dayCount, newDay);

  // Update image with loading state
  loadImage(mossImages[imageIndex]);

  // Update description
  updateDescription(currentDay, todayDayNumber);

  // Update info message
  updateInfoMessage(currentDayOffset, todayDayNumber);
}

// Animate number change
function animateNumber(element, newNumber) {
  const oldNumber = parseInt(element.textContent);
  if (oldNumber === newNumber) return;

  element.style.animation = 'none';
  setTimeout(() => {
    element.style.animation = 'fadeIn 0.3s ease-in';
    element.textContent = newNumber;
  }, 10);
}

// Load image with loading state
function loadImage(src) {
  loadingSpinner.classList.add('active');
  mossImage.style.opacity = '0.5';

  const img = new Image();
  img.onload = () => {
    mossImage.src = src;
    mossImage.style.opacity = '1';
    loadingSpinner.classList.remove('active');
  };
  img.onerror = () => {
    loadingSpinner.classList.remove('active');
    mossImage.style.opacity = '1';
    mossImage.src = src; // Fallback to original src
  };
  img.src = src;
}

// Update description based on current day
function updateDescription(currentDay, todayDayNumber) {
  const daysUntil = todayDayNumber - currentDay;

  if (daysUntil === 0) {
    dayDescription.textContent = 'Today\'s moss!';
  } else if (daysUntil === 1) {
    dayDescription.textContent = 'Yesterday\'s moss';
  } else if (daysUntil > 0) {
    dayDescription.textContent = `${daysUntil} days ago`;
  } else if (daysUntil === -1) {
    dayDescription.textContent = 'Tomorrow\'s moss (sneak peek!)';
  } else {
    dayDescription.textContent = `How did you break into the moss vaults!?`;
  }
}

// Update info message
function updateInfoMessage(offset, todayDayNumber) {
  if (offset === 0) {
    infoMessage.textContent = 'Enjoy your free daily dose!';
  } else if (offset > 0) {
    infoMessage.textContent = `You're browsing the future...`;
  } else {
    infoMessage.textContent = `Reliving the past`;
  }
}

// Setup event listeners
function setupEventListeners() {
  prevBtn.addEventListener('click', () => {
    if (currentDayOffset < -currentDay) return; // Prevent going before start date
    currentDayOffset--;
    updateDisplay();
    prevBtn.blur();
  });

  nextBtn.addEventListener('click', () => {
    if (currentDayOffset >= 0) return; // Prevent going into future beyond today
    currentDayOffset++;
    updateDisplay();
    nextBtn.blur();
  });

  resetBtn.addEventListener('click', () => {
    currentDayOffset = 0;
    updateDisplay();
    resetBtn.blur();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === ' ') {
      e.preventDefault();
      resetBtn.click();
    }
  });

  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
}

// Theme management
function initializeTheme() {
  const savedTheme = localStorage.getItem('mossTheme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('mossTheme', isDarkMode ? 'dark' : 'light');
  themeToggle.textContent = isDarkMode ? '☀️' : '🌙';

  // Add slight animation
  themeToggle.style.transform = 'rotate(20deg)';
  setTimeout(() => {
    themeToggle.style.transform = 'rotate(0deg)';
  }, 300);
}

// Preload images for smoother navigation
function preloadImages() {
  const indicesToPreload = [-1, 0, 1, 2, -2];
  const todayDayNumber = getTodayDayNumber();

  indicesToPreload.forEach((offset) => {
    const dayNumber = todayDayNumber + offset;
    const imageIndex = dayNumber % mossImages.length;
    const img = new Image();
    img.src = mossImages[imageIndex];
  });
}

// Add touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swiped left - next image
      nextBtn.click();
    } else {
      // Swiped right - previous image
      prevBtn.click();
    }
  }
}