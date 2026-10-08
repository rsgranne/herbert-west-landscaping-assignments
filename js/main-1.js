// To use, include <script src="/js/main.js" defer></script> in the <head>.
//
// 1. HTML includes
// 2. Breadcrumbs

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

// To use, include `<script src="/js/main.js" defer></script>` in the `<head>`. `defer` tells the browser to download this file right away but wait to run it until it has finished reading the whole page.
//
// Then place the following near the bottom of your HTML file, just before `</body>`:
//
// <script>
//   document.addEventListener('DOMContentLoaded', () => {
//     includeHTML('/includes/footer.html', 'main');
//   });
// </script>
// <noscript>
//   You cannot see the footer without enabling JavaScript.
// </noscript>
//
// `DOMContentLoaded` fires when the browser has finished reading the page. Deferred scripts like this one always run just before that, so by then `includeHTML` is ready to use.
//
// Replace `/includes/footer.html` & `the footer` in `<noscript>` with the file you want to insert.
//
// Replace `main` with either an element (like `main`), an id (`#main`), or a class (`.main`), & the included file will be placed below it.
//
// `includeHTML` isn’t just for footers: call it as many times as you want, on any page, to include any fragment of HTML anywhere you want.

// ===================================================================
// 2. Breadcrumbs
// ===================================================================

// The page also needs <header id="header">, because the breadcrumb is added to the end of it.

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
// (because this script is deferred, the page is ready by the time this runs)
if (!document.body.classList.contains('no-breadcrumb')) {
  generateBreadcrumb();
}
