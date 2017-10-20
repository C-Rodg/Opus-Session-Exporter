import React from "react";

import Header from "./Header";
import Content from "./Content";

const App = () => {
	return (
		<div className="app">
			<Header />
			<main>
				<Content />
			</main>
		</div>
	);
};

export default App;
