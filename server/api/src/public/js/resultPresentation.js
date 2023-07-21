// resultPresentation.js

function createBox(element, data, depth = 0) {
	const box = document.createElement("div");
	box.className = `box depth-${depth}`; // Add a class to indicate the depth for styling
	box.style.marginLeft = `${depth * 20}px`;

	const heading = document.createElement("h4");

	// Display specific data for each entity type
	switch (element) {
		case "house":
		case "door":
		case "window":
			heading.textContent = `${element} ID: ${
				data[element.toLowerCase() + "_id"]
			}`;
			break;
		case "sensor":
			heading.textContent = `Sensor ID: ${data.sensor_id}, State: ${data.state}`;
			const box = document.getElementById(`box`);
			// if (data.state === "OPEN") {
			// 	const sensorBox = document.findElementByClassName
			//     box.classList.add("open");
			// }
			break;
		case "error":
			heading.textContent = `error: ${data}`;
			break;
		default:
			heading.textContent = element;
			break;
	}

	box.appendChild(heading);

	if (typeof data === "object") {
		for (const key in data) {
			const value = data[key];
			if (typeof value === "object") {
				let nestedBox;
				if (!isNaN(key)) {
					nestedBox = createBox(
						element.toLowerCase().substr(0, element.length - 1),
						value,
						depth + 1
					);
				} else {
					nestedBox = createBox(key, value, depth + 1);
				}
				box.appendChild(nestedBox);
			}
		}
	}

	return box;
}

function displayResult(response) {
	const resultContainer = document.getElementById("result");
	resultContainer.textContent = "";

	let houseBox;
	if (typeof response === "object") {
		if (response[0] && response[0].window_id) {
			houseBox = createBox("Windows", response);
		} else if (response[0] && response[0].house_id) {
			houseBox = createBox("Houses", response);
		} else if (response.error) {
			houseBox = createBox("error", JSON.stringify(response.error));
		} else {
			houseBox = createBox("house", response);
		}
		resultContainer.appendChild(houseBox);
	} else {
		const errorMessage = document.createElement("p");
		errorMessage.textContent = response;
		resultContainer.appendChild(errorMessage);
	}
}
