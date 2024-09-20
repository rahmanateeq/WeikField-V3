import { ActionTypes } from "../constants/action-type";

const dashboard = localStorage.getItem("dashboard");

const initialState = {
	dashboard: dashboard ? JSON.parse(dashboard) : "null",
	orderLine: "",
	getDetailsFlag: ""
};
export const dashboardReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case ActionTypes.SET_DASHBOARD:
			return { ...state, dashboard: payload };

		case ActionTypes.SET_ORDER_LINE:
			return { ...state, orderLine: payload };
			
			//05/12/023
		case ActionTypes.SET_ORDER_DAMAGE:
			return { ...state, getDetailsFlag: payload };
		default:
			return state;
	}
};
