import request from "../../shared/lib/request";

function sendP2SOTP(userProfile) {
	return request({
		url: `/p2s/sendP2SOTP`,
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


function getP2SDistDetails(userProfile) {
	return request({
		url: `/p2s/getP2SDistDetails`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		// data: JSON.stringify({
		// 	usertype: userProfile.usertype,
		// }),
	});
}



//06/12/023
function viewP2SFilter(userProfile) {
	return request({
		url: `p2s/viewP2SFilter`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		
	});
}

function getP2SHeaderList(
	userProfile,
	
	selectedp2sStatus,
    
	selectedDistributer,
) {
	
	return request({
		url: `/p2s/getP2SHeaderList`,
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			usertype:userProfile.usertype,
			p2s_status:selectedp2sStatus,
			dist_code:selectedDistributer,
			limitNo:10,
			offsetStart:0,
			
		
		}),
	});
}

function saveP2S(
	userProfile,
	userId,
	ImgFile,
) {
	return request({
		url: `/p2s/saveP2S`,
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			customer_code:userId,
			created_by_uid:userId,
			check_tick: 1,
			file_path:ImgFile,
			
		}),
	});
};

function setP2SRejectStatus(
	userProfile,
	doc_entry_no,
	remark,
	){
	return request({
		url: `p2s/setP2SRejectStatus`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			doc_entry_no:doc_entry_no,
			
			vaidation_remarks:remark,
		}),
	});
};

function setP2SApproverStatus(
	userProfile,
	doc_entry_no,
	cur_status_code,
	remark,
	){
	return request({
		url: `p2s/setP2SApproverStatus`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			doc_entry_no:doc_entry_no,
			cur_status_code:cur_status_code,
			vaidation_remarks:remark,
		}),
	});
}


function uploadFile(userProfile,selectedFile) {
	const formData = new FormData();
		formData.append('file',selectedFile);
	
	return request({
		url: `/storage/uploadFile`,
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${userProfile.token}`,
		
		},
		data: formData,
	});
}

function getP2SLineDetails(userProfile, doc_entry_no) {
	return request({
		url: `p2s/getP2SLineDetails`,
		method:"POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			doc_entry_no: doc_entry_no
		}),
	});
}

const P2SService = {
    sendP2SOTP,
	uploadFile,
    saveP2S,
    getP2SDistDetails,
	getP2SLineDetails,
    viewP2SFilter,
    getP2SHeaderList,
	setP2SRejectStatus,
	setP2SApproverStatus
};

export default P2SService;   