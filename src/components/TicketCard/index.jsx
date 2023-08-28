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
		setNumberOfTicket(+e.target.value);
	}

	const increaseNumberOfTicket = () => {
		if (error) setError(null);
		setNumberOfTicket(prev => prev + 1);
		// if(numberOfTicket > 0) setError(null);
	}

	const decreaseNumberOfTicket = () => {
		if (numberOfTicket === 0) return;
		if (error) setError(null);
		setNumberOfTicket(prev => prev - 1);
	}
    

	// console.log({data})




	return (
		<div className="flex flex-col items-center p-1.5 rounded-md bg-[#EEF7EE] w-full">
            <div className="flex items-center w-full p-1.5 justify-between">
              <div className="text-sm font-semibold">
			  	{data.ticketType}
              </div>
              <div className="relative font-bold">
			  	₦{data.amount}

                {/* <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.83398 15.0003C4.91732 15.0003 4.17565 15.7503 4.17565 16.667C4.17565 17.5837 4.91732 18.3337 5.83398 18.3337C6.75065 18.3337 7.50065 17.5837 7.50065 16.667C7.50065 15.7503 6.75065 15.0003 5.83398 15.0003ZM14.1673 15.0003C13.2507 15.0003 12.509 15.7503 12.509 16.667C12.509 17.5837 13.2507 18.3337 14.1673 18.3337C15.084 18.3337 15.834 17.5837 15.834 16.667C15.834 15.7503 15.084 15.0003 14.1673 15.0003ZM6.75065 10.8337H12.959C13.584 10.8337 14.134 10.492 14.4173 9.97533L17.5007 4.13366L16.0423 3.33366L12.959 9.16699H7.10898L3.55898 1.66699H0.833984V3.33366H2.50065L5.50065 9.65866L4.37565 11.692C3.76732 12.8087 4.56732 14.167 5.83398 14.167H15.834V12.5003H5.83398L6.75065 10.8337ZM10.0007 1.66699L13.334 5.00033L10.0007 8.33366L8.82565 7.15866L10.1423 5.83366H6.66732V4.16699H10.1423L8.81732 2.84199L10.0007 1.66699Z"
                    fill="#348A40" />
                </svg>
                <div className="absolute -top-2 -right-[3px] text-[#348a40] font-bold">
					{data.purchased}
                </div> */}
              </div>
            </div>
            <div className="w-full h-56 p-2 overflow-hidden rounded-md md:h-64">
			  <img  src={data.imageUrl} className='object-cover w-full h-full overflow-hidden rounded-t-md' alt="" />
            </div>
			<div className="flex items-center justify-between w-full gap-6 p-2 h-fit">
				<button className="flex items-center justify-center rounded-md px-4 py-1 h-full pb-[6px] text-2xl font-bold text-white bg-[#348A40]" onClick={decreaseNumberOfTicket}>-</button>
				<input type="text" className='flex items-center justify-center w-full h-full py-1.5 text-xl font-bold text-center border focus:border-[#348A40] focus:outline-[#348A40] rounded-md' value={numberOfTicket} onChange={setTicketNumber} />
				<button className="flex items-center justify-center  rounded-md  px-4 py-1 h-full pb-[6px] text-2xl font-bold text-white bg-[#348A40]" onClick={increaseNumberOfTicket} >+</button>
			</div>			
            <div className="flex flex-col justify-center items-center my-2.5 gap-2 w-full">
              <div className="text-sm font-semibold">
			  	<span>₦{numberOfTicket * data.amount}</span>
              </div>
			  { error && <div className="flex items-center justify-center text-sm font-medium text-red-400">{error}</div> }
              <div className="flex items-center justify-center w-full">
				<button className='w-3/5 outline-none rounded-md text-xs font-medium text-white py-2.5 bg-[#348A40]' onClick={() => { handleInsideClick() }}>Buy Now</button>
              </div>
            </div>
          </div>
	)
}

export default TicketCard;



// import React, { useEffect } from 'react'
// import { useState, useContext } from 'react';
// import { TicketContext } from '../../contexts/TicketContext';
// import { useTicketContext } from '../../hooks/useTicketContext';

// const TicketCard = ({ data, handleClick }) => {
// 	const [numberOfTicket, setNumberOfTicket] = useState(0);
// 	const [error, setError] = useState(null);
// 	const { dispatch } = useTicketContext()

// 	// useEffect(() => {
// 	// 	// localStorage.setItem("ticket", JSON.stringify(data))
// 	// 	dispatch({ type: "SET_TICKET", payload: "" })
// 	// 	console.log("event dispatched")
// 	// }, [])

// 	const ticketData = {
// 		...data,
// 		numberOfTicket
// 	}

// 	const handleInsideClick = () => {
// 		if(numberOfTicket === 0) {
// 			setError("Please select a number of ticket")
// 			return;
// 		}
// 		dispatch({ type: "SET_TICKET", payload: ticketData })
// 		console.log("event dispatched")
// 		handleClick(data._id);
// 	}

// 	const setTicketNumber = (e) => {
// 		setNumberOfTicket(e.target.value);
// 	}

// 	const increaseNumberOfTicket = () => {
// 		setNumberOfTicket(numberOfTicket + 1);
// 		if(numberOfTicket > 0) setError(null);
// 	}

// 	const decreaseNumberOfTicket = () => {
// 		if (numberOfTicket === 0) return;
// 		setNumberOfTicket(numberOfTicket - 1);
// 	}

// 	return (
// 		<div className="flex flex-col gap-4 w-fit">
// 			<div className="flex w-[20rem] h-[25rem] bg-black rounded-xl overflow-hidden relative">
// 				<img className='w-full h-full ' src={data.imageUrl} alt="" />
// 				<div className="absolute flex flex-col items-center justify-center w-full h-full bg-black/80">
// 					<h2 className='text-2xl font-bold text-white'>{data.ticketType}</h2>
// 					<p className='text-xl font-bold text-white'>₦{data.amount}</p>
// 				</div>
// 			</div>
			// <div className="flex items-center justify-between w-full gap-6 h-fit">
			// 	<button className="flex items-center justify-center px-4 py-1 text-2xl font-bold text-white bg-green-500" onClick={decreaseNumberOfTicket}>-</button>
			// 	<input type="text" className='flex items-center justify-center w-24 h-full py-2 text-xl font-bold text-center border' value={numberOfTicket} onChange={setTicketNumber} />
			// 	<button className="flex items-center justify-center px-4 py-1 text-2xl font-bold text-white bg-green-500" onClick={increaseNumberOfTicket} >+</button>
			// </div>
			// <div className="flex items-center justify-center gap-3 text-lg font-bold">
			// 	<span>₦{numberOfTicket * data.amount}</span>
			// 	{ error && <div className="flex items-center justify-center text-sm font-medium text-red-400">{error}</div> }
			// </div>
// 			{/* <InterswitchPay {...paymentParameters}/> */}
// 			<button className='flex items-center justify-center w-full px-4 py-2 text-lg font-bold text-white bg-green-500' onClick={() => { handleInsideClick() }}>Buy Now</button>
// 		</div>
// 	)
// }

// export default TicketCard;