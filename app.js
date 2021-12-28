'use strict';

const express = require('express');
const https = require('https');

const app = express();

const APIKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // <-- DELETE BEFORE PUSHING TO REPO

app.get('/', function (req, res) {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=Kalamazoo&appid=${APIKey}`;

	https.get(url, function (response) {
		console.log(response.statusCode);

		response.on('data', function (data) {
			const weatherData = JSON.parse(data);
			const temp = Math.trunc(
				((weatherData.main.temp - 273.15) * 9) / 5 + 32
			);
			const weatherDescription = weatherData.weather[0].description;
			const icon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
			res.write(`<p>The weather is currently ${weatherDescription}.</p>`);
			res.write(
				`<h1>The temperature in Kalamazoo is ${temp} degrees fahrenheit.</h1>`
			);
			res.write(`<img src="${icon}">`);
			res.send();
		});
	});
});

app.listen(3000, function () {
	console.log('Server is listening on port 3000.');
});
