import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import MssrService from "../../axios/services/api/mssr";
import { useSelector, useDispatch } from "react-redux";
import {
  getViewMssrDetailsLines,
  getStockEntryNo,
} from "../../redux/actions/mssrAction";
import {
  getUniqueByKey,
  getRoundOff,
} from "../../pages/pages/utils/findUniqueBykey";
import { setAddToCart } from "../../redux/actions/mssrAction";
import { ColorRing } from "react-loader-spinner";

const MssrModel = ({ id, isEditAble, data }) => {
  const dispatch = useDispatch();
  const [newMssrLines,setNewMssrLines] = useState([]);   //--------10-12-2023
  const input1ref = useRef(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [newMssr, setNewMssr] = useState([]);
  const userProfile = useSelector((state) => state.userProfile);
  const mssr = useSelector((state) => state.mssr);
  const { addTocart, getViewStockDetailsLines} = mssr;
  const handleSearch = async () => {
    // AXIOS WRAPPER FOR API CALL
    setLoading(true);
    await MssrService.addNewMssr({ userProfile, search }).then((response) => {
      setSearchData(response.data.data.search_item_details);
    });
    setLoading(false);
  };

  const myAction = (e, item) => {
    e.preventDefault();
    Swal.fire({
      // title: `Item Name:${item.brand}`,
      html:
        // `<p style="text-align:left"><strong>${item.item_code}</strong> </p>` +
        // `<p style="text-align:left">${item.item_name}</p>` +
        `<p style="text-align:left"><span style="font-size:12px;"> ${item.item_details}</span></p>` +
        `<div class="input-row" style="display: flex; justify-content: space-between; gap: 2px;">` +
        `<input type="number" min="0" onkeypress="return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))" id="swal-input1" style="border:1px solid gray; border-radius:5px;" placeholder='Closing Stock' class="swal-input input-field">` +
        `<input type="number" min="10" onkeypress="return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57)  || event.charCode == 46)" id="swal-input2" style="border:1px solid gray; border-radius:5px;" placeholder='Price' class="swal-input input-field">` +
        // `<input type="number" min="0" onkeypress="return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))" id="swal-input3" style="border:1px solid gray" placeholder='Expiry Qty' class="swal-input input-field">` +
        `</div>`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      allowOutsideClick: false, 
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
      },
      didOpen: () => {
        const priceInput = document.getElementById("swal-input2");
        
        // Add event listener to clear validation message when input changes
        priceInput.addEventListener("input", () => {
          const price = parseFloat(priceInput.value);
          const decimalPattern = /^\d+(\.\d{1,2})?$/;  // Ensures up to 2 decimal places
          if (!isNaN(price) && price >= 10 && price <= 9999.99 && decimalPattern.test(priceInput.value)) {
            Swal.resetValidationMessage(); // Reset validation when input is valid
          }
        });
      },
      preConfirm: () => {
        const price = parseFloat(document.getElementById("swal-input2").value);
        const decimalPattern = /^\d+(\.\d{1,2})?$/;  // Validates up to 2 decimal places
        
        if (isNaN(price) || price < 10 || price > 9999.99 || !decimalPattern.test(price)) {
          Swal.showValidationMessage(
            `Price must be between 10 and 9999.99 up to two decimal`
          );
          return false;
        }

        return [document.getElementById("swal-input1").value,
                 document.getElementById('swal-input2').value]
        //         document.getElementById('swal-input3').value  ];
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const [input1, input2] = result.value;
        // const [input1] = result.value;

        if (isEditAble === "true") {
          console.log(item)
          const skuData = {
            item_code: item.item_code,
            item_name: item.item_name,
            cls_stk_qty_saleable: input1 ? input1 : "0",
            action_flag: "I",
            asp_gsv: input2,
            asp_nsv: input2,
          };
           // Check if the item with the same "item_code" already exists
            let new_mssr_added = [...getViewStockDetailsLines, skuData];
            // const itemIndex = new_mssr_added.findIndex(
            //   (existingItem) => existingItem.item_code === skuData.item_code
            // );

            // if (itemIndex !== -1) {
            //   // Replace the old item with the new skuData
            //   new_mssr_added[itemIndex] = skuData;
            // } else {
            //   // Add new skuData to the array if not already present
            //   new_mssr_added.push(skuData);
            // }
          //  // For removing duplicate key
           const key = "item_code";
           const new_mssr_added_UniqueByKey = getUniqueByKey( new_mssr_added, key
           );
          //  console.log("new sku", new_mssr_added_UniqueByKey)
          dispatch(getViewMssrDetailsLines(new_mssr_added_UniqueByKey));
        } else {
          const newData = {
            item_code: item.item_code,
            item_name: item.item_name,
            item_details: item.item_details,
            physical_closing: input1 ? input1 : "0",
            asp_gsv: input2,
            asp_nsv: input2,
            // trasfer_qty:input2 ? input2 : "0",
            // expire_qty:input3 ? input3 : "0",
            mssr_entry: true,
          };
          console.log("newData", newData);

          setNewMssr((prev) => [...prev, newData]);

          let added_to_cart = [...addTocart, newData];
          // For removing duplicate key
          const key = "item_code";
          const order_grid_details_UniqueByKey = getUniqueByKey(
            added_to_cart,
            key
          );
          // store the data in redux store
          dispatch(setAddToCart(order_grid_details_UniqueByKey));
        }
      }
    });
  };
  // console.log("newMssr",newMssr)

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
    </div>
  );
};

export default MssrModel;
