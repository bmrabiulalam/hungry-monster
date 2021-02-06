async function getAPIData(url) {
    const response = await fetch(url);
    const data = await response.json();  
    return data;
}

const searchMeal = () => {
    document.getElementById('meals').innerHTML = '';
    document.getElementById('meal-details').innerHTML = '';
    document.getElementById('errors').style.display = 'none';
    const searchText = document.getElementById('search-input').value;
    const url = ` https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;
    getAPIData(url).then(meals => {
        if(meals.meals === null || meals.meals === undefined){
            const p = document.createElement('p');
            p.innerText = 'Sorry! No meal found.';
            const errorDiv = document.getElementById('errors');
            errorDiv.appendChild(p);
            errorDiv.style.display = 'block';
        }
        else{
            const mealsDiv = document.getElementById('meals');
            meals.meals.forEach(meal => {
                const perMealDiv = document.createElement('div');
                perMealDiv.className = 'per-meal-div';
                perMealDiv.innerHTML = `
                    <img src="${meal.strMealThumb}">
                    <p>${meal.strMeal}</p>
                    <input id="meal-id" type="hidden" value="${meal.idMeal}">
                `;
                mealsDiv.appendChild(perMealDiv);
            });
        }
    });
}

document.getElementById('meals').addEventListener('click', event => {
    const clickedMeal = event.target.parentNode.children;
    const clickedMealId = clickedMeal[2].value;
    const url = ` https://www.themealdb.com/api/json/v1/1/lookup.php?i=${clickedMealId}`;

    getAPIData(url).then(meal => {
        const singleMealObject = meal.meals[0];
        const mealDetailsDiv = document.getElementById('meal-details');
        mealDetailsDiv.innerHTML = `
            <img src="${singleMealObject.strMealThumb}">
            <h2>${singleMealObject.strMeal}</h2>
            <h4>Ingredients</h4>
        `;

        const ul = document.createElement('ul');
        let i = 1;
        for( let property in singleMealObject){
            const a = property.slice(0, property.length - 1);
            if(a === 'strIngredient' && singleMealObject[property].length > 0) {
                const li = document.createElement('li');
                li.innerText = `${singleMealObject['strMeasure'+i]} ${singleMealObject[property]}`;
                ul.appendChild(li);
                i++;
            }
        };

        mealDetailsDiv.appendChild(ul);

    });
});