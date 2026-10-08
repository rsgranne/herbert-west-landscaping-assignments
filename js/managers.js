// Select all character cards
const characterCards = document.querySelectorAll('.managers > div');

// Store active filter selections
let activeAlignment = 'all';
let activeType = 'all';
let activeEnvironment = 'all';

// Helper function to switch button classes
function updateButtonClasses(buttonGroup, selectedButton) {
  buttonGroup.forEach(button => {
    if (button === selectedButton) {
      button.classList.remove('btn-outline-primary');
      button.classList.add('btn-primary');
    } else {
      button.classList.remove('btn-primary');
      button.classList.add('btn-outline-primary');
    }
  });
}

// Function to filter cards based on the selected filters
function filterCards() {
  characterCards.forEach(card => {
    // Get the card's attributes
    const cardAlignment = card.getAttribute('data-alignment');
    const cardType = card.getAttribute('data-type');
    const cardEnvironment = card.getAttribute('data-environment');

    // Check if the card matches the active filters
    const alignmentMatch = activeAlignment === 'all' || cardAlignment === activeAlignment;
    const typeMatch = activeType === 'all' || cardType === activeType;
    const environmentMatch = activeEnvironment === 'all' || cardEnvironment === activeEnvironment;

    // Apply the filters by toggling a CSS class (avoids layout side-effects)
    if (alignmentMatch && typeMatch && environmentMatch) {
      card.classList.remove('is-hidden');
    } else {
      card.classList.add('is-hidden');
    }
  });
}

// Function to handle button clicks and class switching
function setupFilterButtons(attribute, buttons) {
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute(attribute);

      // Update the appropriate active filter
      if (attribute === 'data-alignment') activeAlignment = value;
      if (attribute === 'data-type') activeType = value;
      if (attribute === 'data-environment') activeEnvironment = value;

      // Update button classes
      updateButtonClasses(buttons, button);

      // Apply the filters
      filterCards();
    });
  });
}

// Set up event listeners for each filter group
setupFilterButtons('data-alignment', document.querySelectorAll('.filters button[data-alignment]'));
setupFilterButtons('data-type', document.querySelectorAll('.filters button[data-type]'));
setupFilterButtons('data-environment', document.querySelectorAll('.filters button[data-environment]'));
