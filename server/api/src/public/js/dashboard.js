async function sendRequestWithToken(url, method, data) {
	const token = localStorage.getItem("jwtToken");
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};

	let requestUrl = url;

	// Check if there are URL parameters
	const urlParams = url.match(/:[^/]+/g);
	if (urlParams && urlParams.length > 0) {
		urlParams.forEach((param) => {
			const paramName = param.substr(1); // Remove the ':' from the parameter
			if (data.hasOwnProperty(paramName)) {
				requestUrl = requestUrl.replace(param, data[paramName]);
				delete data[paramName];
			}
		});
	}

	const requestOptions = {
		method: method,
		headers: headers,
		data: method !== "GET" ? data : null,
		url: requestUrl, // Use the modified URL
	};

	try {
		const response = await axios(requestOptions);
		return response.data;
	} catch (error) {
		if (error.response) {
			// The request was made and the server responded with an error status code
			return error.response.data;
		} else if (error.request) {
			// The request was made but no response was received
			throw new Error("No response received from the server.");
		} else {
			// An error occurred while setting up the request
			throw new Error("Error occurred while sending the request.");
		}
	}
}

const token = localStorage.getItem("jwtToken");

if (token) {
	const forms = document.querySelectorAll("form");
	forms.forEach((form) => {
	  form.addEventListener("submit", async function (e) {
		e.preventDefault();
		const method = this.getAttribute("method");
		const url = this.getAttribute("action");
		const formData = new FormData(this);
		const data = Object.fromEntries(formData.entries());
  
		try {
		  const resultContainer = document.getElementById("result");
		  resultContainer.textContent = "Loading...";
  
		  const response = await sendRequestWithToken(url, method, data);
  
		  // Call the displayResult function to display the response in hierarchical boxes
		  displayResult(response);
		} catch (error) {
		  alert("Request failed. Please try again later.");
		  console.error("Error:", error);
		}
	  });
	});
  }