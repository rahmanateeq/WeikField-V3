//done by atharva on 21.02.2024 

import React, { useEffect, useState } from "react";
import { useDispatch , useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DamageDiscService from "../../../axios/services/api/DamageDisc";
import DamageDiscPagination from "../DamageDiscView/DamageDiscViewPagination";


function DamageDiscViewSearchTable () { 
    const userProfile = useSelector((state) => state.userProfile);
    const dashboard = useSelector((state) => state.dashboard.dashboard);
    const { profile_details } = dashboard;
    
    const damagedisc = useSelector((state) => state.damagedisc);
    const {getDdViewHeaderList, viewDamageDiscSearchHeaderTotalRecord } = damagedisc;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    console.log("damagedisc list", damagedisc);


    return (
        <>
          {getDdViewHeaderList && getDdViewHeaderList !== null && (
            <div className="card border-0 rounded-0 mb-3">
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    className="table table-bordered"
                    id="viewDataTable"
                    width="100%"
                    cellSpacing="0"
                  >
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center" }}>Document Entry No. </th>
                        <th style={{ textAlign: "center" }}>Customer Code</th>
                        <th style={{ textAlign: "center" }}>Customer Name</th>
                      
                    </tr>
                    </thead>
                    <tbody>

                        {getDdViewHeaderList &&
                          getDdViewHeaderList.map((damagedisc, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: "center"}}>
                                    <a>
                                        {damagedisc.doc_entry_no}
                                    </a>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <span style={{ textAlign: "center" }}>{damagedisc.customer_code}</span>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <span style={{ textAlign: "center" }}>{damagedisc.customer_name}</span>
                                </td>
                                
                                
                            </tr>
                          ))}
                          {getDdViewHeaderList.length === 0 && (
                            <tr>
                                <td></td>
                                <td></td>
                                <td className="text-nowrap"><h5>No Data Found </h5></td>
                                <td></td>
                                <td></td>
                            </tr>
                          )}
                    </tbody>
                </table>
            </div>
        </div>
            <DamageDiscPagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={viewDamageDiscSearchHeaderTotalRecord}
                  onPageChange={page => setCurrentPage(page)}
            />
        </div>
          )}
      </>
    );
};

export default DamageDiscViewSearchTable;