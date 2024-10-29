import request from "../../shared/lib/request";

function getModules(userProfile) {
	return request({
		url: `/sr/getModules`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
	});
}

function getSRDistributor(userProfile) {
	return request({
		url: `/sr/getDistributors`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
	});
}

function saveTicket( userProfile, data) {
	return request({
		url: `/sr/save`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			mod_code:data.mod_code,
            user_remarks:data.user_remarks,
            cust_code:data.cust_code
		}),
	});
}

function viewAllTicket( userProfile, mod_code) {
	return request({
		url: `/sr/view`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			mod_code:mod_code,
            
		}),
	});
}

function ticketApproval( userProfile, data) {
	return request({
		url: `/sr/changeState`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
            sr_no:data.sr_code,
            actionFlag:data.actionFlag,   //Approved:0,Rejected:1
            remarks:data.remarks
		}),
	});
}

function viewTimeline( userProfile, sr_id) {
	return request({
		url: `/sr/viewTimeline`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			sr_id:sr_id,  
		}),
	});
}


const TicketService = {
    getModules,
    getSRDistributor,
    ticketApproval,
    saveTicket,
    viewAllTicket,viewTimeline
}

export default TicketService