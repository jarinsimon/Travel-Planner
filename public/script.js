const originInput = document.getElementById("origin-input");
const originOptions = document.getElementById("origin-options");
const destinationInput = document.getElementById("destination-input");
const destinationOptions = document.getElementById("destination-options");
const flightTypeSelect = document.getElementById("flight-type-select");
const departureDateInput = document.getElementById("departure-date-input");
const returnDate = document.getElementById("return-date");
const returnDateInput = document.getElementById("return-date-input");
const travelClassSelect = document.getElementById("travel-class-select");
const adultsInput = document.getElementById("adults-input");
const childrenInput = document.getElementById("children-input");
const infantsInput = document.getElementById("infants-input");
const searchButton = document.getElementById("search-button");

const searchResultsSeparator = document.getElementById("search-results-separator");
const searchResultsLoader = document.getElementById("search-results-loader");
const searchResults = document.getElementById("search-results");

const autocompleteTimeout = 300;
let autocompleteTimeoutHandle = 0;
let destinationCityCodes = {};
let originCityCodes = {};

let airports = ["ADQ - KODIAK AIRPORT","AKN - KING SALMON","ANC - TED STEVENS INTL","ATL - HARTSFIELD-JACKSON INT","AUS - AUSTIN-BERGSTROM INTL",
"AXS - QUARTZ MOUNTAIN RGNL","AZA - MESA GATEWAY","BDL - BRADLEY INTL","BET - BETHEL AIRPORT","BLD - BOULDER CITY MUNICIPAL","BNA - INTERNATIONAL",
"BOI - AIR TERM GOWEN FLD","BOS - EDWARD L LOGAN INTL","BRW - W.POST W.ROGERS MEM","BTV - BURLINGTON INTL","BWI - BALTIMORE/WASH. INTL","BZN - YELLOWSTONE INTL",
"CLE - HOPKINS INT","CLT - DOUGLAS INTL","CMH - JOHN GLENN INTL","CRT - ZM JACK STELL FIELD","CRW - YEAGER","CVG - NORTHERN KENTUCKY INTL","DAL - LOVE FIELD",
"DAY - JAMES M COX INTL","DCA - R REAGAN NAT","DEN - DENVER INTERNATIONAL","DFW - DALLAS FT WORTH INTL","DTW - METROPOLITAN WAYNE CO","DUT - DRIFTWOOD BAY AFS",
"ELP - EL PASO INTL","EMK - EMMONAK","ENA - KENAI MUNICIPAL","EWR - NEWARK LIBERTY INTL","FAI - FAIRBANKS INTL","FAT - YOSEMITE INTL","FLL - FLL INTL",
"FMY - PAGE FIELD","FYU - FORT YUKON","GAL - EDWARD G PIKTA SR","GDW - ZETTEL MEMORIAL","GEG - SPOKANE INTL","GNF - GANSNER FIELD","HDN - YAMPA VALLEY",
"HFD - BRAINARD","HNL - DANIEL K INOUYE INTL","HOU - WILLIAM P HOBBY","IAD - DULLES INTL","IAH - GEORGE BUSH INTERCONT","ICT - DWIGHT D EISENHOWER",
"JAX - JACKSONVILLE INTL","JFK - JOHN F KENNEDY INTL","JLA - QUARTZ CREEK","JNU - JUNEAU INTL","KOA - KEAHOLE","KTN - KETCHIKAN INTL","KWN - QUINHAGAK",
"KWP - WEST POINT VILLAGE SPB","KZB - SEA PLANE BASE","LAS - MCCARRAN INTERNATIONAL","LAX - LOS ANGELES INTL","LGA - LAGUARDIA","MCI - KANSAS CITY INTL",
"MCO - ORLANDO INTL","MDW - MIDWAY INTERNATIONAL","MFR - ROGUE VALLEY INTL","MIA - MIAMI INTL","MKE - GENERAL MITCHELL INTL","MLI - QUAD CITY INTL",
"MSP - ST PAUL INTL","MSY - LOUIS ARMSTRONG INTL","NCO - QUONSET STATE","NYG - MCAF (TURNER FIELD)","OAK - OAKLAND INTL","OGG - KAHULUI","OKC - WILL ROGERS WORLD",
"OMA - EPPLEY AIRFIELD","OME - NOME","ORD - O HARE INTERNATIONAL","ORF - NORFOLK INTL","ORL - EXECUTIVE","OTZ - RALPH WIEN MEMORIAL","PBI - PALM BEACH INTL",
"PDX - PORTLAND INTL","PHL - PHILADELPHIA INTL","PHX - SKY HARBOR INTL","PIT - INTERNATIONAL","PVD - T F GREEN STATE APT","PWM - INTL JETPORT","QWG - WILGROVE PARK",
"QXX - FICTITIOUS POINT","RDU - INTERNATIONAL","RIC - INTERNATIONAL","RNO - RENO/TAHOE INTL","RSW - SOUTHWEST FLORIDA INTL","SAC - EXECUTIVE","SAN - INTERNATIONAL",
"SAT - SAN ANTONIO INTL","SEA - SEATTLE TACOMA INTL","SFO - SAN FRANCISCO INTL","SIT - ROCKY GUTIERREZ","SJC - NORMAN Y. MINETA INTL","SLC - SALT LAKE CITY INTL",
"SNA - JOHN WAYNE","STL - LAMBERT-ST LOUIS INTL","TKJ - TOK JUNCTION","TOA - ZAMPERINI FIELD","TPA - TAMPA INTL","UIN - REGIONAL (BALDWIN FLD)","VAK - CHEVAK",
"VEE - VENETIE","VPS - DESTIN FT WALTON BEACH","XES - GRAND GENEVA RESORT","XMD - MUNICIPAL","XNA - NW ARKANSAS RGN","XPR - PINE RIDGE","XSD - TEST RANGE",
"XWA - BASIN INTERNATIONAL","YAK - YAKUTAT","ZNC - NYAC","ZPH - MUNICIPAL","ZZV - MUNICIPAL"];

