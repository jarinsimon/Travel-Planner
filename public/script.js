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

const reset = () => {
	originInput.value = "";
	destinationInput.value = "";
	flightTypeSelect.value = "";
	departureDateInput.valueAsDate = new Date();
	returnDate.valueAsDate = new Date();
	adultsInput.value = 1;
	searchButton.disabled = true;
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