import { click } from "@testing-library/user-event/dist/click";
import React, { Component, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sortMenuFunction } from "./utils/sortMenu";

import { setMenu } from "../../redux/actions/menuAction";
import Swal from "sweetalert2";
import {
  setAddToCart,
  setOrderDetails,
  setSelectedDistributor,
  setSelectedSalePerson,
  showPopUp,
} from "../../redux/actions/placeOrderAction";
import NDCService from "../../axios/services/api/ndc";
import P2SService from "../../axios/services/api/p2s";
import { setNdcExpiry, setNdcOtp } from "../../redux/actions/ndcAction";
import DamageDiscService from "../../axios/services/api/DamageDisc";
import AuthService from "../../axios/services/api/auth";
const Header = (props) => {
  const [lockConfigs, setLockConfigs] = useState([]);
  const [lockedRoutes, setLockedRoutes] = useState([]); // Map of locked routes
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef(null);

  const userProfile = useSelector((state) => state.userProfile);

  const dashboard = useSelector((state) => state.dashboard.dashboard);

  const addTocart = useSelector((state) => state.placeOrder.addTocart);

  const showPopup = useSelector((state) => state.placeOrder.showPopUp);

  const ndc = useSelector((state) => state.ndc);

  const { otp, expiry_time } = ndc;

  // for p2s
  const p2s = useSelector((state) => state.p2s);

  const { p2sotp, p2sexpiry_time } = p2s;


  const { menu_details, profile_details, show_otp_menu_flag, show_p2s_declare_menu_flag,show_damage_declare_menu_flag } = dashboard;
const showpopUp = async (link) => {
  return new Promise((resolve) => {
    const title = `OOPS! You will lose CART data, Press Exit to come out or Cancel to stay in ${link}`;
    Swal.fire({
      title,
      showDenyButton: true,
      confirmButtonText: "Exit",
      denyButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        if (link === "Place Order") {
          Swal.fire("Item removed from cart", "", "success");
        }

        dispatch(setAddToCart([]));
        dispatch(setOrderDetails("null"));
        dispatch(setSelectedDistributor("null"));
        dispatch(setSelectedSalePerson(""));
        dispatch(showPopUp(false));

        resolve(true); // ✅ return true to parent
      } else if (result.isDenied) {
        resolve(false); // ❌ return false to parent
      }
    });
  });
};

 const showPopUps = async (path) => {
  if (path === "/modifyorder" && !showPopup) {
    dispatch(setAddToCart([]));
    dispatch(setSelectedDistributor("null"));
    dispatch(setSelectedSalePerson(""));
    return true; // ✅ directly allow parent to continue
  } 
  else if (path === "/modifyorder" && showPopup) {
    return await showpopUp("Modify Order");
  } 
  else if (path === "/placeorder" && addTocart.length > 0) {
    return await showpopUp("Place Order");
  } 
  else if (path === "/placeorderitem" && addTocart.length > 0) {
    return await showpopUp("Place Order Item");
  } 
  else {
    return true; // ✅ no popup needed, continue
  }
};

  const toggleClass = () => {
    if (ref.current.classList.contains("show")) {
      ref.current.classList.remove("show");
    } else {
      console.log();
    }
  };


  const checkOTP = async (otp, expiry) => {
    const { value: remark } = await Swal.fire({

      input: "number",
      inputPlaceholder: "Verificiation Code",
      html: "Please enter the Weik-UP-Code! received on WhatsApp or Email registered with Weikfield.",
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Verify',
      confirmButtonColor: '#28a745',
      footer: '<div class="align-left"><font size="2" color="grey">1.On WhatsApp Weikfield is certified with Green Tick<br>2.Check your SPAM/JUNK folder as well for email code.</font></div>'
    });



    if (remark == otp) {
      console.log(remark);
      
      const targetDate = new Date(expiry);
      const currentTime = new Date();
      if (currentTime <= targetDate) {
        
        navigate('/fillndc');
      } else {
        Swal.fire({
          html: "OOPS! Weik-UP-Key expired,check your system date/time",
          type: 'failure',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: 'Close',
          cancelButtonColor: '#dc3545'


        });

      }
    } else {
      Swal.fire({
        html: "OOPS! Wrong Weik-UP-Key entered",
        type: 'failure',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Close',
        cancelButtonColor: '#dc3545'


      });
    }
  };

  const checkOTPP2s = async (p2sotp, p2sexpiry) => {
    const { value: remark } = await Swal.fire({

      input: "number",
      inputPlaceholder: "Verificiation Code",
      html: "Please enter the Weik-UP-Code! received on WhatsApp or Email registered with Weikfield.",
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Verify',
      confirmButtonColor: '#28a745',
      footer: '<div class="align-left"><font size="2" color="grey">1.On WhatsApp Weikfield is certified with Green Tick<br>2.Check your SPAM/JUNK folder as well for email code.</font></div>'
    });

    // console.log("remark", remark);
    // console.log("otp", otp);
    // console.log("expiry_time", expiry_time);

    if (remark == p2sotp) {
      console.log(remark);
      // const targetDate = new Date('2023-06-12 23:10:51.596');
      const targetDate = new Date(p2sexpiry);
      const currentTime = new Date();
      if (currentTime <= targetDate) {
        // Swal.fire("Welcome to create MSSR!");
        navigate('/createp2s');
      } else {
        Swal.fire({
          html: "OOPS! Weik-UP-Key expired,check your system date/time",
          type: 'failure',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: 'Close',
          cancelButtonColor: '#dc3545'


        });

      }
    } else {
      Swal.fire({
        html: "OOPS! Wrong Weik-UP-Key entered",
        type: 'failure',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Close',
        cancelButtonColor: '#dc3545'


      });
    }
  };

  const formatTo12Hour = (timeString) => {
    if (!timeString) return "";

    const [hour, minute] = timeString.split(":"); // ignore seconds
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12; // convert 0 → 12
    return `${h}:${minute} ${ampm}`;
  };

