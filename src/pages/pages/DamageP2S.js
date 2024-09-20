import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import P2SViewSearchBar from "../../components/DamageP2S/P2SViewSearchBar";
import P2SViewOrderTable from "../../components/DamageP2S/P2SViewOrderTable";
import { ColorRing } from "react-loader-spinner";
import { setP2SOtp, setP2SExpiry, setP2sList, getP2SDetailsLines, 
	setP2sTableLoading, setViewP2sTotalRecord, selectedP2SPagesNumber
} from "../../redux/actions/p2sAction";


const DamageP2S = () => {

	const userProfile = useSelector((state) => state.userProfile);
	const p2s = useSelector((state) => state.p2s);
	const {p2sLoading} = p2s;

  const dispatch = useDispatch()
	const navigate = useNavigate()
	useEffect(() => {
		if (userProfile.usertype !== "null") {
			console.log("inside p2s",userProfile.usertype)
		  ///////////////////////////////
		  dispatch(setP2SExpiry(null));
		  dispatch(setP2SOtp(null));
		  dispatch(setP2sList(null));
		  dispatch(getP2SDetailsLines(null));
		  dispatch(setP2sTableLoading(false));
		  dispatch(setViewP2sTotalRecord(null));
		  dispatch(selectedP2SPagesNumber(0));
	
		} else {
		  navigate("/");
		}
	  }, []);

	return (
		<>
		<Helmet title="Ndc View" />
			<div className="content-wrapper">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<ol className="breadcrumb">
								<li className="breadcrumb-item">
									{" "}
									<Link to="/dashboard">Dashboard</Link>
								</li>
								<li className="breadcrumb-item active">P2S View</li>
							</ol>
							{/* <div className="row">
								<div className="col-lg-12 mb-2">
									<h4>List of P2S</h4>
								</div>
							</div> */}
							 <P2SViewSearchBar/> 
							 {p2sLoading && <ColorRing
											visible={true}
											height="80"
											width="100%"
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
										/>}
							<P2SViewOrderTable />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DamageP2S;
