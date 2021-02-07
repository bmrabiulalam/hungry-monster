// This function takes the API URL and returns the parsed result in json format
async function getAPIData(url) {
    const response = await fetch(url);
    const data = await response.json();  
    return data;
}

// This function resets the page data for previous search and lookup
const resetPage = () => {
    // Remove the previous meal search results
    setHTMLNullById('meals');

    // Remove the previous meal details and hide the div 
    setHTMLNullById('meal-details');
    hideTagById('meal-details');

    // Remove the previous error contents and hide the div 
    setHTMLNullById('errors');
    hideTagById('errors');
}

// This function sets the innerHTML to null for the Tag of given id
const setHTMLNullById = id => {
    document.getElementById(id).innerHTML = null;
}

// This function hides the Tag of given id
const hideTagById = id => {
    document.getElementById(id).style.display = 'none';
}

// This function sets the error text
const setErrorText = searchText => {
    const errorText = `
        <p>Sorry! No meal found like '${searchText}'.</P>
    `;
    const errorDiv = document.getElementById('errors');
    errorDiv.innerHTML = errorText;
    errorDiv.style.display = 'block';
}

// This function is called onclick the search button
const searchMeal = () => {
    // Get the search text
    const searchText = document.getElementById('search-input').value;
    // URL with the input search text
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;
    // Fetch the data from API with getAPIData function call
    const data = getAPIData(url);

        // Work on the promise returned by the getAPIData function
        data.then(allMeals => {

        // Reset page data for previous search and lookup
        resetPage();

        // Show error if no meal found
        if(allMeals.meals === null || allMeals.meals === undefined){
            setErrorText(searchText);
        }
        // If meals found, show them in the meals section
        else{
            // Fetch the 'meals' section to show all search results
            const mealsDiv = document.getElementById('meals'); 
            // Take the object of all meals
            const mealsObject = allMeals.meals; 

            // Loop through the object of all meals and show each single meal in the page
            mealsObject.forEach(meal => {
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

// This block of code works on click on a single meal div and show their detail on the top of the page
document.getElementById('meals').addEventListener('click', event => {
    // Use event bubble to get the clicked element
    const clickedMeal = event.target.parentNode.children;
    const clickedMealId = clickedMeal[2].value;
    // Get the meal id from the clicked meal hidden input tag
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${clickedMealId}`;
    // Fetch the API data for the clicked meal by id
    const data = getAPIData(url);

    // Work on the promise returned by the getAPIData function
    data.then(allMeals => {
        // Get the meal object
        const singleMealObject = allMeals.meals[0];
        // Fetch the proper section tag to show the meal details
        const mealDetailsDiv = document.getElementById('meal-details');

        mealDetailsDiv.innerHTML = `
            <img src="${singleMealObject.strMealThumb}">
            <h2>${singleMealObject.strMeal}</h2>
            <h4>Ingredients</h4>
        `;

        // Build the ingredients and measurements list
        const ul = document.createElement('ul');
        let i = 1;
        for( let property in singleMealObject){
            const propertyName = property.slice(0, property.length - 1);
            // Get the strIngredient property and use its value if not null. 
            // And get the respective measurements also
            if(propertyName === 'strIngredient' && singleMealObject[property].length > 0) {
                const li = document.createElement('li');
                li.innerText = `${singleMealObject['strMeasure'+i]} ${singleMealObject[property]}`;
                ul.appendChild(li);
                i++;
            }
        };

        mealDetailsDiv.appendChild(ul);
        // Show the meal details
        mealDetailsDiv.style.display = 'block';
        // Get to the div showing the meal recipe details
        mealDetailsDiv.scrollIntoView();
    });
});