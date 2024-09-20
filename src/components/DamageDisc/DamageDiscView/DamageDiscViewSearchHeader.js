import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DamageDiscService from "../../../axios/services/api/DamageDisc";
import {  setDamageDiscTableLoading } from "../../../redux/actions/damageDiscAction";
import { setDdViewHeaderList,  setDdViewSearchHeaderTotalRecord} from "../../../redux/actions/damageDiscAction";


function ViewDamageDiscSearchHeader() {

  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.userProfile);

  const damagedisc = useSelector((state) => state.damagedisc);
  const { viewOrderFilter, viewOrderTotalPages, selectedPage, damagediscEntryNo } = damagedisc;
   

  const viewOrder = useSelector((state) => state.viewOrder);
  const [distributor, setDistributor] = useState("");
  

  
  const [selectedDistributor, setSelectedDistributor] = useState(99);

  const getCreateDamageDeclarationData = async () => {
    await DamageDiscService.viewDamageDeclarationFilter(userProfile).then((response) => {
      console.log("response ----",response.data.data.distributor_details.customer_name);
      setDistributor(response.data.data.distributor_details);
      
    });
  };

  const resetSearch = () => {
    dispatch(setDdViewHeaderList(""));
    setSelectedDistributor(0);
   
  };

  const getDdViewHeaderList = async () => {
   console.log("selecteddistributor",selectedDistributor);
    let selectedPageN = selectedPage * 10;

    dispatch(setDdViewHeaderList(""));
    dispatch(setDamageDiscTableLoading(true));
      await DamageDiscService.getDdViewHeaderList(
        userProfile,
        selectedDistributor, 
        selectedPageN
      ).then((response) => {
        dispatch(setDdViewSearchHeaderTotalRecord(response.data.data.flow_header_total_count))
        console.log("response of flow_header_total_count", response.data.data.flow_header_total_count);
        dispatch(setDdViewHeaderList(response.data.data.flow_header_details));
        dispatch(setDamageDiscTableLoading(false));

      });

  };

  const handleSubmit = (e) => {
    e.preventDefault();
     getDdViewHeaderList();
  };

  useEffect(() => {
    getCreateDamageDeclarationData();
  }, []);

  useEffect(() => {
    getDdViewHeaderList();
  }, [selectedPage, damagediscEntryNo]);

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
            Search Damage Declaration Entries
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
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="DistributorName" className="control-label">
                          Distributor :
                        </label>
                      </div>
                      <div className="col-md-8">
                        <select
                          name="DistributorName"
                          className="form-control selectpicker"
                          data-live-search="true"
                          onChange={(e) =>
                          setSelectedDistributor(e.target.options[e.target.options.selectedIndex].getAttribute('data-key')) //Amit  logic for getting the desired output on UI 
                          }
                          required
                        >
                          <option key={99} data-key={99} value ={99} default >Select Distributor</option>
                          <option key={0} data-key={0} value={0}>Show ALL </option>
                          {distributor &&
                            distributor.map((dist, index) => (
                              <option
                                key={dist.customer_code}
                                value={dist.customer_code}
                                data-key={dist.customer_code}
                              >
                                {dist.customer_name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/*added by Amit from here*/}
                
                </div>
                <div className="form-group row">
                  <div className="col-md-6">
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





export default ViewDamageDiscSearchHeader;