const fs = require('fs'); // file system
const readline = require('readline'); //input-output
	

const Bank = function () {
	const adminsData = [];
	const host1 = {
		firstName: 'Mahatma',
		lastName: 'Gandi',
		position: 'administrator',
		login: 'admin',
		pass: 'ad123'
	}
	adminsData.push(host1);

	const saveData = () => {
		return fs.writeFileSync('data.json', JSON.stringify(data), 'utf8')
	}

	const loadData = () => {
		if (fs.existsSync('./data.json', 'utf0')) { 
			return JSON.parse(fs.readFileSync('./data.json', 'utf8'))
		}
		else {
			return {clients: [], cards: []}
		}
	}

	const data = loadData();

	const createCVV = () => {
		return `${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`
	}

	const createPIN = () => {
		return `${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`
	}

	const createCardNumber = () => {
		return `${createPIN()}-${createPIN()}-${createPIN()}-${createPIN()}`
	}

	const calculateAge = (birthDay) => {
		let ageDifMs = Date.now() - new Date(birthDay);
		let ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970)
	}

	const getClient = (passportID) => {
		const client = data.clients.find(client => client.passportID === passportID)
		if (client && client.activeStatus) {
			return client
		} else {
			throw {'message' : "We don't have that client"}
		}
	}

	const activateClient = (passportID, firstName, lastName, birthDay) => {
		if (calculateAge(birthDay) >= 18) {
			data.clients.push({
				passportID: passportID,
				firstName: firstName,
				lastName: lastName,
				birthDay: birthDay,
				activatinDate: new Date().toLocaleDateString(),
				activeStatus: true
			});
			return getClient(passportID)
		} else {
			throw {'message' : 'Client is too young'}
		}
		// getClient(passportID).activatinDate = new Date().toLocaleDateString();
		// getClient(passportID).activeStatus = true;
		// return getClient(passportID)
	}

	const deactivateClient = (passportID) => {
		const client = getClient(passportID);
		getCards(passportID).forEach(card => card.activeStatus = false);
		client.activeStatus = false;
		return client
	}

	const getCards = (passportID) => {
		const cards = data.cards.filter(card => {
			if (card.passportID === passportID && card.activeStatus) {
				return card
			}
		});
		if (cards) {
			return cards
		} else {
			throw{'message' : 'Cards not found'}
		}
	}

	const getCardByNum = (cardNumber) => {
		const card = data.cards.find(card => card.cardNumber === cardNumber);
		if (card && card.activeStatus) {
			return card
		} else {
			throw{'message' : 'That card not found'}
		}
	}

	const addCard = (passportID) => {
		const client = getClient(passportID);
		const cardNumber = createCardNumber();
		data.cards.push({
			passportID: passportID,
			cardNumber: cardNumber,
			CVV: createCVV(),
			PIN: createPIN(),
			activationDate: new Date().toLocaleDateString(),
			expiredDate: `${new Date().getFullYear() + 2}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
			balance: 0,
			activeStatus: true
		});
		return getCardByNum(cardNumber)
	}

	const deactivateCard = (cardNumber) => {
		const card = getCardByNum(cardNumber);
		card.activeStatus = false;
		return card
	}

	const updateCard = (cardNumber) => {
		const card = getCardByNum(cardNumber);
		const passportID = card.passportID;
		const balance = card.balance;
		const newCardNum = createCardNumber();
		card.activeStatus = false;
		data.cards.push({
			passportID: passportID,
			cardNumber: newCardNum,
			CVV: createCVV(),
			PIN: createPIN(),
			activationDate: new Date().toLocaleDateString(),
			expiredDate: `${new Date().getFullYear() + 2}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
			balance: balance,
			activeStatus: true
		});
		return getCardByNum(newCardNum)
	}

	const updateBalance = (cardNumber, delta) => {
		const card = getCardByNum(cardNumber);
		card.balance += delta;
		return card
	}

	const savingChanges = (func) => {
		return (...args) => {
			const result = func(...args);
			saveData();
			return result;
		}
	}

	const errorsCatcher = (func) => {
		return (...args) => {
			try {
				return func(...args)
			}
			catch (err) {
				console.log(err)
			}
		}
	}

	return {
		getClient: errorsCatcher(getClient),
		activateClient: errorsCatcher(savingChanges(activateClient)),
		deactivateClient: errorsCatcher(savingChanges(deactivateClient)),

		getCards: errorsCatcher(getCards),
		getCardByNum: errorsCatcher(getCardByNum),
		addCard: errorsCatcher(savingChanges(addCard)),
		deactivateCard: errorsCatcher(savingChanges(deactivateCard)),
		updateCard: errorsCatcher(savingChanges(updateCard)),

		updateBalance: errorsCatcher(savingChanges(updateBalance))
	}
} ();


