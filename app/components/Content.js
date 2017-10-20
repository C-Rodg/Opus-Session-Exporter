import React, { Component } from "react";
import AlertContainer from "react-alert";
import axios from "axios";
const FileDownload = require("js-file-download");

import { getQueryParams } from "../utils/queryParameters";

import "../styles/content.scss";
import Card from "./Card";
import Loading from "./Loading";

const alertOptions = {
	position: "top right",
	theme: "dark",
	time: 4000,
	offset: 7
};

class Content extends Component {
	state = {
		clientGuid: "",
		eventId: "",
		username: "",
		password: "",
		loading: false
	};

	componentDidMount() {
		// Parse out query parameters
		const q = getQueryParams();
		let hasValue = false;
		const obj = {};
		if (q.hasOwnProperty("clientguid")) {
			hasValue = true;
			obj.clientGuid = q["clientguid"];
		}
		if (q.hasOwnProperty("eventid")) {
			hasValue = true;
			obj.eventId = q["eventid"];
		}
		if (q.hasOwnProperty("username")) {
			hasValue = true;
			obj.username = q["username"];
		}
		if (q.hasOwnProperty("password")) {
			hasValue = true;
			obj.password = q["password"];
		}

		if (hasValue) {
			this.setState(obj);
		}
	}

	// Get parsed session data in validar format
	handleGetValidarCSV = () => {
		const { clientGuid, eventId, username, password } = this.state;
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
				let d = new Date();
				const fileName = `Validar_${d.getFullYear()}_${d.getMonth() +
					1}_${d.getDate()}_${d.getHours()}.csv`;
				axios
					.post("/opus/getSessions", data)
					.then(resp => {
						console.log(resp);
						FileDownload(resp.data, fileName);
						this.msg.success("Validar session list downloaded!");
					})
					.catch(err => {
						console.log(err);
						this.msg.error("There was an issue getting the session list..");
					});
			});
		}
	};

	// Make API request for full session data
	handleGetFullSessionData = () => {
		const { clientGuid, eventId, username, password } = this.state;
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
				const d = new Date();
				const fileName = `FullSessions_${d.getFullYear()}_${d.getMonth() +
					1}_${d.getDate()}_${d.getHours()}.csv`;
				axios
					.post("/opus/getSessions", data)
					.then(resp => {
						FileDownload(resp.data, fileName);
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
					/>
				) : (
					<Loading width={210} height={210} />
				)}
			</div>
		);
	}
}

export default Content;
