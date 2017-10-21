const express = require("express");
const app = express(),
	path = require("path"),
	bodyParser = require("body-parser"),
	axios = require("axios"),
	json2csv = require("json2csv"),
	moment = require("moment"),
	VALIDAR_CSV_MAP = require("./csvConfig");

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
		validarCSV,
		filter
	} = clientRequest.body;
	const data = {
		clientGUID: clientGuid,
		event_id: eventId
	};
	if (filter) {
		data.filter = filter;
	}
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
			// TODO: Check for next_page_link -

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
					fields = VALIDAR_CSV_MAP;
					const convertedSessions = result.map(convertToValidarObj);
					csvData = json2csv({
						data: convertedSessions,
						fields,
						withBOM: true
					});
				} else {
					fields = Object.keys(result[0]);
					csvData = json2csv({ data: result, fields, withBOM: true });
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

// Convert start/end dates to 4 columns
function convertToValidarObj(result) {
	const obj = Object.assign({}, result);
	const start = moment(result.session_start_date_time, "YYYY-MM-DDTHH:mm:ss");
	const end = moment(result.session_end_date_time, "YYYY-MM-DDTHH:mm:ss");
	if (start.isValid()) {
		obj.added_start_date = start.format("MM/DD/YYYY");
		obj.added_start_time = start.format("H:mm");
	}
	if (end.isValid()) {
		obj.added_end_date = end.format("MM/DD/YYYY");
		obj.added_end_time = end.format("H:mm");
	}
	return obj;
}
