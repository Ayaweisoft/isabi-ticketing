import { useContext } from 'react'
import { TicketContext  } from '../contexts/TicketContext'

export const useTicketContext = () => {
    const context = useContext(TicketContext)
    // console.log("context", context)

    if (!context) {
        throw Error("useTicketContext must be used inside an TicketContextProvider")
    }

    return context
}