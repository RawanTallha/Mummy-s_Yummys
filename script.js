// Dynamic Ingredients List
function addIngredient() {
    const ingredientInput = document.createElement('input');
    ingredientInput.type = 'text';
    ingredientInput.className = 'form-control mirza-regular mb-2';
    ingredientInput.placeholder = 'أضف مكون';
    document.getElementById('ingredients-list').appendChild(ingredientInput);
}

// Dynamic Tags List with Random Colors
function addTag() {
    const tag = prompt('أدخل العلامة:', '');
    if (tag) {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-box';
        tagElement.textContent = tag;
        const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        tagElement.style.backgroundColor = randomColor;
        document.getElementById('tags-list').appendChild(tagElement);
    }
}

// Slider with Chef Hat Icon
const slider = document.getElementById('difficulty-level');
const sliderThumb = document.querySelector('.slider-thumb');
slider.addEventListener('input', () => {
    const value = slider.value;
    const percentage = ((value - 1) / 2) * 100; // Map to 0-100%
    sliderThumb.style.left = `${percentage}%`;
});

// Initialize Bootstrap Tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl);
});
