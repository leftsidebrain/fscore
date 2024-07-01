function calculateInvestmentAfterTwoYears() {
  const initialCapital = 1000000000; // 1 miliar

  // Alokasi investasi
  const bankDeposit = 350000000; // 350 juta
  const governmentBonds = 650000000; // 650 juta
  const stockA = governmentBonds * 0.35; // 35% dari 650 juta
  const stockB = governmentBonds * 0.35; // Sisanya dari 650 juta
  const stoctC = governmentBonds * 0.3;

  // Tingkat keuntungan per tahun
  const bankInterestRate = 0.035; // 3.5%
  const stockCInterestRate = 0.13; // 13%
  const stockAInterestRate = 0.145; // 14.5%
  const stockBInterestRate = 0.125; // 12.5%

  // Menghitung keuntungan setelah dua tahun
  const bankProfit = bankDeposit * Math.pow(1 + bankInterestRate, 2) - bankDeposit;

  const stockCProfit = stoctC * Math.pow(1 + stockCInterestRate, 2) - stoctC;

  const stockAProfit = stockA * Math.pow(1 + stockAInterestRate, 2) - stockA;

  const stockBProfit = stockB * Math.pow(1 + stockBInterestRate, 2) - stockB;

  // Menghitung total uang setelah dua tahun
  const totalAfterTwoYears = initialCapital + bankProfit + stockCProfit + stockAProfit + stockBProfit;

  // Mencetak hasil
  console.log(`Total uang investor setelah dua tahun: Rp ${totalAfterTwoYears.toLocaleString("id-ID")}`);
}

calculateInvestmentAfterTwoYears();
