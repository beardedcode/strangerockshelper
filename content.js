// Function to toggle the cell color and save the state
function toggleCellColor(cell) {
  if (cell.textContent.trim() === '') {
    return; // Exit the function if the cell is empty
  }

  // Check if the cell is already checked
  const isChecked = cell.classList.contains('checked');
  
  if (!isChecked) {
    // If the cell is not checked, set the gradient background
    cell.style.backgroundImage = 'linear-gradient(90deg, ' + cell.style.backgroundColor + ' 50%, #ffffff 50%)';
  } else {
    // If the cell is checked, set the full-color background
    cell.style.backgroundImage = 'none';
  }

  // Toggle the 'checked' class
  cell.classList.toggle('checked');
  
  const cellId = cell.getAttribute('data-cell-id');
  localStorage.setItem(cellId, !isChecked); // Store the opposite state in localStorage
}

// Function to restore the checked state from localStorage
function restoreCheckedState() {
  const cells = document.querySelectorAll('[data-cell-id]');
  cells.forEach((cell) => {
    const cellId = cell.getAttribute('data-cell-id');
    const isChecked = localStorage.getItem(cellId);
    
    if (isChecked === 'true') {
      cell.classList.add('checked');
      cell.style.backgroundImage = 'none'; // Set the full-color background for previously checked cells
    }
  });
}

// Function to speak the provided text using text-to-speech
function speakText(text) {
  const speechSynthesis = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices.find(voice => voice.lang === 'en-us'); // Change the voice name as desired
  speechSynthesis.speak(utterance);
}

// Function to read aloud all the tips sequentially
function readAllTips() {
  const tipsList = document.querySelectorAll('.tips-wrapper li');
  let currentIndex = 0;

  function readTip() {
    const tip = tipsList[currentIndex];
    
    // Check if the tip has already been read
    if (tip.classList.contains('reading')) {
      currentIndex++;
      if (currentIndex < tipsList.length) {
        readTip();
      }
      return;
    }

    const text = tip.innerText;

    speakText(text);
    tip.classList.add('reading');
    document.querySelector('.tips-wrapper h3').classList.add('reading');
    document.querySelector('.tips-wrapper h3').textContent = "Tips (Audio)"

    const duration = calculateDuration(text);
    setTimeout(() => {
      tip.classList.remove('reading');
      document.querySelector('.tips-wrapper h3').classList.remove('reading');
      document.querySelector('.tips-wrapper h3').textContent = "Tips"
      currentIndex++;
      if (currentIndex < tipsList.length) {
        readTip();
      }
    }, duration);
  }

  function calculateDuration(text) {
    const wordsPerMinute = 106; // Adjust as desired
    const words = text.split(' ').length;
    const minutes = words / wordsPerMinute;
    const duration = minutes * 60 * 1000; // Convert to milliseconds
    return duration;
  }

  readTip();
}

// Function to stop the speech synthesis
function stopSpeaking() {
  const speechSynthesis = window.speechSynthesis;
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }
}

// Event listener for the tips heading
const tipsHeading = document.querySelector('.tips-wrapper h3');
tipsHeading.addEventListener('click', stopSpeaking);

// Restore the checked state on page load
window.addEventListener('DOMContentLoaded', restoreCheckedState);

function resetRows() {
  const rows = document.querySelectorAll('.table-wrapper tbody tr');
  
  rows.forEach(row => {
    const strangeCell = row.querySelector('.strange');
    const goldenCell = row.querySelector('.golden');
    strangeCell.classList.remove('checked');
    goldenCell.classList.remove('checked');
    const strangeCellId = strangeCell.getAttribute('data-cell-id');
    const goldenCellId = goldenCell.getAttribute('data-cell-id');
    localStorage.setItem(strangeCellId, false);
    localStorage.setItem(goldenCellId, false);
  });
}
