import React, { useRef, useState } from "react";
import MssrService from "../../axios/services/api/mssr";
import { useSelector, useDispatch } from "react-redux";
import { getViewMssrDetailsLines } from "../../redux/actions/mssrAction";
import { getUniqueByKey } from "../../pages/pages/utils/findUniqueBykey";
import { setAddToCart } from "../../redux/actions/mssrAction";
import { ColorRing } from "react-loader-spinner";

const MssrModel = ({ id, isEditAble, data }) => {
  const dispatch = useDispatch();
  const [newMssrLines, setNewMssrLines] = useState([]);
  const input1ref = useRef(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [newMssr, setNewMssr] = useState([]);
  const userProfile = useSelector((state) => state.userProfile);
  const mssr = useSelector((state) => state.mssr);
  const { addTocart, getViewStockDetailsLines } = mssr;

  // --- State for custom inner modal ---
  const [innerModalVisible, setInnerModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [closingStock, setClosingStock] = useState("");
  const [price, setPrice] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    await MssrService.addNewMssr({ userProfile, search }).then((response) => {
      setSearchData(response.data.data.search_item_details);
    });
    setLoading(false);
  };


  
  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
    object.target.value =
      !!object.target.value && Math.abs(object.target.value) >= 0
        ? Math.abs(object.target.value)
        : null;
  };
  // Open custom inner modal instead of calling Swal
  const myAction = (e, item) => {
    e.preventDefault();
    setSelectedItem(item);
    setClosingStock("");
    setPrice("");
    setValidationMessage("");
    setInnerModalVisible(true);
  };

  // Validate inputs and process data from the custom modal
  const handleInnerModalConfirm = () => {
    const parsedPrice = parseFloat(price);
    
    const decimalPattern = /^\d+(\.\d{1,2})?$/;
    if (isNaN(parsedPrice) || parsedPrice < 10 || parsedPrice > 9999.99 || !decimalPattern.test(price)) {
      setValidationMessage("Price must be between 10 and 9999.99 up to two decimal");
      return;
    }
    if (isEditAble === "true") {
      const skuData = {
        item_code: selectedItem.item_code,
        item_name: selectedItem.item_name,
        cls_stk_qty_saleable: closingStock || "0",
        action_flag: "I",
        asp_gsv: price,
        asp_nsv: price,
      };
      let new_mssr_added = [...getViewStockDetailsLines, skuData];
      // For removing duplicate key
      const key = "item_code";
      const new_mssr_added_UniqueByKey = getUniqueByKey( new_mssr_added, key
      );
     //  console.log("new sku", new_mssr_added_UniqueByKey)
     dispatch(getViewMssrDetailsLines(new_mssr_added_UniqueByKey));
    } else {
      const newData = {
        item_code: selectedItem.item_code,
        item_name: selectedItem.item_name,
        item_details: selectedItem.item_details,
        physical_closing: closingStock || "0",
        asp_gsv: price,
        asp_nsv: price,
        mssr_entry: true,
      };
      setNewMssr((prev) => [...prev, newData]);
      let added_to_cart = [...addTocart, newData];
      const key = "item_code";
      const order_grid_details_UniqueByKey = getUniqueByKey(added_to_cart, key);
      dispatch(setAddToCart(order_grid_details_UniqueByKey));
    }
    setInnerModalVisible(false);
  };

  const handleInnerModalCancel = () => {
    setInnerModalVisible(false);
  };

  return (
    <div
      className="modal bd-example-modal-lg fade"
      // id="mssrModelTable"
      id={id}
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-bs-focus="false"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <p className="modal-title m-auto" id="exampleModalLabel">
              <input
                type="text"
                id="input"
                ref={input1ref}
                placeholder="Enter your search"
                style={{ border: "1px solid gray", height: "2.1rem" }}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="text-green">
                <button
                  onClick={handleSearch}
                  className="btn btn-primary mb-1 ml-2"
                >
                  Search
                </button>
              </span>
            </p>
            <button
              className="close"
              type="button"
              data-dismiss="modal"
              onClick={() => {
                input1ref.current.value = "";
                setSearchData([]);
              }}
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          {loading ? (
            <ColorRing
              visible={true}
              height="80"
              width="100%"
              ariaLabel="blocks-loading"
              wrapperStyle={{ textAlign: "center" }}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          ) : (
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
                      {/* <th style={{ minWidth: "100px" }}>item Details</th> */}
                      <th>Item Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchData &&
                      searchData.map((data, index) => (
                        <tr key={index}>
                          <td>
                            <a
                              href=""
                              role="button"
                              onClick={(e) => myAction(e, data)}
                            >
                              {data.item_code}
                            </a>
                          </td>
                          {/* <td>{data.item_details}</td> */}
                          <td>{data.item_name}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="cart-prod-list d-block d-sm-none">
                {searchData &&
                  searchData.map((data, index) => (
                    <div
                      className="cart-prod-div"
                      key={index}
                      onClick={(e) => myAction(e, data)}
                    >
                      <div className="cart-prod-desc">
                        <span className="cart-prod-lbl">Item Code : </span>
                        <span className="cart-prod-val">{data.item_code}</span>
                      </div>
                      {/* <div className="cart-prod-desc">
											<span className="cart-prod-lbl">Item Details : </span>
											<span className="cart-prod-val">
                                            {data.item_details}
                                                </span>
										</div> */}
                      <div className="cart-prod-desc">
                        <span className="cart-prod-lbl">Item Name : </span>
                        <span className="cart-prod-val">{data.item_name}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Inner Modal (pure React, no Bootstrap JS) */}
      {innerModalVisible && (
        <>
         {/* Backdrop */}
         <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1050,
            }}
          ></div>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: "20px",
              zIndex: 1060,
              borderRadius: "5px",
              width: "90%",
              maxWidth: "400px",
            }}
            role="dialog"
            aria-modal="true"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h5>Enter Details for {selectedItem?.item_code}</h5>
              
            </div>
            <p style={{ textAlign: "left", fontSize: "12px" }}>{selectedItem?.item_details}</p>
            <div
              className="input-row"
              style={{ display: "flex", justifyContent: "space-between", gap: "2px", marginTop: "10px" }}
            >
              <input
                type="number"
                min={1}
                maxLength="5"
                onInput={maxLengthCheck}
                value={closingStock}
                onChange={(e) => {
                  setClosingStock(e.target.value);
                  setValidationMessage("");
                }}
                onKeyPress={(event) => {
                  if (event.charCode < 48) {
                    event.preventDefault();
                  }
                }}
                placeholder="Closing Stock"
                style={{ border: "1px solid gray", borderRadius: "5px", width: "48%" }}
                className="form-control"
              />
              <input
                type="number"
                min="10"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setValidationMessage("");
                }}
                placeholder="Price"
                style={{ border: "1px solid gray", borderRadius: "5px", width: "48%" }}
                className="form-control"
              />
            </div>
            {validationMessage && (
              <div style={{ color: "red", marginTop: "8px", fontSize: "0.9rem" }}>{validationMessage}</div>
            )}
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button onClick={handleInnerModalCancel} className="btn btn-secondary" style={{ marginRight: "10px" }}>
                Cancel
              </button>
              <button onClick={handleInnerModalConfirm} className="btn btn-primary">
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MssrModel;
