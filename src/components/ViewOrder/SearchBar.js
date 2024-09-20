import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewOrderService from "../../axios/services/api/viewOrder";
import { selectedPagesNumber, setViewOrderFilter, setViewOrderTotalPages, setViewOrderTotalRecord } from "../../redux/actions/viewOrderAction";
import DatePicker from "react-datepicker";
import { convert } from "../../pages/pages/utils/dateConverter";
import $ from "jquery";
function SearchBar({ channel }) {
	const dispatch = useDispatch();

	const date = new Date();
	function getFirstDayOfMonth(year, month) {
		return new Date(year, month, 1);
	}
	const firstDay = getFirstDayOfMonth(date.getFullYear(), date.getMonth());

	// Collecting data from Redux store
	const userProfile = useSelector((state) => state.userProfile);
	const userId = useSelector(
		(state) => state.dashboard.dashboard.profile_details.user_id
	);

	const viewOrder = useSelector((state) => state.viewOrder);
	const { viewOrderFilter, viewOrderTotalPages, selectedPage} = viewOrder;

	const [startDate, setStartDate] = useState(firstDay);
	const [endDate, setEndDate] = useState(new Date());
	const [selectedChannel, setSelectedChannel] = useState(0);
	const [orderStatus, setOrderStatus] = useState(0);
	const [distributor, setDistributor] = useState(0);
	const [selectedOrderStatus, setSelectedOrderStatus] = useState(0);
	const [selectedDistributer, setSelectedDistributer] = useState(0);
	const [loading, setLoading] = useState(true);

	//  min date 90 days
	const minimumDate = new Date();
	minimumDate.setDate(minimumDate.getDate() - 90);

	const resetSearch = () => {
		setSelectedChannel(0);
		setSelectedOrderStatus(0);
		setSelectedDistributer(0);
		setOrderStatus(0);
		setDistributor(0);
	};
	const getViewOrderFilter = async (channel) => {
		setSelectedChannel(channel);
		setSelectedOrderStatus(0);
		setSelectedDistributer(0);
		setOrderStatus(0);
		setDistributor(0);
		await ViewOrderService.getViewOrderFilter(userProfile, channel).then(
			(response) => {
				setOrderStatus(response.data.data.order_status);
				setDistributor(response.data.data.distributor_details);
				// dispatch(setViewOrderFilter(response.data));
			}
		);
	};

 const getViewOrderDetails = async () => {
		const fromData = convert(startDate);
		const toDate = convert(endDate);
		let selectedPageN = selectedPage *10;
		await ViewOrderService.getViewOrderDetails(
			userProfile,
			selectedChannel,
			selectedDistributer,
			fromData,
			toDate,
			selectedOrderStatus,
			userId,
			selectedPageN
		).then((response) => {
			dispatch(setViewOrderFilter(response.data.data.order_details));
			dispatch(setViewOrderTotalRecord(response.data.data.total_record_count));
			{response.data.data.total_record_count > 10 ?
			dispatch(setViewOrderTotalPages(Math.ceil((response.data.data.total_record_count)/10))):
			dispatch(setViewOrderTotalPages(1));
			}
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(selectedPagesNumber(0));
		getViewOrderDetails();
	};

	useEffect(() => {
		getViewOrderDetails()
	}, [selectedPage]);

	return (
		<div className="row mb-3">
			<div className="col-lg-12">
				<div className="card card-primary border-0">
					<div
						className="card-header collapsepanel"
						data-toggle="collapse"
						data-target="#collapseOne"
						aria-expanded="true">
						Search Orders
					</div>
					<div
						className="card-body collapse show py-0"
						id="collapseOne"
						aria-expanded="true">
						<div className="column pt-3 col-sm-offset-0">
							<form
								data-toggle="validator"
								role="form"
								className="form-horizontal">
								<div className="form-group row">
									<div className="col-md-6">
										<div className="row">
											<div className="col-md-4">
												<label htmlFor="OrderNumber" className="control-label">
													Channel:
												</label>
											</div>
											<div className="col-md-8">
												<select
													name="OrderNumber"
													className="form-control selectpicker"
													data-live-search="true"
													onChange={(e) => getViewOrderFilter(e.target.value)}
													required>
													<option value={0}>Show All</option>
													{channel &&
														channel.map((ch, index) => (
															<option
																key={ch.channel_code}
																value={ch.channel_name}>
																{ch.channel_name}
															</option>
														))}
												</select>
											</div>
										</div>
									</div>
									<div className="col-md-6">
										<div className="row">
											<div className="col-md-4">
												<label
													htmlFor="DistributorName"
													className="control-label">
													Distributor:
												</label>
											</div>
											<div className="col-md-8">
												<select
													name="DistributorName"
													className="form-control selectpicker"
													data-live-search="true"
													onChange={(e) =>
														setSelectedDistributer(e.target.value)
													}
													required>
													<option value={0}>Show All</option>

													{distributor &&
														distributor.map((dist, index) => (
															<option
																key={dist.customer_code}
																value={dist.customer_code}>
																{dist.customer_name}
															</option>
														))}
												</select>
											</div>
										</div>
									</div>
								</div>
								<div className="form-group row">
									<div className="col-md-6">
										<div className="row">
											<div className="col-md-4">
												<label htmlFor="dateFrom" className="control-label">
													From Date:
												</label>
											</div>
											<div className="col-md-8">
												<DatePicker
													showIcon
													className="datepick form-control datepicker"
													selected={startDate}
													minDate={minimumDate}
													onChange={(date) => setStartDate(date)}
													selectsStart
													maxDate={new Date()}
													startDate={startDate}
													endDate={endDate}
												/>
											</div>
										</div>
									</div>
									<div className="col-md-6">
										<div className="row">
											<div className="col-md-4">
												<label htmlFor="dateTo" className="control-label">
													To Date:
												</label>
											</div>
											<div className="col-md-8">
												<DatePicker
													showIcon
													className="datepick form-control datepicker"
													selected={endDate > startDate ? endDate : startDate}
													onChange={(date) => setEndDate(date)}
													selectsEnd
													startDate={startDate}
													endDate={endDate}
													maxDate={new Date()}
													minDate={startDate}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="form-group row">
									<div className="col-md-6">
										<div className="row">
											<div className="col-md-4">
												<label htmlFor="OrderStatus" className="control-label">
													Order Status:
												</label>
											</div>
											<div className="col-md-8">
												<select
													name="OrderStatus"
													className="form-control selectpicker"
													data-live-search="true"
													onChange={(e) =>
														setSelectedOrderStatus(e.target.value)
													}
													required>
													<option value={0}>Show All</option>
													{orderStatus &&
														orderStatus.map((order, index) => (
															<option
																key={order.order_status_code}
																value={order.order_status_code}>
																{order.order_status_desc}
															</option>
														))}
												</select>
											</div>
										</div>
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
													onClick={handleSubmit}
													type="submit"
													className="btn btn-primary  btn-md">
													<i className="fa-solid fa-magnifying-glass"></i>{" "}
													Search
												</button>
												&nbsp;
												<button
													type="reset"
													onClick={resetSearch}
													className="btn btn-danger btn-md">
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
	);
}

export default SearchBar;
