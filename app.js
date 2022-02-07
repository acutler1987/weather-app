'use strict';

const express = require('express');
const https = require('https');
const config = require('./config');
const apiKey = config.API_key;
const uri = config.redirect_uri;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
	const city = req.body.cityName;
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

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
				`<h1>The temperature in ${city} is ${temp} degrees fahrenheit.</h1>`
			);
			res.write(`<img src="${icon}">`);
			res.send();
		});
	});
});

app.listen(8888, function () {
	console.log('Server is listening on port 8888.');
});
