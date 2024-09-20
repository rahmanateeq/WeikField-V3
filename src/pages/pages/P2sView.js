// import React, { useEffect } from 'react'
// import { Helmet } from 'react-helmet'
// import { Link, useNavigate } from 'react-router-dom'
// import P2SViewSearchBar from "../../components/DamageP2S/P2SViewSearchBar"
// import { useSelector } from 'react-redux'
// import { getP2sDetailsLines, selectedP2SPagesNumber, setP2SExpiry, setP2SOtp, setP2sList, setP2sTableLoading, setViewP2sTotalRecord } from '../../redux/actions/p2sAction'
// import { ColorRing } from 'react-loader-spinner'
// import P2SViewOrderTable from '../../components/DamageP2S/P2SViewOrderTable'

// const P2sView = () => {

//     const userProfile = useSelector((state) => state.userProfile);
//     const p2s = useSelector((state) => state.p2s);
//     const { p2sLoading } = p2s;


//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     useEffect(() => {
//         if (userProfile.usertype != "null") {
//             console.log("inside p2s")

//             dispatch(setP2SExpiry(null));
//             dispatch(setP2SOtp(null));
//             dispatch(setP2sList(null));
//             dispatch(getP2sDetailsLines(null));
//             dispatch(setP2sTableLoading(false));
//             dispatch(setViewP2sTotalRecord(null));
//             dispatch(selectedP2SPagesNumber(0));
//         } else {
//             navigate("/");
//         }
//     }, []);

//     return (
//         <>
//             <Helmet title='P2s View' />
//             <div className='content-wrapper'>
//                 <div className='contant-fluid'>
//                     <div className='row'>
//                         <div className='col-md-12'>
//                             <ol className='breadcrumb'>
//                                 <li className='breadcrumb-item'>
//                                     {" "}
//                                     <Link to="/dashboard">Dashboard</Link>
//                                 </li>
//                                 <li className='breadcrumb-item active'>P2s View</li>
//                             </ol>
//                             <div className='row'>
//                                 <div className='col-lg-12 mb-2'>
//                                     <h4>List of P2S</h4>
//                                 </div>
//                             </div>
//                             <P2SViewSearchBar />
//                             {p2sLoading && <ColorRing
//                                 visible={true}
//                                 height="80"
//                                 width="100%"
//                                 ariaLabel="blocks-loading"
//                                 wrapperStyle={{}}
//                                 wrapperClass="blocks-wrapper"
//                                 colors={[
//                                     "#e15b64",
//                                     "#f47e60",
//                                     "#f8b26a",
//                                     "#abbd81",
//                                     "#849b87",
//                                 ]}

//                             />}
//                             <P2SViewOrderTable />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </>
//     )
// }

// export default P2sView