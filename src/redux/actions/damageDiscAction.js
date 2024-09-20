import { ActionTypes } from "../constants/action-type";


// used for disclaimer creation purpose 
export const setDamageDiscotp = (DamageDiscotp) => {
    return {
        type: ActionTypes.SET_DAMAGEDISC_OTP,
        payload: DamageDiscotp,
    };
};

export const setDamageDiscExpiry = (DamageDiscexpiry) => {
    return {
        type: ActionTypes.SET_DAMAGEDISC_EXPIRY,
        payload: DamageDiscexpiry,
    };
};

//used for View Damage declaration purpose, 22.02.2024

export const setDdViewHeaderList = (damagedec) => {
    return {
        type: ActionTypes.SET_DDVIEWHEADER_HEADER_LIST,
        payload: damagedec,
    };
};


export const getDamageDiscDetailsLines = (damagedec) => {
    return {
        type: ActionTypes.SET_DAMAGEDISC_DETAILS_LINES,
        payload: damagedec,
    };
};


export const getDamageDiscApprovalLogs = (damagedec) => {
    return {
        type: ActionTypes.SET_DAMAGEDISC_APPROVAL_LOGS,
        payload: damagedec,
    };
};



export const setDamageDiscValidationStatus = (damagedec) => {
    return {
        type: ActionTypes.SET_DAMAGEDISC_VALIDATION_STATUS,
        payload: damagedec,
    };
};

export const setDamageDiscRejectStatus = (damagedec) => {
    return{
        type: ActionTypes.SET_DAMAGEDISC_REJECT_STATUS,
        payload: damagedec,
    };
};

export const selectedDamageDiscPagesNumber = (data) => {
	return {
		type: ActionTypes.SET_SELECTED_DAMAGEDISCPAGE_NUMBER,
		payload: data,
	};
};

export const setDdViewSearchHeaderTotalRecord = (data) => {
    return {
        type: ActionTypes.SET_DDVIEWSEARCHHEADER_TOTAL_RECORD,
        payload: data,
    };
};

export const setDamageDiscTableLoading = (state) => {
    return {
        type: ActionTypes.SET_DAMAGEDISC_TABLE_LOADING,
        payload: state,
    };
};

export const selectedDamageDiscEntryNumber = (data) => {
    return {
        type: ActionTypes.SET_SELECTED_DAMAGEDISC_ENTRY_NUMBER,
        payload: data,
    };
};

export const setDamageDiscLoading = (data) => {
    return {
        type: ActionTypes.SET_DAMAGEDISC_LOADING,
        payload: data,
    }
}


