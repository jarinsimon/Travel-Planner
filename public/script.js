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