const fetchLockConfig = async () => {
  try {
    const response = await AuthService.getLockStatus(userProfile);
    return response.data.data.order_lock_config; // ✅ this now reaches runCheck()
  } catch (error) {
    console.error("Error fetching lock config:", error);
    return null; // ✅ safe fallback
  }
};

     const showCurrentLockMenu = (lock) => {
      Swal.fire({
        icon: "warning",
        title: `Access Locked`,
        html: `
          <div style="display:flex; justify-content:center; align-items:center; margin-top:10px;">
            <div style="background:#f9f9f9; border:1px solid #e0e0e0; border-radius:12px; padding:15px 20px; text-align:center;">
              <b>${lock.menu_display_name}</b> is currently <span style="color:red;">locked</span>.<br/><br/>
              ⏰ Locked after <b>${formatTo12Hour(lock.lock_timeslot)}</b><br/>
              📅 From <b>Day ${lock.day_from}</b> to <b>Day ${lock.day_to}</b>
            </div>
          </div>
        `,
        confirmButtonText: "Go to Dashboard",
        confirmButtonColor: "#3085d6"
      }).then(() => {
        navigate("/dashboard");
        toggleClass();
      });
    };

    // console.log("menu details", menu_details);
 const checkLockStatus = (configs) => {
  // console.log("configs", configs);
  setLockConfigs(configs);
    const now = new Date();
    const currentDay = now.getDate();
    const currentTime = now.toTimeString().slice(0, 8);
    // console.log("running lock check at", currentTime, "day", currentDay);
    const newLockedRoutes = [];
    configs.forEach((lock) => {
        if (
          lock.status === "Active" &&
          currentDay >= lock.day_from &&
          currentDay <= lock.day_to &&
          currentTime >= lock.lock_timeslot
        ) {
          const lockedMenu = menu_details.find(
            (m) => m.menu_display_name === lock.menu_display_name );

            if (lockedMenu?.menu_href) {
              newLockedRoutes.push(lockedMenu.menu_href);
            }
          if ( lockedMenu?.menu_href === window.location.pathname ) { 
            showCurrentLockMenu(lock);
            }
        }
      });
      // console.log("newLockedRoutes", newLockedRoutes);
    setLockedRoutes(newLockedRoutes);
  }

