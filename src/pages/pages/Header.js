import { click } from "@testing-library/user-event/dist/click";
import React, { Component, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sortMenuFunction } from "./utils/sortMenu";

import { setMenu } from "../../redux/actions/menuAction";
import Swal from "sweetalert2";
import {
  setAddToCart,
  setSelectedDistributor,
  setSelectedSalePerson,
  showPopUp,
} from "../../redux/actions/placeOrderAction";
import NDCService from "../../axios/services/api/ndc";
import P2SService from "../../axios/services/api/p2s";
import { setNdcExpiry, setNdcOtp } from "../../redux/actions/ndcAction";
import DamageDiscService from "../../axios/services/api/DamageDisc";

const Header = (props) => {
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
    let title = `OOPS! You will loose CART data,Press Exit to come out or Cancel to be in ${link}`;
    Swal.fire({
      title: title,
      showDenyButton: true,
      confirmButtonText: "Exit",
      denyButtonText: `Cancel`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        {
          link === "Place Order" &&
            Swal.fire("Item removed from cart", "", "success");
        }
        dispatch(setAddToCart([]));
        dispatch(setSelectedDistributor("null"));
        dispatch(setSelectedSalePerson(""));
        dispatch(showPopUp(false));
      } else if (result.isDenied) {
        window.history.back();
      }
    });
    console.log(window.location.pathname);
  };

  const showPopUps = (path) => {
    if (path === "/modifyorder" && !showPopup) {
      dispatch(setAddToCart([]));
      dispatch(setSelectedDistributor("null"));
      dispatch(setSelectedSalePerson(""));
      return;
    } else if (path === "/modifyorder" && showPopup) {
      showpopUp("Modify Order");
    } else if (path === "/placeorder" && addTocart.length > 0) {
      showpopUp("Place Order");
    } else {
      return;
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
      {console.log(addTocart)}
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
          {/* {console.log("employees - menu_details", menu)} */}
          {menu_details &&
            menu_details.map((item, index) => (
              <li
                onClick={toggleClass}
                key={index}
                className={`nav-item ${window.location.pathname === `${item.menu_href}`
                    ? "active"
                    : ""
                  }`}
                data-toggle="tooltip"
                data-placement="right"
                title={item.menu_display_name}
              >
                <Link
                  className="nav-link"
                  to={item.menu_href}
                  onClick={() => showPopUps(window.location.pathname)}
                >
                  {/* fa fa-fw  */}
                  <i className={`${item.menu_icon}`}></i>
                  <span className="nav-link-text">
                    {" "}
                    {item.menu_display_name}
                  </span>
                </Link>
              </li>
            ))}
            
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
