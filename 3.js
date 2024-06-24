function printInvertedIsoscelesTriangle(height) {
  // Loop untuk setiap baris
  for (let i = height; i >= 1; i--) {
    console.log("🚀 ~ printInvertedIsoscelesTriangle ~ i:", i);
    let line = "";
    // Loop untuk mencetak spasi di awal setiap baris (agar segitiga rata kanan)
    for (let j = 1; j <= height - i; j++) {
      line += "  "; // Menambahkan dua spasi untuk setiap karakter
    }
    // Loop untuk mencetak karakter di setiap baris
    for (let k = 1; k <= 2 * i - 1; k++) {
      // Bergantian antara '#' dan '+'
      if (k % 2 === 0) {
        line += "+ ";
      } else {
        line += "# ";
      }
    }
    console.log(line);
  }
}

// Contoh penggunaan dengan tinggi segitiga 5
printInvertedIsoscelesTriangle(5);
