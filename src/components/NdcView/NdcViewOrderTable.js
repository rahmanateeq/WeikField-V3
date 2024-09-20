import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MssrService from "../../axios/services/api/mssr";
import DashboardService from "../../axios/services/api/dashboard";
import { userType } from "../../pages/pages/constants/constants";
import { setOrderLine } from "../../redux/actions/dashboardAction";
import {
  getNdcDetailsLines,
  getNdcApprovalLogs,
  selectedNdcEntryNumber,
  selectedNdcPagesNumber,
} from "../../redux/actions/ndcAction";
import { setSelectedOrder } from "../../redux/actions/placeOrderAction";
import NdcViewOrderModel from "./NdcViewOrderModel";
import axios from "axios";
import { baseURL } from "../../axios/shared/constants";
import NDCService from "../../axios/services/api/ndc";
import Pagination from "../ViewOrder/Pagination";
import NdcPagination from "./NdcPagination";
// import { saveAs } from 'file-saver';
function NdcViewOrderTable() {
  const userProfile = useSelector((state) => state.userProfile);
  const dashboard = useSelector((state) => state.dashboard.dashboard);
  const { menu_details, profile_details } = dashboard;
 
  const ndc =useSelector((state)=>state.ndc) 
  const {getNdcList, viewNdcTotalRecord} = ndc;
  const [loadingItems, setLoadingItems] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
console.log("ndc list",ndc )
  const getNdcLines = async (ndc) => {
    const ndc_entry_no = ndc.ndc_entry_no;

    // AXIOS WRAPPER FOR API CALL
    await NDCService.getNDCLineDetails(
      userProfile,
      ndc_entry_no
    ).then((response) => {
     // dispatch(getStockEntryNo(ndc_entry_no));
     console.log("response",response)
       dispatch(getNdcDetailsLines(response.data.data.ndc_line_details));
       dispatch(getNdcApprovalLogs(response.data.data.ndc_approval_log));

    });
  };

  // const downloadIMG = async (e, ndc) =>{
  //       //  e.preventDefault()
  //        console.log(ndc.upload_file_path)
  //        const link = document.createElement('a');
  //        link.href = 'https://weikfield-partner-portal-repo.s3.ap-south-1.amazonaws.com/aqua_invoice.pdf';
  //        link.download = 'aqua_invoice.pdf';
  //        link.click();
  //     }

  const downloadIMG = async (e, ndc) =>{

    const {upload_file_path } = ndc;
    const fileUrl = `${upload_file_path}`;
    const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${filename}`;
    link.target = '_blank';
    link.click();
        };

  const setValidationStatus = async (item, field) => {
    let ndc_entry_no = item.ndc_entry_no;
    let cur_status_code = field === "accept" ? (Number(item.status_code) ): 99;

    if(field == 'accept'){
     
      const { value: remark } = await Swal.fire({
        html: "Enter NDC Approval remarks ",
        input: "text",
        inputPlaceholder: "Max character 75",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel"
      });
      if (remark) {
        await NDCService.setValidationStatus(
          userProfile,
          ndc_entry_no,
          cur_status_code,
          remark,
        ).then((response) => {
          console.log("error code------------>>:",response.data.error_code);
          if(response.data.error_code===0){
            Swal.fire({
              html : response.data.data.message

            });
           // dispatch(selectedNdcPagesNumber(currentPage));
            dispatch(selectedNdcEntryNumber(response.data.data.message));

          }
        });
      }else{

      }
    }else{    
      const { value: remark } = await Swal.fire({
        html: "Enter NDC rejection remarks ",
        input: "text",
        inputPlaceholder: "Max character 75",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel"
      });
      if (remark) {
        await NDCService.setNDCRejectStatus(
          userProfile,
          ndc_entry_no,
          remark,
        ).then((response) => {

          //dispatch(selectedNdcPagesNumber(currentPage));
          dispatch(selectedNdcEntryNumber(response.data.data.message));
            // navigate('/dashboard')
          
        });
      }else{
        // Swal.fire({
        //   icon:"error",
        //   text: " Please enter valid remark!"
        // })
      }

    }

    // console.log("cur_status_code", cur_status_code)

 
  };

    const reset = async() =>{
       dispatch(getNdcDetailsLines(null));
       dispatch(getNdcApprovalLogs(null));

    }

  return (
    <>
      {getNdcList && getNdcList !== null && (
        <div className="card border-0 rounded-0 mb-3">
          <div className="card-body">
            <div className="table-responsive">
              <table
                className="table table-bordered"
                id="viewDataTable"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>NDC Entry No</th>
                    <th style={{ textAlign: "center" }}>Customer Name</th>
                    <th style={{ textAlign: "center" }}>Period From</th>
                    <th style={{ minWidth: "120px",textAlign: "center" }}>Period To</th>
                    <th style={{ minWidth: "120px" }}>Total Claim Amount</th>
                    <th style={{ minWidth: "120px",textAlign: "center" }}>Approver Name</th>
                    <th style={{ minWidth: "120px" ,textAlign: "center"}}>Status</th>
                    <th style={{ minWidth: "120px",textAlign: "center"  }}>Download</th>

                  </tr>
                </thead>
                <tbody>

                  {getNdcList &&
                    getNdcList.map((ndc, index) => (
                      <tr key={index}>
                        <td>
                          <a
                            onClick={() => getNdcLines(ndc)}
                            className="text-green"
                            href="#viewndcorderpop"
                            data-toggle="modal"
                            data-tooltip="tooltip"
                            title="View NDC"
                          >
                            {ndc.ndc_entry_no}
                          </a>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {ndc.customer_name}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {ndc.period_from}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {ndc.period_to}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {ndc.total_claim_amount}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {ndc.approver_name}
                        </td>

                        <td style={{ textAlign: "center" }}>
                        
                          {//profile_details.user_id == ndc.created_uid  && Number(ndc.status_code) == 0 
                            profile_details.user_id == ndc.pending_with_uid  && Number(ndc.status_code) < 3
                           ? (
                            <div>
                              <button
                                title="validate"
                                data-dismiss="modal"
                                aria-label="Close"
                                className="btn btn-dash-primary btn-sm mr-1"
                                onClick={() => setValidationStatus(ndc, "accept")}
                              >
                                <i
                                  className="fa fa-check"
                                  style={{ color: "green" }}
                                  aria-hidden="true"
                                ></i>
                              </button>
                              <button
                                title="reject"
                                data-dismiss="modal"
                                aria-label="Close"
                                className="btn btn-dash-danger btn-sm mr-2"
                                onClick={() => setValidationStatus(ndc, "reject")}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>

                            </div>
                           ) : (
                            <span className="text-danger text-nowrap">
                              {ndc.ui_status}
                            </span>
                          )}
                        </td>

                         <td style={{ textAlign: "center" }}>
                          
                             <i
                             onClick={(e) => downloadIMG(e,ndc)}
                             className="fa fa-download"
                             style={{ fontSize: "24px", color: "green" }}
                             aria-hidden="true"
                           ></i>
                           
                        </td>
                      </tr>
                    ))}

                  {getNdcList.length === 0 && (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-nowrap"><h5> No data found </h5></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
              <NdcPagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={viewNdcTotalRecord} 
                onPageChange={page => setCurrentPage(page)}
              />
            </div>
            <NdcViewOrderModel id="viewndcorderpop" reset={reset} />
          </div>
        </div>
      )}
    </>
  );
}

export default NdcViewOrderTable;