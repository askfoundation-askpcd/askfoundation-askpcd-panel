import Stripe from "stripe";
import XLSX from "xlsx";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Load workbook
const workbook = XLSX.readFile("SupportContracts2026_link.xlsx");
const sheet = workbook.Sheets["2026"];
const rows = XLSX.utils.sheet_to_json(sheet);

console.log("🚀 PRODUCTION MODE — Creating real Stripe customers\n");

let updatedRows = [];
let createdCount = 0;
let skippedCount = 0;

for (const row of rows) {
    const contractNumber = row["CDoS Support Contract Number"];
    const name = row["Customer Name 2026"];
    const active = row["CDoS Support Active"];
    const stripeId = row["Stripe Customer ID"];

    // Skip rows with no contract number
    if (!contractNumber) {
        console.log(`⚠ Skipping row with no contract number`);
        skippedCount++;
        updatedRows.push(row);
        continue;
    }

    // Skip inactive rows
    if (String(active).trim().toLowerCase() !== "yes") {
        console.log(`⏭ Skipping inactive contract: ${contractNumber} (${name})`);
        skippedCount++;
        updatedRows.push(row);
        continue;
    }

    // Skip rows already linked
    if (stripeId && stripeId.trim() !== "") {
        console.log(`✔ Already linked: ${contractNumber} → ${stripeId}`);
        skippedCount++;
        updatedRows.push(row);
        continue;
    }

    // Create Stripe customer
    console.log(`➕ Creating Stripe customer for: ${contractNumber} (${name})`);

    const customer = await stripe.customers.create({
        name: name,
        metadata: {
            cdos_contract_number: contractNumber,
            support_active: active
        }
    });

    console.log(`✔ Created: ${contractNumber} → ${customer.id}`);

    // Write Stripe ID back into row
    row["Stripe Customer ID"] = customer.id;
    updatedRows.push(row);
    createdCount++;
}

// Write updated rows back to sheet
const newSheet = XLSX.utils.json_to_sheet(updatedRows);
workbook.Sheets["2026"] = newSheet;
XLSX.writeFile(workbook, "SupportContracts2026_link.xlsx");

console.log("\n🎉 PRODUCTION COMPLETE");
console.log(`✔ Stripe customers created: ${createdCount}`);
console.log(`⏭ Rows skipped: ${skippedCount}`);
console.log("📄 Excel sheet updated with new Stripe IDs");
