import { ActionTypes } from "../constants/action-type";

const initialState = {
    selectedPage: 0,
    damagediscotp: "null",
    damagediscexpiry_time: "null",
    selectedDamageDiscPage: 0,
    getDamageDiscDetailsLines: [], //done on 24/2/24
    getDamageDiscApprovalLogs: [], //24/2/24
    DamageDiscLoading: false, //24/2/24
    viewDamageDiscSearchHeaderTotalRecord: null, //24/2/24
    damagediscEntryNo: null,
};

export const damagediscReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case ActionTypes.SET_SELECTED_DAMAGEDISCPAGE_NUMBER:
            return{ ...state, selectedPage: payload };

        case ActionTypes.SET_DAMAGEDISC_OTP:
            return { ...state, damagediscotp: payload };

        case ActionTypes.SET_DAMAGEDISC_EXPIRY:
            return { ...state, damagediscexpiry_time: payload };
    
         case ActionTypes.SET_DDVIEWHEADER_HEADER_LIST:
            return{...state, getDdViewHeaderList: payload };

        case ActionTypes.SET_DAMAGEDISC_DETAILS_LINES:
            return {...state, getDamageDiscDetailsLines: payload };

        case ActionTypes.SET_DAMAGEDISC_APPROVAL_LOGS:
            return{...state, getDamageDiscApprovalLogs: payload };

        // case ActionTypes.SET_DAMAGEDISC_VALIDATION_STATUS:
        //     return{...state, selectedPage: payload };

        // case ActionTypes.SET_DAMAGEDISC_REJECT_STATUS:
        //     return{...state, selectedPage: payload };

        case ActionTypes.SET_DAMAGEDISC_TABLE_LOADING:
            return{...state, DamageDiscLoading : payload };

        case ActionTypes.SET_DDVIEWSEARCHHEADER_TOTAL_RECORD:
            return{...state, viewDamageDiscSearchHeaderTotalRecord: payload };

        case ActionTypes.SET_SELECTED_DAMAGEDISCPAGE_NUMBER:
            return{...state, selectedPage: payload };
        
        case ActionTypes.SET_SELECTED_DAMAGEDISC_ENTRY_NUMBER:
            return{...state, damagediscEntryNo: payload };
    default:
        return state;
    }
}