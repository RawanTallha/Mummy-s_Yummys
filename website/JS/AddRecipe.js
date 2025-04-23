// Fetch navbar and footer content
fetch('navbar.html')
  .then(res => res.text())
  .then(data => document.getElementById('navbar').innerHTML = data);

fetch('footer.html')
  .then(res => res.text())
  .then(data => document.getElementById('footer').innerHTML = data);

// Dynamic Ingredients List
function addIngredient() {
    const newIngredientInput = document.getElementById('newIngredient');
    const ingredient = newIngredientInput.value.trim();

    if (ingredient !== "") {
        const addedIngredientsDiv = document.getElementById('addedIngredients');
        const ingredientDiv = document.createElement('div');
        ingredientDiv.className = 'added-ingredient';
        ingredientDiv.innerHTML = `
            <span>${ingredient}</span>
            <span class="remove-ingredient" onclick="removeIngredient(this)">×</span>
        `;
        addedIngredientsDiv.appendChild(ingredientDiv);
        newIngredientInput.value = '';
    }
}

function removeIngredient(element) {
    element.parentElement.remove();
}

// Dynamic Tags List with Colorful Backgrounds
function addTag() {
    const tag = prompt('أدخل الوسم:', '');
    if (tag) {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        const randomColor = `hsl(${Math.random() * 360}, 70%, 70%)`;
        tagElement.style.backgroundColor = randomColor;
        document.getElementById('tagsList').appendChild(tagElement);
    }
}

// Function to display confirmation message
function showConfirmationMessage(message, status = null) {
    const confirmationMessageDiv = document.getElementById('confirmationMessage');
    confirmationMessageDiv.textContent = message;
    confirmationMessageDiv.style.display = 'block';

    // Reset styles
    confirmationMessageDiv.classList.remove('draft', 'public', 'private');

    // Add class based on status
    if (status === 'draft') {
        confirmationMessageDiv.classList.add('draft');
    } else if (status === 'public') {
        confirmationMessageDiv.classList.add('public');
    } else if (status === 'private') {
        confirmationMessageDiv.classList.add('private');
    }

    setTimeout(() => {
        confirmationMessageDiv.style.display = 'none';
    }, 3000); // Message disappears after 3 seconds
}

// Form submission handler
document.getElementById('addRecipeForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const recipeName = document.getElementById('recipeName').value;
    const recipeDescription = document.getElementById('recipeDescription').value;
    const recipeType = document.getElementById('recipeType').value;
    const difficultyLevel = document.getElementById('difficultyLevel').value;
    const hours = document.getElementById('hours').value;
    const minutes = document.getElementById('minutes').value;

    // Collect ingredients
    const ingredients = Array.from(document.querySelectorAll('#addedIngredients .added-ingredient span:first-child'))
        .map(span => span.textContent);

    // Get status
    const status = document.getElementById('statusSelect').value;

    // Validate that all required fields are filled
    if (!recipeName || !recipeDescription || !recipeType || !hours || !minutes || ingredients.length === 0 || !status) {
        alert('الرجاء ملء جميع الحقول المطلوبة.');
        return;
    }

    // Log the values (for testing)
    console.log('Recipe Name:', recipeName);
    console.log('Recipe Description:', recipeDescription);
    console.log('Recipe Type:', recipeType);
    console.log('Difficulty Level:', difficultyLevel);
    console.log('Hours:', hours);
    console.log('Minutes:', minutes);
    console.log('Ingredients:', ingredients);
    console.log('Status:', status);

    // Show confirmation message based on status
    let confirmationMessage = '';
    if (status === 'private') {
        confirmationMessage = 'تم حفظ الوصفة بشكل خاص.';
        showConfirmationMessage(confirmationMessage, 'private');
    } else if (status === 'public') {
        confirmationMessage = 'تم حفظ الوصفة بشكل عام.';
        showConfirmationMessage(confirmationMessage, 'public');
    }

    // Add your submission logic here (e.g., sending data to a server)
});

// Save draft function
function saveDraft() {
    showConfirmationMessage('تم حفظ المسودة.', 'draft');
    // Add your save draft logic here (e.g., saving data to local storage)
}

// Dynamic Recipe Steps
function addStep() {
    const stepsContainer = document.getElementById('steps-container');
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step-input-group';
    stepDiv.innerHTML = `
        <textarea class="form-control step-description" rows="3" placeholder="أدخل خطوة"></textarea>
        <button type="button" class="remove-step-button" onclick="removeStep(this)">-</button>
    `;
    stepsContainer.appendChild(stepDiv);
}

function removeStep(element) {
    element.parentElement.remove();
}
