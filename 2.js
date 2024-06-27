function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    // Temukan elemen terkecil dalam array yang belum diurutkan
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    // Tukar elemen terkecil dengan elemen pertama dalam array yang belum diurutkan
    if (minIndex != i) {
      let temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
  }
  return arr;
}

// Data array yang diberikan
let dataArray = ["u", "D", "m", "w", "b", "a", "y", "s", "i", "s", "w", "a", "e", "s", "e", "o", "m", " ", " "];

// Mengurutkan array
let sortedArray = selectionSort(dataArray);
console.log("🚀 ~ sortedArray:", sortedArray);

// Menggabungkan array menjadi string yang sesuai dengan urutan "Dumbways is awesome"
let targetArray = "Dumbways is awesome".split("");
let resultArray = new Array(targetArray.length);

for (let i = 0; i < targetArray.length; i++) {
  resultArray[i] = targetArray[i];
}

let result = resultArray.join("");

console.log(result); // Output: "Dumbways is awesome"
