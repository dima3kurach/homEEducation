const fs = require('fs'); // file system
const readline = require('readline'); //input-output
	
const clientsList = [];
const cardsList = [];

const hostList = [];
const host1 = {
	firstName: 'Mahatma',
	lastName: 'Gandi',
	position: 'administrator',
	login: 'admin',
	pass: 'ad123'
}
hostList.push(host1);


const Bank = function () {

	const loadData = () => {
		if (fs.existsSync('./data.json', 'utf0')) { 
			clientsList.push(...JSON.parse(fs.readFileSync('./data.json', 'utf8')).clients);
			cardsList.push(...JSON.parse(fs.readFileSync('./data.json', 'utf8')).cards);
		}
	}
	
	const saveData = () => {
		return fs.writeFileSync('data.json', JSON.stringify({clients: clientsList, cards: cardsList}), 'utf8')
	}

	loadData()

	const createCardNumber = () => {
		const part1 = `${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`;
		const part2 = `${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`;
		const part3 = `${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`;
		const part4 = `${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`;
		return part1 + '-' + part2 + '-' + part3 + '-' + part4
	}

	const createCVV = () => {
		return `${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`
	}

	const createPIN = () => {
		return `${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`
	}

	const ageCalculation = (birthDay) => {
		let ageDifMs = Date.now() - new Date(birthDay);
		let ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970)
	}

	const getClient = (passportID) => {
			return clientsList.find(client => client.passportID === passportID)
	}

	const activateClient = (passportID, firstName, lastName, birthDay) => {
		const filtrateClient = getClient(passportID);
		if (filtrateClient) {
			if (filtrateClient.activeStatus) {
				throw {
					'message' : 'User already active'
				}
			} else {
				getClient(passportID).activatinDate = new Date().toLocaleDateString();
				getClient(passportID).activeStatus = true;
				return getClient(passportID)
			}
		} else if (ageCalculation(birthDay) < 18) {
			throw {
		 		'message' : 'Client is too young'
		 	}
		} else {
			clientsList.push({
				passportID: passportID,
				firstName: firstName,
				lastName: lastName,
				birthDay: birthDay,
				activatinDate: new Date().toLocaleDateString(),
				activeStatus: true
			});
			return getClient(passportID)
		}
	}

	const deactivateClient = (passportID) => {
		if (getClient(passportID)) {
			getCards(passportID).forEach(card => card.activeStatus = false);
			getClient(passportID).activeStatus = false;
			return getClient(passportID)
		} else {
			throw {
				'message' : "We don't have that client"
			}
		}
	}

	const getCards = (passportID) => {
		return cardsList.filter(card => card.passportID === passportID)
	}

	const getCardWithNum = (cardNumber) => {
		return cardsList.find( card => card.cardNumber === cardNumber)
	}

	const addCard = (passportID) => {
		if (getClient(passportID) && getClient(passportID).activeStatus) {
			const cardNumber = createCardNumber();
			cardsList.push({
				passportID: passportID,
				cardNumber: cardNumber,
				CVV: createCVV(),
				PIN: createPIN(),
				activationDate: new Date().toLocaleDateString(),
				expiredDate: (new Date().getFullYear() + 2) + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
				balance: 0,
				activeStatus: true
			});
			return getCardWithNum(cardNumber)
		} else {
			throw {
				'message' : 'Firstly register client questionnaire'
			}
		}
	}

	const deactivateCard = (cardNumber) => {
		if (getCardWithNum(cardNumber)) {
			getCardWithNum(cardNumber).activeStatus = false;
			return getCardWithNum(cardNumber)
		} else {
			throw {
				'message' : 'That card not found'
			}
		}
	}

	const updateCard = (cardNumber) => {
		if (getCardWithNum(cardNumber) && getCardWithNum(cardNumber).activeStatus) {
			const passportID = getCardWithNum(cardNumber).passportID;
			const balance = cardsList.find(card => card.cardNumber === cardNumber).balance;
			const newCardNum = createCardNumber();
			deactivateCard(cardNumber);
			cardsList.push({
				passportID: passportID,
				cardNumber: newCardNum,
				CVV: createCVV(),
				PIN: createPIN(),
				activationDate: new Date().toLocaleDateString(),
				expiredDate: (new Date().getFullYear() + 2) + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
				balance: balance,
				activeStatus: true
			});
			return getCardWithNum(newCardNum)
		} else {
			throw {
				'message' : "We don't have client with that card"
			}
		}
	}

	const updateBalance = (cardNumber, delta) => {
		if (cardsList.filter(card => card.cardNumber === cardNumber).length > 0) {
			cardsList.filter(card => card.cardNumber === cardNumber)[0].balance += delta;
			return getCardWithNum(cardNumber)
		} else {
			throw {
				'message' : 'That card not found'
			}
		}
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
		getCardWithNum: errorsCatcher(getCardWithNum),
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
						console.log(`New balance is ${Bank.getCardWithNum(card.cardNumber).balance}`);
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
					actions589(Bank.getCardWithNum);
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
			if (Bank.getCardWithNum(answer)) {
				checkPIN(Bank.getCardWithNum(answer))			
			} else if (hostList.find(host => host.login === answer)) {
				checkPass(hostList.find(host => host.login === answer))
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
console.log(clientsList)

console.log('-------------------------------------------')

Bank.addCard('YU485926')
Bank.addCard('OU484526')
console.log(cardsList)

// console.log('===========================================')
*/
