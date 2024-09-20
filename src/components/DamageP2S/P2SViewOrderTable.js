import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MssrService from "../../axios/services/api/mssr";
import DashboardService from "../../axios/services/api/dashboard";
import { userType } from "../../pages/pages/constants/constants";
import { setOrderLine } from "../../redux/actions/dashboardAction";

import {
  getP2sApprovalLogs,
  getP2SDetailsLines,
  selectedP2sEntryNumber,
  selectedP2sPagesNumber,
} from "../../redux/actions/p2sAction";
// import { getP2sDetailsLines } from "../../redux/actions/p2sAction";

import axios from "axios";
import { baseURL } from "../../axios/shared/constants";
import P2SService from "../../axios/services/api/p2s";
import Pagination from "../ViewOrder/Pagination";
import P2SViewOrderModel from "./P2SViewOrderModel";
import P2SPagination from "./P2SPagination";
function P2SViewOrderTable() {
  const userProfile = useSelector((state) => state.userProfile);
  const dashboard = useSelector((state) => state.dashboard.dashboard);
  const { menu_details, profile_details } = dashboard;

  const p2s = useSelector((state) => state.p2s);

  const { setP2sList, getP2sList, viewP2sTotalRecord } = p2s;
  const [loadingItems, setLoadingItems] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const getP2SLines = async (p2s) => {
    const doc_entry_no = p2s.doc_entry_no;

    // AXIOS WRAPPER FOR API CALL
    await P2SService.getP2SLineDetails(userProfile, doc_entry_no).then(
      (response) => {
        // dispatch(getStockEntryNo(doc_entry_no));
        console.log("response", response);
        dispatch(getP2SDetailsLines(response.data.data.p2s_line_details));
        dispatch(getP2sApprovalLogs(response.data.data.p2s_approval_log));
      }
    );
  };

  const downloadIMG = async (e, p2s) => {
    const { upload_file_path } = p2s;
    const fileUrl = `${upload_file_path}`;
    const filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${filename}`;
    link.target = "_blank";
    link.click();
  };

  const setP2SApproverStatus = async (item, field) => {
    let doc_entry_no = item.doc_entry_no;
    let cur_status_code = field === "accept" ? Number(item.status_code) : 99;

    if (field == "accept") {
      const { value: remark } = await Swal.fire({
        html: "Enter P2S Approval remarks ",
        input: "text",
        inputPlaceholder: "Max character 75",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      });
      if (remark) {
        await P2SService.setP2SApproverStatus(
          userProfile,
          doc_entry_no,
          cur_status_code,
          remark
        ).then((response) => {
          console.log("error code------------>>:", response.data.error_code);
          if (response.data.error_code === 0) {
            Swal.fire({
              html: response.data.data.message,
            });
            // dispatch(selectedP2sPagesNumber(currentPage));
            dispatch(selectedP2sEntryNumber(response.data.data.message));
          }
        });
      } else {
      }
    } else {
      const { value: remark } = await Swal.fire({
        html: "Enter P2S rejection remarks ",
        input: "text",
        inputPlaceholder: "Max character 75",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      });
      if (remark) {
        await P2SService.setP2SRejectStatus(
          userProfile,
          doc_entry_no,
          remark
        ).then((response) => {
          //dispatch(selectedP2sPagesNumber(currentPage));
          dispatch(selectedP2sEntryNumber(response.data.data.message));
          // navigate('/dashboard')
        });
      } else {
        // Swal.fire({
        //   icon:"error",
        //   text: " Please enter valid remark!"
        // })
      }
    }

    // console.log("cur_status_code", cur_status_code)
  };

  const reset = async () => {
    dispatch(getP2SDetailsLines(null));
    dispatch(getP2sApprovalLogs(null));
  };

  return (
    <>
      {setP2sList && setP2sList !== null && (
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
                    <th style={{ textAlign: "center" }}>P2S Entry No</th>
                    <th style={{ textAlign: "center" }}>Customer Name</th>
                    <th style={{ minWidth: "120px", textAlign: "center" }}>
                      Approver Name
                    </th>
                    <th style={{ minWidth: "120px", textAlign: "center" }}>
                      Status
                    </th>
                    <th style={{ minWidth: "120px", textAlign: "center" }}>
                      Download
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {setP2sList &&
                    setP2sList.map((p2s, index) => (
                      <tr key={index}>
                        <td>
                          <a
                            onClick={() => getP2SLines(p2s)}
                            className="text-green"
                            href="#viewndcorderpop"
                            data-toggle="modal"
                            data-tooltip="tooltip"
                            title="View NDC"
                          >
                            {p2s.doc_entry_no}
                          </a>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {p2s.customer_name}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {p2s.approver_name}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {
                            //profile_details.user_id == p2screated_uid  && Number(p2sstatus_code) == 0
                            profile_details.user_id == p2s.pending_with_uid &&
                            Number(p2s.status_code) < 3 ? (
                              <div>
                                <button
                                  title="validate"
                                  data-dismiss="modal"
                                  aria-label="Close"
                                  className="btn btn-dash-primary btn-sm mr-1"
                                  onClick={() =>
                                    setP2SApproverStatus(p2s, "accept")
                                  }
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
                                  onClick={() =>
                                    setP2SApproverStatus(p2s, "reject")
                                  }
                                >
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                              </div>
                            ) : (
                              <span className="text-danger text-nowrap">
                                {p2s.ui_status}
                              </span>
                            )
                          }
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <i
                            onClick={(e) => downloadIMG(e, p2s)}
                            className="fa fa-download"
                            style={{ fontSize: "24px", color: "green" }}
                            aria-hidden="true"
                          ></i>
                        </td>
                      </tr>
                    ))}

                  {setP2sList.length === 0 && (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-nowrap">
                        <h5> No data found </h5>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>

              <P2SPagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={viewP2sTotalRecord}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
            <P2SViewOrderModel id="viewndcorderpop" reset={reset} />
          </div>
        </div>
      )}
    </>
  );
}

export default P2SViewOrderTable;
