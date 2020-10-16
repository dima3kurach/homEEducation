// IF-ELSE
console.log('IF-ELSE', '==============================================')

{
	// ex.1
	console.log('Exercise #1')
	let a = 1;
	if (a == 0) {console.log('Correct')} else {console.log('Uncorrect')};
	a = 0;
	if (a == 0) {console.log('Correct')} else {console.log('Uncorrect')};
	a = -3;
	if (a == 0) {console.log('Correct')} else {console.log('Uncorrect')};
}

{
	// ex.2
	console.log('Exercise #2')
	let a = 1;
	if (a > 0) {console.log('Correct')} else {console.log('Uncorrect')};
	a = 0;
	if (a > 0) {console.log('Correct')} else {console.log('Uncorrect')};
	a = -3;
	if (a > 0) {console.log('Correct')} else {console.log('Uncorrect')};
}

{
	// ex.3
	console.log('Exercise #3')
	let a = 1;
	if (a < 0) {console.log('Correct')} else {console.log('Uncorrect')};
	a = 0;
	if (a < 0) {console.log('Correct')} else {console.log('Uncorrect')};
	a = -3;
	if (a < 0) {console.log('Correct')} else {console.log('Uncorrect')};
}

{
	// ex.4
	console.log('Exercise #4')
	let a = 1;
	if (a >= 0) {console.log('Correct')} else {console.log('Uncorrect')};
	a = 0;
	if (a >= 0) {console.log('Correct')} else {console.log('Uncorrect')};
	a = -3;
	if (a >= 0) {console.log('Correct')} else {console.log('Uncorrect')};
}

{
	// ex.5
	console.log('Exercise #5')
	let a = 1;
	if (a <= 0) {console.log('Correct')} else {console.log('Uncorrect')};
	a = 0;
	if (a <= 0) {console.log('Correct')} else {console.log('Uncorrect')};
	a = -3;
	if (a <= 0) {console.log('Correct')} else {console.log('Uncorrect')};
	}

{
	// ex.6
	console.log('Exercise #6')
	let a = 1;
	if (a != 0) {console.log('Correct')} else {console.log('Uncorrect')};
	a = 0;
	if (a != 0) {console.log('Correct')} else {console.log('Uncorrect')};
	a = -3;
	if (a != 0) {console.log('Correct')} else {console.log('Uncorrect')};
}

{
	// ex.7
	console.log('Exercise #7')
	let a = 'test';
	if (a == 'test') {console.log('Correct')} else {console.log('Uncorrect')};
	a = 'TesT';
	if (a == 'test') {console.log('Correct')} else {console.log('Uncorrect')};
	a = 3;
	if (a == 'test') {console.log('Correct')} else {console.log('Uncorrect')};
}

{
	// ex.8
	console.log('Exercise #8')
	let a = '1';
	if (a === '1') {console.log('Correct')} else {console.log('Uncorrect')};
	a = 1;
	if (a === '1') {console.log('Correct')} else {console.log('Uncorrect')};
	a = 3;
	if (a === '1') {console.log('Correct')} else {console.log('Uncorrect')};
}

{
	// ex.9-1
	console.log('Exercise #9-1')
	let test = Boolean(true);
	if (test === true) {console.log('Correct')} else {console.log('Uncorrect')};
	test = Boolean(false);
	if (test === true) {console.log('Correct')} else {console.log('Uncorrect')};
}

{
	// ex.9-2
	console.log('Exercise #9-2')
	let test = Boolean(true);
	test === true ? console.log('Correct') : console.log('Uncorrect');
	test = Boolean(false);
	test === true ? console.log('Correct') : console.log('Uncorrect');
}

// IF-ELSE + &&, ||
console.log('IF-ELSE + &&, ||', '==============================================')

{
	// ex.1
	console.log('Exercise #1')
	let a = 5;
	if (a > 0 && a < 5) {console.log('Correct')} else {console.log('Uncorrect')};
	a = 0;
	if (a > 0 && a < 5) {console.log('Correct')} else {console.log('Uncorrect')};
	a = -3;
	if (a > 0 && a < 5) {console.log('Correct')} else {console.log('Uncorrect')};
	a = 2;
	if (a > 0 && a < 5) {console.log('Correct')} else {console.log('Uncorrect')};
}

{
	// ex.2
	console.log('Exercise #2')
	let a = 5;
	if (a == 0 || a == 2) {console.log('Correct', a + 7)} else {console.log('Uncorrect', a / 10)};
	a = 0;
	if (a == 0 || a == 2) {console.log('Correct', a + 7)} else {console.log('Uncorrect', a / 10)};
	a = -3;
	if (a == 0 || a == 2) {console.log('Correct', a + 7)} else {console.log('Uncorrect', a / 10)};
	a = 2;
	if (a == 0 || a == 2) {console.log('Correct', a + 7)} else {console.log('Uncorrect', a / 10)};
}

