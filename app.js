const Amadeus = require("amadeus");
const express = require("express");
require("dotenv").config();
const app = express();
const PORT = 3000;

const amadeus = new Amadeus({
	clientId: process.env.API_KEY,
	clientSecret: process.env.API_SECRET
})

var server = app.listen(PORT, function () {
	console.log(`Server running on Port ${PORT}`);
});

app.get('/', function (req, res){
	res.send('Server is working');
});

app.get('/citySearch', async function(req, res){
	console.log(req.query);
	var keywords = req.query.keyword;
	const response = await amadeus.referenceData.locations
	.get({
		keyword: keywords,
		subType: 'CITY,AIRPORT',
	})
	.catch((x) => console.log(x));
	try {
		await res.json(JSON.parse(response.body));
	} catch (err) {
		await res.json(err);
	}
});

app.use(express.static("public"));

app.get('/autocomplete', async(req, res) => {
	try {
		const { query } = req;
		const { data } = await amadeus.referenceData.locations.get({
			keyword: query.keyword,
			subType: Amadeus.location.city,
		});
		res.json(data);
	} catch (err) {
		console.error(err.res);
		res.json([]);
	}
});

app.get('/flightSearch', async(req, res) => {
	try{
		const { query } = req;
		console.log(query)
		const { data } = await amadeus.shopping.flightOffersSearch.get({
			originLocationCode: query.origin,
			destinationLocationCode: query.destination,
			departureDate: query.departureDate,
			adults: query.adults,
			children: query.children,
			infants: query.infants,
			...(query.returnDate ? { returnDate: query.returnDate } : {}),
		});
		res.json(data);
	} catch (err){
		console.error(err.res);
		res.json([]);
	}
});