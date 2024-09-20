// Code written by atharva on 13.02.2024//

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link,useNavigate } from "react-router-dom";
import DamageDiscService from "../../axios/services/api/DamageDisc";

import Swal from "sweetalert2";
function DamageDiscComp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userProfile = useSelector((state => state.userProfile));

  const [approveCheckboxChecked, setApproveCheckboxChecked] = useState(true);
  const [distributor, setDistributor] = useState("");  //to take single input as information from this variable.
  const [flowDeclaration, setFlowDeclaration] = useState([]);
  const [customerCode,setCustomerCode] = useState(""); //Coded by Atharva on 20.02.2024
  

  const getDamageDiscDistDetails = async () => {
    
    await DamageDiscService.getDamageDiscDistDetails(userProfile).then((response) => {
      console.log("response", response);
      const customer_name = response.data.data.distributor_details.map((customer) => customer.customer_name);
      //const declaration = response.data.data.flow_declaration.map((fd) => fd.body); //to get output for Dist Detials

      setDistributor(customer_name[0]);
      setFlowDeclaration(response.data.data.flow_declaration);
      setCustomerCode(response.data.data.distributor_details.map((customer) => customer.customer_code)[0]);

    });
  };


  const userId = useSelector(
    (state) => state.dashboard.dashboard.profile_details.user_id
  );

  const handleApproveCheckBox = () => {
    setApproveCheckboxChecked(!approveCheckboxChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //this is used so that whenever page is reloaded , it should directly not Save the data//

    await DamageDiscService.saveDamageDisc(userProfile, customerCode, userId).then(
      (response) => {
        console.log("response", response.data);
        Swal.fire({
          icon: `${response.data.data.error_message}`,
          title: `${response.data.data.message}`,
          text: `${response.data.data.add_message}--${response.data.data.doc_entry_no}`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCancelButton: false,
          showCloseButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "your-custom-class",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/dashboard");
          }
        });
      }

    );
  };
  useEffect(() => {
    console.log("DamageDiscDistDetials");

    getDamageDiscDistDetails();
  }, []); // API call for whenever we enter the page in order to display the details on the screen. 

  const policyDownload = async (e) => {
    const link = document.createElement('a');

    link.href = "https://weikfield-public.s3.ap-south-1.amazonaws.com/Damage+Policy_WF_Final.pdf";
    link.download = "https://weikfield-public.s3.ap-south-1.amazonaws.com/Damage+Policy_WF_Final.pdf";
    link.target = '_blank';
    link.click();
        
  };


  return (
    <div className="row mb-3">
      <div className="col-lg-12">
        <div className="card card-primary border-0">
          <div
            className="card-header "
          >
            Damage Declaration Screen
          </div>
      
              <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="Distributor" className="control-label">
                          Distributor:
                        </label>
                      </div>
                      <div className="col-md-8">
                        <input
                          type="text"
                          name="Distributor"
                          className="form-control"
                          defaultValue={distributor}
                          readOnly 
                        />
                    
                      </div>
                    </div>
              </div>
          {/* Code for content to displayed on the page , coded on 20..02.2024*/}
          <div className="container">   
          {/* CSS for Consent-Header below */}
            <div id="m-head"><p>{flowDeclaration.length > 0 && flowDeclaration[0].title_desc}</p></div>         
              {flowDeclaration && flowDeclaration.map((declaration) => (
              <div id="dsc-body">
                <h4>{declaration.header}</h4>
                <p style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  <span dangerouslySetInnerHTML={{__html:declaration.body}}  />
                </p>
                
              </div>
            ))}
            <div className="form-check">
                  <input
                    id="approveClaim"
                    className="form-check-input"
                    type="checkbox"
                    checked={!approveCheckboxChecked}
                    onChange={handleApproveCheckBox}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="approveClaim"
                  >
                    By Clicking on Save button, you are agreeing to the Terms & Conditions of the Damage Policy of Weikfield Foods Pvt Ltd.
                  </label>

                </div>
          </div>
        </div>
      </div>
    
      <div className="card-body collapse show py-0">
        <div className="column pt-3 col-sm-offset-0">
          <form
            data-toggle="validator"
            role="form"
            className="form-horizontal"
          >
            <div className="row">
              <div className="col-md-12"> 
              </div>


              <div className="col-md-1 mt-2 mt-md-0">
                <button
                  className="btn btn-primary btn-md"
                  disabled={
                    approveCheckboxChecked
                  }
                  onClick={handleSubmit}
                  type="submit"
                >
                  <i className="fa-solid fa-save"></i> Save
                </button>
              </div>
              {/* Download Button added on 29.02.2024 */}
              <div className="col-md-1 mt-1 mt-md-1">
                          <i
                             onClick={(e) => policyDownload(e)}
                             className="fa fa-download"
                             style={{ fontSize: "24px", color: "green" }}
                             aria-hidden="true"
                           ></i>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  )

};
export default DamageDiscComp;
