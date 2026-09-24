import XLSX from "xlsx";

// Load workbook
const workbook = XLSX.readFile("SupportContracts2026_link.xlsx");
const sheet = workbook.Sheets["2026"];
const rows = XLSX.utils.sheet_to_json(sheet);

// Safe‑test limit
const SAFE_LIMIT = 5;

console.log("🔒 DRY‑RUN MODE — Processing first 5 rows only\n");

let processed = 0;

for (const row of rows) {
    if (processed >= SAFE_LIMIT) break;

    const contractNumber = row["CDoS Support Contract Number"];
    const name = row["Customer Name 2026"];
    const active = row["CDoS Support Active"];
    const stripeId = row["Stripe Customer ID"];

    // No contract number
    if (!contractNumber) {
        console.log(`⚠ DRY‑RUN: Would skip row with no contract number`);
        processed++;
        continue;
    }

    // Inactive contract
    if (String(active).trim().toLowerCase() !== "yes") {
        console.log(`⏭ DRY‑RUN: Would skip inactive contract: ${contractNumber} (${name})`);
        processed++;
        continue;
    }

    // Already linked
    if (stripeId && stripeId.trim() !== "") {
        console.log(`✔ DRY‑RUN: Would skip already linked contract: ${contractNumber} → ${stripeId}`);
        processed++;
        continue;
    }

    // Would create Stripe customer
    console.log(`➕ DRY‑RUN: Would create Stripe customer for: ${contractNumber} (${name})`);

    processed++;
}

console.log("\n🎉 DRY‑RUN COMPLETE — No Stripe calls were made.");
