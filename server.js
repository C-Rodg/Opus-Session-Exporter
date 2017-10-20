const express = require("express");
const app = express(),
	path = require("path"),
	bodyParser = require("body-parser"),
	axios = require("axios"),
	json2csv = require("json2csv");

// Configure Express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// Send the Application
app.get("/opus/session-exporter", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

app.post("/opus/getSessions", (clientRequest, clientResponse) => {
	const {
		clientGuid,
		eventId,
		username,
		password,
		validarCSV
	} = clientRequest.body;
	const data = {
		clientGUID: clientGuid,
		event_id: eventId
	};
	axios({
		method: "post",
		url: "https://api.opus.agency/api/1.4/getEventSessions",
		data,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		auth: {
			username,
			password
		}
	})
		.then(opusResponse => {
			// TODO: Check for next_page_link

			// If there are results parse and send
			if (
				opusResponse.data &&
				opusResponse.data.result &&
				opusResponse.data.result.length > 0
			) {
				const { result } = opusResponse.data;
				let fileName = "validarSessions.csv",
					fields = [],
					csvData = "";

				if (validarCSV) {
					// TODO: PARSE INTO VALIDAR FORMAT
				} else {
					fields = Object.keys(result[0]);
					csvData = json2csv({ data: result, fields });
					fileName = "fullSessionData.csv";
				}

				clientResponse.header(
					"Content-Disposition",
					`attachment;filename=${fileName}`
				);
				clientResponse.type("text/csv");
				clientResponse.status(200).send(csvData);
			} else {
				clientResponse
					.status(200)
					.send({ data: [], fields: ["No sessions found.."] });
			}
		})
		.catch(err => {
			clientResponse.status(500).send(err.message);
		});
});

// Launch the server
app.listen(3001, () => {
	console.log("Opus Session Exporter now listening on port 3001...");
});
