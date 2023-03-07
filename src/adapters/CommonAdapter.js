import ApiAdapter from "./ApiAdapter"

const servicePrefix = "/"
const productPrefix = "/products/"
const serviceSuffix = ".php"

/* Home/index */

export const fetchTicketDetails =  (id) => {
    return ApiAdapter.fetchData({
        url: "v2/get-ticket-by-event-id/" + id,
        method: "get"    
    })
}

export const verifyPayment =  (data) => {
    return ApiAdapter.fetchData({
        url: "v2/verify-payment",
        method: "post",
        data
    })
}

export const submitTicket =  (data) => {
    return ApiAdapter.fetchData({
        url: "v2/save-purchased-ticket",
        method: "post",
        data
    })
}

export const checkTicket =  ({ticketId, eventId}) => {
    console.log("ticketId: ", ticketId);
    console.log("eventId: ", eventId);
    return ApiAdapter.fetchData({
        url: "v2/check-ticket-id/" + ticketId + "/" + eventId,
        method: "get"    
    })
}