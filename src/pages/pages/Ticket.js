import React, { useState, useLayoutEffect, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import TicketService from "../../axios/services/api/ticketService";
import Swal from "sweetalert2";
import { ColorRing } from "react-loader-spinner";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import "react-vertical-timeline-component/style.min.css";

import { createRoot } from 'react-dom/client'; // Import createRoot

const Ticket = () => {
  const navigate = useNavigate();
  const [showComponent,setShowComponent] = useState(false)
  const [modules, setModules] = useState(0);
  const [distributor, setDistributor] = useState(0);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedDistributer, setSelectedDistributer] = useState('');
  const [getTicketList, setGetTicketList] = useState([])
  const [loadingMD, setLoadingMD] = useState(false);
  const [loadingDB, setLoadingDB] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadinglist, setloadingList] = useState(false)
  const userProfile = useSelector((state) => state.userProfile);
  const userId = localStorage.getItem("username")

  console.log("userId",userId)
  const getModule = async () => {
    try {
      setLoadingMD(true)
      const res = await TicketService.getModules(userProfile);
        setModules(res.data.data.module_lov)
    } catch (error) {
      console.error("Error fetching module:", error);
    } finally {
      setLoadingMD(false)
    }
  };
  const getDistributor = async () => {
    try {
      setLoadingDB(true)
      const res = await TicketService.getSRDistributor(userProfile);
      setDistributor(res.data.data.distributor_lov);
    } catch (error) {
      console.error("Error fetching distributor:", error);
    } finally {
      setLoadingDB(false)
    }
  };

  const resetSearch = () => {
      setSelectedDistributer(0)
      setSelectedModule(0)
  }

 
  const setStatus = async (sr_code, id) => {
   let actionFlag = id === 0 ? "0" : "1"
    let label = id === 0 ? "Remark for Approval" : "Remark for Rejection";
    let title = id === 0 ? "Approval" : "Rejection";
    const { value: remark } = await Swal.fire({
      title: `${title}`,  // Main title
      text: "Please provide a remark for the action.", 
      input: "text",
      inputLabel: `${label}`,
      inputPlaceholder: "Please Enter Remark",
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      allowOutsideClick: false,
      customClass: {
        input: 'custom-input',
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button'
      },
      inputValidator: (value) => {
        if (!value) {
          return "You need to write a remark!";
        } 
        return null;
      }
    });
  
    if (remark) {
      const data = {
        sr_code: sr_code,
        actionFlag: actionFlag,
        remarks: remark
      };
  
      try {
        const res = await TicketService.ticketApproval(userProfile, data);
  
        // Check if response is successful and display appropriate message
        if (res ) {
          const srStateChangeResp = res.data.data.sr_state_change_resp;
          if (Object.keys(srStateChangeResp).length !== 0) {
            setloadingList(true)
            Swal.fire({
              title: `${srStateChangeResp.sr_no}`,

              text: `${srStateChangeResp.message}`,
              icon: "success",
              confirmButtonText: "OK"
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "There was an issue processing the request.",
              icon: "error",
              confirmButtonText: "OK"
            });
          }
        } else {
          Swal.fire({
            title: "Error",
            text: "Unexpected response from the server.",
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to complete the action. Please try again.",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    }
  };
  
const viewAllTicketList = async () =>{
  setLoading(true)
  try{
    const response = await TicketService.viewAllTicket(userProfile, selectedModule )
    setGetTicketList(response.data.data.view_sr_grid)
    setloadingList(false)
  }catch{
      console.log("error in fetching ticket List")
  }finally{
      setLoading(false)
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    viewAllTicketList()
  };

  useEffect(() =>{

    if(loadinglist){
      viewAllTicketList()

    }

  },[loadinglist])
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    console.log("in create", selectedModule, selectedDistributer);
  
    Swal.fire({
      title: 'Enter Justification',
      input: 'textarea',
      inputPlaceholder: 'Enter your justification here...',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter some justification!';
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const justification = result.value;
        const data = {
          mod_code: selectedModule,
          cust_code: selectedDistributer,
          user_remarks: justification,
        };
  
        try {
          const res = await TicketService.saveTicket(userProfile, data);

          const { error_code, data: { sr_save_resp } } = res.data;
  
          if (sr_save_resp.error_message === "success") {
            setloadingList(true)
            Swal.fire({
              title: `Service Request #${sr_save_resp.sr_no}`,
              text: sr_save_resp.message,
              icon: 'success',  // Show success icon
              confirmButtonText: 'OK'
            });
          } else {
            // Error Swal
            Swal.fire({
              title: 'Error',
              text: sr_save_resp.message || 'An error occurred while raising the ticket.',
              icon: 'error',  // Show error icon
              confirmButtonText: 'OK'
            });
          }
        } catch (error) {
          // Error handling if API request fails
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while raising the ticket.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          console.error("Error while creating ticket:", error);
        }
      }
    });
  };
  

  useLayoutEffect(() => {
    // handle css when component loads
    document.body.classList.remove("loginBG");
    document.body.classList.add(
      "fixed-nav",
      "sticky-footer",
      "sidenav-toggled"
    );
  }, []);
  useEffect(() => {
    if (userProfile.usertype !== "null") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setShowComponent(true)
      getModule()
      getDistributor()
    } else {
      navigate("/");
    }
  }, []);


  const renderTimeline = (timeLineGrid) => {
    const sortedTimeline = [...timeLineGrid].sort((a, b) => a.steps - b.steps);

    return (
      <VerticalTimeline>
        {sortedTimeline.map((item, index) => {
          // Example color logic for different statuses
          const backgroundColor = item.last_node === "1" 
            ? "rgba(76, 175, 80, 0.7)" 
            : "rgba(211, 211, 211, 0.7)"; // Light green for 1, light gray otherwise
          const iconBackgroundColor = item.last_node === "1" 
            ? "rgba(76, 175, 80, 0.7)" 
            : "rgba(255, 0, 0, 0.5)"; // Light green for 1, light red otherwise
  
          return (
            <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element--work"
            contentStyle={{
              background: backgroundColor,
              color: '#fff',
              border: '2px solid red'
            }}
            contentArrowStyle={{ borderRight: `9px solid ${iconBackgroundColor}` }}
            date={
              <span style={{ color: '#000'}}>
                {item.rec_timestamp.split(" ")[0]}<br />
                {item.rec_timestamp.split(" ")[1]} {/* Shows the time */}
              </span>
            }
            iconStyle={{ background: iconBackgroundColor, color: '#fff' }}
          >
            <h5 className="vertical-timeline-element-subtitle" style={{ color: '#000' }}>Name: {item.emp_name}</h5>
            <h5 className="vertical-timeline-element-subtitle" style={{ color: '#000' }}>{item.flow_details}</h5>
            <p style={{ backgroundColor: 'rgb(76, 175, 80)', color: '#000', padding: '4px' }}>
              {item.remarks.toUpperCase()}
            </p>
          </VerticalTimelineElement>
          );
        })}
      </VerticalTimeline>
    );
  };
  
  
  const getTimeline = async (sr_code) => {
      console.log("ticket sr_code", sr_code);
  
      try {
          const response = await TicketService.viewTimeline(userProfile, sr_code);
          console.log("response", response);
          const timeLineGrid = response.data.data.view_timeline_grid;
          console.log("timeLineGrid", timeLineGrid);
  
          if (timeLineGrid.length > 0) {
            const modalWidth = window.innerWidth >= 768 ? '900px' : '';
              Swal.fire({
                  title: `Timeline for ${sr_code}`,
                  html: `<div id="timeline-container" style="height: 550px; overflow-y: auto; scrollbar-width: thin; background-color: rgba(211, 211, 211, 0.7);"></div>`, // Create a container for the timeline
                  width: modalWidth, // Adjust the modal width if needed
                  showCloseButton: true,
                  showConfirmButton: false,
                  allowOutsideClick: false,
                  didOpen: () => {
                      const timelineContainer = document.getElementById('timeline-container');
                      const root = createRoot(timelineContainer);
    
                      // Render the timeline inside the container
                      root.render(renderTimeline(timeLineGrid));
                  }
              });
          } else {
              Swal.fire({
                  icon: 'info',
                  title: 'No Timeline Available',
                  text: 'There is no timeline chart available for this SR code.',
                  confirmButtonText: 'Okay',
              });
          }
  
      } catch (error) {
          console.error("Error fetching timeline", error);
  
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Something went wrong. Please try again.',
              confirmButtonText: 'Okay',
          });
      }
  };

  return (
    <>
		<Helmet title="Create Ticket" />
		{showComponent &&
			<div className="content-wrapper">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<ol className="breadcrumb">
								<li className="breadcrumb-item">
									{" "}
									<Link to="/dashboard">Dashboard</Link>
								</li>
								<li className="breadcrumb-item active">Ticket</li>
							</ol>
							<div className="row">
              {/* <div className="col-lg-12 mb-2">
									<h4>Tickets</h4>
								</div> */}
							</div>
              {/* search bar started */}
							<div className="row mb-3">
                <div className="col-lg-12">
                  <div className="card card-primary border-0">
                    <div
                      className="card-header collapsepanel"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                    >
                      Create Tickets
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
                                  <label htmlFor="ModuleName" className="control-label">
                                    Module:
                                  </label>
                                </div>
                                <div className="col-md-8">
                                  <select
                                    name="ModuleName"
                                    className="form-control selectpicker"
                                    data-live-search="true"
                                    onChange={(e) =>
                                      setSelectedModule(e.target.value)
                                    }
                                    required
                                    disabled={loadingMD}

                                  >
                                    {loadingMD ? (
                                        <option>Loading...</option>
                                      ) : (
                                        <>
                                        
                                    <option value={''}>Show All</option>
                                      {modules && modules.map((md, index) => (
                                        <option key={index} value={md.opt_id} >
                                          {md.opt_value}
                                        </option>
                                      ))}
                                      </>
                                      )}
                                    
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <div className="col-md-4">
                                  <label
                                    htmlFor="DistributorName"
                                    className="control-label"
                                  >
                                    Distributor :
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
                                    disabled={loadingDB}
                                  >
                                    {loadingDB ? (
                                        <option>Loading...</option>
                                      ) : (
                                        <>
                                          <option value={''}>Show All</option>
                                          {distributor && distributor.map((dist, index) => (
                                            <option key={index} value={dist.customer_code}>
                                              {dist.customer_name}
                                            </option>
                                          ))}
                                        </>
                                      )}
                                  </select>
                                </div>
                              </div>
                            </div>
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
                                    onClick={(e) =>handleCreateTicket(e)}
                                    disabled={!selectedModule || !selectedDistributer}
                                    className=" btn btn-primary btn-md"
                                  
                                  >  <span className="mr-1">

                                    <i className="fa fa-plus"></i>
                                  </span>
                                    Create Ticket 
                                  </button>&nbsp;
                                  <button
                                  disabled={!selectedModule }
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="btn btn-primary  btn-md"
                                    data-toggle="collapse"
                                          data-target="#collapseOne"
                                          aria-expanded="false"
                                  > 
                                  <span className="mr-1">
                                    <i className="fa fa-eye"></i>
                                  </span>
                                    View 
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
            {/*search bar ended */}
            {/* Table started */}
            <div className="card border-0 rounded-0 mb-3">
              <div className="card-body">
              {loading ? (
                         <div 
                         style={{
                          backgroundColor: 'white',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '20%', // This makes the div take the full height of the viewport
                          overflow: 'hidden' // Prevent overflow and scrolling
                        }}
                      >
                        
                          <ColorRing
                          visible={true}
                          height="100"
                          width="100"
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
                      </div>
                       ) : (
                        
                  <div className="table-responsive">
                  <table
                    className="table table-bordered"
                    id="viewDataTable"
                    width="100%"
                    cellSpacing="0"
                  >
                    <thead>
                      <tr>
                        <th >Ticket No</th>
                        <th style={{minWidth: "100px", textAlign: "center" }}>Customer Code</th>
                        <th style={{minWidth: "100px", textAlign: "center" }}>Customer Name</th>     
                      <th style={{ minWidth: "100px",  textAlign: "center"  }}>Created At</th>  
                      <th style={{ minWidth: "100px" ,textAlign: "center"}}>Status</th> 
                      </tr>
                    </thead>
                    <tbody>
                   
                      {getTicketList &&
                        getTicketList.map((ticket, index) => (
                          <tr key={index}>
                            <td>
                              <a
                                onClick={() => getTimeline(ticket.sr_code)}
                                className="text-green"
                                href="#viewndcorderpop"
                                data-toggle="modal"
                                data-tooltip="tooltip"
                                title="View ticket"
                              >
                                {ticket.sr_code}
                              </a>
                            </td>

                            <td style={{ textAlign: "center" }}>
                              {ticket.customer_code}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {ticket.customer_name}
                            </td>
                            <td style={{ textAlign: "center",cursor : "pointer" }} title={ticket.created}>
                              {ticket.created.split(" ")[0]} {/* Show only the date */}
                            </td>

                            <td style={{ textAlign: "center" }}>
                            {/* Conditionally render buttons or status */}
                            {(ticket.status_flag === "O"  && ticket.approver_uid === userId) ? (
                              <>
                                <button
                                  
                                    onClick={() => setStatus(ticket.sr_code, 0)}
                                    // type="submit"
                                    className="btn btn-dash-primary btn-sm mr-2">
                                    <i className="fa-solid fa-check"></i>
                                  </button>
                                  <button
                                    // type="reset"
                                    onClick={() => setStatus(ticket.sr_code, 1)}
                                    className="btn btn-dash-danger btn-sm mr-2">
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                              </>
                            ) : (
                              <span>{ticket.status}</span> // Show status if not "O"
                            )}
                          </td>
                          </tr>
                        ))}

                      {getTicketList.length === 0 && (
                        <tr>
                          <td ></td>
                          <td style={{minWidth: "100px", textAlign: "center" }}></td>
                          
                          <td className="text-nowrap " style={{minWidth: "100px", textAlign: "center"}}><h5> No data found </h5></td>
                          
                          <td style={{minWidth: "100px", textAlign: "center" }}></td>
                          <td style={{minWidth: "100px", textAlign: "center" }}></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            </div>
            {/* table end */}
						</div>
					</div>
				</div>
			</div>
}
		</>
  )
}

export default Ticket