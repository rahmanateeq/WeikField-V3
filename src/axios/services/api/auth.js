import request from "../../shared/lib/request";

function addUser(data) {
	localStorage.setItem("username", data.username);
	localStorage.setItem("password", data.password);
	return request({
		url: `/authenticate`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		data: JSON.stringify({
			username: data.username,
			password: data.password,
		}),
	});
}

function forgetPassward(data) {
	return request({
		url: `/login/retrievePassword`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		data: JSON.stringify({
				"userId": `${data}`
		}),
	});
}

function getUserType(token) {
	return request({
		url: `/home/getUserType`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

function getLockStatus(userProfile) {
	return request({
		url: `/placeOrder/order-lock-status`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
	});
}

const AuthService = {
	addUser,
	getUserType,
	forgetPassward,
	getLockStatus
};

export default AuthService;
