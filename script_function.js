const clientsList = [];   //main database

function addClient () {
	let client = {};   //client questionnaire

	client.first_name = 'John';
	client.last_name = 'Doe';
	client.age = 18;
	client.address = 'USA, Kanzas';
	client.cards = []

	clientsList.push(client);
}

function removeClient (first_name_value = undefined, last_name_value = undefined) {
	first_name_value = 'John';
	last_name_value = 'Doe';

	for (let i = 0; i < clientsList.length; ++i) {
		if (first_name_value === clientsList[i].first_name && last_name_value === clientsList[i].last_name) {
			clientsList.splice(i, 1);
			break;
		}
	}
}

function addClientCard (first_name_value = undefined, last_name_value = undefined) {
	const clientCard = {};

	clientCard.type = 'gold';
	clientCard.currency = 'USD';
	clientCard.money = 0;

	for (let i = 0; i < clientsList.length; ++i) {
		if (first_name_value === clientsList[i].first_name && last_name_value === clientsList[i].last_name) {
			clientsList[i].cards.push(clientCard);
			break;
		}
	}
}

function removeClientCard (first_name_value = undefined, last_name_value = undefined, cardType_value = undefined) {
	clientsList.findIndex(function(elementClient, indexClient) {
		if (elementClient.first_name === first_name_value && elementClient.last_name === last_name_value) {
			return elementClient.cards.findIndex(function(elementCard, indexCard) {
				if (elementCard.type === cardType_value) {
					return clientsList[indexClient].cards.splice(indexCard, 1);
				}
			})
		}
	})
}

function plusMoneyToCard (first_name_value = undefined, last_name_value = undefined, cardType_value = undefined, money_count = undefined) {
	clientsList.findIndex(function(elementClient, indexClient) {
		if (elementClient.first_name === first_name_value && elementClient.last_name === last_name_value) {
			return elementClient.cards.findIndex(function(elementCard, indexCard) {
				if (elementCard.type === cardType_value) {
					return clientsList[indexClient].cards[indexCard].money += money_count;
				}
			})
		}
	})
}

function minusMoneyToCard (first_name_value = undefined, last_name_value = undefined, cardType_value = undefined, money_count = undefined) {
	clientsList.findIndex(function(elementClient, indexClient) {
		if (elementClient.first_name === first_name_value && elementClient.last_name === last_name_value) {
			return elementClient.cards.findIndex(function(elementCard, indexCard) {
				if (elementCard.type === cardType_value) {
					return clientsList[indexClient].cards[indexCard].money -= money_count;
				}
			})
		}
	})
}


addClient ();
addClient ();
addClient ();
addClient ();
addClient ();

removeClient ('John', 'Doe');
removeClient ('John', 'Doe');
removeClient ('John', 'Doe');

addClientCard ('John', 'Doe');
addClientCard ('John', 'Doe');
addClientCard ('John', 'Doe');

removeClientCard ('John', 'Doe', 'gold');
removeClientCard ('John', 'Doe', 'gold');

plusMoneyToCard ('John', 'Doe', 'gold', 450);

minusMoneyToCard ('John', 'Doe', 'gold', 250);

console.log(clientsList)
console.log(clientsList[0].cards)

console.log('---------------------------------------------------')

// let i = clientsList.findIndex ( function (questionnaire) {
// 	if (questionnaire.first_name === 'John') {
// 		return questionnaire;
// 	}
// } )
// console.log(i)