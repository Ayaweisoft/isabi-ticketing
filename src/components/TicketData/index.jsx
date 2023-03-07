import React from 'react'

const TicketData = ({ data }) => {
  return (
    <div className='flex flex-col'>
        <h2 className='font-bold text-xl'>Ticket Data</h2>
        <div className="flex flex-col">
            <span className=''>Name:    {data.name}</span>
            <span className=''>Email:   {data.email}</span>
            <span className=''>Phone:   {data.phone}</span>
            <span className=''>Amount:  {data.amount}</span>
            <span className=''>Number of Ticket:    {data.numberOfTicket}</span>
            <span className=''>Number of Ticket Used:   {data.numberOfTicketUsed}</span>
            <span className=''>Ticket Type: {data.ticketType}</span>
            <span className=''>Status:  {data.status}</span>
        </div>
    </div>
  )
}

export default TicketData