import React from 'react'
import { useQuery } from '@tanstack/react-query'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useParams } from 'react-router-dom'
import getData from '../../utils/getData'
import { fetchTicketDetails, verifyPayment, submitTicket } from '../../adapters/CommonAdapter'
import { useState, useContext } from 'react'
import TicketCard from '../../components/TicketCard'
import InputModal from '../../components/InputModal'
import { TicketContext } from '../../contexts/TicketContext'
import appConfig from '../../configs/app.config'

const index = () => {
	const { id } = useParams();
	console.log(id)

	const [modal, setModal] = useState(false);
	const [trxRef, setTrxRef] = useState(Date.now().toString());
	const [successModal, setSuccessModal] = useState(false);
	const [ticketId, setTicketId] = useState(null);
	const { ticket } = useContext(TicketContext)

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		amount: 0,
	})

	const { isLoading, error, data: eventData } = useQuery({
		queryKey: ['ticketData'],
		queryFn: () => getData(fetchTicketDetails, id),
	})

	const handleClick = (id) => {
		console.log('clicked: ', id);

		setModal(true);
	}

	const submitVoteToDB = (tx_ref, trans_id,) => {
		console.log("submitting vote to db");
		const buyer = JSON.parse(localStorage.getItem("buyer"));
		const ticket = JSON.parse(localStorage.getItem("ticket"));
		let requestData = {
			message: "Payment successful",
			ref: tx_ref,
			trax: trans_id,
			eventId: eventData.event._id,
			ticketId: trxRef,
			ticketDatabaseId: ticket._id,
			parentTicket: trxRef,
			amount: parseFloat(ticket?.numberOfTicket * ticket?.amount).toString(),
			ticketType: ticket.ticketType,
			imageUrl: ticket.imageUrl,
			name: formData.name,
			phone: formData.phone_number,
			email: formData.email,
			numberOfTicket: ticket.numberOfTicket,
			amountPaid: parseFloat(ticket?.numberOfTicket * ticket?.amount).toString(),
		};

		const { isLoading, error, data } = useQuery({
			queryKey: ['submitTicket'],
			queryFn: () => getData(submitTicket, requestData),
		})

		if (data?.statusText === "OK") {
			setSuccessModal(true);
			ticketId = data?.data?.ticketId;
		}
	}

	const paymentCallback = (merchantCode, txnRef, amount) => {
		const { isLoading, error, data } = useQuery({
			queryKey: ['verifyPayment'],
			queryFn: () => getData(verifyPayment, {
				merchantCode,
				txnRef,
				amount
			}),
		})

		if (error) {
			console.log('error: ', error);
			return;
		}

		let successCodes = ["10", "11", "00"];
		console.log("data: ", data);

		if (successCodes.includes(data.ResponseCode)) {
			submitVoteToDB(data.PaymentReference, data.MerchantReference);
		} else {
			console.log("interswitch faliure");

			// if (res)
			// 	this.paymentCallback(
			// 		"MX46047",
			// 		this.tId,
			// 		parseFloat(this.ticketDetails.cost).toString()
			// 	);
		}

	}

	const handlePaymentResponse = (response) => {
		console.log("response: ", response);
		if (response.resp === "00") {
			paymentCallback(
				"MX46047",
				trxRef,
				parseFloat(ticket?.numberOfTicket * ticket?.amount).toString()
			);
		} else {
			// this.finalizingPayment = false;
			console.log("payment unsuccessful")
		}
	}

	const paymentParameters = {
		merchant_code: "MX46047",
		pay_item_id: "1476285",
		txn_ref: trxRef,
		amount: parseFloat(ticket?.numberOfTicket * ticket?.amount * 100).toString(),
		cust_name: formData.name,
		cust_email: formData.email,
		cust_id: formData.phone,
		currency: 566, // ISO 4217 numeric code of the currency used
		onComplete: handlePaymentResponse,
		site_redirect_url: `${appConfig.devAppUrl}tickets/${id}`,
		mode: "TEST",
	}

	const initiatePayment = () => {
		window.webpayCheckout(paymentParameters);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		setFormData({
			...formData,
			amount: ticket.numberOfTicket * ticket.amount,
		})
		setTrxRef(Date.now().toString());

		console.log('form data: ', formData);
		initiatePayment();
	}

	console.log("data: ", eventData);

	if (error) {
		return <div>Something went wrong</div>
	}

	if (isLoading) {
		return <div>Loading...</div>
	}

	return (
		<div className=''>
			<Header />
			{
				modal && <InputModal setModal={setModal} setFormData={setFormData} formData={formData} handleSubmit={handleSubmit} />
			}
			<div className="flex flex-col justify-center relative items-center w-full h-fit pt-24 py-16 bg-[url('/src/assets/background.png')]">
				<h2 className='mb-6 text-3xl font-bold text-[#07360e] text-center'>{ eventData.event.eventName }</h2>
				<h2 className='mb-6 text-2xl font-bold text-[#07360e]'>Available Tickets</h2>

				<div className="flex justify-center items-center flex-wrap gap-6">
					{
						eventData?.ticketList.map((data) => (
							<TicketCard data={data} handleClick={handleClick} />
						))
					}
				</div>
				{/* The button to open modal */}
				{/* <label htmlFor="my-modal-4" className="btn">open modal</label> */}

				{/* Put this part before </body> tag */}
				{/* <input type="checkbox" id="my-modal-4" className="modal-toggle" />
				<label htmlFor="my-modal-4" className="cursor-pointer modal">
					<label className="relative modal-box" htmlFor="">
						<h3 className="text-lg font-bold">Congratulations random Internet user!</h3>
						<p className="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
					</label>
				</label> */}
			</div>
			<Footer data={eventData.event} />
		</div>
	)
}

export default index