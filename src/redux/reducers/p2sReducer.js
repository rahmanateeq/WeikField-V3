import { ActionTypes } from "../constants/action-type";

const initialState = {
    selectedPage: 0,
    p2sotp: "null",
    p2sexpiry_time: "null",
    getP2sApprovalLogs: [],
    getP2SDetailsLines: [],
    setP2sList: [],
    p2sEntryNo: null,
    selectedP2sPage: 0,
    viewP2sTotalRecord: null,
    p2sLoading: false,
};

export const p2sReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_SELECTED_P2SPAGE_NUMBER:
            return { ...state, selectedPage: payload };

        case ActionTypes.SET_P2S_OTP:
            return { ...state, p2sotp: payload };

        case ActionTypes.SET_P2S_EXPIRY:
            return { ...state, p2sexpiry_time: payload };

        case ActionTypes.SET_P2S_APPROVAL_LOGS:
            return { ...state, getP2sApprovalLogs: payload };

        case ActionTypes.SET_P2S_DETAILS_LINES:
            return { ...state, getP2SDetailsLines: payload };

        case ActionTypes.SET_P2S_HEADER_LIST:
            return { ...state, setP2sList: payload };

            case ActionTypes.SET_SELECTED_P2S_ENTRY_NUMBER:
                return{...state, p2sEntryNo:  payload };

                case ActionTypes.SET_SELECTED_P2SCPAGE_NUMBER:
			return { ...state, selectedP2sPage: payload };

            case ActionTypes.SET_VIEW_P2S_TOTALRECORD:
			return { ...state, viewP2sTotalRecord: payload };

            case ActionTypes.SET_P2S_TABLE_LOADING:
                return { ...state, p2sLoading: payload };

        default:
            return state;
    }

}