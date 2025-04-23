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

  // Load recipes dynamically
  fetch("http://localhost:3000/recipes")
    .then(response => response.json())
    .then(data => {
      const recipeList = document.getElementById("recipes-container");

      // Display first 2 recipes from the API
      data.forEach((item) => { // all items
      // data.slice(0, 2).forEach(item => {
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
      console.error("Error loading recipes:", error);
    });
});
