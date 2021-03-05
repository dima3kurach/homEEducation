const readline = require('readline'); //input-output
const Bank = require(`${__dirname}/../model/core.js`);

const Interface = function () {
	const bank = new Bank;

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	const admin = 'admin';
	const client = 'client';

	const authentication = {
		sentence: {
			admin: {
				1: 'Input login\n',
				2: 'Input password\n',
				3: 'Wrong password! Repeat please\n',
				4: 'Authentication successful\n'
			},
			client: {
				1: 'Input card number\n',
				2: 'Input PIN\n',
				3: 'Wrong PIN! You have only',
				4: 'Authentication successful\n'
			},
			func: isAdminClient => {
				return isAdminClient === admin ? authentication.sentence.admin : authentication.sentence.client;
			}
		},
		askId: async isAdminClient => {
			const sentence = authentication.sentence.func(isAdminClient);
			const id = await askQuestion(sentence['1']);
			return await authentication.askSecret(isAdminClient, id)
		},
		askSecret: async (isAdminClient, id) => {
			const sentence = authentication.sentence.func(isAdminClient);
			const datacell = isAdminClient === admin ? bank.getAdmin(id) : bank.getCardByNum(id);
			const trueSecret = isAdminClient === admin ? datacell.pass : datacell.PIN;
			let attempts = isAdminClient === admin ? true : 2;
			let secret = await askQuestion(sentence['2']);

			while (attempts) {
				if (secret === trueSecret) {
					break
				};
				if (isAdminClient === admin) {
					secret = await askQuestion(sentence['3'])
				};
				if (isAdminClient === client) {
					secret = await askQuestion(`${sentence['3']} ${attempts} tries\n`);
					--attempts
				}
			}

			if (attempts) {
				console.log(sentence['4']);
				return id
			} else {
				console.log('Card locked');
				bank.deactivateCard(id);
				return false
			}
		}
	}

	const menu = {
		admin: {
			1: {
				label: 'View all clients',
				action: async () => {
					console.log(__dirname)

					console.log('Clients data:')
					console.log(bank.getAllClients(), '\n')
				}
			},
			2: {
				label: 'Find client',
				action: async () => {
					const passportID = await askQuestion('Input passport ID ');
					console.log('Client account:');
					console.log(bank.getClient(passportID), '\n')
				}
			},
			3: {
				label: 'Find client cards',
				action: async () => {
					const passportID = await askQuestion('Input passport ID ');
					const cards = bank.getCards(passportID).map(card => Object.assign({}, card));
					cards.forEach(card => {
						delete card.CVV;
						delete card.PIN;
						return card
					});

					console.log('Client cards:');
					console.log(cards, '\n')
				}
			},
			4: {
				label: 'Find client card',
				action: async () => {
					const cardNumber = await askQuestion('Input card number ');
					const card = Object.assign({}, bank.getCardByNum(cardNumber));
					delete card.CVV;
					delete card.PIN;
					console.log('Client card:');
					console.log(card, '\n')
				}
			},
			5: {
				label: 'Add or activate client',
				action: async () => {
					const questions = {
						addClient: {
							1: 'Input passport ID ',
							2: 'Input first name ',
							3: 'Input last name ',
							4: 'Input birth day '
						},
						activateClient:
						{
							1: 'Input passport ID '
						}
					};
					const inputs = [];
					const littleMenu = {
						1: {
							label: 'Add client',
							action: async () => {
								for (let i = 1; i < 5; ++i) {
									inputs.push(await askQuestion(questions.addClient[`${i}`]))
								};
								console.log(bank.addClient(...inputs), '\n')
							}
						},
						2: {
							label: 'Activate client',
							action: async () => {
								inputs.push(await askQuestion(questions.activateClient['1']));
								console.log(bank.activateClient(...inputs), '\n')
							}
						}
					};

					let menuType = prepareMenu(littleMenu);
					let answer = await askQuestion(`${menuType}\n`);
					answer !== '0' ? await littleMenu[answer].action() : console.log('');
				}
			},
			6: {
				label: 'Deactivate client',
				action: async () => {
					const passportID = await askQuestion('Input passport ID ');
					console.log('Client deactivated:');
					console.log(bank.deactivateClient(passportID), '\n')
				}
			},
			7: {
				label: 'Add card',
				action: async () => {
					const passportID = await askQuestion('Input passport ID ');
					const card = Object.assign({}, bank.addCard(passportID));
					delete card.CVV;
					delete card.PIN;
					console.log('New card:');
					console.log(card, '\n')
				}
			},
			8: {
				label: 'Refresh card',
				action: async () => {
					const cardNumber = await askQuestion('Input card number ');
					const card = Object.assign({}, bank.refreshCard(cardNumber));
					delete card.CVV;
					delete card.PIN;
					console.log('Card refreshed:');
					console.log(card, '\n')
				}
			},
			9: {
				label: 'Deactivate card',
				action: async () => {
					const cardNumber = await askQuestion('Input card number ');
					const card = Object.assign({}, bank.deactivateCard(cardNumber));
					delete card.CVV;
					delete card.PIN;
					console.log('Card deactivated:');
					console.log(card, '\n')
				}
			}
		},
		client: {
			1: {
				label: 'View balance',
				action: async cardNumber => {
					console.log('Your balance is', bank.getCardByNum(cardNumber).balance, '\n')
				}
			},
			2: {
				label: 'Withdraw money',
				action: async cardNumber => {
					const delta = parseInt(await askQuestion('Input the sum '));
					bank.updateBalance(cardNumber, -delta);
					console.log('New balance is', bank.getCardByNum(cardNumber).balance, '\n')
				}
			},
			3: {
				label: 'Put money',
				action: async cardNumber => {
					const delta = parseInt(await askQuestion('Input the sum '));
					bank.updateBalance(cardNumber, delta);
					console.log('New balance is', bank.getCardByNum(cardNumber).balance, '\n')
				}
			},
			4: {
				label: 'Change PIN',
				action: async cardNumber => {
					const newSecret = await askQuestion('Write new PIN ');
					bank.changePIN(cardNumber, newSecret);
					console.log('Change successful\n')
				}
			},
			5: {
				label: 'Deactivate card',
				action: async cardNumber => {
					bank.deactivateCard(cardNumber);
					console.log('Deactivate successful\n')
				}
			}
		},
		esc_label: '0 - Quit'
	}

	const prepareMenu = menuType => {
		let menuText = '';
		Object.entries(menuType).forEach(([key, value]) => menuText += `${key} - ${value.label}\n`);
		menuText += menu.esc_label;
		return menuText;
	}

	const askQuestion = async question => {
		try {
			return new Promise(resolve => {
				rl.question(question, a => {
					resolve(a)
				})
			})
		}
		catch (err) {
			console.log(err)
		}

	}

	const run = async () => {
		const isAdminClient = (await askQuestion('Are you an admin? (Y/N)\n')).toLowerCase() === 'y' ? admin : client;
		const id = await authentication.askId(isAdminClient);
		const menuType = isAdminClient === admin ? prepareMenu(menu[admin]) : prepareMenu(menu[client]);
		const menuAction = isAdminClient === admin ? menu[admin] : menu[client];
		let answer, checkPIN = false;

		while (id) {
			answer = await askQuestion(`${menuType}\n`);
			if (answer === '0' || (isAdminClient === client && checkPIN && !await authentication.askSecret(isAdminClient, id))) break;
			await menuAction[answer].action(id);
			checkPIN = true
		};

		rl.close()
	}

	return {
		run: run
	}
}();

module.exports = Interface

// return new Promise (resolve => {
// 	rl.question('y/n\n', a => {
// 		resolve(a)
// 	})
// }).then(a => {
// 	console.log(a)
// })
