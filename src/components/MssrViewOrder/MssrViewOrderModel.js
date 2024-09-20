          import { useEffect, useState, useRef } from "react";
          import { useSelector } from "react-redux";
          import MssrService from "../../axios/services/api/mssr";
          import { useNavigate } from "react-router-dom";
          import {maxLengthCheck} from "../../pages/pages/utils/maxLengthInput"
          import Swal from "sweetalert2";
          import MssrModel from "../Mssr/MssrModel";
          
          const ViewOrderModel = ({ id, reset }) => {
            const mssr = useSelector((state) => state.mssr);
            const dashboard = useSelector((state) => state.dashboard.dashboard);
            const {profile_details} = dashboard;


            // profile_details.user_id

            const { getViewStockDetailsLines, getStockEntryNO } = mssr;
            const navigate = useNavigate()
            const userProfile = useSelector((state) => state.userProfile);
            const [qtySaleableData, setQtySaleableData] = useState([]);
            const [returnQtyData, setReturnQtyData] = useState([]);
            const [damageQtyData, setDamageQtyData] = useState([]);
            const [inputData, setInputData] = useState([]);
            const [showOrderSummary, setShowOrderSummary] = useState("d-none");

	const [saveMssrData, setSaveMssrData] = useState([]);
      
///////////////////////////////////////////////////////////////////////////
const [data, setData] = useState([]);
const [initialData, setInitialData] = useState([]);
useEffect(() => {
  if(getViewStockDetailsLines && getViewStockDetailsLines.length>0)
  {
    setInitialData(getViewStockDetailsLines) ;
    setData(getViewStockDetailsLines)
  }
}, [getViewStockDetailsLines])
            const [changedData, setChangedData] = useState([]);
            const handleInputChange = (id, field, value) => {
              const updatedData = data.map(obj => {
                if (obj.item_code === id) {
                  return { ...obj, [field]: value };
                }
                return obj;
              });
              setData(updatedData);
            };
            const handleSubmit = async(event) => {
              event.preventDefault();
              const stock_entry_no  = getStockEntryNO.mssr_entry_no;
              // Filter only the changed data objects
              const changedDataObjects = data.filter(obj => {
                const initialObj = initialData.find(initial => initial.item_code === obj.item_code);
                return (
                  initialObj.cls_stk_qty_damage !== obj.cls_stk_qty_damage ||
                  initialObj.cls_stk_qty_saleable !== obj.cls_stk_qty_saleable ||
                  initialObj.market_return_qty !== obj.market_return_qty 
                );
              });
              const submitData = changedDataObjects.map((mssr, index)=>({
                item_code: mssr.item_code,
                cls_stk_qty_saleable: mssr.cls_stk_qty_saleable,
                cls_stk_qty_damage: mssr.cls_stk_qty_damage,
                market_return_qty: mssr.market_return_qty,
                action_flag: mssr.action_flag

                // asp_gsv:mssr.asp_gsv,
                // asp_nsv:mssr.asp_nsv
              }));
              // Log the changed data objects
              // console.log('Changed Data:', changedDataObjects);
              // console.log('submitData Data:', submitData);
              //Call api for saving mssr object

              let new_sku_added = getViewStockDetailsLines.filter((obj) => obj.action_flag !== "U") //........updated
              if (submitData.length > 0 || new_sku_added.length > 0) {

                // console.log(JSON.stringify(submitData));
                // console.log(JSON.stringify(new_sku_added));

                const combinedData = [...submitData, ...new_sku_added]; //.........updated
                console.log(JSON.stringify("combinedData ----", combinedData));//.........update

                await MssrService.getUpdateStockDetails(userProfile, stock_entry_no, combinedData)
                  .then((response) => {
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
                    },
                   
                    );
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
              <>
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
                        View MSSR Status - {getViewStockDetailsLines && getViewStockDetailsLines[0].ui_status}
                      </h5>
                      <button
                        className="close"
                        type="button"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={()=>reset()}
                      >
                        {" "}
                        <span aria-hidden="true">×</span>{" "}
                      </button>
                    </div>
                    <div className="modal-body">
                      <div className="table-responsive d-none d-sm-block">
                        <table
                          width="100%"
                          border="0"
                          cellSpacing="0"
                          cellPadding="0"
                          className="table tableDash table-striped no-border linkUnd table-hover"
                          id="dataTables1"
                        >
                          <thead>
                            <tr>
                              <th style={{ minWidth: "100px" }}>Item Code</th>
                              <th style={{ minWidth: "280px" }}>Item Name</th>
                              <th style={{ minWidth: "100px" }}>
                                Saleable Stock Qty{" "}
                              </th>
                              {/* <th style={{ minWidth: "100px" }}>
                                Market Return Qty
                              </th>
                              <th>Expiry Qty</th> */}
                              {/* <th>Status</th> */}
                            </tr>
                          </thead>

                          <tbody>
                            {getViewStockDetailsLines &&
                              getViewStockDetailsLines.map((mssr, index) => (
                                <tr key={index}>
                                  <td>{mssr.item_code} {mssr && mssr.action_flag ==="I" ? <span style={{color:"red"}}>*</span> : ""}</td>
                                  <td>{mssr.item_name}</td>
                                  <td>
                                    <input
                                      defaultValue={mssr.cls_stk_qty_saleable}
                                      disabled={
                                        profile_details.user_id === getStockEntryNO.created_by_uid && getStockEntryNO.status_code == 0 ? false :true
                                      }
                                      type="number"
                                      id={`saleableStockQty-${mssr.item_code}`}
                                      style={{ textAlign: "center" }}
                                      min={0}
                                      maxLength="5"
                                      onInput={maxLengthCheck}
                                      onChange={(e) =>
                                        handleInputChange(
                                          mssr.item_code,
                                          "cls_stk_qty_saleable",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  {/* <td>
                                    <input
                                      defaultValue={mssr.market_return_qty}
                                      disabled={
                                        profile_details.user_id === getStockEntryNO.created_by_uid && getStockEntryNO.status_code == 0 ? false :true
                                      }
                                      type="number"
                                      id={`saleableStockQty-${mssr.item_code}`}
                                      style={{ textAlign: "center" }}
                                      min={0}
                                      maxLength="5"
                                      onInput={maxLengthCheck}
                                      onChange={(e) =>
                                        handleInputChange(
                                          mssr.item_code,
                                          "market_return_qty",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td> */}
                                  {/* <td>
                                    <input
                                      defaultValue={mssr.cls_stk_qty_damage}
                                      disabled={
                                        profile_details.user_id === getStockEntryNO.created_by_uid && getStockEntryNO.status_code == 0 ? false :true
                                      }
                                        type="number"
                                        id={`saleableStockQty-${mssr.item_code}`}
                                        style={{ textAlign: "center" }}
                                        min={0}
                                        maxLength="5"
                                        onInput={maxLengthCheck}
                                      onChange={(e) =>
                                        handleInputChange(
                                          mssr.item_code,
                                          "cls_stk_qty_damage",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td> */}
                                  {/* <td>{mssr.ui_status}</td> */}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      <div className={`cart-prod-list d-block d-sm-none`} >
                        {getViewStockDetailsLines &&
                          getViewStockDetailsLines.map((mssr, index) => (
                            <div className={`cart-prod-div ${mssr && mssr.action_flag === "I" ? "highlighted" : ""}`} key={index} >
                              <div className="cart-prod-desc">
                                <span className="cart-prod-lbl">
                                  Item Code :{" "}
                                {mssr && mssr.action_flag ==="I" ? <span style={{color:"red"}}>*</span> : ""}
                                </span>
                                <span className="cart-prod-val">
                                  {mssr.item_code}
                                </span>
                              </div>
                              <div className="cart-prod-desc">
                                <span className="cart-prod-lbl">
                                  Item Name :{" "}
                                </span>
                                <span className="cart-prod-val">
                                  {mssr.item_name}
                                </span>
                              </div>
                              <div className="cart-prod-desc pt-1">
                                <span className="cart-prod-lbl">
                                  Saleable Stock Qty :{" "}
                                </span>
                                
                                <span className="cart-prod-val" >
                                  <input
                                    disabled={
                                      profile_details.user_id === getStockEntryNO.created_by_uid && getStockEntryNO.status_code == 0 ? false :true
                                    }
                                    id={`saleableStockQty-${mssr.item_code}`}
                                   style={{ textAlign: "right",}}   
                                    min={0}
                                    maxLength="3"
                                    onInput={maxLengthCheck}
                                    type="number"
                                    className="qty-ctl"
                                    step="1"
                                    defaultValue={mssr.cls_stk_qty_saleable}
                                    onKeyPress={(event) => {
                                      if (
                                        event.charCode < 48 ||
                                        event.charCode > 58
                                      ) {
                                        event.preventDefault();
                                      }
                                    }}
                                    onChange={(e) =>
                                      handleInputChange(
                                        mssr.item_code,
                                        "cls_stk_qty_saleable",
                                        e.target.value
                                      )
                                    }
                                  />
                                </span>
                              </div>
                              {/* <div className="cart-prod-desc pt-1">
                                <span
                                  className="cart-prod-lbl"
                                  style={{ width: "180px" }}
                                >
                                  Market Return Qty :{" "}
                                </span>
                                <span className="cart-prod-val">
                                  <input
                                    disabled={
                                      profile_details.user_id === getStockEntryNO.created_by_uid && getStockEntryNO.status_code == 0 ? false :true
                                    }
                                    style={{ textAlign: "right" }}
                                    min={0}
                                    maxLength="3"
                                    onInput={maxLengthCheck}
                                    type="number"
                                    className="qty-ctl"
                                    step="1"
                                    placeholder={mssr.market_return_qty}
                                    onKeyPress={(event) => {
                                      if (
                                        event.charCode < 48 ||
                                        event.charCode > 58
                                      ) {
                                        event.preventDefault();
                                      }
                                    }}
                                    // onChange={(e) =>
                                    //   handleInputChange(e, index, "returnQty")
                                    // }

                                    onChange={(e) =>
                                      handleInputChange(
                                        mssr.item_code,
                                        "market_return_qty",
                                        e.target.value
                                      )
                                    }
                                  />
                                </span>
                              </div> */}

                              {/* <div className="cart-prod-desc pt-1">
                                <span className="cart-prod-lbl">
                                  Expiry Qty :{" "}
                                </span>
                                <span
                                  className="cart-prod-val"
                                  style={{ marginLeft: "47px" }}
                                >
                                  <input
                                    disabled={
                                      profile_details.user_id === getStockEntryNO.created_by_uid && getStockEntryNO.status_code == 0 ? false :true
                                    }
                                    style={{ textAlign: "right" }}
                                    min={0}
                                    maxLength="3"
                                    onInput={maxLengthCheck}
                                    type="number"
                                    className="qty-ctl"
                                    step="1"
                                    placeholder={mssr.cls_stk_qty_damage}
                                    onKeyPress={(event) => {
                                      if (
                                        event.charCode < 48 ||
                                        event.charCode > 58
                                      ) {
                                        event.preventDefault();
                                      }
                                    }}
                                    // onChange={(e) =>
                                    //   handleInputChange(e, index, "damageQty")
                                    // }

                                    onChange={(e) =>
                                      handleInputChange(
                                        mssr.item_code,
                                        "cls_stk_qty_damage",
                                        e.target.value
                                      )
                                    }
                                  />
                                </span>
                              </div> */}

                              {/* <div className="cart-prod-desc">
                                <span className="cart-prod-lbl">Status : </span>
                                <span className="cart-prod-val">
                                  {mssr.ui_status}
                                </span>
                              </div> */}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="modal-footer text-center">
                    <a
                        // href="#modalshowcart"
                        href="#mssrModelTable"
                        data-toggle="modal"
                      >
                        <button
                          type="button"
                          // className={`btn btn-info btn-block btn-lg my-3 d-sm-block d-none`}
                        className={`btn btn-info btn-lg ${getStockEntryNO && profile_details.user_id == getStockEntryNO.created_by_uid && getStockEntryNO.status_code == 0 ? '' :'d-none'}`}

                        >
                          <i className="fa fa-plus"></i> Add New Sku's
                        </button>
                      </a>
                      <a>
                      <button
                        type="submit"
                        className={`btn btn-primary btn-md ${getStockEntryNO && profile_details.user_id == getStockEntryNO.created_by_uid && getStockEntryNO.status_code == 0 ? '' :'d-none'}`}
                        onClick={handleSubmit}
                      >
                        <i className="fa-solid fa-check mr-2"></i> Save
                      </button>
                      </a>
                    </div>
                  </div>
                </div>
             
              </div>
                 <MssrModel id="mssrModelTable" isEditAble="true" />
             </>
            );
          };

          export default ViewOrderModel;
