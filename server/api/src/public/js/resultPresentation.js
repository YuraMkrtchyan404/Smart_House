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
			break;
		case "error":
			heading.textContent = `error: ${data}`;
			break;
        case "warning":
            heading.textContent = `warning: ${data}`;
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

	let resultBox;
	let warningBox;
	if (typeof response === "object") {
		if (response[0] && response[0].window_id) {
			resultBox = createBox("Windows", response);
		} else if (response[0] && response[0].house_id) {
			resultBox = createBox("Houses", response);
		} else if (response.door && !response.house_id) {
			resultBox = createBox("door", response.door);
			if(response.warning){
				warningBox = createBox("warning", JSON.stringify(response.warning))
				resultBox.appendChild(warningBox)
			}
		} else if (response.window && !response.house_id) {
			resultBox = createBox("window", response.window);
		} else if (response.error) {
			resultBox = createBox("error", JSON.stringify(response.error));
        } else {
			resultBox = createBox("house", response);
		}
		resultContainer.appendChild(resultBox);
	} else {
		const errorMessage = document.createElement("p");
		errorMessage.textContent = response;
		resultContainer.appendChild(errorMessage);
	}
}
