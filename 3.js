function printInvertedIsoscelesTriangle(height) {
  // Loop untuk setiap baris
  for (let i = height; i >= 1; i--) {
    let line = "";
    // Loop untuk mencetak spasi di awal setiap baris (agar segitiga rata kanan)
    for (let j = 1; j <= height - i; j++) {
      line += " "; // Menambahkan dua spasi untuk setiap karakter
    }

    // Loop untuk mencetak karakter di setiap baris
    for (let k = 1; k <= i; k++) {
      // Bergantian antara '#' dan '+'
      if (i % 2 === 0) {
        line += "+ ";
      } else {
        if (k % 2 === 0) {
          line += "+ ";
        } else {
          line += "# ";
        }
      }
    }

    console.log(line);
  } // baris 2
  // for (let l = height; l >= 5; l--) {
  //   let line = "";

  //   for (let m = 1; m <= 1; m++) {
  //     line += " ";
  //   }

  //   for (let n = 1; n <= l - 1; n++) {
  //     line += "+ ";
  //   }
  //   console.log(line);
  // } // baris 3
  // for (let o = height; o >= 5; o--) {
  //   let line = "";

  //   for (let p = 1; p <= 2; p++) {
  //     line += " ";
  //   }

  //   for (let q = 1; q <= o - 2; q++) {
  //     if (q % 2 == 0) {
  //       line += "# ";
  //     } else {
  //       line += "+ ";
  //     }
  //   }
  //   console.log(line);
  // } //baris 4
  // for (let o = height; o >= 5; o--) {
  //   let line = "";

  //   for (let p = 1; p <= 3; p++) {
  //     line += " ";
  //   }

  //   for (let q = 1; q <= o - 3; q++) {
  //     line += "+ ";
  //   }
  //   console.log(line);
  // } //baris 5
  // for (let r = height; r >= 5; r--) {
  //   let line = "";

  //   for (let s = 1; s <= 4; s++) {
  //     line += " ";
  //   }

  //   for (let t = 1; t <= r - 4; t++) {
  //     line += "# ";
  //   }
  //   console.log(line);
  // }
}
printInvertedIsoscelesTriangle(5);
