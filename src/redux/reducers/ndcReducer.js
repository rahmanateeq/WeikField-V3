import { ActionTypes } from "../constants/action-type";



const initialState = {
	otp: "null",
	expiry_time: "null",
	getNdcList: [],
	getNdcDetailsLines: [],
	getNdcApprovalLogs: [],
	ndcLoading: false,
	viewNdcTotalRecord: null,
	selectedPage: 0,
	ndcEntryNo: null,
};
export const ndcReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case ActionTypes.SET_NDC_OTP:
			return { ...state, otp: payload };

		case ActionTypes.SET_NDC_EXPIRY:
			return { ...state, expiry_time: payload };

		case ActionTypes.SET_NDC_HEADER_LIST:
			return { ...state, getNdcList: payload };

		case ActionTypes.SET_NDC_DETAILS_LINES:
			return { ...state, getNdcDetailsLines: payload };

		case ActionTypes.SET_NDC_APPROVAL_LOGS:
			return { ...state, getNdcApprovalLogs: payload };

		case ActionTypes.SET_NDC_TABLE_LOADING:
			return { ...state, ndcLoading: payload };

		case ActionTypes.SET_VIEW_NDC_TOTALRECORD:
			return { ...state, viewNdcTotalRecord: payload };

		case ActionTypes.SET_SELECTED_NDCPAGE_NUMBER:
			return { ...state, selectedPage: payload };

		case ActionTypes.SET_SELECTED_NDC_ENTRY_NUMBER:
			return { ...state, ndcEntryNo: payload };
		default:
			return state;
	}
};
