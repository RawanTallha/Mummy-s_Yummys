const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

// NAV and FOOTER
fetch('navbar.html')
    .then(res => res.text())
    .then(data => document.getElementById('navbar').innerHTML = data);

fetch('footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

if (recipeId) {
    fetch(`/recipe/${recipeId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Failed to load recipe: ${res.statusText}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("✅ Recipe Data:", data);


            // Set image
            document.querySelector(".recipe-image img").src = data.image_url;

            // Set title and username
            document.querySelector(".recipe-title").textContent = data.recipe_title;
            document.querySelector(".subtitle em").textContent = "@" + data.username;

            // Set details
            const details = document.querySelector(".recipe-details");
            details.innerHTML = `
          <h2>تــفـاصــيـل الـوصــفــة</h2>
          <p><b>اسم الوصفة:</b> ${data.recipe_title}</p>
          <p><b>وصف الوصفة:</b> ${data.description}</p>
          <p><b>نوع الوصفة:</b> ${data.type}</p>
          <p><b>مستوى الصعوبة:</b> ${data.level}</p>
          <p><b>وقت الطهي:</b> ${data.time_to_make} دقيقة</p>
        `;

            // Ingredients
            const mainIngredients = data.ingredients.slice(0, 3);
            const moreIngredients = data.ingredients.slice(3);

            const ingList = document.querySelector(".ingredients ol");
            ingList.innerHTML = mainIngredients.map(i => {
                return `<li>${i.full_ingredient}</li>`;
            }).join("");

            const extraList = document.querySelector("#moreIngredients .card-body ol");
            extraList.innerHTML = moreIngredients.map(i => {
                return `<li>${i.full_ingredient}</li>`;
            }).join("");

            //  TOOLS
            const toolList = document.querySelector(".essentials ol");
            toolList.innerHTML = data.tools.map(tool => `<li>${tool}</li>`).join("");

            // STEPS
            const mainSteps = data.steps.slice(0, 3);
            const extraSteps = data.steps.slice(3);

            document.querySelector(".steps ol").innerHTML =
                mainSteps.map(step => `<li>${step}</li>`).join("");

            document.querySelector("#moreSteps .card-body ol").innerHTML =
                extraSteps.map(step => `<li>${step}</li>`).join("");

            // TAGS
            const tagSection = document.querySelector(".tags");
            tagSection.innerHTML = `<h2>هـــاشــتـاقـات</h2>` +
                data.tags.map(tag => `<span class="tag">#${tag}</span>`).join("");
        })
        .catch(err => {
            console.error("Error loading recipe:", err);
            alert("An error occurred while loading the recipe.");
        });
}

document.querySelector('.like-button').addEventListener('click', () => {
    alert('تمت اضافتها للمفضلة');
});

document.querySelector('.save-button').addEventListener('click', () => {
    alert('تمت اضافتها للمحفوظات');
});