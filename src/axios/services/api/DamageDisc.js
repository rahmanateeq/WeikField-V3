//Code written by atharva on 13.02.2024

import request from "../../shared/lib/request";

function sendDamageDiscOTP(userProfile) {
    return request({
        url: `/ndc/sendOTP`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userProfile.token}`,
        },
        data: JSON.stringify({
            usertype: userProfile.usertype,
        }),
    });
}

function getDamageDiscDistDetails(userProfile) {
    return request({
        url: `/flow/getFlowDistDetails`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userProfile.token}`,
        },
    });
} 

function viewDamageDeclarationFilter(userProfile) {
    return request({
        url: `flow/viewFlowFilter`, //added on22.02.2024, by atharva
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userProfile.token}`,
        },
    });
}

function getDdViewHeaderList(
    userProfile,
    distcode,
    offsetStart
) {
    return request({
        url: `flow/getFlowHeaderList`, //added on22.02.2024, by atharva
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userProfile.token}`,
        },
        data: JSON.stringify({
            usertype: userProfile.usertype,
            // dd_status:"0",
            dist_code:distcode,
            limitNo:10,
            offsetStart:offsetStart
        }),
    });
};

function saveDamageDisc(
    userProfile,
    customerCode,
    createdByUid,
 ) {
    return request({
        url: `/flow/saveFlowDamage`,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userProfile.token}`,
        },
        data: JSON.stringify({

            customer_code:customerCode,
            created_by_uid:createdByUid,
            check_tick: 1,
            file_path:"NA",
            
        }),
    });
};

function getDamageDiscDetailsLines(userProfile, doc_entry_no) {
    return request ({
        url: `flow/getFlowLineDetails`, //added on 22.02.2024,by atharva
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userProfile.token}`,
        },
        data: JSON.stringify({
            doc_entry_no: doc_entry_no,

        }),
    });
}

const DamageDiscService = {
    sendDamageDiscOTP,
    getDdViewHeaderList,
    saveDamageDisc,
    viewDamageDeclarationFilter,
    getDamageDiscDistDetails,
    getDamageDiscDetailsLines,    
};

export default DamageDiscService;