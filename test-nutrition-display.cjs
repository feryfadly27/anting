// Test to show how nutrition status translates in parent dashboard
const NUTRITION_STATUS_MAP = {
  Normal: "Normal",
  Stunted: "Pendek (Stunting)",
  "Severely Stunted": "Sangat Pendek (Stunting Berat)",
  Underweight: "Berat Badan Kurang",
  "Severely Underweight": "Berat Badan Sangat Kurang",
  Overweight: "Berat Badan Berlebih",
  "Possible risk of overweight": "Berisiko Berat Badan Berlebih",
  Wasted: "Gizi Kurang",
  "Severely Wasted": "Gizi Buruk",
};

function toIndonesianNutritionStatus(status) {
  if (!status) return "-";
  return NUTRITION_STATUS_MAP[status] ?? status;
}

// Test data from the database
const testPertumbuhan = {
  kategori_tbu: "Severely Stunted",
  kategori_bbu: "Normal",
  kategori_bbtb: "Overweight",
};

console.log("📊 Parent Dashboard - Nutrition Status Display Test\n");
console.log("Database values (English):");
console.log("  TB/U (Height/Age):", testPertumbuhan.kategori_tbu);
console.log("  BB/U (Weight/Age):", testPertumbuhan.kategori_bbu);
console.log("  BB/TB (Weight/Height):", testPertumbuhan.kategori_bbtb);

console.log("\n✅ Displayed in Dashboard (Indonesian):");
console.log("  TB/U (Height/Age):", toIndonesianNutritionStatus(testPertumbuhan.kategori_tbu));
console.log("  BB/U (Weight/Age):", toIndonesianNutritionStatus(testPertumbuhan.kategori_bbu));
console.log("  BB/TB (Weight/Height):", toIndonesianNutritionStatus(testPertumbuhan.kategori_bbtb));

console.log("\n📋 All Nutrition Status Translations:");
Object.entries(NUTRITION_STATUS_MAP).forEach(([en, id]) => {
  console.log(`  ${en.padEnd(30)} → ${id}`);
});
