document
	.getElementById("register-link")
	.addEventListener("click", function (e) {
		e.preventDefault();
		document.getElementById("login-form").style.display = "none";
		document.getElementById("register-form").style.display = "block";
	});

document.getElementById("login-link").addEventListener("click", function (e) {
	e.preventDefault();
	document.getElementById("register-form").style.display = "none";
	document.getElementById("login-form").style.display = "block";
});

// Handle login form submission
document.getElementById("login-form").addEventListener("submit", function (e) {
	e.preventDefault();
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	// Send login request to the backend
	axios
		.post("http://localhost:3000/owner/login", {
			email: email,
			password: password,
		})
		.then((response) => {
			const data = response.data;
			// If login is successful, redirect to dashboard page
			if (data.token) {
				localStorage.setItem("jwtToken", data.token);
				window.location.href = "http://localhost:3000/dashboard";
			} else {
				// If login fails, display the error message
				alert(data.error);
			}
		})
		.catch((error) => {
			alert("Error: " + error.message);
		});
});

// Handle registration form submission
document
	.getElementById("register-form")
	.addEventListener("submit", function (e) {
		e.preventDefault();
		const name = document.getElementById("register-name").value;
		const email = document.getElementById("register-email").value;
		const password = document.getElementById("register-password").value;

		// Send registration request to the backend
		axios
			.post("http://localhost:3000/owner/register", {
				name: name,
				email: email,
				password: password,
			})
			.then((response) => {
				const data = response.data;
				// If registration is successful, redirect to dashboard page
				if (data.token) {
					localStorage.setItem("jwtToken", data.token);
					window.location.href = "http://localhost:3000/dashboard";
				} else {
					// If registration fails, display the error message
					alert(data.error);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				alert("Failed to register. Please try again later.");
			});
	});