useEffect(() => {
    if (!menu_details || menu_details.length === 0) return;
    console.log("Setting up lock check interval");
  const runCheck = async () => {
    const data = await fetchLockConfig(); 
    if (data) checkLockStatus(data);
  };

  runCheck();
  const now = new Date();
  const msUntilNextMinute =
    (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

  let intervalId; // ⚡ Declare here so cleanup can access it

  const timeoutId = setTimeout(() => {
    runCheck();
    intervalId = setInterval(runCheck, 60 * 1000); // store the ID
  }, msUntilNextMinute);

  return () => {
    console.log("Cleaning up lock check interval");
    clearTimeout(timeoutId);
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}, [menu_details?.length]);


const handleMenuClick = async (path, item) => {
  const isSamePath = path === item.menu_href;
  const isLocked = lockedRoutes.includes(item.menu_href);

  if (isLocked) {
    const lock = lockConfigs.find(
      (lock) => lock.menu_display_name === item.menu_display_name
    );
    if (lock) {
      Swal.fire({
        icon: "error",
        title: `🚫 ${lock.menu_display_name} Locked`,
        html: `
          <div style="display:flex; justify-content:center; align-items:center; margin-top:10px;">
            <div style="background:#f9f9f9; border:1px solid #e0e0e0; border-radius:12px; padding:15px 20px; text-align:center;">
              <p style="font-size: 17px; color: #dc2626; font-weight: 600;">🚫 Access Restricted</p>
              <p style="font-size: 15px; color: #1f2937;">
                <b>${lock.menu_display_name}</b> is currently locked.
              </p>
              <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 10px 14px; border-radius: 10px; font-size: 14px;">
                <p><b>🔒 Locked After:</b> ${formatTo12Hour(lock.lock_timeslot)}</p>
                <p><b>📅 Available:</b> Day ${lock.day_from}–${lock.day_to} before ${formatTo12Hour(lock.lock_timeslot)}</p>
              </div>
            </div>
          </div>
        `,
        confirmButtonText: "Got It",
        confirmButtonColor: "#2563eb",
        background: "#ffffff",
        width: "460px",
      });
    }
    return; // stop execution if locked
  }

  // ✅ Handle popup confirmation result
  let allow = true;
  if (!isSamePath) {
    allow = await showPopUps(path);
  }

  if (allow) {
    navigate(item.menu_href);
    toggleClass();
  }
};


  const ndcLoginPopup = async () => {

    if (profile_details && profile_details.ndc_completion_flag === "0") {
      console.log("profile data", profile_details)
      await Swal.fire({
        html: 'NDC Entry screen requires <b>Weik-UP-Code Verification</b>.<br>Do you want to continue....?',
        showCancelButton: true,
        confirmButtonText: 'Send Code',
        cancelButtonText: 'Close',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545',
        footer: '<font color="grey">Keep your Mobile Phone & Registered <font color="green">WhatsApp</font> handy </font>'
      }).then((result) => {
        if (result.isConfirmed) {
          NDCService.sendOTP(userProfile).then(
            (response) => {
              console.log("opt api ndc ", response.data.data);
              // dispatch(setNdcOtp(response.data.data.otp))&&
              // dispatch(setNdcExpiry(response.data.data.expiry_timestamp))&& 
              checkOTP(response.data.data.otp, response.data.data.expiry_timestamp);

            }
          );
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
    }
     else {
      Swal.fire("NDC is already submitted for the Open Period.")
    }


  };
 //06-07/12/023
  const P2SLoginPopup = async () => {

    // if (profile_details && profile_details.ndc_completion_flag === "0") {
    //   console.log("profile data2", profile_details.ndc_completion_flag)
      await Swal.fire({
        html: 'P2S Entry screen requires <b>Weik-UP-Code Verification</b>.<br>Do you want to continue....?',
        showCancelButton: true,
        confirmButtonText: 'Send Code1',
        cancelButtonText: 'Close',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545',
        footer: '<font color="grey">Keep your Mobile Phone & Registered <font color="green">WhatsApp</font> handy </font>'
      }).then((result) => {
        if (result.isConfirmed) {
          P2SService.sendP2SOTP(userProfile).then(
            
            (response) => {
              console.log("opt api p2s-- ", response.data.data);
              // dispatch(setNdcOtp(response.data.data.otp))&&
              // dispatch(setNdcExpiry(response.data.data.expiry_timestamp))&& 
              checkOTPP2s(response.data.data.otp, response.data.data.expiry_timestamp);
              // console.log("userdat",userProfile)
            }
          );
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
    // }
    //  else {
    //   Swal.fire("P2S is already submitted for the Open Period.")
    // }


  }

  //Added on 28.02.2024 @ 6:15 PM by Atharva

  const checkOTPDamageDisc = async (DamageDiscotp, DamageDiscexpiry) => {
    const { value: enteredOtp } = await Swal.fire({
     
      input: "number",
      inputPlaceholder: "Verification Code",
      html: "Please enter the Weik-UP-Code! received on WhatsApp or Email registered with Weikfield.",
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Verify',
      confirmButtonColor: '#28a745',
      footer: '<div class="align-left"><font size="2" color="grey">1.On WhatsApp Weikfield is certified with Green Tick<br>2.Check your SPAM/JUNK folder as well for email code.</font></div>'
    });
     

    if (enteredOtp == DamageDiscotp) {
      console.log(enteredOtp);

      const targetDate = new Date(DamageDiscexpiry);
      const currentTime = new Date();
      if (currentTime <= targetDate) {
        //Swal.fire("welcome to damage declaration !");
       navigate('/damageDisc');
      } else {
        Swal.fire({
          html: "OOPS ! Weik-UP-Key expired,check your system date/time",
          type: 'failure',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: 'Close',
          cancelButtonColor: '#dc3545'

        });

      }
    } else {
      Swal.fire({
        html: "OOPS! Wrong Weik-UP-Key entered",
        type: 'failure',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Close',
        cancelButtonColor: '#dc3545'


    });

 };

};

const DamageDiscLoginPopup = async () => {
    await Swal.fire({
      html: 'Damage Declaration  screen requires <b>Weik-UP-Code Verification</b>.<br>Do you want to continue....?',
      showCancelButton: true,
      confirmButtonText: 'Send Code',
      cancelButtonText: 'Close',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      footer: '<font color="grey">Keep your Mobile Phone & Registered <font color="green">WhatsApp</font> handy </font>'
    }).then((result) => {
      if (result.isConfirmed){
        DamageDiscService.sendDamageDiscOTP(userProfile).then(

          (response) => {
            console.log("opt api DamageDisc-- ", response.data.data);
            checkOTPDamageDisc(response.data.data.otp, response.data.data.expiry_timestamp);
          }
        );
      } else if(result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })


  }

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-light fixed-top"
      id="mainNav"
    >
      {console.log("addTocart", addTocart)}
      <Link className="navbar-brand" to="/dashboard">
        <img src="assets/images/Weikfield-Logo.svg" title="Logo" height="56" />
      </Link>
      <button
        className="navbar-toggler navbar-toggler-right"
        type="button"
        data-toggle="collapse"
        data-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i className="fa fa-fw fa-bars"></i>
      </button>
      <div className="collapse navbar-collapse" ref={ref} id="navbarResponsive">
        <ul className="navbar-nav sidenav-toggler">
          <li className="nav-item">
            <a className="nav-link" id="sidenavToggler">
              <i className="fa fa-fw fa-bars"></i>
            </a>
          </li>
        </ul>
         <ul className="navbar-nav navbar-sidenav" id="exampleAccordion">
          {menu_details &&
            menu_details.map((item, index) => {
              const isLockedPath = lockedRoutes.includes(item.menu_href); // check if path is locked
              const isActive = window.location.pathname === item.menu_href;

              return (
                <li
                  key={index}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  title={
                    isLockedPath
                      ? `${item.menu_display_name} is locked for this timeslot`
                      : item.menu_display_name
                  }
                  style={{
                    opacity: isLockedPath ? 0.5 : 1,
                    backgroundColor: isLockedPath ? "#d3d3d3" : "",
                    cursor: isLockedPath ? "not-allowed" : "pointer"
                  }}
                >
                  <Link
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuClick(window.location.pathname, item);
                    }}
                  >
                    <i className={item.menu_icon}></i>
                    <span className="nav-link-text">{item.menu_display_name}</span>
                  </Link>
                </li>
              );
            })}
            {/* <li  // place Order Item router
                onClick={toggleClass}
                className={`nav-item ${window.location.pathname === "/placeorderitem" ? "active" : ""}`}
                data-toggle="tooltip"
                data-placement="right"
                title="Place Order (Item)"
              >
                <Link
                  className="nav-link"
                  to="/placeorderitem"
                  onClick={() => showPopUps(window.location.pathname)}
                >
                  <i className="fa fa-list-alt"></i>
                  <span className="nav-link-text"> Place Order (Item) </span>
                </Link>
              </li>  */}
            
          {show_otp_menu_flag ===1 &&
            <li
              onClick={toggleClass}
              className="nav-item"
              data-toggle="tooltip"
              data-placement="right"
              title={"NDC"}
            >
              <span
                className="nav-link"
                // to={"#"}
                onClick={() => ndcLoginPopup()}
              >
                <i className="fa fa-inr"></i>
                <span className="nav-link-text">&nbsp;Create NDC</span>
              </span>
            </li>
          }

          {/* // 05/12/023 add new code */}
          {show_p2s_declare_menu_flag === 1 &&
            <li
              onClick={toggleClass}
              className="nav-item"
              data-toggle="tooltip"
              data-placement="right"
              title={"P2S"}
            >
              <span
                className="nav-link"
                // to={"#"}
                onClick={() => P2SLoginPopup()}
              >
                <i className="fas fa-lock"></i>
                <span className="nav-link-text">&nbsp;Declare P2S</span>
              </span>
            </li>
          }

          {/* Added on 28.02.2024 by Atharva */}
          {show_damage_declare_menu_flag ===1 &&  
          
            <li
              onClick={toggleClass}
              className="nav-item"
              data-toggle="tooltip"
              data-placement="right"
              title={"Sign Damage Policy"}
            >
              <span 
                className="nav-link"
                onClick={() => DamageDiscLoginPopup()}
              >
                <i className="fas fa-file-signature" ></i>
                <span className="nav-link-text">&nbsp;Sign Damage Policy</span>
              </span>
            </li>
          }

        </ul>
        <ul className="navbar-nav ml-auto" onClick={toggleClass}>
          <li className="nav-item dropdown profile_details_drop">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="profile_img">
                <div className="prfil-img">
                  <img
                    src="assets/images/sc1.jpg"
                    width="40px"
                    className="rounded-circle"
                    alt=""
                  />
                </div>
                <div className="user-name">
                  <p>{profile_details && profile_details.user_name}</p>
                  <span>{profile_details && profile_details.user_id}</span>
                </div>
              </div>
            </a>
            <ul className="dropdown-menu drp-mnu">
              {/* <li>
                <Link
                  to="/myprofile"
                  onClick={() => showPopUps(window.location.pathname)}
                >
                  <i className="fa fa-user"></i> Manage Profile
                </Link>
              </li> */}
              <li>
                <Link to="/logout">
                  <i className="fa fa-sign-out"></i> Logout
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
