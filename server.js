const express = require("express");
const app = express(),
	path = require("path"),
	bodyParser = require("body-parser");

// Configure Express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// Send the Application
app.get("/opus/sessions", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

// Launch the server
app.listen(3001, () => {
	console.log("Opus Exporter now listening on port 3001...");
});
