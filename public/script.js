const originInput = document.getElementById("origin-input");
const originOptions = document.getElementById("origin-options");
const destinationInput = document.getElementById("destination-input");
const destinationOptions = document.getElementById("destination-options");
const flightTypeSelect = document.getElementById("flight-type-select");
const departureDateInput = document.getElementById("departure-date-input");
const returnDate = document.getElementById("return-date");
const returnDateInput = document.getElementById("return-date-input");
const adultsInput = document.getElementById("adults-input");
const searchButton = document.getElementById("search-button");

const searchResultsSeparator = document.getElementById("search-results-separator");
const searchResultsLoader = document.getElementById("search-results-loader");
const searchResults = document.getElementById("search-results");

const autocompleteTimeout = 300;
let autocompleteTimeoutHandle = 0;
let destinationCityCodes = {};
let originCityCodes = {};

const reset = () => {
	originInput.value = "";
	destinationInput.value = "";
	flightTypeSelect.value = "";
	departureDateInput.valueAsDate = new Date();
	returnDate.valueAsDate = new Date();
	adultsInput.value = 1;
	searchButton.disabled = true;
	searchResultsSeparator.classList.add("d-none");
	searchResultsLoader.classList.add("d-none");
};

const formatDate = (date) => {
	const [formattedDate] = date.toISOString().split("T");
	return formattedDate;
};

const formatNumber = (number) => {
	return `${Math.abs(parseInt(number))}`;
};

const showResults = (results) => {
	if (results.length === 0) {
		searchResults.insertAdjacentHTML(
			"beforeend",
			`<li class="list-group-item d-flex justify-content-center align-content-center" id="search-no-results">No results</li>`
		);
	}
	results.forEach(({ itineraries, price }) => {
		const priceLabel = `${price.total} ${price.currency}`;

		searchResults.insertAdjacentHTML(
			"beforeend",
			`<li class="flex-column flex-sm-row list-group-item d-flex justify-content-between align-items-sm-center">
			${itineraries
				.map((itinerary, index) => {
				  const [, hours, minutes] = itinerary.duration.match(/(\d+)H(\d+)?/);
				  const travelPath = itinerary.segments
					.flatMap(({ arrival, departure }, index, segments) => {
					  if (index === segments.length - 1) {
						return [departure.iataCode, arrival.iataCode];
					  }
					  return [departure.iataCode];
					})
					.join(" → ");
				  return `
				  <div class="flex-column flex-1 m-2 d-flex">
					<small class="text-muted">${
					  index === 0 ? "Outbound" : "Return"
					}</small>
					<span class="fw-bold">${travelPath}</span>
					<div>${hours || 0}h ${minutes || 0}m</div>
				  </div>
				`;
				})
				.join("")}
			  <span class="bg-primary rounded-pill m-2 badge fs-6">${priceLabel}</span>
			</li>`
		);
	});
};

const autocomplete = (input, datalist, cityCodes) => {
	clearTimeout(autocompleteTimeoutHandle);
	autocompleteTimeoutHandle = setTimeout(async () => {
	  try {
		const params = new URLSearchParams({ keyword: input.value });
		const response = await fetch(`/api/autocomplete?${params}`);
		const data = await response.json();
		datalist.textContent = "";
		data.forEach((entry) => {
		  cityCodes[entry.name.toLowerCase()] = entry.iataCode;
		  datalist.insertAdjacentHTML("beforeend",`<option value="${entry.name}"></option>`);
		});
	  } catch (error) {
		console.error(error);
	  }
	}, autocompleteTimeout);
};

const search = async () => {
	try {
		const returns = flightTypeSelect.value === "round-trip";
		const params = new URLSearchParams({
			origin: originCityCodes[originInput.value.toLowerCase()],
			destination: destinationCityCodes[destinationInput.value.toLowerCase()],
			departureDate: formatDate(departureDateInput.valueAsDate),
			adults: formatNumber(adultsInput.value),
		});
		const response = await fetch(`/search?${params}`);
		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
	}
};


//Event handler to disable/enable search button based on completion of all search form values
document.body.addEventListener("input", () => {
	searchButton.disabled = !originInput.value || !destinationInput.value;
});

//Event handler to autocomplete origin input from Amadeus Airport/City Search API
originInput.addEventListener("input", () => {
	
});

//Event handler to autocomplete destination input from Amadeus Airport/City Search API
destinationInput.addEventListener("input", () => {

});

//Event handler to show or hide return date input depending on one-way or round-trip flight plans
flightTypeSelect.addEventListener("change", () => {
	if (flightTypeSelect.value === "one-way") {
		returnDate.classList.add("d-none");
	} else {
		returnDate.classList.remove("d-none");
	}
});

//Searches for flight offers through Amadeus Flight Offers API
searchButton.addEventListener("click", async() => {

});

//Ensures form is set to default
reset();