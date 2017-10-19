const express = require("express");
const app = express(),
	path = require("path"),
	bodyParser = require("body-parser"),
	axios = require("axios");

// Configure Express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// Send the Application
app.get("/opus/sessions", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

app.post("/opus/getSessions", (req, res) => {
	axios
		.post("https://api.opus.agency/api/1.4/getEventSessions")
		.then(response => {
			console.log(response);
			res.send("OKAY!");
		})
		.catch(err => {
			console.log(err);
		});
});

// Launch the server
app.listen(3001, () => {
	console.log("Opus Exporter now listening on port 3001...");
});
