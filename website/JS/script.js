fetch("http://localhost:3000/recipes")
  .then((response) => response.json())
  .then((data) => {
    const recipeList = document.getElementById("recipe-list");

    data.forEach((item) => {
      const shortDescription = item.description.length > 50 
        ? item.description.substring(0, 50) + "..." 
        : item.description;

      const card = `
        <li class="cards_item">
          <div class="card">
            <div class="card_image">
              <img src="assets/recipe1.jpg" alt="Recipe image">
            </div>
            <div class="card_content">
              <p class="card-content-username">@${item.username}</p>
              <h2 class="card_title">${item.recipe_title}</h2>
              <div class="card_text">
                <p>${shortDescription}</p>
              </div>
              <div class="card_button">
                <a href="ViewRecipe.html" class="card-button">اقرا الوصفة كاملة</a>
              </div>
            </div>
          </div>
        </li>
      `;

      recipeList.insertAdjacentHTML("beforeend", card);
    });
  })
  .catch((error) => {
    console.error("Error loading recipes:", error);
  });
