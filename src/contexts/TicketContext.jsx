import { createContext, useEffect, useReducer } from "react";

export const TicketContext = createContext({})

export const ticketReducer = (state, action) => {
    switch (action.type) {
        case "SET_TICKET":
            return {
                ticket: action.payload
            }
        case "UPDATE_TICKET":
            return {
                ...state,
                ticket: action.payload
            }
        default:
            return state
    }
}

export const TicketContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(ticketReducer, {
        ticket: {}
    })
       
    // useEffect(() => {
    //     const ticket = JSON.parse(localStorage.getItem("ticket"))
    //     if (ticket) {
    //         dispatch({type: "UPDATE_TICKET", payload: ticket})
    //     }
    // }, [dispatch])
    
    console.log("State: ", state)
    
    return (
        <TicketContext.Provider value={{...state, dispatch}}>
            { children }
        </TicketContext.Provider>
    )
}