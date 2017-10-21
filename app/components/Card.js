import React from "react";
import "../styles/card.scss";

import TextInput from "./TextInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Card = ({
	clientGuid,
	eventId,
	username,
	password,
	onGetValidarCSV,
	onGetFullSessionData,
	onInputUpdate,
	filterDate,
	onDateChange
}) => {
	return (
		<div className="card">
			<div className="card-title">Configuration:</div>
			<form onSubmit={onGetValidarCSV}>
				<div className="card-body">
					<TextInput
						val={clientGuid}
						valChange={onInputUpdate}
						tag="clientGuid"
						label="Client GUID"
					/>
					<TextInput
						val={eventId}
						valChange={onInputUpdate}
						tag="eventId"
						label="Event ID"
					/>
					<TextInput
						val={username}
						valChange={onInputUpdate}
						tag="username"
						label="Username"
					/>
					<TextInput
						val={password}
						valChange={onInputUpdate}
						tag="password"
						label="Password"
						type="password"
					/>
					<div className="date-box">
						<label>Pull Sessions Updated From:</label>
						<DatePicker
							placeholderText="All of the Sessions!"
							dateFormat="MMM DD, YYYY, HH:mm"
							timeFormat="HH:mm"
							isClearable={true}
							selected={filterDate}
							onChange={onDateChange}
							showTimeSelect
						/>
					</div>
				</div>
				<div className="card-actions">
					<div className="action action-full" onClick={onGetFullSessionData}>
						Export All Data
					</div>
					<div className="action action-validar" onClick={onGetValidarCSV}>
						Get Validar CSV
					</div>
				</div>
			</form>
		</div>
	);
};

export default Card;
