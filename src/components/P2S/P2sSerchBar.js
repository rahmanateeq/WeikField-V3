import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import P2SService from "../../axios/services/api/p2s";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { maxLengthCheck } from "../../pages/pages/utils/maxLengthInput";
import { toast, Toaster } from "react-hot-toast";
function P2sSearchBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Collecting data from Redux store
  const userProfile = useSelector((state) => state.userProfile);

  const userId = useSelector(
    (state) => state.dashboard.dashboard.profile_details.user_id
  );

  const [enableSave, setEnableSave] = useState(true);
  const [detailRemark, setDetailRemark] = useState(0);
  const [amount, setAmount] = useState(0);
  const [distributor, setDistributor] = useState("");
  const [p2sType, setP2sType] = useState([]);
  const [selectedFileUpload, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ImgFile, setImgFile] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [approveCheckboxChecked, setApproveCheckboxChecked] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);

  const getuploadFileData = async () => {
    await P2SService.getP2SDistDetails(userProfile).then((response) => {
      console.log("response", response);
      const customer_name = response.data.data.distributor_details.map(
        (customer) => customer.customer_name
      );

      console.log("cutomer name", customer_name);
      setDistributor(customer_name[0]);
      setP2sType(response.data.p2s_types);
      console.log("p2stypes", p2sType);
      setFormData(response.data.p2s_types);
    });
    console.log("distributor --", distributor);
  };

  const handleInputChange = (p2sTypeId, value, fieldName) => {
    const updatedValues = formData.map((p2s) => {
      if (p2s.p2s_type_id === p2sTypeId) {
        return { ...p2s, [fieldName]: value };
      }
      return p2s;
    });
    setFormData(updatedValues);
  };
  // const [selectedUpFile, setSelectedUpFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileChange = async (event) => {
    if (approveCheckboxChecked) {
      Swal.fire("Please check the checkbox before uploading the image.");
      return;
    }
    setSelectedFile(null);
    setErrorMessage(null);
    setEnableSave(true);
    const selectedFile = event.target.files[0];
    // File size validation
    const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
    if (selectedFile.size > maxSizeInBytes) {
      Swal.fire("File size exceeds the maximum allowed limit (4MB).");
      return;
    }

    // File type validation
    const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedFileTypes.includes(selectedFile.type)) {
      Swal.fire("Invalid file type. Please upload a PDF, JPEG or PNG image.");
      return;
    }

    setSelectedFile(selectedFile.name);

    // Perform the rest of the file handling tasks and upload
    await P2SService.uploadFile(userProfile, selectedFile)
      .then((response) => {
        setImgFile(response.data.data);
        console.log("hello", response.data.error_code);
        if (response.data.error_code === 0) {
          setEnableSave(false); //false : enable , true: disable
        } else {
          toast.error("File Not Uploaded.");
          setEnableSave(true);
        }
      })
      .catch((error) => {
        console.log({ message: error });
      });
  };
  const handleNoClaimCheckbox = () => {
    setIsCheckboxChecked(!isCheckboxChecked);

    // const resetInputValues = formData.map(() => 0);
    // setFormData(resetInputValues);
  };

  const handleApproveCheckBox = () => {
    setApproveCheckboxChecked(!approveCheckboxChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ImgFile !== "") {
      console.log("in if condition");
      await P2SService.saveP2S(userProfile, userId, ImgFile).then(
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
    } else {
      Swal.fire({
        icon: "warning",
        title: "NO DATA FOUND",
        text: "Please fill details and amount ",
        showCancelButton: false,
        showCloseButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "your-custom-class",
        },
      });
    }
  };

  useEffect(() => {
    getuploadFileData();
    console.log("p2stypes", p2sType);
  }, []);

  return (
    <div className="row mb-3">
      <div className="col-lg-12">
        <div className="card card-primary border-0">
          <div
            className="card-header "
            // data-toggle="collapse"
            // data-target="#collapseOne"
            // aria-expanded="true"
          >
            P2S Declaration Screen
          </div>
          <div className="card-body collapse show py-0">
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
                </div>
                <div className="form-group row">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-12">
                        {/* <input
                          id="noClaim"
                          className="form-check-label"
                          type="checkbox"
                          checked={isCheckboxChecked}
                          onChange={handleNoClaimCheckbox}
                        /> */}
                        {/* <label htmlFor="noclaim" className="control-label">
                          No Claim Pending
                        </label> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
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
                        I confirm that i will not be submitting any Damage claim to the company, i will also upload my declaration on my letterhead duly signed & sealed.
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="fileInput"
                      className={`btn btn btn-md ${
                        approveCheckboxChecked ? "btn-disabled" : "btn-primary"
                      }`}
                    >
                      <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        disabled={approveCheckboxChecked}
                        onChange={handleFileChange}
                      />
                      <i className="fa fa-upload"></i> Upload file
                    </label>
                    <span
                      className="ml-3"
                      style={{ fontSize: "12px", lineHeight: "40px" }}
                    >
                      {selectedFileUpload && selectedFileUpload}
                    </span>
                    <br />
                    {errorMessage && (
                      <span
                        style={{
                          fontSize: "12px",
                          lineHeight: "40px",
                          color: "red",
                        }}
                      >
                        {errorMessage}
                      </span>
                    )}
                  </div>
                  <div className="col-md-6 mt-2 mt-md-0">
                    <button
                      className="btn btn-primary btn-md"
                      disabled={
                        enableSave ||
                        approveCheckboxChecked ||
                        !selectedFileUpload
                      }
                      onClick={handleSubmit}
                      type="submit"
                    >
                      <i className="fa-solid fa-save"></i> Save
                    </button>
                  </div>
                </div>

                {/* <div
                  className="col-md-8 text-right"
                  style={{ position: "relative" }}
                >
                  
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default P2sSearchBar;
