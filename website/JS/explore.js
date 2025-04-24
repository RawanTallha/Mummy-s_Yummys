// Load navbar and footer
fetch('navbar.html')
    .then(res => res.text())
    .then(data => document.getElementById('navbar').innerHTML = data);

fetch('footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

// When DOM is ready
$(document).ready(function () {
    // Handle category filter button clicks
    $('.nav-pills .nav-link').on('click', function (e) {
        e.preventDefault();
        $('.nav-pills .nav-link').removeClass('active');
        $(this).addClass('active');
    });

    // Load all recipes initially
    fetch("http://localhost:3000/recipes")
        .then(response => response.json())
        .then(data => {
            const recipeList = document.getElementById("recipes-container");
            recipeList.innerHTML = ''; // Clear any previous content
            data.forEach((item) => {
                const shortDescription = item.description.length > 50
                    ? item.description.substring(0, 50) + "..."
                    : item.description;

                const card = `
                    <div class="col-md-4 recipe-card" data-category="main-dish">
                        <article class="cta">
                            <img src="${item.image_url || 'assets/default.jpg'}" alt="صورة للوصفة">
                            <div class="cta__text-column">
                                <h2>${item.recipe_title}</h2>
                                <p>الشيف: ${item.first_name} ${item.last_name}</p>
                                <p>${shortDescription}</p>
                                <a href="ViewRecipe.html?id=${item.recipe_id}">جرب الوصفة</a>
                            </div>
                        </article>
                    </div>
                `;
                recipeList.insertAdjacentHTML("beforeend", card);
            });
        })
        .catch(error => {
            console.error("Error loading all recipes:", error);
        });
});

function loadByTag(tag, containerId) {
  // Log the tag before fetching
  console.log('Fetching recipes with tag:', tag);

  // Encode the tag for the URL
  const encodedTag = encodeURIComponent(tag);
  const url = `/recipes/filter/by-tag?tag=${encodedTag}`;

  console.log('Fetching URL:', url); // Log the full URL

  fetch(url)
      .then(res => res.json())
      .then(recipes => {
          console.log('Recipes received:', recipes);

          const container = document.querySelector(`#${containerId} .main`);
          container.innerHTML = '';

          if (recipes.length === 0) {
              container.innerHTML = '<p class="text-center">لا توجد وصفات لعرضها.</p>';
              return;
          }

          recipes.forEach(item => { // Use 'item' to match the initial load
              const shortDescription = item.description.length > 50
                  ? item.description.substring(0, 50) + "..."
                  : item.description;

              const card = `
                  <div class="col-md-4 recipe-card" data-category="main-dish">
                      <article class="cta">
                          <img src="${item.image_url || 'assets/default.jpg'}" alt="صورة للوصفة">
                          <div class="cta__text-column">
                              <h2>${item.recipe_title}</h2>
                              <p>الشيف: ${item.username}</p>
                              <p>${shortDescription}</p>
                              <a href="ViewRecipe.html?id=${item.recipe_id}">جرب الوصفة</a>
                          </div>
                      </article>
                  </div>
              `;
              container.insertAdjacentHTML("beforeend", card); // Use insertAdjacentHTML on the container directly
          });
      })
      .catch(err => console.error(`Failed to load recipes for ${tag}:`, err));
}

document.getElementById('appatizer-tab').addEventListener('shown.bs.tab', () => loadByTag('مقبلات', 'appatizer'));
document.getElementById('main-tab').addEventListener('shown.bs.tab', () => loadByTag('طبق رئيسي', 'main'));