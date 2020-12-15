const fs = require('fs'); // file system

const Bank = function () {
	const admins = [];
	const host1 = {
		position: 'administrator',
		login: 'admin',
		pass: 'ad123'
	}
	admins.push(host1);

	const saveData = () => {
		return fs.writeFileSync(__dirname + '/../core/data.json', JSON.stringify(data), 'utf8')
	}

	const loadData = () => {
		if (fs.existsSync(__dirname + '/../core/data.json', 'utf0')) {
			return JSON.parse(fs.readFileSync(__dirname + '/../core/data.json', 'utf8'))
		}
		else {
			return { clients: [], cards: [] }
		}
	}

	const data = Object.assign({ admins: admins }, loadData());

	const createCVV = () => {
		return `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
	}

	const createPIN = () => {
		return `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
	}

	const createCardNumber = () => {
		return `${createPIN()}-${createPIN()}-${createPIN()}-${createPIN()}`
	}

	const isExistClient = (passportID) => {
		const client = data.clients.find(client => client.passportID === passportID);
		if (!client) {
			return true
		} else {
			throw { 'massage': 'Client is already exist' }
		}
	}

	const calculateAge = (birthDay) => {
		let ageDifMs = Date.now() - new Date(birthDay);
		let ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970)
	}

	const getAdmin = (login) => {
		const admin = data.admins.find(admin => admin.login === login)
		if (admin) {
			return admin
		} else {
			throw { 'message': "We don't have that employee" }
		}
	}

	const getAllClients = () => {
		const clients = data.clients;
		//const clients = data.clients.filter(client => client.activeStatus === true);
		if (clients) {
			return clients
		} else {
			throw { 'message': 'Data is empty' }
		}
	}

	const getClient = (passportID) => {
		const client = data.clients.find(client => client.passportID === passportID);
		if (client) {
			return client
		} else {
			throw { 'message': "We don't have that client" }
		}
	}

	const addClient = (passportID, firstName, lastName, birthDay) => {
		if (isExistClient(passportID) && calculateAge(birthDay) >= 18) {
			data.clients.push({
				passportID: passportID,
				firstName: firstName,
				lastName: lastName,
				birthDay: birthDay,
				activatinDate: new Date().toLocaleDateString(),
				activeStatus: true
			});
			return { client: getClient(passportID), card: addCard(passportID) }
		} else {
			throw { 'message': 'Client is too young' }
		}
	}

	const activateClient = (passportID) => {
		const client = getClient(passportID);
		if (!client.activeStatus) {
			client.activatinDate = new Date().toLocaleDateString();
			client.activeStatus = true;
			return { client: client, card: addCard(passportID) }
		} else {
			throw { 'message': 'Client is already active' }
		}
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
			throw { 'message': 'Cards not found' }
		}
	}

	const getCardByNum = (cardNumber) => {
		const card = data.cards.find(card => card.cardNumber === cardNumber);
		if (card && card.activeStatus) {
			return card
		} else {
			throw { 'message': 'That card not found' }
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

	const refreshCard = (cardNumber) => {
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

	const changePIN = (cardNumber, newPIN) => {
		const card = getCardByNum(cardNumber);
		card.PIN = newPIN;
		return card
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
		getAdmin: errorsCatcher(getAdmin),

		getAllClients: errorsCatcher(getAllClients),
		getClient: errorsCatcher(getClient),
		addClient: errorsCatcher(savingChanges(addClient)),
		activateClient: errorsCatcher(savingChanges(activateClient)),
		deactivateClient: errorsCatcher(savingChanges(deactivateClient)),

		getCards: errorsCatcher(getCards),
		getCardByNum: errorsCatcher(getCardByNum),
		addCard: errorsCatcher(savingChanges(addCard)),
		deactivateCard: errorsCatcher(savingChanges(deactivateCard)),
		refreshCard: errorsCatcher(savingChanges(refreshCard)),
		changePIN: errorsCatcher(savingChanges(changePIN)),

		updateBalance: errorsCatcher(savingChanges(updateBalance))
	}
};

module.exports = Bank
