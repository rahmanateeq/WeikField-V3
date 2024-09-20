import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import DamageDiscViewSearchTable from "../../components/DamageDisc/DamageDiscView/DamageDiscViewSearchTable";
import { ColorRing } from "react-loader-spinner";

	import { getDamageDiscDetailsLines, selectedDamageDiscPagesNumber, setDdViewHeaderList,
		setDamageDiscTableLoading,   setDdViewSearchHeaderTotalRecord } from "../../redux/actions/damageDiscAction";

	import ViewDamageDiscSearchHeader from "../../components/DamageDisc/DamageDiscView/DamageDiscViewSearchHeader";
const DamageDiscViewPage = () => {

	const userProfile = useSelector((state) => state.userProfile);
	const damagedisc = useSelector((state) => state.damagedisc);
    const {DamageDiscLoading} = damagedisc;

 
	const dispatch = useDispatch()
	const navigate = useNavigate()

	  useEffect(() => {
		if (userProfile.usertype !== "null") {
			console.log("inside damagedeclaration")
			///////////////////////////////////
			dispatch(setDdViewHeaderList(null));
			dispatch(getDamageDiscDetailsLines(null));
			dispatch(setDamageDiscTableLoading(false));
			dispatch(setDdViewSearchHeaderTotalRecord((null)));
			dispatch(selectedDamageDiscPagesNumber(0));

		}else {
			navigate("/");
		}
	  }, []);


	return (
		<>
		<Helmet title="DamageDisc View" />
			<div className="content-wrapper">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<ol className="breadcrumb">
								<li className="breadcrumb-item">
									{" "}
									<Link to="/dashboard">Dashboard</Link>
								</li>
								<li className="breadcrumb-item active">View Signed Damage Policy</li>
							</ol>
							<div className="row">
								{/* <div className="col-lg-12 mb-2">
									<h4>List of Signed Damage Policy</h4>
								</div> */}
							</div>
							 
							 <ViewDamageDiscSearchHeader/>
							 {DamageDiscLoading && <ColorRing
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
							<DamageDiscViewSearchTable />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DamageDiscViewPage;
