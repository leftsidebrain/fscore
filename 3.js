function printInvertedIsoscelesTriangle(height) {
  // Loop untuk setiap baris
  for (let i = height; i >= 5; i--) {
    let line = "";
    // Loop untuk mencetak spasi di awal setiap baris (agar segitiga rata kanan)
    for (let j = 1; j <= height - i; j++) {
      line += " "; // Menambahkan dua spasi untuk setiap karakter
    }
    // Loop untuk mencetak karakter di setiap baris
    for (let k = 1; k <= i; k++) {
      // Bergantian antara '#' dan '+'
      if (k % 2 === 0) {
        line += "+ ";
      } else {
        line += "# ";
      }
    }
    console.log(line);
  }
  for (let l = height; l >= 5; l--) {
    let line = "";
    // Loop untuk mencetak spasi di awal setiap baris (agar segitiga rata kanan)
    for (let m = 1; m <= 1; m++) {
      line += " "; // Menambahkan dua spasi untuk setiap karakter
    }
    // Loop untuk mencetak karakter di setiap baris
    for (let n = 1; n <= l - 1; n++) {
      // Bergantian antara '#' dan '+'
      line += "+ ";
    }
    console.log(line);
  }
  for (let o = height; o >= 5; o--) {
    let line = "";
    // Loop untuk mencetak spasi di awal setiap baris (agar segitiga rata kanan)
    for (let p = 1; p <= 2; p++) {
      line += " "; // Menambahkan dua spasi untuk setiap karakter
    }
    // Loop untuk mencetak karakter di setiap baris
    for (let q = 1; q <= o - 2; q++) {
      // Bergantian antara '#' dan '+'
      if (q % 2 == 0) {
        line += "# ";
      } else {
        line += "+ ";
      }
    }
    console.log(line);
  }
  for (let o = height; o >= 5; o--) {
    let line = "";
    // Loop untuk mencetak spasi di awal setiap baris (agar segitiga rata kanan)
    for (let p = 1; p <= 3; p++) {
      line += " "; // Menambahkan dua spasi untuk setiap karakter
    }
    // Loop untuk mencetak karakter di setiap baris
    for (let q = 1; q <= o - 3; q++) {
      // Bergantian antara '#' dan '+'
      line += "+ ";
    }
    console.log(line);
  }
  for (let r = height; r >= 5; r--) {
    let line = "";
    // Loop untuk mencetak spasi di awal setiap baris (agar segitiga rata kanan)
    for (let s = 1; s <= 4; s++) {
      line += " "; // Menambahkan dua spasi untuk setiap karakter
    }
    // Loop untuk mencetak karakter di setiap baris
    for (let t = 1; t <= r - 4; t++) {
      // Bergantian antara '#' dan '+'
      line += "# ";
    }
    console.log(line);
  }
}

// Contoh penggunaan dengan tinggi segitiga 5
printInvertedIsoscelesTriangle(5);
