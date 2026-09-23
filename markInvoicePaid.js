// markInvoicePaid.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/*
    Marks an invoice as paid manually (out-of-band).
    Use this for:
    - BACS manual transfers
    - Cheque payments
    - Cash payments
    - SumUp payments

    This does NOT charge the customer.
    It simply tells Stripe: "I received the money outside Stripe."
*/

export async function markInvoicePaid(invoiceId) {
    if (!invoiceId) {
        throw new Error("Invoice ID is required.");
    }

    console.log(`💷 Marking invoice ${invoiceId} as paid manually...`);

    const invoice = await stripe.invoices.pay(invoiceId, {
        paid_out_of_band: true
    });

    console.log(`✔ Invoice ${invoiceId} marked as paid.`);
    return invoice;
}

// Optional CLI runner
async function run() {
    const invoiceId = process.argv[2];

    if (!invoiceId) {
        console.log("Usage: node markInvoicePaid.js <invoiceId>");
        return;
    }

    await markInvoicePaid(invoiceId);
}

run();
