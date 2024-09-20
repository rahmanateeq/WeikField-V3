import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
// import P2SService from "../../axios/services/api/mssr";
import P2SService from "../../axios/services/api/p2s";
import { useNavigate } from "react-router-dom";
import { maxLengthCheck } from "../../pages/pages/utils/maxLengthInput";

import Swal from "sweetalert2";
const P2SViewOrderModel = ({ id, reset }) => {
  const p2s = useSelector((state) => state.p2s);
  const { getP2sApprovalLogs, getP2SDetailsLines, setP2sList } = p2s;
  // console.log("data",getP2SDetailsLines)

  // console.log("Approvel value", getP2SDetailsLines)
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.userProfile);

  ///////////////////////////////////////////////////////////////////////////
  const [data, setData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [changedData, setChangedData] = useState([]);

  const handleInputChange = (id, field, value) => {
    const updatedData = data.map((obj) => {
      if (obj.item_code === id) {
        return { ...obj, [field]: value };
      }
      return obj;
    });
    setData(updatedData);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const stock_entry_no = 0;
    // Filter only the changed data objects
    const changedDataObjects = data.filter((obj) => {
      const initialObj = initialData.find(
        (initial) => initial.item_code === obj.item_code
      );
      return (
        initialObj.cls_stk_qty_damage !== obj.cls_stk_qty_damage ||
        initialObj.cls_stk_qty_saleable !== obj.cls_stk_qty_saleable ||
        initialObj.market_return_qty !== obj.market_return_qty
      );
    });
    const submitData = changedDataObjects.map((mssr, index) => ({
      item_code: mssr.item_code,
      cls_stk_qty_saleable: mssr.cls_stk_qty_saleable,
      cls_stk_qty_damage: mssr.cls_stk_qty_damage,
      market_return_qty: mssr.market_return_qty,
    }));

    if (submitData.length > 0) {
      await P2SService.getUpdateStockDetails(
        userProfile,
        stock_entry_no,
        submitData
      );
      console.log("userdata", userProfile).then((response) => {
        Swal.fire({
          title: `${response.data.data.message}`,
          text: `${response.data.data.add_message}`,
          showCancelButton: false,
          showCloseButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "your-custom-class",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const closeButton = document.querySelector(".close");
            if (closeButton) {
              closeButton.click();
            }
          }
        });
      });
    } else {
      Swal.fire({
        title: "Please Fill in the Input",
        text: "I'm sorry, but it seems like you forgot to fill in the required input.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      console.log("error", "error in else condition");
    }
  };
  return (
    <div
      className="modal bd-example-modal-lg fade"
      id={id}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-backdrop="static"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              View P2S Line Details <br />
              <span>
                Customer Name :{" "}
                {setP2sList &&
                  setP2sList.length > 0 &&
                  setP2sList[0].customer_name}
              </span>
            </h5>
            <button
              className="close"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => reset()}
            >
              {" "}
              <span aria-hidden="true">×</span>{" "}
            </button>
          </div>
          <div className="modal-body">
            {/* <div className="table-responsive">
              <table
                width="100%"
                border="0"
                cellSpacing="0"
                cellPadding="0"
                className="table tableDash table-striped no-border linkUnd table-hover d-none d-sm-block"
                id="dataTables1"
              >
                <thead>
                  <tr>
                    <th style={{ minWidth: "100px" }}>P2S Entry No</th>
                    <th style={{ minWidth: "280px" }}>Details Remark</th>
                    <th style={{ minWidth: "100px" }}> P2S Type </th>
                    <th style={{ minWidth: "100px" }}>Claim Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {getP2SDetailsLines &&
                    getP2SDetailsLines.map((p2s, index) => (
                      <tr key={index}>
                        <td>{p2s.doc_entry_no}</td>
                        <td>{p2s.detail_remark}</td>
                        <td>
                          {p2s.p2s_type}
                        </td>
                        <td>
                          {p2s.claim_amount}
                        </td>

                      </tr>
                    ))}

                </tbody>

              </table>

              <div className="cart-prod-list d-block d-sm-none">
                {getP2SDetailsLines &&
                  getP2SDetailsLines.map((ndc, index) => (
                    <div className="cart-prod-div" key={index}>
                      <div className="cart-prod-desc">
                        <span className="cart-prod-lbl">
                          P2S Entry No :{" "}
                        </span>
                        <span className="cart-prod-val">
                          {p2s.doc_entry_no}
                        </span>
                      </div>
                      <div className="cart-prod-desc">
                        <span className="cart-prod-lbl">
                          Details Remark :{" "}
                        </span>
                        <span className="cart-prod-val">
                          {p2s.detail_remark}
                        </span>
                      </div>
                      <div className="cart-prod-desc pt-1">
                        <span className="cart-prod-lbl">
                          P2S Type :{" "}
                        </span>
                        {p2s.p2s_type}
                      </div>
                      <div className="cart-prod-desc pt-1">
                        <span
                          className="cart-prod-lbl"
                          style={{ width: "180px" }}
                        >
                          Claim Amount :{" "}
                        </span>
                        {p2s.claim_amount}
                      </div>
                    </div>
                  ))}
              </div>

            </div> */}
            {getP2sApprovalLogs ? (
              <div>
                <div
                  className=" d-none d-sm-block table-responsive tables"
                  style={{ width: "100%", height: "75%" }}
                >
                  <h5 style={{ color: "red" }}>Approvel Logs</h5>
                  <table
                    style={{ width: "25%" }} // Set the width and height
                    id="dataTables1"
                  >
                    <thead>
                      <tr style={{ width: "1%", height: "75%" }}>
                        <th> Stage</th>
                        <th>Approver Remarks</th>
                        <th>Action By</th>
                        <th>Approver Name</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getP2sApprovalLogs &&
                        getP2sApprovalLogs.map((p2s, index) => (
                          <tr key={index}>
                            <td>{p2s.approval_stages}</td>
                            <td>{p2s.approver_remarks}</td>
                            <td>{p2s.approved_by_desgn}</td>
                            <td>{p2s.approver_name}</td>
                            <td>{p2s.log_timestamp}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="cart-prod-list d-block d-sm-none d-md-none d-lg-none">
                  <div className=" card">
                    <div className="card-body">
                      {getP2sApprovalLogs &&
                        getP2sApprovalLogs.map((p2s, index) => (
                          <div className="card" key={index}>
                            <div className="cart-prod-desc">
                              <span className="cart-prod-lbl">Stage : </span>
                              <span className="cart-prod-val">
                                {p2s.approval_stages}
                              </span>
                            </div>
                            <div className="cart-prod-desc">
                              <span className="cart-prod-lbl">
                                Approver Remarks :{" "}
                              </span>
                              <span className="cart-prod-val">
                                {p2s.approver_remarks}
                              </span>
                            </div>
                            <div className="cart-prod-desc pt-1">
                              <span className="cart-prod-lbl">
                                Action By :{" "}
                              </span>
                              {p2s.approved_by_desgn}
                            </div>
                            <div className="cart-prod-desc pt-1">
                              <span
                                className="cart-prod-lbl"
                                style={{ width: "180px" }}
                              >
                                Approver Name :{" "}
                              </span>
                              {p2s.approver_name}
                            </div>
                            <div className="cart-prod-desc pt-1">
                              <span className="cart-prod-lbl">
                                Timestamp :{" "}
                              </span>
                              {p2s.log_timestamp}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                {/* ) : ("no any data")} */}
              </div>
            ) : (
              "No any data"
            )}

            {/* <button
              type="submit"
              className="btn btn-primary  btn-md"
              onClick={handleSubmit}
            >
              <i className="fa-solid fa-check mr-2"></i> Save
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default P2SViewOrderModel;
