import React from 'react'

const successModal = ({ setSuccessModal, ticketId }) => {


	return (
		<div className="fixed z-10 flex items-center justify-center w-full h-full">
			<div className="absolute cursor-pointer flex w-full h-full z-10 bg-black/70" onClick={() => { setSuccessModal(false) }}></div>
			<div className="z-20 flex flex-col items-center justify-center w-2/5 p-4 bg-white rounded-lg font-medium shadow-lg">
				Congratulations!!! 🌟🌟🌟 on your successful purchase of ticket with
				ID
				<span className="text-xl text-[#] font-semibold">{ ticketId }</span>
				<br />
				An email has been sent to you with further details,
				kindly visit:
				<a
				class="no-underline text-primary font-bold cursor-pointer text-md"
				href="http://i-sabi.app"
				target="_blank"
				rel="noopener noreferrer">I-Sabi</a>
				or download app to stay connected and stay up to date...
			</div>
		</div >
	)
}

export default successModal