// manualSettlementDashboard.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/*
    Manual Settlement Dashboard
    ---------------------------
    Shows all subscriptions + invoices that require manual settlement:
    - bacs_manual
    - sumup
    - cheque
    - cash

    And provides a function to mark invoices as paid manually.
*/

export async function getManualSettlementDashboard() {
    console.log("📊 Loading Manual Settlement Dashboard...\n");

    // 1. Fetch all subscriptions
    const subscriptions = await stripe.subscriptions.list({
        limit: 100,
        expand: ["data.latest_invoice"]
    });

    const manualContracts = [];

    for (const sub of subscriptions.data) {
        const route = sub.metadata?.route || "";
        const contractNumber = sub.metadata?.contractNumber || "Unknown";

        // Only show manual settlement routes
        if (!["bacs_manual", "sumup", "cheque", "cash"].includes(route)) {
            continue;
        }

        const invoice = sub.latest_invoice;
        const invoiceId = invoice?.id || null;
        const invoiceStatus = invoice?.status || "unknown";

        manualContracts.push({
            contractNumber,
            customerId: sub.customer,
            subscriptionId: sub.id,
            route,
            invoiceId,
            invoiceStatus,
            amountDue: invoice?.amount_due || 0,
            currency: invoice?.currency || "gbp"
        });
    }

    return manualContracts;
}

// Mark invoice paid manually (BACS, SumUp, Cheque, Cash)
export async function markInvoicePaid(invoiceId) {
    console.log(`💷 Marking invoice ${invoiceId} as paid manually...`);

    const invoice = await stripe.invoices.pay(invoiceId, {
        paid_out_of_band: true
    });

    console.log(`✔ Invoice ${invoiceId} marked paid.`);
    return invoice;
}

// CLI runner (optional)
async function runDashboard() {
    const dashboard = await getManualSettlementDashboard();

    console.log("📄 Manual Settlement Dashboard\n");
