import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import getData from '../../utils/getData'
import { fetchTicketDetails, checkTicket } from '../../adapters/CommonAdapter'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

const CheckTicket = () => {
	const { id } = useParams();
	console.log(id)

	const [input, setInput] = useState(null);

	const { isLoading, error, data: eventData } = useQuery({
		queryKey: ['ticketData'],
		queryFn: () => getData(fetchTicketDetails, id),
	})

	const handleChange = (e) => {
		setInput(e.target.value);
	}

	const handleSubmit = () => {
		console.log("input: ", input);
		const { isLoading, error, data } = useQuery({
			queryKey: ['ticketData'],
			queryFn: () => getData(checkTicket, { ticketId: input, eventId: id }),
		})
		
		console.log("ticket: ", data);
	}
	console.log("data: ", eventData);

	return (
		<div className='h-full'>
			<Header />
			<div className="flex flex-col justify-center gap-4 items-center w-full h-[80vh] bg-[url('/src/assets/background.png')]">
				<h2 className="font-bold text-4xl text-[#07360e] text-center">Check Ticket</h2>
				<div className="flex flex-col py-10 px-6 gap-4 shadow-lg bg-white justify-center items-center">
					<h2 className="text-center text-xl font-medium">Enter Ticket</h2>
					<div className="form-control">
						<div className="input-group">
							<input type="text" placeholder="Search…" onChange={handleChange} className="input input-bordered" />
							<button className="btn bg-green-500" onClick={handleSubmit}>
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
			<Footer data={eventData?.event} />
		</div>
	)
}

export default CheckTicket