import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MssrService from "../../axios/services/api/mssr";
import DashboardService from "../../axios/services/api/dashboard";
import { userType } from "../../pages/pages/constants/constants";
import { setOrderLine } from "../../redux/actions/dashboardAction";
import {
  getViewMssrDetailsLines,
  getStockEntryNo,setLoading
} from "../../redux/actions/mssrAction";
import { setSelectedOrder } from "../../redux/actions/placeOrderAction";
import { ColorRing } from "react-loader-spinner";
import MssrViewOrderModel from "./MssrViewOrderModel";
import {
  selectedPagesNumber,
  setViewOrderTotalPages,
} from "../../redux/actions/viewOrderAction";

// import { saveAs } from "file-saver";
import axios from "axios";
import { baseURL } from "../../axios/shared/constants";
// import Pagination from "../ViewOrder/Pagination";
import MssrPagination from "./MssrPagination"; //------new

function MssrViewOrderTable({ handleStatus }) {
  const userProfile = useSelector((state) => state.userProfile);
  const dashboard = useSelector((state) => state.dashboard.dashboard);
  const { menu_details, profile_details } = dashboard;
  const mssr = useSelector((state) => state.mssr);
  const { viewMssrFilter, viewMssrTotalPages ,viewMssrTotalRecord} = mssr;
  // const { viewMssrFilter, viewMssrTotalPages } = mssr;  
  const [loadingItems, setLoadingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const numbers = [...Array(viewMssrTotalPages + 1).keys()].slice(1);

  const getOrderLines = async (mssr) => {
    console.log("MSSR", mssr);
    const stock_entry_no = mssr.mssr_entry_no;

    // AXIOS WRAPPER FOR API CALL
    await MssrService.getViewStockDetailsLines(
      userProfile,
      stock_entry_no
    ).then((response) => {
      // dispatch(getStockEntryNo(stock_entry_no));
      dispatch(getStockEntryNo(mssr));
      dispatch(getViewMssrDetailsLines(response.data.data.stock_line_details));
    });
    // getViewOrderDetails()
    // AXIOS WRAPPER FOR API CAL
  };

  const setValidationStatus = async (item) => {
    let stock_entry_no = item.mssr_entry_no;
    let cur_status_code = item.status_code;
    const { value: remark } = await Swal.fire({
      title: "Enter Validation Remark ",
      input: "text",
      inputPlaceholder: "Please Enter Remark",
    });
    if (remark) {
      setLoading(true)
      await MssrService.setValidationStatus(
        userProfile,
        stock_entry_no,
        cur_status_code,
        remark.toUpperCase()
      ).then((response) => {
        Swal.fire(response.data.data.message);
        dispatch(setLoading(true))
      })
      .catch((error) => {
        
        Swal.fire('Error', 'Failed to Approve the order. Please try again.', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
      
    }
  };
  const setRejectionStatus = async (item) => {
    let stock_entry_no = item.mssr_entry_no;
    let cur_status_code = item.status_code;
    const { value: remark } = await Swal.fire({
      title: "<strong>⚠️ You're about to reject this order</strong>", // Bold title with icon
    html: `
      <p style="color: #d33; font-weight: bold;">This action cannot be undone!</p>
      <label for="remark-input" style="font-size: 1.4em; margin-bottom: 10px;">Enter Rejection Remark</label>
      <input id="remark-input" class="swal2-input custom-input" placeholder="Please Enter Remark" type="text">`,
    showCancelButton: true,
    confirmButtonText: 'Reject',
    cancelButtonText: 'Cancel',
    focusConfirm: false,
    customClass: {
      title: 'swal2-title-custom',
      confirmButton: 'swal2-confirm-custom',
      cancelButton: 'swal2-cancel-custom',
    },
    didOpen: () => {
      const inputElement = document.getElementById('remark-input');
      inputElement.style.width = '80%';
      inputElement.addEventListener('focus', () => {
        inputElement.style.borderColor = 'red'; // Set red border on focus
        inputElement.style.boxShadow = '0 0 5px red'; // Add shadow for emphasis
      });
      inputElement.addEventListener('blur', () => {
        inputElement.style.borderColor = ''; // Reset border color when focus is lost
        inputElement.style.boxShadow = ''; // Reset shadow
      });
    },
    preConfirm: () => {
      const input = Swal.getPopup().querySelector('#remark-input');
      return input.value;
    },
    background: '#f9f9f9', // Light background for better readability
  });

    if (remark) {
      setLoading(true)
      await MssrService.setRejectionStatus(
        userProfile,
        stock_entry_no,
        cur_status_code,
        remark
      ).then((response) => {
        Swal.fire(response.data.data.message);
        dispatch(setLoading(true))
      })
      .catch((error) => {
        
        Swal.fire('Error', 'Failed to reject the order. Please try again.', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
 
    }
  };
  const selectedPageNumber = (pageNo) => {
    dispatch(selectedPagesNumber(pageNo));
  };

  const downloadPDF = async(mssr) => {
    setLoadingItems((prevLoadingItems) => [...prevLoadingItems, mssr]);
    const fileName = mssr.mssr_entry_no;
    const fileUrl = `${baseURL}/dashboard/downloadFile/${fileName}`;
   await fetch(fileUrl,{
      method: 'GET', 
      headers: {
      //   'Content-Type': 'application/json', // Replace with the desired content type
      //   'Authorization': `Bearer ${userProfile.token}`, // Replace with your actual authorization token
      //    Add any additional headers as needed
      },
      })
      .then(response => response.blob())
      .then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.pdf`;
      // link.download = `CS2300044`;
      link.click();
      URL.revokeObjectURL(url);
      })
      .catch(error => {
      console.error('Error downloading file:', error);
      });
      setLoadingItems((prevLoadingItems) =>
      prevLoadingItems.filter((loadingItem) => loadingItem !== mssr)
    );
    };

    const reset = async() =>{
      await dispatch(getViewMssrDetailsLines(null));
    }

  return (
    <>
      {viewMssrFilter && viewMssrFilter !== null && (
       

       
        <div className="card border-0 rounded-0 mb-3">
          { loading ? (
                  <ColorRing
                  visible={true}
                  height="100"
                  width="100%"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
            ) : (
            <>
            <div className="card-body">
              <div className="table-responsive">
                <table
                  className="table table-bordered"
                  id="viewDataTabl"
                  width="100%"
                  cellSpacing="0"
                >
                  <thead>
                    <tr>
                      <th style={{ minWidth: "120px",textAlign:"center" }}>MSSR Entry No</th>
                      <th style={{ minWidth: "120px" }}>Customer Code</th>
                      <th style={{ minWidth: "120px" }}>Customer Name</th>
                      <th style={{ minWidth: "120px" }}>Pending with</th>
                      <th style={{ minWidth: "120px" }}>Status</th>
                      <th style={{ minWidth: "120px" }}>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewMssrFilter &&
                      viewMssrFilter.map((mssr, index) => (
                        <tr key={index}>
                          <td style={{ minWidth: "120px",textAlign:"center" }}>
                            <a
                              onClick={() => getOrderLines(mssr)}
                              className="text-green"
                              href="#viewmssrorderpop"
                              data-toggle="modal"
                              data-tooltip="tooltip"
                              title="View Order"
                            >
                              {mssr.mssr_entry_no}
                            </a>
                          </td>
                          <td className="text-nowrap">{mssr.customer_code}</td>

                          <td >
                            {mssr.customer_name}
                          </td>

                          <td style={{ textAlign: "left" }}>
                            {Number(mssr.status_code) < 2 ? (
                              <>{mssr.approver_name}</>
                            ) : (
                              ""
                            )}
                          </td>

                          <td>
                            {profile_details.user_id == mssr.approver_uid &&
                            Number(mssr.status_code) < 2 ? (
                              <div>
                                <button
                                  title="validate"
                                  data-dismiss="modal"
                                  aria-label="Close"
                                  className="btn btn-dash-primary btn-sm mr-2"
                                  onClick={() => setValidationStatus(mssr)}
                                >
                                  <i
                                    className="fa fa-check"
                                    style={{ color: "green" }}
                                    aria-hidden="true"
                                  ></i>
                                </button>
                                <button
                                title="Reject" 
                                className="btn btn-dash-primary btn-sm ml-1"
                                style={{ borderColor: "red" }}
                                onClick={() => setRejectionStatus(mssr)}
                                >
                                  <i
                                    className="fa fa-times"
                                    style={{ color: "red" }}
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              </div>
                            ) : (
                              <span className="text-danger text-nowrap">
                                {mssr.ui_status}
                              </span>
                            )}
                          </td>

                          <td>
                            {loadingItems.includes(mssr) ?
                              <i
                                class="fa fa-spinner fa-spin"
                                style={{ fontSize: "24px", color:"red" }}
                              ></i>
                              :
                              <i
                              onClick={() => downloadPDF(mssr)}
                              className="fa fa-download"
                              style={{ fontSize: "24px", color: "green" }}
                              aria-hidden="true"
                            ></i>
                            }
                          </td>
                        </tr>
                      ))}

                    {viewMssrFilter.length === 0 && (
                      <tr>
                        <td></td>
                        <td></td>
                        <td className="text-nowrap">No data found </td>
                        <td></td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </table>

                
                {/* <Pagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={viewMssrTotalPages}
                  onPageChange={page => setCurrentPage(page)}
                /> */}
              </div>
              <MssrViewOrderModel id="viewmssrorderpop" reset={reset} />
            </div>
               {/* --------------new updated 14-9-2023---------------------- */}
               <MssrPagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={ viewMssrTotalRecord} 
                  onPageChange={page => setCurrentPage(page)}
              />
            </>
            )}
            

        </div>
      )}
    </>
  );
}

export default MssrViewOrderTable;
