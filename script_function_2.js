const fs = require('fs'); // file system

let data = {};

if (fs.existsSync('./data.json', 'utf8') === true) {
	data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
} else {
	data.clients = [];
	data.cards = [];
}
	
const clientsList = data.clients;
const cardsList = data.cards;

const Bank = function () {
	
	function saveData () {
		return fs.writeFileSync('data.json', JSON.stringify({clients: clientsList, cards: cardsList}), 'utf8')
	}

	function randomizeCardNumber () {
		return `${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}-${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}-${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}-${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`
	}

	function randomizeCVV () {
		return `${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`
	}

	function getClient (passportID) {
		return clientsList.filter(client => client.passportID === passportID)
	}

	function activateClient (passportID, firstName, lastName, age) {
		if (getClient(passportID).length > 0) {
			if (getClient(passportID)[0].activeStatus === true) {
				return console.log('Sorry! Client with that passportID is active.')
			} else if (getClient(passportID)[0].firstName === firstName && getClient(passportID)[0].lastName === lastName && getClient(passportID)[0].age === age) {
				getClient(passportID)[0].activeStatus = true;
				return saveData()
			} else {
				return console.log('Client information has a mistake!')
			}
		} else if (age < 18) {
			return console.log('Client is too young.')
		} else {
			clientsList.push({
				passportID: passportID,
				firstName: firstName,
				lastName: lastName,
				age: age,
				activatinDate: new Date().toLocaleDateString(),
				activeStatus: true
			})
			return saveData()
		}
	}

	function deactivateClient (passportID) {
		if (getClient(passportID).length > 0) {
			getCard(passportID).forEach(card => card.activeStatus = false);
			getClient(passportID)[0].activeStatus = false;
			return saveData()
		} else {
			return console.log("We don't have that client.")
		}
	}

	function getCard (passportID) {
		return cardsList.filter(card => card.passportID === passportID)
	}

	function addCard (passportID) {
		if (getClient(passportID)[0].activeStatus === true) {
			cardsList.push({
				passportID: passportID,
				cardNumber: randomizeCardNumber(),
				CVV: randomizeCVV(),
				activationDate: new Date().toLocaleDateString(),
				expiredDate: (new Date().getFullYear() + 2) + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
				money: 0,
				activeStatus: true
			});
			return saveData()
		} else {
			return console.log('Firstly register client questionnaire.')
		}
	}

	function updateCard (passportID, cardNumber) {
		if (getClient(passportID)[0].activeStatus === true) {
			const money = cardsList.filter(card => card.cardNumber === cardNumber)[0].money;
			cardsList.splice(cardsList.findIndex(card => card.cardNumber === cardNumber), 1);
			cardsList.push({
				passportID: passportID,
				cardNumber: randomizeCardNumber(),
				CVV: randomizeCVV(),
				activationDate: new Date().toLocaleDateString(),
				expiredDate: (new Date().getFullYear() + 2) + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
				money: money,
				activeStatus: true
			});
			return saveData()
		} else if (cardsList.filter(card => card.cardNumber === cardNumber).length === 0) {
			return console.log("Client don't have that card.")
		} else {
			return console.log("We don't have that client.")
		}
	}

	function deactivateCard (cardNumber) {
		if (cardsList.filter(card => card.cardNumber === cardNumber).length > 0) {
			cardsList.filter(card => card.cardNumber === cardNumber)[0].activeStatus = false;
			return saveData()
		} else {
			return console.log('Card not found!')
		}
	}

	function updateBalance (cardNumber, delta) {
		if (cardsList.filter(card => card.cardNumber === cardNumber).length > 0) {
			cardsList.filter(card => card.cardNumber === cardNumber)[0].money += delta;
			return saveData()
		} else {
			return console.log('Card not found!')
		}
	}

	return {
		getClient: getClient,
		activateClient: activateClient,
		deactivateClient: deactivateClient,

		getCard: getCard,
		addCard: addCard,
		updateCard: updateCard,
		deactivateCard: deactivateCard,

		updateBalance: updateBalance
	}
} ();


Bank.activateClient('YU485926', 'John', 'Doe', 28)
Bank.activateClient('OU484526', 'Peter', 'Crugge', 32)
console.log(clientsList)

console.log('-------------------------------------------')

Bank.addCard('YU485926')
Bank.addCard('OU484526')
console.log(cardsList)

// console.log('===========================================')
