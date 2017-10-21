import React, { Component } from "react";
import AlertContainer from "react-alert";
import axios from "axios";
const FileDownload = require("js-file-download");
import moment from "moment";

import { getQueryParams } from "../utils/queryParameters";

import "../styles/content.scss";
import Card from "./Card";
import Loading from "./Loading";

const alertOptions = {
	position: "top right",
	theme: "dark",
	time: 0,
	offset: 7
};

class Content extends Component {
	state = {
		clientGuid: "",
		eventId: "",
		username: "",
		password: "",
		filterDate: "",
		loading: false
	};

	componentDidMount() {
		// Parse out query parameters
		const q = getQueryParams();
		let lastModified = "";
		let hasValue = false;
		const obj = {};
		if (q.hasOwnProperty("clientguid")) {
			hasValue = true;
			obj.clientGuid = q["clientguid"];
		}
		if (q.hasOwnProperty("eventid")) {
			hasValue = true;
			obj.eventId = q["eventid"];
			lastModified = window.localStorage.getItem(`${obj.eventId}_lastModified`);
		}
		if (q.hasOwnProperty("username")) {
			hasValue = true;
			obj.username = q["username"];
		}
		if (q.hasOwnProperty("password")) {
			hasValue = true;
			obj.password = q["password"];
		}

		if (lastModified) {
			obj.filterDate = moment(lastModified, "YYYY-MM-DD HH:mm");
		}

		if (hasValue) {
			this.setState(obj);
		}
	}

	// Get parsed session data in validar format
	handleGetValidarCSV = () => {
		const { clientGuid, eventId, username, password, filterDate } = this.state;
		if (!clientGuid || !eventId || !username || !password) {
			this.msg.error("Please fill out all credential fields..");
		} else {
			this.setState({ loading: true }, () => {
				const data = {
					clientGuid,
					eventId,
					username,
					password,
					validarCSV: true
				};
				if (filterDate) {
					data.filter = `modified_date_time > ${filterDate.format(
						"MM/DD/YYYY HH:mm:ss"
					)}`;
				}
				let d = new Date();
				const fileName = `ValidarSessions_${d.getFullYear()}_${d.getMonth() +
					1}_${d.getDate()}_${d.getHours()}_${d.getMinutes()}.csv`;
				axios
					.post("/opus/getSessions", data)
					.then(resp => {
						FileDownload(resp.data, fileName);
						const now = moment().format("YYYY-MM-DD HH:mm");
						window.localStorage.setItem(`${eventId}_lastModified`, now);
						this.msg.success("Validar session list downloaded!");
						this.setState({ loading: false });
					})
					.catch(err => {
						console.log(err);
						this.msg.error("There was an issue getting the session list..");
						this.setState({ loading: false });
					});
			});
		}
	};

	// Make API request for full session data
	handleGetFullSessionData = () => {
		const { clientGuid, eventId, username, password, filterDate } = this.state;
		if (!clientGuid || !eventId || !username || !password) {
			this.msg.error("Please fill out all credential fields..");
		} else {
			this.setState({ loading: true }, () => {
				const data = {
					clientGuid,
					eventId,
					username,
					password,
					validarCSV: false
				};
				if (filterDate) {
					data.filter = `modified_date_time > ${filterDate.format(
						"MM/DD/YYYY HH:mm:ss"
					)}`;
				}
				const d = new Date();
				const fileName = `FullSessions_${d.getFullYear()}_${d.getMonth() +
					1}_${d.getDate()}_${d.getHours()}_${d.getMinutes()}.csv`;
				axios
					.post("/opus/getSessions", data)
					.then(resp => {
						FileDownload(resp.data, fileName);
						const now = moment().format("YYYY-MM-DD HH:mm");
						window.localStorage.setItem(`${eventId}_lastModified`, now);
						this.setState({ loading: false });
						this.msg.success("Full session list downloaded!");
					})
					.catch(err => {
						console.log(err);
						this.setState({ loading: false });
						this.msg.error("There was an issue getting the session list..");
					});
			});
		}
	};

	// Update state from input
	handleInputUpdate = (tag, ev) => {
		this.setState({ [tag]: ev.target.value });
	};

	// Handle Filter date change
	handleDateChange = date => {
		this.setState({
			filterDate: date
		});
	};

	render() {
		return (
			<div className="content">
				<AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
				{!this.state.loading ? (
					<Card
						clientGuid={this.state.clientGuid}
						eventId={this.state.eventId}
						username={this.state.username}
						password={this.state.password}
						onGetValidarCSV={this.handleGetValidarCSV}
						onGetFullSessionData={this.handleGetFullSessionData}
						onInputUpdate={this.handleInputUpdate}
						onDateChange={this.handleDateChange}
						filterDate={this.state.filterDate}
					/>
				) : (
					<Loading width={210} height={210} />
				)}
			</div>
		);
	}
}

export default Content;
