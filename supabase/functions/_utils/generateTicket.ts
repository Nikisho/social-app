import { supabaseAdmin } from "./supabase.ts";
import {uuidv4 } from "./uuidv4.ts";
import { qrcode } from "https://deno.land/x/qrcode/mod.ts";

async function generateQRCodeBase64(value: string) {
  return (await qrcode(value)).toString();
};

export const generateTicket = async (
    user_id:number,
    featured_event_id:number,
    date: Date,
    ticket_type_id: number
) => {
    const uuid = uuidv4();
    const qrValue = `com.linkzy://ticket/${uuid}`;
    const eventDate = new Date(date)
    const { error, data } = await supabaseAdmin
        .from('tickets')
        .insert({
            user_id: user_id,
            featured_event_id: featured_event_id,
            qr_code_link: qrValue,
            ticket_type_id: ticket_type_id,
            uuid: uuid,
            expiry_date: new Date(eventDate.setDate(eventDate.getDate() + 1))
        })
        .select('ticket_id, qr_code_link')
        .single();


        const base64Qr = await generateQRCodeBase64(qrValue);
        const base64Data = base64Qr.split(',')[1]; // Extract the base64 data from the data URL;
        
        if (data) {
            console.log("Ticket generated with ID: ", data.ticket_id);
            console.log("QR Code Link: ", await generateQRCodeBase64(qrValue));
            return {ticket_id: data.ticket_id, qr_code_link: base64Data}; // return both the ticket_id and the qr code link
        }

        if (error) {
            throw error.message;
        }
}