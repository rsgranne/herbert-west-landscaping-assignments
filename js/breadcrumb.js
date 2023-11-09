// To use, insert the following in `<body>`: <script src="/js/breadcrumb.js"></script>

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to replace hyphens with spaces and format words
function formatBreadcrumbItem(item) {
  return item
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .split(' ') // Split the string into words
    .map((word, index) =>
      index === 0 || !['a', 'and', 'or', 'the'].includes(word)
        ? capitalizeFirstLetter(word)
        : word.toLowerCase()
    ) // Capitalize the first word and keep exceptions lowercase
    .join(' '); // Join the words back into a string
}

// Function to generate the breadcrumb list
function generateBreadcrumb() {
  // Get the current file path
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split('/').filter(Boolean); // Split the path and remove empty parts

  // Create the breadcrumb list
  const breadcrumbList = document.createElement('ol');
  breadcrumbList.classList.add('breadcrumb');
  breadcrumbList.id = 'breadcrumb-list';

  // Add the "Home" link as the first item
  const homeListItem = document.createElement('li');
  homeListItem.innerHTML = '<a href="/" class="text-decoration-none text-success">Home</a>';
  breadcrumbList.appendChild(homeListItem);

  // Build the breadcrumb list for the folders and pages
  let currentURL = '/';
  for (let i = 0; i < pathParts.length; i++) {
    currentURL += pathParts[i] + '/';

    const listItem = document.createElement('li');
    let folderName = formatBreadcrumbItem(pathParts[i]);

    // Remove the ".html" extension from the last item
    if (i === pathParts.length - 1) {
      const extensionIndex = folderName.lastIndexOf('.html');
      if (extensionIndex !== -1) {
        folderName = folderName.substring(0, extensionIndex);
      }
    }

    // If it's the last item, don't create a link
    if (i === pathParts.length - 1) {
      listItem.textContent = folderName;
    } else {
      listItem.innerHTML = `<a href="${currentURL}" class="text-decoration-none text-success">${folderName}</a>`;
    }

    // Add "active" class and aria-current="page" to the last item
    if (i === pathParts.length - 1) {
      listItem.classList.add('active');
      listItem.setAttribute('aria-current', 'page');
    }

    breadcrumbList.appendChild(listItem);
  }

  // Create the breadcrumb nav and wrap it in a container
  const breadcrumbNav = document.createElement('nav');
  breadcrumbNav.setAttribute('aria-label', 'breadcrumb');
  breadcrumbNav.appendChild(breadcrumbList);

  const breadcrumbContainer = document.createElement('div');
  breadcrumbContainer.classList.add('container-fluid');
  breadcrumbContainer.appendChild(breadcrumbNav);

  // Append the breadcrumb to the header
  const header = document.getElementById('header');
  header.appendChild(breadcrumbContainer);
}

// Call the function when the page loads
window.onload = generateBreadcrumb;
