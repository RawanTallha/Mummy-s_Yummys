fetch('navbar.html')
  .then(res => res.text())
  .then(data => document.getElementById('navbar').innerHTML = data);

fetch('footer.html')
  .then(res => res.text())
  .then(data => document.getElementById('footer').innerHTML = data);

// Load recipes dynamically
fetch("http://localhost:3000/recipes")
  .then((response) => response.json())
  .then((data) => {
    const recipeList = document.getElementById("recipe-list");

    // data.forEach((item) => { // all items
      data.slice(0, 2).forEach((item) => {
      const shortDescription = item.description.length > 50
        ? item.description.substring(0, 50) + "..."
        : item.description;

      const card = `
  <li class="cards_item">
    <div class="card">
      <div class="card_image">
        <img src="${item.image_url}" alt="صورة للوصفة">
      </div>
      <div class="card_content">
        <p class="card-content-username">@${item.username}</p>
        <h2 class="card_title">${item.recipe_title}</h2>
        <div class="card_text">
          <p>${shortDescription}</p>
        </div>
        <div class="card_button">
          <a href="ViewRecipe.html?id=${item.recipe_id}" class="card-button">اقرأ الوصفة كاملة</a>
        </div>
      </div>
    </div>
  </li>
`;

      recipeList.insertAdjacentHTML("beforeend", card);

    });
    const moreCard = `
  <li class="cards_item">
    <div class="card">
      <div class="card_content">
        <i class="fa-solid fa-angles-right"></i>
        <h2 class="card_title">تصفح المزيد</h2>
        <div class="card_text">
          <p>اكتشفي مختلف الوصفات و الاصناف مع وصفات امي</p>
        </div>
        <div class="card_button">
          <a href="explore.html" class="card-button">انقر للذهاب الى صفحة الوصفات</a>
        </div>
      </div>
    </div>
  </li>
`;

    recipeList.insertAdjacentHTML("beforeend", moreCard);

  })
  .catch((error) => {
    console.error("Error loading recipes:", error);
  });