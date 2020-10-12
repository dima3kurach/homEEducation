const pHeops = 2.34; //volume of the pyramid Heops in millions of m3
const pKhafre = 2.211; //volume of the pyramid Khafre in millions of m3
const pMenkaure = .235; //volume of the pyramid Menkaure in millions of m3

let a = 1.7; //edge of the pyramid in millions of m3

let d = Math.sqrt(a**2 + a**2); //diagonal
let h = Math.sqrt((d**2) / 2 + a**2); //height
let S = a**2; //square
let V = S * h / 3; //volume

V > pHeops ? console.log('Our pyramid is bigger than the piramid of Heops') :
			 console.log('Our pyramid is smaller than the piramid of Heops');
V > pKhafre ? console.log('Our pyramid is bigger than the piramid of Khafre') :
			  console.log('Our pyramid is smaller than the piramid of Khafre');
V > pMenkaure ? console.log('Our pyramid is bigger than the piramid of Menkaure') :
			    console.log('Our pyramid is smaller than the piramid of Menkaure');