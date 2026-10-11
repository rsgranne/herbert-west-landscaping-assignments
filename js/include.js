// https://chnsa.ws/25p
// Function to include HTML content below a specified element, ID, or class
function includeHTML(url, targetElement = null) {
  // Fetch the external HTML file
  fetch(url)

    // Check that the file was found, then convert the response from the server into plain text
    .then(response => {
      // A missing file (like a 404) still sends back a response, so stop here with an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })

    // Work with the HTML text after it has been loaded
    .then(data => {
      // Warn if the included file contains a full HTML document (which is usually a mistake when using includeHTML)
      if (data.toLowerCase().includes('<html')) {
        console.warn(`⚠️ Warning: ${url} appears to contain a full HTML document! Make sure it only contains the intended fragment.`);
      }

      // Create a parser that can turn a string of HTML into real HTML elements
      const parser = new DOMParser();

      // Parse the fetched HTML text as an HTML document
      const htmlContent = parser.parseFromString(data, 'text/html');

      // Get only the actual HTML elements inside the fetched file’s <body>
      // This skips whitespace, line breaks, comments, and text nodes
      const includedContent = htmlContent.body.children;

      // Create a temporary container for the included elements
      // This lets us insert everything at once while keeping the correct order
      const fragment = document.createDocumentFragment();

      // Copy each included element into the temporary fragment
      Array.from(includedContent).forEach(node => {
        fragment.appendChild(node.cloneNode(true));
      });

      // If the user provided a target element, selector, ID, or class
      if (targetElement) {
        // If targetElement is a string, use it as a CSS selector
        // Examples: 'main', '#main', '.main'
        //
        // If targetElement is already an element, use it directly
        const targetElementNode = typeof targetElement === 'string'
          ? document.querySelector(targetElement)
          : targetElement;

        // Stop with an error if the target element doesn’t exist on this page
        if (!targetElementNode) {
          console.error(`Target element '${targetElement}' not found.`);
          return;
        }

        // Insert the included content after the target element
        targetElementNode.after(fragment);
      } else {
        // If no target element was provided, find the first element in <body>
        const firstElement = document.body.firstElementChild;

        // Insert the included content before the first element in <body>
        firstElement.before(fragment);
      }
    })

    // Show an error in the console if the file cannot be fetched or inserted
    .catch(error => console.error('Error fetching the file:', error));
}

// To use, include `<script src="/js/include.js" defer></script>` in the `<head>`. `defer` tells the browser to download this file right away but wait to run it until it has finished reading the whole page.
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
