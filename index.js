const drinks = document.querySelector('#drinks');
const searchForm = document.querySelector('#search-form');

const drinkTemplate = (drink) => {
	// This API isn't great. All of the ingredients/measurements are separate key/values in the main object and not grouped together.
	// Let's just create new arrays filtering them out so we can map over them to render them in the template.
	// Some drinks have incomplete information, so it might return undefined measurements for ingredients, etc. Eek.
	// Handle this inside the template literal for now -- just return an empty string if undefined.
	const ingredients = Object.keys(drink)
		.filter((k) => drink[k] && k.includes('strIngredient'))
		.map((k) => drink[k]);

	const measurements = Object.keys(drink)
		.filter((k) => drink[k] && k.includes('strMeasure'))
		.map((k) => drink[k]);

	return `
		<article class="drink" id=${drink.idDrink}>
			<div class="drink__content">
				<h2>${drink.strDrink}</h2>
				<div class="drink__details">
					<h3>Recipe:</h3>
					<ul>
						${/* Map over the ingredients array and find the matching ingredient based on index. */ ''}
						${Object.keys(ingredients)
							.map((_, i) => {
								if (ingredients[i]) {
									return `<li>${measurements[i] ? measurements[i] : ''} ${ingredients[i]}</li>`;
								}
							})
							.join('')}
					</ul>
					<p>${drink.strInstructions}</p>
					<p>Recommended Glass: ${drink.strGlass}</p>
				</div>
			</div>
			<img src=${drink.strDrinkThumb} alt="${drink.strDrink}" />
		</article>
		<div class="popup-overlay"></div>
	`;
};

searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const formData = new FormData(searchForm);
	const input = formData.get('search');

	fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input}`)
		.then((res) => res.json())
		.then((data) => {
			drinks.innerHTML = !data.drinks
				? `<span class="error-message">No results 😞</span>`
				: data.drinks.map((drink) => drinkTemplate(drink)).join('');
		})
		.catch((error) => console.log(error));

	searchForm.reset();
});

// fetch random drink
document.querySelector('#random').addEventListener('click', (e) => {
	fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
		.then((res) => res.json())
		.then((data) => {
			drinks.innerHTML = drinkTemplate(data.drinks[0]);
		});
});

// attach event listeners to each drink card to handle expanding the element
drinks.addEventListener('click', (e) => {
	e.target.closest('article').classList.toggle('expanded');
});
