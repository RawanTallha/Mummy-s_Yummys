// Fetch navbar and footer content
fetch('navbar.html')
  .then(res => res.text())
  .then(data => document.getElementById('navbar').innerHTML = data);

fetch('footer.html')
  .then(res => res.text())
  .then(data => document.getElementById('footer').innerHTML = data);

// DOM Elements
const newIngredientInput = document.getElementById('newIngredient');
const addedIngredientsDiv = document.getElementById('addedIngredients');
const confirmationMessageDiv = document.getElementById('confirmationMessage');
const recipeForm = document.getElementById('addRecipeForm');
const stepsContainer = document.getElementById('steps-container');

// Dynamic Ingredients List
function addIngredient() {
    const ingredient = newIngredientInput.value.trim();
    if (!ingredient) return;

    const ingredientDiv = document.createElement('div');
    ingredientDiv.className = 'added-ingredient';
    ingredientDiv.innerHTML = `
        <span>${ingredient}</span>
        <span class="remove-ingredient" onclick="removeIngredient(this)">×</span>
    `;
    addedIngredientsDiv.appendChild(ingredientDiv);
    newIngredientInput.value = '';
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
        tagElement.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 70%)`;
        document.getElementById('tagsList').appendChild(tagElement);
    }
}

// Recipe Steps Management
function addStep() {
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

// Confirmation Message Display
function showConfirmationMessage(message, type = null) {
    confirmationMessageDiv.textContent = message;
    confirmationMessageDiv.style.display = 'block';
    
    // Reset all classes first
    confirmationMessageDiv.className = 'confirmation-message';
    
    // Add specific class if provided
    if (type) {
        confirmationMessageDiv.classList.add(type);
    }

    setTimeout(() => {
        confirmationMessageDiv.style.display = 'none';
    }, 3000);
}

// Save Draft Functionality
function saveDraft() {
    showConfirmationMessage('تم حفظ المسودة', 'draft');
    // Additional draft saving logic can be added here
}

// Form Submission Handler
recipeForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Gather form data
    const formData = new FormData();
    formData.append('name', document.getElementById('recipeName').value);
    formData.append('description', document.getElementById('recipeDescription').value);
    formData.append('type', document.getElementById('recipeType').value);
    formData.append('difficulty', document.getElementById('difficultyLevel').value);
    formData.append('hours', document.getElementById('hours').value || 0);
    formData.append('minutes', document.getElementById('minutes').value || 0);
    formData.append('status', document.getElementById('statusSelect').value);

    // Collect ingredients
    const ingredients = Array.from(document.querySelectorAll('#addedIngredients .added-ingredient span:first-child'))
                           .map(el => el.textContent);
    formData.append('ingredients', JSON.stringify(ingredients));

    // Collect steps
    const steps = Array.from(document.querySelectorAll('.step-input-group textarea'))
                     .map(step => step.value);
    formData.append('steps', JSON.stringify(steps));

    // Handle image upload
    const imageInput = document.getElementById('recipeImage');
    if (imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
    }

    // Validation
    if (!formData.get('name') || !formData.get('description') || ingredients.length === 0) {
        showConfirmationMessage('الرجاء ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    try {
        const response = await fetch('/api/recipes', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            showConfirmationMessage(
                formData.get('status') === 'public' ? 
                'تم نشر الوصفة بنجاح' : 
                'تم حفظ الوصفة بشكل خاص',
                formData.get('status')
            );
            
            // Optionally reset form after successful submission
            if (result.success) {
                recipeForm.reset();
                addedIngredientsDiv.innerHTML = '';
                stepsContainer.innerHTML = '';
                document.getElementById('difficultyLevel').value = 3;
            }
        } else {
            showConfirmationMessage(`خطأ: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Submission error:', error);
        showConfirmationMessage('حدث خطأ أثناء إرسال الوصفة', 'error');
    }
});

// Helper function to collect all form data (for debugging)
function collectFormData() {
    return {
        name: document.getElementById('recipeName').value,
        description: document.getElementById('recipeDescription').value,
        type: document.getElementById('recipeType').value,
        difficulty: document.getElementById('difficultyLevel').value,
        hours: document.getElementById('hours').value,
        minutes: document.getElementById('minutes').value,
        status: document.getElementById('statusSelect').value,
        ingredients: Array.from(document.querySelectorAll('#addedIngredients .added-ingredient span:first-child'))
                       .map(el => el.textContent),
        steps: Array.from(document.querySelectorAll('.step-input-group textarea'))
                 .map(step => step.value)
    };
}
