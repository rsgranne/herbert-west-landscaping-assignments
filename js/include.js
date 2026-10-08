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

// To use, include `<script src="/js/include.js"></script>` in the `<head>` (or at least above where you call the `includeHTML` function) & then place the following near the bottom of your HTML file, just before any other `<script>` tags that come before `</body>`:
//
// <script>
//   includeHTML('/includes/footer.html', 'main');
// </script>
// <noscript>
//   You cannot see the footer without enabling JavaScript.
// </noscript>
//
// Replace `/includes/footer.html` & `the footer` in `<noscript>` with the file you want to insert.
//
// Replace `main` with either an element (like `main`), an id (`#main`), or a class (`.main`), & the included file will be placed below it.
