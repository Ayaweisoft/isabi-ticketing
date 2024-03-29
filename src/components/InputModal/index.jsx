import React from 'react'
import appConfig from '../../configs/app.config'
import { InterswitchPay } from 'react-interswitch'

const index = ({ setModal, handleSubmit, setFormData, formData }) => {

	const handleInput = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	// const paymentParameters = {
	// 	merchantCode: 'MX46047',
	// 	payItemID: 'Default_Payable_MX46047',
	// 	customerEmail: formData.email,
	// 	redirectURL: `${appConfig.devAppUrl}tickets/63f86ded7d532b0014cd64b6`,
	// 	text: 'Checkout',
	// 	mode: 'TEST',
	// 	transactionReference: Date.now().toString(),
	// 	amount: '1000',
	// 	style: {
	// 		width: '70%',
	// 		padding: '0.6rem',
	// 		marginTop: '3rem',
	// 		border: 'none',
	// 		color: '#fff',
	// 		backgroundColor: '#000AFF'
	// 	},
	// 	callback: (response) => {
	// 		console.log('response: ', response)
	// 		// if (response.resp === '00') {
	// 		// 	navigate('/certificate')
	// 		// }
	// 	}
	// }

	return (
		<div className="fixed z-10 flex items-center justify-center w-full h-full px-6">
			<div className="absolute z-10 flex w-full h-full cursor-pointer bg-black/70" onClick={() => { setModal(false) }}></div>
			<div className="z-20 flex flex-col items-center justify-center w-full p-4 bg-white rounded-md shadow-lg sm:w-3/5 md:w-2/5">
				<form action="" className='flex flex-col items-center justify-center w-full gap-4' onSubmit={handleSubmit}>
					<h2 className="text-2xl font-bold text-[#348A40]">Checkout</h2>
					<div className="w-full max-w-xs form-control">
						<label className="label">
							<span className="label-text">Name</span>
						</label>
						<input type="text" required name="name" placeholder="Enter Name" onChange={handleInput} className="w-full max-w-xs input input-bordered" />
					</div>
					<div className="w-full max-w-xs form-control">
						<label className="label">
							<span className="label-text">Email</span>
						</label>
						<input type="email" required name='email' placeholder="Enter Email" onChange={handleInput} className="w-full max-w-xs input input-bordered" />
					</div>
					<div className="w-full max-w-xs form-control">
						<label className="label">
							<span className="label-text">Phone</span>
						</label>
						<input type="phone" required name='phone' onChange={handleInput} placeholder="Enter Phone Number" className="w-full max-w-xs input input-bordered" />
					</div>
					<input className="bg-[#348A40] text-white px-5 py-3 rounded-md mt-4 cursor-pointer" type="submit" value="Checkout"  />
				</form>
			</div>
		</div >
	)
}

export default index