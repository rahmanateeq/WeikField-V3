import { ActionTypes } from "../constants/action-type";

export const setDashboard = (data) => {
	localStorage.setItem("dashboard", JSON.stringify(data));
	return {
		type: ActionTypes.SET_DASHBOARD,
		payload: data,
	};
};

export const setOrderLine = (products, ord) => {
	let orderLine = { products, ord };
	return {
		type: ActionTypes.SET_ORDER_LINE,
		payload: orderLine,
	};
};

//05/12/023
export const getDetailsFlag = (data) => {
	return {
		type: ActionTypes.SET_ORDER_DAMAGE,
		payload: data,
	};
};