const reset = () => {
	originInput.value = "";
	destinationInput.value = "";
	flightTypeSelect.value = "one-way";
	departureDateInput.valueAsDate = new Date();
	returnDateInput.valueAsDate = new Date();
	returnDate.classList.add("d-none");
	travelClassSelect.value = "ECONOMY";
	adultsInput.value = 1;
	childrenInput.value = 0;
	infantsInput.value = 0;
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


function autocomplete(searchEle, arr) {
	var currentFocus;
	searchEle.addEventListener("input", function(e) {
	   var divCreate,b,i,fieldVal = this.value;
	   closeAllLists();
	   if (!fieldVal) {
		  return false;
	   }
	   currentFocus = -1;
	   divCreate = document.createElement("DIV");
	   divCreate.setAttribute("id", this.id + "autocomplete-list");
	   divCreate.setAttribute("class", "autocomplete-items");
	   this.parentNode.appendChild(divCreate);
	   for (i = 0; i <arr.length; i++) {
		  if ( arr[i].substr(0, fieldVal.length).toUpperCase() == fieldVal.toUpperCase() ) {
			 b = document.createElement("DIV");
			 b.innerHTML = "<strong>" + arr[i].substr(0, fieldVal.length) + "</strong>";
			 b.innerHTML += arr[i].substr(fieldVal.length);
			 b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
			 b.addEventListener("click", function(e) {
				searchEle.value = this.getElementsByTagName("input")[0].value;
				closeAllLists();
			 });
			 divCreate.appendChild(b);
		  }
	   }
	});
	searchEle.addEventListener("keydown", function(e) {
	   var autocompleteList = document.getElementById(
		  this.id + "autocomplete-list"
	   );
	   if (autocompleteList)
		  autocompleteList = autocompleteList.getElementsByTagName("div");
	   if (e.keyCode == 40) {
		  currentFocus++;
		  addActive(autocompleteList);
	   }
	   else if (e.keyCode == 38) {
		  //up
		  currentFocus--;
		  addActive(autocompleteList);
	   }
	   else if (e.keyCode == 13) {
		  e.preventDefault();
		  if (currentFocus > -1) {
			 if (autocompleteList) autocompleteList[currentFocus].click();
		  }
	   }
	});
	function addActive(autocompleteList) {
	   if (!autocompleteList) return false;
		  removeActive(autocompleteList);
	   if (currentFocus >= autocompleteList.length) currentFocus = 0;
	   if (currentFocus < 0) currentFocus = autocompleteList.length - 1;
	   autocompleteList[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(autocompleteList) {
	   for (var i = 0; i < autocompleteList.length; i++) {
		  autocompleteList[i].classList.remove("autocomplete-active");
	   }
	}
	function closeAllLists(elmnt) {
	   var autocompleteList = document.getElementsByClassName(
		  "autocomplete-items"
	   );
	   for (var i = 0; i < autocompleteList.length; i++) {
		  if (elmnt != autocompleteList[i] && elmnt != searchEle) {
			 autocompleteList[i].parentNode.removeChild(autocompleteList[i]);
		  }
	   }
	}
	document.addEventListener("click", function(e) {
	   closeAllLists(e.target);
	});
}

const search = async () => {
	try {
		const returns = flightTypeSelect.value === "round-trip";
		const params = new URLSearchParams({
			//origin: originCityCodes[originInput.value.toLowerCase()],
			//destination: destinationCityCodes[destinationInput.value.toLowerCase()],
			origin: 'SFO',
			destination: 'LAX', 
			departureDate: formatDate(departureDateInput.valueAsDate),
			adults: formatNumber(adultsInput.value),
			children: formatNumber(childrenInput.value),
			infants: formatNumber(infantsInput.value),
			travelClass: travelClassSelect.value,
			...(returns ? { returnDate: formatDate(returnDateInput.valueAsDate) } : {}),
		});
		const response = await fetch(`/api/search?${params}`);
		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
	}
};


//Event handler to disable/enable search button based on completion of all search form values
document.body.addEventListener("change", () => {
	clearTimeout(autocompleteTimeoutHandle);
	searchButton.disabled = !originInput.value || !destinationInput.value;
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
	searchResultsSeparator.classList.remove("d-none")
	searchResultsLoader.classList.remove("d-none")
	searchResults.textContent = "";

	const results = await search();
	searchResultsLoader.classList.add("d-none");
	showResults(results);
});

//Ensures form is set to default
reset();