{
	// ex.3
	console.log('Exercise #3')
	let a = 1, b = 3;
	if (a <= 1 && b >= 3) {console.log('Correct', a + b)} else {console.log('Uncorrect', a - b)};
	a = 0; b = 6;
	if (a <= 1 && b >= 3) {console.log('Correct', a + b)} else {console.log('Uncorrect', a - b)};
	a = 3; b = 5;
	if (a <= 1 && b >= 3) {console.log('Correct', a + b)} else {console.log('Uncorrect', a - b)};
}

{
	// ex.4
	console.log('Exercise #4')
	let a = 1, b = 3;
	if ((a > 2 && a < 11) || (b >= 6 && b < 14)) {console.log('Correct')} else {console.log('Uncorrect')};
	a = 0; b = 6;
	if ((a > 2 && a < 11) || (b >= 6 && b < 14)) {console.log('Correct')} else {console.log('Uncorrect')};
	a = 3; b = 5;
	if ((a > 2 && a < 11) || (b >= 6 && b < 14)) {console.log('Correct')} else {console.log('Uncorrect')};
}

// SWITCH-CASE
console.log('SWITCH-CASE', '==============================================')

{
	// ex.1
	console.log('Exercise #1')
	let num = 3, result;
	switch (num) {
		case 1: result = 'Winter'; break;
		case 2: result = 'Spring'; break;
		case 3: result = 'Summer'; break;
		case 4: result = 'Autumn'; break;
		default:;
	}
	console.log(`Answer is ${result}`);
}

// EXERCISES LVL.2
console.log('EXERCISES LVL.2', '==============================================')

{
	// ex.1
	console.log('Exercise #1')
	let day = 15;
	if (day < 1 || day > 31) {console.log(`Wrong date`)}
		else if (day >= 1 && day < 11) {console.log(`First decade`)}
		else if (day >= 11 && day < 21) {console.log(`Second dacade`)}
		else if (day >= 21 && day <= 31) {console.log(`Third decade`)};
}

{
	// ex.2
	console.log('Exercise #2')
	let month = 7;
	if (month < 1 || month > 12) {console.log(`Wrong month`)}
		else if (month === 1 || month === 2 || month === 12) {console.log(`Winter`)}
		else if (month >= 3 && month <= 5) {console.log(`Spring`)}
		else if (month >= 6 && month <= 8) {console.log(`Summer`)}
		else if (month >= 9 && month <= 11) {console.log(`Autumn`)};
}

{
	// ex.3
	console.log('Exercise #3')
	let stroke = `abcde`;
	switch (stroke[0]) {
		case `a`: console.log(`Yes`); break;
		default: console.log(`No`);
	}
}

{
	// ex.4
	console.log('Exercise #4')
	let stroke = `12345`;
	switch (stroke[0]) {
		case `1`: console.log(`Yes`); break;
		case `2`: console.log(`Yes`); break;
		case `3`: console.log(`Yes`); break;
		default: console.log(`No`);
	}
}

{
	// ex.5
	console.log('Exercise #5')
	let stroke = `523`;
	console.log(`Sum = ${Number(stroke[0]) + Number(stroke[1]) + Number(stroke[2])}`)
}

{
	// ex.6
	console.log('Exercise #6')
	let stroke = `523461`;
	let sum1 = Number(stroke[0]) + Number(stroke[1]) + Number(stroke[2]),
		sum2 = Number(stroke[3]) + Number(stroke[4]) + Number(stroke[5]);
	sum1 === sum2 ? console.log(`Yes`) : console.log(`No`);
}

// CYCLES
console.log('CYCLES', '==============================================')

{
	// ex.1-a
	console.log('Exercise #1-a')
	for (let i = 1; i <= 10; ++i) {
		console.log(i);
	};
}

{
	// ex.1-b
	console.log('Exercise #1-b')
	let i = 1;
	while (i <= 10) {
		console.log(i);
		++i;
	};
}

{
	// ex.1-c
	console.log('Exercise #1-c')
	let i = 1;
	do {
		console.log(i);
		++i;
	} while (i <= 10);
}

{
	// ex.2-a
	console.log('Exercise #2-a')
	for (let i = 10; i >= 1; --i) {
		console.log(i);
	};
}

{
	// ex.2-b
	console.log('Exercise #2-b')
	let i = 10;
	while (i >= 1) {
		console.log(i);
		--i;
	};
}

{
	// ex.1-c
	console.log('Exercise #3-c')
	let i = 10;
	do {
		console.log(i);
		--i;
	} while (i >= 1);
}

{
	// ex.3-a
	console.log('Exercise #3-a')
	for (let i = 1; i <= 10; ++i) {
		if (i % 2 === 0) {console.log(i)};
	};
}

{
	// ex.3-b
	console.log('Exercise #3-b')
	let i = 1;
	while (i <= 10) {
		if (i % 2 === 0) {console.log(i)};
		++i;
	};
}

{
	// ex.1-c
	console.log('Exercise #1-c')
	let i = 1;
	do {
		if (i % 2 === 0) {console.log(i)};
		++i;
	} while (i <= 10);
}