const Interface = function () {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	const checkPIN = (card, i = 0) => {
		rl.question('Input PIN code\n', (answerPIN) => {
			if (card.PIN == answerPIN) {
				helloClient(card)
			} else if (i < 2) {
				console.log(`Wrong PIN! You have ${2-i} more tries`)
				checkPIN(card, ++i)
			} else {
				console.log('Card locked');
				rl.close();
			}
		})
	}

	const helloClient = (card) => {
		const client = Bank.getClient(card.passportID)
		console.log(`Hello ${client.firstName}`);
		questionsToClient();
		answersSystemClient(card);
	}

	const questionsToClient = () => {
		console.log('----------------------------------------');
		console.log('What do you want to do?');
		console.log('1 - View your card balance');
		console.log('2 - Change balance on card');
		console.log('0 - If you want to close program')
	}

	const answersSystemClient = (card) => {
		rl.question('', (answer) => {
			switch (answer) {
				case '1': 
					console.log('----------------------------------------');
					console.log(`Balance is ${card.balance}`);
					continueWork(card, questionsToClient, answersSystemClient);
					break;
				case '2': 
					console.log('----------------------------------------');
					rl.question('What the sum\n', (answerSum) => {
						Bank.updateBalance(card.cardNumber, -parseInt(answerSum, 10));
						console.log(`New balance is ${Bank.getCardByNum(card.cardNumber).balance}`);
						continueWork(card, questionsToClient, answersSystemClient);
					});
					break;
				case '0': rl.close(); break;
				default:
					console.log('Answer has a mistake, repeate please');
					answersSystemClient(card);
			}
		});
	}

	const checkPass = (host) => {
		rl.question('Input password\n', (answerPass) => {
			if (host.pass == answerPass) {
				console.log('Access allowed');
				clientRequestQuestions();
				clientRequest()
			} else {
				console.log('Access denided');
				rl.close();
			}
		})
	}

	const clientRequestQuestions = () => {
		console.log('----------------------------------------');
		console.log('What do you want to do?');
		console.log('1 - Find client');
		console.log('2 - Add new client');
		console.log('3 - Remove client');
		console.log('4 - Find client cards');
		console.log('5 - Find client card with number');
		console.log('6 - Change balance');
		console.log('7 - Add card');
		console.log('8 - Update card');
		console.log('9 - Remove card');
		console.log('0 - If you want to close program')
	}

	const clientRequest = (clientPassportID) => {
		rl.question('', (answer) => {
			switch (answer) {
				case '1': 
					console.log('----------------------------------------');
					actions147(clientPassportID, Bank.getClient);
					break;
				case '2': 
					console.log('----------------------------------------');
					action2(clientPassportID, Bank.activateClient)
					break;
				case '3': 
					console.log('----------------------------------------');
					action3(clientPassportID, Bank.deactivateClient)
					break;
				case '4': 
					console.log('----------------------------------------');
					actions147(clientPassportID, Bank.getCards);
					break;
				case '5': 
					console.log('----------------------------------------');
					actions589(Bank.getCardByNum);
					break;
				case '6': 
					console.log('----------------------------------------');
					action6(Bank.updateBalance);
					break;
				case '7': 
					console.log('----------------------------------------');
					actions147(clientPassportID, Bank.addCard);
					break;
				case '8': 
					console.log('----------------------------------------');
					actions589(Bank.updateCard);
					break;
				case '9': 
					console.log('----------------------------------------');
					actions589(Bank.deactivateCard);
					break;
				case '0': rl.close(); break;
				default:
					console.log('Answer has a mistake, repeate please');
					clientRequest();
			}
		});
	}

	const actions147 = (passportID, func) => {
		if (!passportID) {
			rl.question('Input client passportID\n', (answer) => {
				if (Bank.getClient(answer)) {
					console.log(func(answer));
					continueWork(answer, clientRequestQuestions, clientRequest, true)
				} else {
					console.log("Client doesn't exist")
					// throw{
					// 	'message' : "Client doesn't exist"
					// }
					actions147(passportID, func)
				}
			});
		} else {
			console.log(func(passportID));
			continueWork(passportID, clientRequestQuestions, clientRequest, true)
		}
	}

	const action2 = (passportID, func) => {
		if (!passportID) {
			let newClientPassID, firstName, lastName, birthDay;
			rl.question('Write passportID\n', (newClientPassID) => {
				rl.question('Write first name\n', (firstName) => {
					rl.question('Write first name\n', (lastName) => {
						rl.question('Write birthDay\n', (birthDay) => {
							console.log(Bank.activateClient(newClientPassID, firstName, lastName, birthDay));
							continueWork(newClientPassID, clientRequestQuestions, clientRequest, true)
						});
					});
				});
			});
		} else {
			console.log('Client is already active')
			continueWork(passportID, clientRequestQuestions, clientRequest, true)
		}
	}

	const action3 = (passportID, func) => {
		if (!passportID) {
			rl.question('Input client passportID\n', (answer) => {
				console.log(func(answer));
				clientRequestQuestions();
				clientRequest();
			});
		} else {
			console.log(func(passportID));
			clientRequestQuestions();
			clientRequest();
		}
	}

	const actions589 = (func) => {
		rl.question('Input card number\n', (answer) => {
			const result = func(answer);
			console.log(result);
			continueWork(result.passportID, clientRequestQuestions, clientRequest, true)
		})
	}

	const action6 = (func) => {
		rl.question('Input card number\n', (answer) => {
			rl.question('What the sum\n',  (answerSum) => {
				const result = func(answer, parseInt(answerSum, 10));
				console.log(result);
				continueWork(result.passportID, clientRequestQuestions, clientRequest, true)
			})
		})
	}

	const continueWork = (x, func1, func2, host) => {
		console.log('----------------------------------------');
		rl.question('Something else(YES/NO)\n', (answer) => {
			if (answer === 'no' || answer === 'NO') {
				if (!host) {
					rl.close()
				} else {
					func1();
					return func2()
				}
			} else {
				func1();
				return func2(x)
			}
		})
	}

	const systemQA = () => {
		rl.question('Please input your card number(or login if you an administrator))\n', (answer) => {
			if (Bank.getCardByNum(answer)) {
				checkPIN(Bank.getCardByNum(answer))			
			} else if (adminsData.find(host => host.login === answer)) {
				checkPass(adminsData.find(host => host.login === answer))
			} else {
				console.log('Account not found. Repeate please');
				systemQA();
			}
		});
	}

	const errorsCatcher = (func) => {
		return (...args) => {
			try {
				return func(...args)
			}
			catch (err) {
				console.log(err)
			}
		}
	}

	return {
		systemQA: errorsCatcher(systemQA)
	}
} ();

Interface.systemQA()

/*
Bank.activateClient('YU485926', 'John', 'Doe', '28/05/1985')
Bank.activateClient('OU484526', 'Peter', 'Crugge', '10/10/2000')
console.log(data)

console.log('-------------------------------------------')

Bank.addCard('YU485926')
Bank.addCard('OU484526')
console.log(data)

// console.log('===========================================')
*/
