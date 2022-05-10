export default function chance(percent) {
  const chance = Math.floor(Math.random() * 100);
  return percent >= chance;
}

let availableColors = [];

export class ColorGenerator {
  constructor(colors) {
    this.colors = colors;
    this.availableColors = [];
  }

  randColor() {
    if (!this.availableColors.length) {
      this.availableColors = [...this.colors];
    }

    const index = [Math.floor(Math.random() * this.availableColors.length)];
    const color = this.availableColors[index];
    this.availableColors.splice(index, 1);
    return color;
  }
}

export function randColor() {
  // var letters = "0123456789ABCDEF";
  // var color = "";
  // for (var i = 0; i < 6; i++) {
  //   color += letters[Math.floor(Math.random() * 16)];
  // }
  // return color;

  if (!availableColors.length) {
    availableColors = [...Colors];
  }

  const index = [Math.floor(Math.random() * availableColors.length)];
  const color = availableColors[index];
  availableColors.splice(index, 1);
  return color;
}

const Colors = [
  "606c52",
  "826ca5",
  "d88727",
  "441f00",
  "8ec0e7",
  "edf3ce",
  "e3c6d4",
  "edf3ce",
  "606c52",
  "e3c6d4",
  "dec982",
  "a26f5b",
  "f8cd99",
  "525e28",
  "899aa1",
  "8ca871",
  "5f6e8b",
  "863f77",
  "c8c260",
  "a26f5b",
  "7eb7c0",
  "72593b",
  "82824a",
  "aebf94",
  "385234",
  "f0e07d",
  "aaab5c",
  "a89074",
  "2e6255",
  "ce9c83",
  "e7763a",
  "a78b45",
  "df9498",
  "f7cfcc",
  "e0b75b",
  "293d60",
  "3b678c",
  "a6b5c8",
  "edc987",
  "c9545b",
];
