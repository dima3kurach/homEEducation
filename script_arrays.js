{
	// ex.1
	console.log('Exercise #1')
	const a = [];
	for (var i = 1; i <= 10; ++i) {
		a[i - 1] = 'x';
	};
	console.log(a);
};

console.log('---------------------------------------------');

{
	// ex.2
	console.log('Exercise #2')
	const a = [];
	for (var i = 1; i <= 10; ++i) {
		a[i - 1] = i;
	};
	console.log(a);
};

console.log('---------------------------------------------');

{
	// ex.3
	console.log('Exercise #3')
	const a = [];
	for (var i = 1; i <= 10; ++i) {
		a[i - 1] = Math.random();
		a[i - 1] = a[i - 1].toFixed(2);
		a[i - 1] = Number(a[i - 1]);
	};
	console.log(a);
};

console.log('---------------------------------------------');

{
	// ex.4
	console.log('Exercise #4')
	const a = [];
	for (var i = 1; i <= 10; ++i) {
		a[i - 1] = Math.round(Math.random()*10);
	};
	console.log(a);
};

console.log('---------------------------------------------');

{
	// ex.5
	console.log('Exercise #5')
	const a = [];
	for (var i = 1; i <= 10; ++i) {
		a[i - 1] = Math.floor(Math.random() * 20) - 10;
	};
	console.log('Right elements :')
	for (var i = 1; i <= 10; ++i) {
		if (a[i - 1] > 0 && a[i - 1] < 10) {console.log(`${a[i - 1]}`)};
	};
};

console.log('---------------------------------------------');

{
	// ex.6
	console.log('Exercise #6')
	const a = [];
	for (var i = 1; i <= 10; ++i) {
		a[i - 1] = Math.round(Math.random() * 10);
	};
	for (var i = 1; i <= 10; ++i) {
		if (a[i - 1] === 5) {
			console.log('Yes');
			break;
		};
		if (i === 10) {
			console.log('No');
		};
	};
};

console.log('---------------------------------------------');

{
	// ex.7
	console.log('Exercise #7')
	const a = [];
	let sum = 0;
	for (var i = 1; i <= 10; ++i) {
		a[i - 1] = Math.round(Math.random() * 10);
		sum = sum + a[i - 1];
	};
	console.log(`Summary = ${sum}`);
};

console.log('---------------------------------------------');

{
	// ex.8
	console.log('Exercise #8')
	const a = [];
	let sum = 0;
	for (var i = 1; i <= 10; ++i) {
		a[i - 1] = Math.round(Math.random() * 10);
		sum = sum + a[i - 1]**2;
	};
	console.log(`Summary = ${sum}`);
};

console.log('---------------------------------------------');

{
	// ex.9
	console.log('Exercise #9')
	const a = [];
	let sum = 0;
	for (var i = 1; i <= 10; ++i) {
		a[i - 1] = Math.round(Math.random() * 10);
		sum = sum + a[i - 1];
	};
	console.log(`Arithmetic Mean = ${sum/a.length}`);
};