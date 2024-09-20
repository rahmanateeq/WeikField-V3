import { ActionTypes } from "../constants/action-type";


export const setP2SOtp = (p2sotp) => {
	return {
		type: ActionTypes.SET_P2S_OTP,
		payload: p2sotp,
	};
};

export const setP2SExpiry = (p2sexpiry) => {
	return {
		type: ActionTypes.SET_P2S_EXPIRY,
		payload: p2sexpiry,
	};
};


export const getP2SDetailsLines = (p2s) => {
	return {
		type: ActionTypes.SET_P2S_DETAILS_LINES,
		payload: p2s,
	};
};

export const getP2sApprovalLogs	 = (p2s) => {
	return {
		type: ActionTypes.SET_P2S_APPROVAL_LOGS,
		payload: p2s,
	};
};

export const setP2sTableLoading = (state) => {
	return {
		type: ActionTypes.SET_P2S_TABLE_LOADING,
		payload: state,
	};
};

export const setViewP2sTotalRecord = (data) => {
	return {
		type: ActionTypes.SET_VIEW_P2S_TOTALRECORD,
		payload: data,
	};
};


export const setP2sList =(p2s) => {
	return {
		type: ActionTypes.SET_P2S_HEADER_LIST,
		payload: p2s,
	}
};


export const selectedP2SPagesNumber = (data) => {
	return {
		type: ActionTypes.SET_SELECTED_P2SPAGE_NUMBER,
		payload: data,
	};
};


export const selectedP2sEntryNumber = (data) => {
	return {
		type: ActionTypes.SET_SELECTED_P2S_ENTRY_NUMBER,
		payload: data,
	};
};

