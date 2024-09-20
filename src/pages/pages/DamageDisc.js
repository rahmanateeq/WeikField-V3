// //Code written by Atharva on 14.02.2024 

import React, {useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import DamageDiscComp from "../../components/DamageDisc/DamageDiscComp";

const DamageDiscPage= (props) => {
    const navigate = useNavigate();

    const userProfile = useSelector((state) => state.userProfile);
    console.log("userProfile", userProfile);

    useLayoutEffect(() => {

        document.body.classList.remove("loginBG");
        document.body.classList.add(
            "fixed-nav",
            "sticky-footer",
            "sidenav-toggled"
        );
     }, []);
    
     const [showComponent, setShowComponent] = useState(false)
     useEffect(() => {
        if (userProfile.usertype !== "null") {
            window.scrollTo({ top: 0, behaviour: "smooth" });
            setShowComponent(true)
        } else {
            navigate("/");
        }
     }, []);
    
      return (
        <>
            <Helmet title="DamageDiscPage" />
            { showComponent && 
                <div className="content-wrapper">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        {" "}
                                        <Link to="/dashboard">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Damage Disclaimer</li>
                                </ol>
                                <div className="row">
                                    <div className="col-lg-12 mb-2">
                                        <h4> Create Damage Declaration </h4>
                                    </div>
                                </div>
    
                                <DamageDiscComp />
                            </div>
                        </div>
                    </div>
                </div>
    }
            </>
      );
    };



export default  DamageDiscPage;
