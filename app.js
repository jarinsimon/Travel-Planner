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

app.get('/flightSearch', async function(req, res){
	const response = await amadeus.shopping.flightOffersSearch.get({
		originLocationCode: 'HNL',
		destinationLocationCode: 'SJC', 
		departureDate: '2021-12-17',
		adults: '1'
	}).then(function (res){
		console.log(res);
	}).catch(function (res){
		console.error(res);
	});
});