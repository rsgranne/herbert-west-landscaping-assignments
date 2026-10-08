// To use, insert the following in <head>: <script src="/js/breadcrumb.js" defer></script>
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
