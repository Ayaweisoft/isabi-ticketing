import ApiAdapter from "./ApiAdapter"

// GET /get-all-event (no v2 prefix)
// Returns all APPROVED events — used by the Discover/Home page
export const fetchEvents = () => {
    return ApiAdapter.fetchData({
        url: "get-all-event",
        method: "get"
    })
}

// GET /v2/get-event-by-id/:id
// Returns { eventData: { _id, eventName, eventType, status, ... } }
// Used to render the event header, description, and type on page load
export const fetchEventById = (id) => {
    return ApiAdapter.fetchData({
        url: "v2/get-event-by-id/" + id,
        method: "get"
    })
}

// GET /v2/get-ticket-by-event-id/:id
// Returns all ticket tiers (VIP, Regular, etc.) with amount and purchased count
export const fetchTicketDetails = (id) => {
    return ApiAdapter.fetchData({
        url: "v2/get-ticket-by-event-id/" + id,
        method: "get"
    })
}

// POST /v2/verify-payment
// Body: { merchantcode, reference, amount }
export const verifyPayment = (data) => {
    return ApiAdapter.fetchData({
        url: "v2/verify-payment",
        method: "post",
        data
    })
}

// POST /v2/save-purchased-ticket
// Body: { eventId, ticketId, email, phone, name, quantity, mobile: true, ...extras }
// Internally: deducts balance / routes to Interswitch, sends email+SMS, generates QR
export const submitTicket = (data) => {
    return ApiAdapter.fetchData({
        url: "v2/save-purchased-ticket",
        method: "post",
        data
    })
}

// GET /v2/check-ticket-id/:ticketId/:eventId
// Verify a ticket by its ID
export const checkTicket = ({ ticketId, eventId }) => {
    return ApiAdapter.fetchData({
        url: `v2/check-ticket-id/${ticketId}/${eventId}`,
        method: "get"
    })
}

// GET /v2/find-my-ticket/:eventId/:email
// External user enters email + eventId to retrieve their ticket with QR code
export const findMyTicket = ({ eventId, email }) => {
    return ApiAdapter.fetchData({
        url: `v2/find-my-ticket/${eventId}/${encodeURIComponent(email)}`,
        method: "get"
    })
}

// GET /tickets/:ticketId/invoice  (no v2 prefix)
// Returns ticket invoice including base64-encoded QR code with embedded logo
export const fetchTicketInvoice = (ticketId) => {
    return ApiAdapter.fetchData({
        url: `tickets/${ticketId}/invoice`,
        method: "get"
    })
}
