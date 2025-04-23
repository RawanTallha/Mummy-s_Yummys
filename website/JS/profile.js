fetch('navbar.html')
          .then(res => res.text())
          .then(data => document.getElementById('navbar').innerHTML = data);
    
fetch('footer.html')
          .then(res => res.text())
          .then(data => document.getElementById('footer').innerHTML = data);
      
// to fetch the users data
fetch('/user/profile')
    .then(res => {
        if (!res.ok) {
            throw new Error("User not logged in or session expired.");
        }
        return res.json();
    })
    .then(user => {
        document.querySelector('.full-name').textContent = user.fullName;
        document.querySelector('.bio').textContent = user.bio;
    })
    .catch(err => {
        console.error('Failed to fetch user data:', err);
    });


// Load user recipes
fetch('/user/recipes')
.then(res => res.json())
.then(recipes => {
    const recipeContainer = document.querySelector('.cards');
    recipeContainer.innerHTML = ''; // clear placeholder content

    if (recipes.length === 0) {
        recipeContainer.innerHTML = '<p class="text-center">لا توجد وصفات منشورة بعد.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const card = `
            <li class="cards_item">
                <div class="card">
                    <div class="card_image"><img src="${recipe.image_url}" alt="${recipe.title}"></div>
                    <div class="card_content">
                        <h2 class="card_title">${recipe.title}</h2>
                        <div class="card_text">
                            <p>${recipe.description}</p>
                        </div>
                        <div class="card_button">
                            <a href="ViewRecipe.html?id=${recipe.recipe_id}" class="card-button">اقرا الوصفة كاملة</a>
                        </div>
                    </div>
                </div>
            </li>
        `;
        recipeContainer.insertAdjacentHTML('beforeend', card);
    });
})
.catch(err => {
    console.error("Failed to load recipes:", err);
});


// Load user draft recipes
fetch('/user/drafts')
    .then(res => res.json())
    .then(drafts => {
        const draftContainer = document.getElementById('draft-cards');
        draftContainer.innerHTML = ''; // clear previous content

        if (drafts.length === 0) {
            draftContainer.innerHTML = '<p class="text-center">لا توجد مسودات حاليا.</p>';
            return;
        }

        drafts.forEach(draft => {
            const card = `
                <li class="cards_item">
                    <div class="card">
                        <div class="card_image"><img src="${draft.image_url}" alt="${draft.title}"></div>
                        <div class="card_content">
                            <h2 class="card_title">${draft.title}</h2>
                            <div class="card_text">
                                <p>${draft.description}</p>
                            </div>
                            <div class="card_button">
                                <a href="EditRecipe.html?id=${draft.recipe_id}" class="card-button">تعديل الوصفة</a>
                            </div>
                        </div>
                    </div>
                </li>
            `;
            draftContainer.insertAdjacentHTML('beforeend', card);
        });
    })
    .catch(err => {
        console.error("Failed to load draft recipes:", err);
    });


// Load liked recipes
function loadFavorites() {
    fetch('/user/favorites')
    .then(res => res.json())
    .then(favorites => {
        const container = document.querySelector('#favorites .main');
        container.innerHTML = '';

        if (favorites.length === 0) {
            container.innerHTML = '<p class="text-center">لا توجد وصفات مفضلة حتى الآن.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.classList.add('cards');

        favorites.forEach(recipe => {
            ul.innerHTML += `
                <li class="cards_item">
                    <div class="card">
                        <div class="card_image"><img src="${recipe.image_url}" alt="${recipe.title}"></div>
                        <div class="card_content">
                            <h2 class="card_title">${recipe.title}</h2>
                            <p class="card_text">${recipe.description}</p>
                            <div class="card_button">
                                <a href="ViewRecipe.html?id=${recipe.recipe_id}" class="card-button">اقرا الوصفة كاملة</a>
                            </div>
                        </div>
                    </div>
                </li>
            `;
        });

        container.appendChild(ul);
    })
    .catch(err => console.error("Failed to load liked recipes:", err));
}


// Load saved recipes (history)
function loadHistory() {
    fetch('/user/history')
    .then(res => res.json())
    .then(history => {
        const container = document.querySelector('#history .main');
        container.innerHTML = '';

        if (history.length === 0) {
            container.innerHTML = '<p class="text-center">لا يوجد سجل محفوظات بعد.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.classList.add('cards');

        history.forEach(recipe => {
            ul.innerHTML += `
                <li class="cards_item">
                    <div class="card">
                        <div class="card_image"><img src="${recipe.image_url}" alt="${recipe.title}"></div>
                        <div class="card_content">
                            <h2 class="card_title">${recipe.title}</h2>
                            <p class="card_text">${recipe.description}</p>
                            <div class="card_button">
                                <a href="ViewRecipe.html?id=${recipe.recipe_id}" class="card-button">اقرا الوصفة كاملة</a>
                            </div>
                        </div>
                    </div>
                </li>
            `;
        });

        container.appendChild(ul);
    })
    .catch(err => console.error("Failed to load history:", err));
}

document.getElementById('favorites-tab').addEventListener('shown.bs.tab', loadFavorites);
document.getElementById('history-tab').addEventListener('shown.bs.tab', loadHistory);
document.getElementById('draft-tab').addEventListener('shown.bs.tab', loadDrafts);
