import { ActionTypes } from "../constants/action-type";

export const setNdcOtp = (otp) => {
	return {
		type: ActionTypes.SET_NDC_OTP,
		payload: otp,
	};
};

export const setNdcExpiry = (expiry) => {
	return {
		type: ActionTypes.SET_NDC_EXPIRY,
		payload: expiry,
	};
};
export const setNdcHeaderList = (ndc) => {
	return {
		type: ActionTypes.SET_NDC_HEADER_LIST,
		payload: ndc,
	};
};
export const getNdcDetailsLines = (ndc) => {
	return {
		type: ActionTypes.SET_NDC_DETAILS_LINES,
		payload: ndc,
	};
};
export const getNdcApprovalLogs	 = (ndc) => {
	return {
		type: ActionTypes.SET_NDC_APPROVAL_LOGS,
		payload: ndc,
	};
};

export const setNdcTableLoading = (state) => {
	return {
		type: ActionTypes.SET_NDC_TABLE_LOADING,
		payload: state,
	};
};

export const setViewNdcTotalRecord = (data) => {
	return {
		type: ActionTypes.SET_VIEW_NDC_TOTALRECORD,
		payload: data,
	};
};

export const selectedNdcPagesNumber = (data) => {
	return {
		type: ActionTypes.SET_SELECTED_NDCPAGE_NUMBER,
		payload: data,
	};
};

export const selectedNdcEntryNumber = (data) => {
	return {
		type: ActionTypes.SET_SELECTED_NDC_ENTRY_NUMBER,
		payload: data,
	};
};


