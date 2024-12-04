let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 100;
document.getElementById('score').textContent = score;

let wheel = document.querySelector("#wheel");
let button = document.querySelector("#spin");
let labels = document.querySelectorAll(".label span");

// Define the cooldown period (12 hours in milliseconds)
const cooldownPeriod = 12 * 60 * 60 * 1000; // 12 hours

// Check if the wheel was spun recently and calculate remaining time
let lastSpinTime = localStorage.getItem('lastSpinTime');
let currentTime = new Date().getTime();
let timeRemaining = 0;

// If there's a last spin time, calculate the remaining time
if (lastSpinTime) {
  lastSpinTime = parseInt(lastSpinTime);
  timeRemaining = cooldownPeriod - (currentTime - lastSpinTime);

  // If the time remaining is less than 0, it means 12 hours have passed, so reset the cooldown
  if (timeRemaining <= 0) {
    timeRemaining = 0;
  }
}

function updateCountdown() {
  if (timeRemaining > 0) {
    // Calculate remaining time in hours, minutes, and seconds
    let hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    // Display countdown
    document.getElementById('countdown').textContent = `Next spin available in ${hours}h ${minutes}m ${seconds}s`;

    // Disable the spin button during cooldown
    button.disabled = true;
  } else {
    document.getElementById('countdown').textContent = "";
    button.disabled = false;
  }
}

// Call the countdown function to update immediately on load
updateCountdown();

// Enable the button and allow the spin if the cooldown is over
button.addEventListener("click", spinWheel);

function spinWheel() {
  // Generate a random spin between 0 and 3600 degrees (10 full spins)
  let spin = Math.floor(Math.random() * 3600 + 360); // Ensure at least 1 full spin
  let finalDegrees = spin % 360; // Get only the degrees within one full rotation

  // Apply rotation to the wheel
  wheel.style.transition = "ease 1s";
  wheel.style.transform = `rotate(${spin}deg)`;

  // Wait for the spin animation to complete
  setTimeout(() => {
    // Adjust for the offset of the top segment (12 is at 0 degrees)
    let offsetDegrees = (360 - finalDegrees + 15) % 360;

    // Correctly calculate the field index
    let fieldIndex = Math.floor(offsetDegrees / 30) % 12;

    // Get the text content of the label
    let label = labels[fieldIndex].textContent;

    // Remove "$" from the label and parse the number
    let value = parseInt(label.replace('$', '').trim());

    // Update the score
    score += value;
    
    // Update the score display
    document.getElementById('score').textContent = score;

    // Save the new score to localStorage
    localStorage.setItem('score', score);

    // Save the current time as the last spin time
    localStorage.setItem('lastSpinTime', currentTime);

    // Reset the remaining cooldown time and update the countdown display
    timeRemaining = cooldownPeriod;
    updateCountdown();

  }, 1000); // Match the delay to the CSS transition duration
}

// Update the countdown every second to show the remaining time
setInterval(function() {
  if (timeRemaining > 0) {
    timeRemaining -= 1000;
    updateCountdown();
  }
}, 1000);
