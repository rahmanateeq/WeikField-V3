import Multiselect from "multiselect-react-dropdown";
import React, { useEffect, useMemo, useState } from "react";
import {
	setInvoice,
	setFlavour,
  } from "../redux/actions/mssrAction";

import { useSelector, useDispatch } from "react-redux";

function MultiSelect({invoice_details}) {
	const dispatch = useDispatch();
	const [selectedValue, setSelectedValue] = useState([]);

	// Map invoice details to required format
    const options = invoice_details?.map((item) => ({
        sap_doc_no: item.document_no,
        sap_doc_no_date: `${item.document_no}_[${item.document_date}]`,
        draft_flag: item.draft_flag,
    })) || [];

	const initialSelected = useMemo(
        () => options.filter(item => item.draft_flag === "Y"),
        [invoice_details]
    );

	const buildSelectedObject = (selectedList) => {
		return selectedList.map((item) => ({
			sap_doc_no: item.sap_doc_no, // Return an object with sap_doc_no
		}));
	};

    // Dispatch selected items' sap_doc_no to Redux store on mount
    useEffect(() => {
		if(initialSelected.length > 0){
			setSelectedValue([...initialSelected]);
			const selectedDocNos = buildSelectedObject([...initialSelected])
        dispatch(setInvoice(selectedDocNos));
		}
		
    }, [initialSelected]);

	const onSelect = (selectedList, selectedItem) => {
		setSelectedValue([...selectedList]);
		const selectedDocumentNos = buildSelectedObject([...selectedList]);
		dispatch(setInvoice(selectedDocumentNos));
	};

	const onRemove = (selectedList, removedItem) => {
		setSelectedValue([...selectedList]);
		const remainingDocumentNos = buildSelectedObject([...selectedList]);
		dispatch(setInvoice(remainingDocumentNos));
	};

	return (
		<Multiselect
			// disable={disableFilter}
			options={options} // Options to display in the dropdown
			selectedValues={selectedValue} // Preselected value to persist in dropdown
			onSelect={onSelect} // Function will trigger on select event
			onRemove={onRemove} // Function will trigger on remove event
			displayValue="sap_doc_no_date" // Property name to display in the dropdown options
		/>
	);
}

export default MultiSelect;
