// Function to include HTML content below a specified element, id, or class
function includeHTML(url, targetElement = null) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const htmlContent = parser.parseFromString(data, 'text/html');
      const includedContent = htmlContent.querySelector('body').childNodes;

      if (targetElement) {
        const targetElementNode = typeof targetElement === 'string'
          ? document.querySelector(targetElement)
          : targetElement;

        includedContent.forEach(node => {
          targetElementNode.insertAdjacentElement('afterend', node.cloneNode(true));
        });
      } else {
        const firstElement = document.querySelector('body').childNodes[0];
        includedContent.forEach(node => {
          firstElement.insertAdjacentElement('beforebegin', node.cloneNode(true));
        });
      }
    })
    .catch(error => console.error('Error fetching the file:', error));
}

// To use, include `<script src="/js/include.js"></script>` in the `<head>` (or at least above where you call the `includeHTML` function) & then place this in `<body>`:
//
// <script>
//   includeHTML('/includes/footer.html', 'main');
// </script>
//
// Replace `/includes/footer.html` with the file you want to insert.
//
// Replace `main` with either an element (like `main`), an id (`#main`), or a class (`.main`), & the included file will be placed below it.
