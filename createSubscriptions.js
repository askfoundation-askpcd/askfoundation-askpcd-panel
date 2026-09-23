// createSubscriptions.js
import XLSX from "xlsx";
import { handleBillingRoute, PaymentMethodType } from "./billingEngine.js";

// Load workbook
const workbook = XLSX.readFile("SupportContracts2026_link.xlsx");
const sheetName = "2026";
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet);

console.log("🚀 Starting Billing Engine Subscription Processing...\n");

let processedCount = 0;
let skippedCount = 0;

for (const row of rows) {
    const contract = row["CDoS Support Contract Number"];
    const customerId = row["Stripe Customer ID"];
    const option = row["Option"];
    const paymentMethod = row["PaymentMethod"];   // NEW: includes bacs_manual

    // Basic validation
    if (!contract) {
        console.log(`⚠ Skipping row — missing contract number`);
        skippedCount++;
        continue;
    }

    if (!customerId || !customerId.startsWith("cus_")) {
        console.log(`⚠ Skipping ${contract} — invalid or missing Stripe customer ID`);
        skippedCount++;
        continue;
    }

    if (!option || ![1, 2, 3].includes(option)) {
        console.log(`⚠ Skipping ${contract} — invalid Option value`);
        skippedCount++;
        continue;
    }

    if (!paymentMethod || !Object.values(PaymentMethodType).includes(paymentMethod)) {
        console.log(`⚠ Skipping ${contract} — invalid or missing PaymentMethod`);
        skippedCount++;
        continue;
    }

    console.log(`🔧 Processing ${contract} → Option ${option} → Route ${paymentMethod}`);

    try {
        const result = await handleBillingRoute({
            customerId,
            contractNumber: contract,
            option,
            paymentMethodType: paymentMethod,
            metadata: {
                sheetRow: contract,
                source: "createSubscriptions.js"
            }
        });

        // Write results back into sheet
        row["stripe_subscription_id"] = result.subscriptionId || "";
        row["BillingRouteStatus"] = result.status || "";
        row["SettlementMode"] = result.settlement || "";   // NEW: "manual_required" for bacs_manual

        console.log(`✔ Completed ${contract} → ${result.route} → ${result.status}\n`);
        processedCount++;

    } catch (err) {
        console.log(`❌ Error processing ${contract}: ${err.message}\n`);
        row["BillingRouteStatus"] = "error";
        skippedCount++;
    }
}

// Write updated sheet back to file
const updatedSheet = XLSX.utils.json_to_sheet(rows);
workbook.Sheets[sheetName] = updatedSheet;
XLSX.writeFile(workbook, "SupportContracts2026_link.xlsx");

console.log("🎉 Billing Engine Processing Complete");
console.log(`✔ Processed: ${processedCount}`);
console.log(`⏭ Skipped: ${skippedCount}`);
console.log("📄 Excel sheet updated with subscription IDs and statuses\n");
