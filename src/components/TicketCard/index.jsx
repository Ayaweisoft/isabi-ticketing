import React, { useEffect } from 'react'
import { useState, useContext } from 'react';
import { TicketContext } from '../../contexts/TicketContext';
import { useTicketContext } from '../../hooks/useTicketContext';

const TicketCard = ({ data, handleClick }) => {
	const [numberOfTicket, setNumberOfTicket] = useState(0);
	const [error, setError] = useState(null);
	const { dispatch } = useTicketContext()

	// useEffect(() => {
	// 	// localStorage.setItem("ticket", JSON.stringify(data))
	// 	dispatch({ type: "SET_TICKET", payload: "" })
	// 	console.log("event dispatched")
	// }, [])

	const ticketData = {
		...data,
		numberOfTicket
	}

	const handleInsideClick = () => {
		if(numberOfTicket === 0) {
			setError("Please select a number of ticket")
			return;
		}
		dispatch({ type: "SET_TICKET", payload: ticketData })
		console.log("event dispatched")
		handleClick(data._id);
	}

	const setTicketNumber = (e) => {
		setNumberOfTicket(e.target.value);
	}

	const increaseNumberOfTicket = () => {
		setNumberOfTicket(numberOfTicket + 1);
		if(numberOfTicket > 0) setError(null);
	}

	const decreaseNumberOfTicket = () => {
		if (numberOfTicket === 0) return;
		setNumberOfTicket(numberOfTicket - 1);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex w-[20rem] h-[25rem] bg-black rounded-xl overflow-hidden relative">
				<img className='w-full h-full ' src={data.imageUrl} alt="" />
				<div className="absolute flex flex-col items-center justify-center w-full h-full bg-black/80">
					<h2 className='text-2xl font-bold text-white'>{data.ticketType}</h2>
					<p className='text-xl font-bold text-white'>₦{data.amount}</p>
				</div>
			</div>
			<div className="flex items-center justify-center w-full gap-6 h-fit">
				<button className="flex items-center justify-center px-4 py-1 text-2xl font-bold text-white bg-green-400" onClick={decreaseNumberOfTicket}>-</button>
				<input type="text" value={numberOfTicket} onChange={setTicketNumber} />
				<button className="flex items-center justify-center px-4 py-1 text-2xl font-bold text-white bg-green-400" onClick={increaseNumberOfTicket} >+</button>
			</div>
			<div className="flex items-center justify-center gap-3 text-lg font-bold">
				<span>₦{numberOfTicket * data.amount}</span>
				{ error && <div className="flex items-center justify-center text-sm font-medium text-red-400">{error}</div> }
			</div>
			{/* <InterswitchPay {...paymentParameters}/> */}
			<button className='flex items-center justify-center w-full px-4 py-2 text-lg font-bold text-white bg-[#07360e]' onClick={() => { handleInsideClick() }}>Buy Now</button>
		</div>
	)
}

export default TicketCard;