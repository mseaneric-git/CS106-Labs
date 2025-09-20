// Sean Eric A. Margarata
// Student-Id: 2024-01-13038

let base=8

// Problem 1: Grade Calculator
console.log("Grade Calulator\n");

let score=base*10+5;

function calculateGrade(score){
	if(score<60){
		return 'F';
	}
	else if(score<=70){
		return 'D';
	}
	else if(score<=80){
		return 'C';
	}
	else if(score<=90){
		return 'B';
	}
	else{
		return 'A';
	}
}

console.log(`base = ${base}`);
console.log(`score = ${score}`);
console.log(`Grade = ${calculateGrade(score)}`);

console.log("\n----------------------------------\n");

// Problem 2: Star Pattern
console.log("Star Pattern\n");

let rows=base+2;

function showStars(rows){
	for(let i=0;i<rows;i++){
		for(let j=0;j<=i;j++){
			process.stdout.write("* ");
		}
		console.log("");
	}
}

console.log(`base = ${base}`);
console.log(`rows = ${rows}\n`);
showStars(rows);

console.log("\n----------------------------------\n");

// Problem 3: Prime Number Checker
console.log("Prime Number Checker\n");

let base_prime=base+10;

function isPrime(n){
	if(n<=1){
		return "Not Prime";
	}
	for(let i=2;i<n;i++){
		if(n%i==0){
			return "Not Prime";
		}
	}
	return "Prime";
}

console.log(`base = ${base_prime}`);
console.log(`Prime or Not: ${isPrime(base_prime)}`);

console.log("\n----------------------------------\n");

// Problem 4: Multiplication Table
console.log("Multiplication Table\n");

console.log(`base = ${base}`);
console.log("\nTable:");

function multiplicationTable(n){
	for(let i=1;i<=10;i++){
		console.log(`${i} * ${n} = ${n*i}`);
	}
}

multiplicationTable(base);
