import { checkTicket } from "../adapters/CommonAdapter";

export const generateTicketId = async(len, event_id) => {
    var shortPass;
    var valid = false;

    do {
        try {
            var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            shortPass = [...Array(len)].reduce(a => a + p[~~(Math.random() * p.length)], '');
            await checkTicket(
                {
                    ticketId: shortPass,
                    eventId: event_id
                }
            );
            valid = false;
        } catch (error) {
            valid = true;
        }
    } while (!valid);

    return shortPass;
}

export default generateTicketId;