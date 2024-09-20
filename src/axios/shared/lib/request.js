/**
 * Axios Request Wrapper
 * ---------------------
 *
 * @author  NITEST KUMAR @nitesh
 * @license MIT
 *
 */

import axios from "axios";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { baseURL } from "../constants";
import store from "../../../redux/store";
import { ActionTypes } from "../../../redux/constants/action-type";

/**
 * Create an Axios Client with defaults
 */
const client = axios.create({
	baseURL: baseURL,
});
/**
 * Request Wrapper with default success/error actions
 */

// function updateAccessToken() {
// 	let token = JSON.parse(localStorage.getItem("token"));
// 	let stored_username = localStorage.getItem("username");
// 	let stored_password = localStorage.getItem("password");
// 	return request({
// 		url: `/refreshToken/?username=${stored_username}&password=${stored_password}`,
// 		method: "GET",
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 			isRefreshToken: "true",
// 		},
// 	});
// }

///////////////////////

// Function to refresh the access token using the refresh token
let accessToken = '';
async function refreshAccessToken() {
    let token = JSON.parse(localStorage.getItem("token"));
	let stored_username = localStorage.getItem("username");
	let stored_password = localStorage.getItem("password");
    try {
      const response = await axios.get(`${baseURL}/refreshToken/?username=${stored_username}&password=${stored_password}`, {
        headers: {
			Authorization: `Bearer ${token}`,
			isRefreshToken: "true",
		}
      });
      accessToken = response.data.token;
      localStorage.setItem("token", JSON.stringify(response.data.token))
      store.dispatch({
					type: ActionTypes.SET_TOKEN,
					payload: response.data.token,
				});
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

const request = function (options) {
	const onSuccess = function (response) {
		// toast.success("response.data.message");
		// console.debug("Request Successful!", response);
		return response;
	};

	const onError = async function (error) {
		console.log("Request Failed:", error.config);
		if (error.response) {
			// Request was made but server responded with something
			// other than 2xx
			if (error.response.data.status === 500) {
				toast.error("User ID or Password entered is wrong");
				localStorage.clear();
				//window.location.replace("/partner/");
				// window.location.replace("/");
			} else if (error.response.data.status === 501) {
				// const newUserToken = await updateAccessToken();
				// localStorage.setItem("token", JSON.stringify(newUserToken.token));
				// store.dispatch({
				// 	type: ActionTypes.SET_TOKEN,
				// 	payload: newUserToken.token,
				// });

                /////////////////////////////////////
                const originalRequest = error.config;
                return refreshAccessToken().then(() => {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axios(originalRequest);
                  });
                /////////////////////////

			} else if (error.response.data.status === 502) {
				localStorage.clear();
				window.location.replace("/partner/");
			} else if (error.response.data.status === 510) {
				toast.error("You are not authorized to use this application");
			} else {
				toast.error(error.response.data.message);
			}

			// let timerInterval;
			// Swal.fire({
			// 	title: error.response.data.error,
			// 	html: error.response.data.message,
			// 	timer: 2500,
			// 	timerProgressBar: true,
			// 	showCancelButton: true,
			// 	confirmButtonColor: "#3085d6",
			// 	cancelButtonColor: "#d33",
			// 	confirmButtonText: "Ok",
			// 	onBeforeOpen: () => {
			// 		Swal.showLoading();
			// 		timerInterval = setInterval(() => {
			// 			const content = Swal.getContent();
			// 			if (content) {
			// 				const b = content.querySelector("b");
			// 				if (b) {
			// 					b.textContent = Swal.getTimerLeft();
			// 				}
			// 			}
			// 		}, 100);
			// 	},
			// 	onClose: () => {
			// 		clearInterval(timerInterval);
			// 	},
			// }).then((result) => {
			// 	if (result.dismiss === Swal.DismissReason.timer) {
			// 		console.log("I was closed by the timer");
			// 	}
			// });

			console.error("Status:", error.response.status);
			console.error("Data:", error.response.data);
			console.error("Headers:", error.response.headers);
			console.error("Error Message:", error.response.data.message);
		} else {
			// Something else happened while setting up the request
			// triggered the error
			console.error("Error Message:", error.message);
		}

		return Promise.reject(error.response || error.message);
	};

	return client(options).then(onSuccess).catch(onError);
};

export default request;
