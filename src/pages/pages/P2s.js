import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NdcSearchBar from "../../components/Ndc/NdcSerchBar";
import P2sSerchbar from "../../components/P2S/P2sSerchBar";

const P2s = (props) => {
	const navigate = useNavigate();
  
	const userProfile = useSelector((state) => state.userProfile);

  useLayoutEffect(() => {
    // handle css when component loads
    document.body.classList.remove("loginBG");
    document.body.classList.add(
      "fixed-nav",
      "sticky-footer",
      "sidenav-toggled"
    );
  }, []);

  const [showComponent,setShowComponent] = useState(false)
  useEffect(() => {
	if (userProfile.usertype !== "null") {
		window.scrollTo({ top: 0, behavior: "smooth" });
		setShowComponent(true)
	} else {
		navigate("/");
	}
}, []);

  return (
    <>
		<Helmet title="P2S" />
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
								<li className="breadcrumb-item active">Declare P2S</li>
							</ol>
							<div className="row">
								{/* <div className="col-lg-12 mb-2">
									<h4>List of P2S </h4>
								</div> */}
							</div>
							{/* <NdcSearchBar  /> */}
                            <P2sSerchbar />
						</div>
					</div>
				</div>
			</div>
}
		</>
  );
};

export default P2s;
