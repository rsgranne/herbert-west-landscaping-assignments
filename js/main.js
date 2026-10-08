// 1. HTML includes
// 2. Breadcrumbs
// 3. Manager-card filters
// 4. Form validation

// ===================================================================
// 1. HTML includes
// ===================================================================

// Function to include HTML content below a specified element, ID, or class
function includeHTML(url, targetElement = null) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      // Warn if the included file contains a full HTML document (which is usually a mistake when using includeHTML)
      if (data.toLowerCase().includes('<html')) {
        console.warn(`⚠️ Warning: ${url} appears to contain a full HTML document! Make sure it only contains the intended fragment.`);
      }

      // Parse the fetched HTML string into a DOM structure so we can manipulate its elements
      const parser = new DOMParser();
      const htmlContent = parser.parseFromString(data, 'text/html');

      // Get only the element nodes from the parsed content (ignores text/comments)
      const includedElements = Array.from(htmlContent.body.children);

      if (targetElement) {
        // Determine the target element (it can be a selector string or a DOM element)
        const targetElementNode = typeof targetElement === 'string'
          ? document.querySelector(targetElement)
          : targetElement;

        // Ensure the target element exists before proceeding
        if (!targetElementNode) {
          console.error(`Target element '${targetElement}' not found.`);
          return;
        }

        // Insert each valid element after the target element
        includedElements.forEach(node => {
          targetElementNode.insertAdjacentElement('afterend', node.cloneNode(true));
        });
      } else {
        // If no target is specified, insert each included element before the first child of <body> (i.e., at the top of the page content)
        const firstElement = document.body.firstElementChild;
        includedElements.forEach(node => {
          firstElement.insertAdjacentElement('beforebegin', node.cloneNode(true));
        });
      }
    })
    .catch(error => console.error('Error fetching the file:', error));
}

// To use, include <script src="/js/main.js"></script> in the <head> (or at least above where you call the includeHTML function) & then place the following near the bottom of your HTML file, just before any other <script> tags that come before </body>:
//
// <script>
//   includeHTML('/includes/footer.html', 'main');
// </script>
// <noscript>
//   You cannot see the footer without enabling JavaScript.
// </noscript >
//
// Replace /includes/footer.html & the footer in <noscript> with the file you want to insert.
//
// Replace main with either an element (like main), an ID (#main), or a class (.main), & the included file will be placed below it.

// ===================================================================
// 2. Breadcrumbs
// ===================================================================

// Capitalizes the first letter of a word
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Formats a string for breadcrumb display: replaces hyphens, applies title casing (except small words)
function formatBreadcrumbItem(item) {
  return item
    .replace(/-/g, ' ')
    .split(' ')
    .map((word, index) =>
      index === 0 || !['a', 'and', 'or', 'the'].includes(word.toLowerCase())
        ? capitalizeFirstLetter(word)
        : word.toLowerCase()
    )
    .join(' ');
}

// Builds the breadcrumb and appends it to the #header element
function generateBreadcrumb() {
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split('/').filter(Boolean);

  // Create the <ol> element that will hold breadcrumb items
  const breadcrumbList = document.createElement('ol');
  breadcrumbList.classList.add('breadcrumb');
  breadcrumbList.id = 'breadcrumb-list';

  // "Home" link is always first
  const homeListItem = document.createElement('li');
  homeListItem.classList.add('breadcrumb-item');
  homeListItem.innerHTML = '<a href="/" class="text-decoration-none text-success">Home</a>';
  breadcrumbList.appendChild(homeListItem);

  // Construct breadcrumbs from path parts
  let currentURL = '/';
  pathParts.forEach((part, index) => {
    currentURL += `${part}/`;
    const listItem = document.createElement('li');

    // Remove ".html" if it's the final item
    let label = formatBreadcrumbItem(part);
    if (index === pathParts.length - 1 && label.endsWith('.html')) {
      label = label.replace(/\.html$/, '');
    }

    // If this is the last item, make it the active page, without a link; otherwise, make it a clickable link
    listItem.classList.add('breadcrumb-item');
    if (index === pathParts.length - 1) {
      listItem.textContent = label;
      listItem.classList.add('active');
      listItem.setAttribute('aria-current', 'page');
    } else {
      listItem.innerHTML = `<a href="${currentURL}" class="text-decoration-none text-success">${label}</a>`;
    }

    // Add list item to the breadcrumb list
    breadcrumbList.appendChild(listItem);
  });

  // Create <nav> element that will hold the breadcrumb list with proper ARIA attributes
  const breadcrumbNav = document.createElement('nav');
  breadcrumbNav.setAttribute('aria-label', 'breadcrumb');
  breadcrumbNav.appendChild(breadcrumbList);

  // Create fluid container for the breadcrumb list
  const container = document.createElement('div');
  container.classList.add('container-fluid');
  container.appendChild(breadcrumbNav);

  // Add the breadcrumb list to the header element if #header exists
  const header = document.getElementById('header');
  if (header) {
    header.appendChild(container);
  } else {
    console.warn('⚠️ No #header element found — breadcrumb not inserted.');
  }
}

// Generate breadcrumb unless the <body> has the "no-breadcrumb" class
window.addEventListener('load', () => {
  if (!document.body.classList.contains('no-breadcrumb')) {
    generateBreadcrumb();
  }
});

// ===================================================================
// 3. Manager-card filters
// ===================================================================

function initializeManagerFilters() {
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
}

window.addEventListener('load', initializeManagerFilters);

// ===================================================================
// 4. Form validation
// ===================================================================

// https://chnsa.ws/26g
function validate() {
  // Get the values from the form fields
  var firstName = document.getElementById("first-name").value;
  var lastName = document.getElementById("last-name").value;
  var email = document.getElementById("email").value;
  var subject = document.getElementById("subject").value;
  var message = document.getElementById("message").value;
  var error_message = document.getElementById("error_message");

  // Set the error message style
  error_message.style.padding = "0 1rem 1rem 0";
  error_message.style.color = "red";
  error_message.style.fontSize = "1.5rem";

  // Show the error message and scroll to it
  function showError(message) {
    error_message.innerHTML = message;
    error_message.scrollIntoView();
    return false;
  }

  // Check if the first name is valid
  if (firstName.length < 3) {
    return showError("Your first name must be longer than 2 characters. Sorry Bo.");
  }

  // Check if the last name is valid
  if (lastName.length < 3) {
    return showError("Your last name must be longer than 2 character. Sorry Ng.");
  }

  // Check if the email is valid
  if (email.indexOf("@") === -1 || email.length < 6) {
    return showError("Please enter a valid email address.");
  }

  // Check if the subject is valid
  if (subject.length < 1) {
    return showError("Please pick a subject.");
  }

  // Check if the message is valid
  if (message.length <= 3) {
    return showError("Your message must contain more than 2 characters.");
  }

  // Show a success message
  alert("Thank you. Your form has been submitted successfully!");
  return true;
}
