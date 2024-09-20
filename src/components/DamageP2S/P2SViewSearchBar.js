import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import P2SService from "../../axios/services/api/ndc";
import P2SService from "../../axios/services/api/p2s";
// import { setP2sList, setP2sTableLoading,setViewP2sTotalRecord } from "../../redux/actions/ndcAction";
import { setP2sList, setP2sTableLoading, setViewP2sTotalRecord } from "../../redux/actions/p2sAction";

import DatePicker from "react-datepicker";
import {
  selectedMssrPagesNumber,
  setViewMssrFilter,
  setViewMssrTotalPages,
  setViewMssrTotalRecord,
} from "../../redux/actions/mssrAction";

function P2SViewSearchBar() {
  const dispatch = useDispatch();

  const p2s = useSelector((state) => state.p2s);
  const { viewOrderFilter, viewOrderTotalPages, selectedPage,p2sEntryNo } = p2s;
  // Collecting data from Redux store
  const userProfile = useSelector((state) => state.userProfile);

  // const viewOrder = useSelector((state) => state.viewOrder);x``x`
  // const { viewOrderFilter, viewOrderTotalPages, selectedPage } = viewOrder;

  const [ndcPeriods, setNdcPeriods] = useState(0);
  const [p2sStatus, setp2sStatus] = useState(0);
  const [distributor, setDistributor] = useState("");

  const [selectedp2sStatus, setSelectedp2sStatus] = useState(0);
  const [selectedDistributer, setSelectedDistributer] = useState(0);
  const [selectedP2sPeriods, setselectedP2sPeriods] = useState(0);
  const [loading, setLoading] = useState(true);

  const getCreateNdcData = async () => {
    await P2SService.viewP2SFilter(userProfile).then((response) => {
      console.log("response =====", response.data.data.distributor_details.customer_name);
      setDistributor(response.data.data.distributor_details);
      setp2sStatus(response.data.data.p2s_status);
      setNdcPeriods(response.data.data.ndc_periods)
    });
  };

  const resetSearch = () => {
    dispatch(setP2sList(""));
    setselectedP2sPeriods(0);
    setSelectedDistributer(0);
    setSelectedp2sStatus(0);
  };

  // on button submit
  // const getP2SHeaderList = async (fromDate,toDate) => {
  //   dispatch(setP2sList(""));
  //   dispatch(setP2sTableLoading(true));
  //   const selectedPageN = 0;
  //   const limitNo = 10;
  //     await P2SService.getP2SHeaderList(
  //     userProfile,
  //     fromDate,
  //     toDate,
  //     selectedp2sStatus,
  //     limitNo,
  //     selectedPageN,
  //     selectedDistributer
  //    ).then((response) => {
  //     console.log("response of headerList", response.data.data.ndc_header_details);
  //   dispatch(setP2sList(response.data.data.ndc_header_details));
  //   dispatch(setP2sTableLoading(false));

  //   });
    

  // };


  // -----------------------------13/10/2023

  const getP2SHeaderList = async () => {
    
    let selectedPageN = selectedPage * 10;
    
    dispatch(setP2sList(""));
    dispatch(setP2sTableLoading(true));
      await P2SService.getP2SHeaderList(
      userProfile,
      // fromDate,
      // toDate,
      selectedp2sStatus,
      // selectedPageN,
      selectedDistributer
     ).then((response) => {
    dispatch(setViewP2sTotalRecord(response.data.data.p2s_header_total_count))
    console.log("response of p2s_total_count", response.data.data.p2s_header_details);
    dispatch(setP2sList(response.data.data.p2s_header_details));
    dispatch(setP2sTableLoading(false));

    });
    

  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
     getP2SHeaderList();
  };

  useEffect(() => {
    getCreateNdcData();
  }, []);

  // useEffect(() => {
  //   getP2SHeaderList();
  // }, [selectedPage,p2sEntryNo]);

  return (
    <div className="row mb-3">
      <div className="col-lg-12">
        <div className="card card-primary border-0">
          <div
            className="card-header collapsepanel"
            data-toggle="collapse"
            data-target="#collapseOne"
            aria-expanded="true"
          >
            Search P2S Entries
          </div>
          <div
            className="card-body collapse show py-0"
            id="collapseOne"
            aria-expanded="true"
          >
            <div className="column pt-3 col-sm-offset-0">
              <form
                data-toggle="validator"
                role="form"
                className="form-horizontal"
              >
                <div className="form-group row">
                  {/* <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="OrderNumber" className="control-label">
                          P2S Periods:
                        </label>
                      </div>
                      <div className="col-md-8">
                        <select
                          name="OrderNumber"
                          className="form-control selectpicker"
                          data-live-search="true"
                           onChange={(e) =>
                            setselectedP2sPeriods(e.target.value)
                          }
                          required
                        >
                          <option value={0}>Show All</option>
                          {ndcPeriods &&
                            ndcPeriods.map((p2s, index) => (
                              <option
                                key={index}
                                value={p2s.p2s_status_code}
                              >
                                {p2s.ndc_periods}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div> */}
                  {/*commented  by Amit from here*/}
                  {/* <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label
                          htmlFor="DistributorName"
                          className="control-label"
                        >
                          Distributor:
                        </label>
                      </div>
                      <div className="col-md-8">
                        <input
                          name="DistributorName"
                          className="form-control selectpicker"
                          data-live-search="true"
                          // onChange={(e) =>
                          //   setSelectedDistributer(e.target.value)
                          // }
                          defaultValue={distributor}
                          // required
                          readOnly
                        />
                          
                      </div>
                    </div> */}
                  {/*added by Amit from here*/}
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label
                          htmlFor="DistributorName"
                          className="control-label"
                        >
                          Distributor:
                        </label>
                      </div>
                      <div className="col-md-8">
                        <select
                          name="DistributorName"
                          className="form-control selectpicker"
                          data-live-search="true"
                          onChange={(e) =>{
                      
                            setSelectedDistributer(e.target.value);
                          }
                          }
                          required
                        >
                          <option value={0}>Show All</option>

                          {distributor &&
                            distributor.map((dist, index) => (
                              <option
                                key={dist.customer_code}
                                value={dist.customer_code}
                              >
                                {dist.customer_name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    {/*added by Amit till here*/}
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="OrderStatus" className="control-label">
                          P2S Status:
                        </label>
                      </div>
                      <div className="col-md-8">
                        <select
                          name="OrderStatus"
                          className="form-control selectpicker"
                          data-live-search="true"
                          onChange={(e) => {
                            console.log(e.target.value);
                            setSelectedp2sStatus(e.target.value);
                          }
                          }
                          required
                        >
                          <option value={99}>Show All</option>
                          {p2sStatus &&
                            p2sStatus.map((p2s, index) => (
                              <option
                                key={p2s.p2s_status_code}
                                value={p2s.p2s_status_code}
                              >
                                {p2s.p2s_status_value}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="username" className="control-label">
                          {" "}
                        </label>
                      </div>
                      <div className="col-md-8 text-right">
                        <button
                          onClick={handleSubmit}
                          type="submit"
                          className="btn btn-primary  btn-md"
                          data-toggle="collapse"
                                data-target="#collapseOne"
                                aria-expanded="false"
                        >
                          <i className="fa-solid fa-magnifying-glass"></i>
                          Search
                        </button>
                        &nbsp;
                        <button
                          type="reset"
                          onClick={resetSearch}
                          className="btn btn-danger btn-md"
                        >
                          <i className="fa-solid fa-rotate-right"></i> Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default P2SViewSearchBar;