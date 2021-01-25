const Constructor = function () {
   const webPage = (title, ...tags) => {
      return `<!DOCTYPE html>
      <html lang="en">

      <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>${title}</title>

         <link rel="stylesheet" type="text/css" href="../assets/style.css">
      </head>

      <body>
         ${tags.join('')}
      </body>

      </html>`
   }

   const tagH1 = (text, style) => {
      return `<h1 class="${style}">${text}</h1>`
   }

   const tagH2 = (text, style) => {
      return `<h2 class="${style}">${text}</h2>`
   }

   const tagForm = (action, method, style, ...tags) => {
      return `<form action=${action} method=${method} autocomplete="off" class="${style}">
         ${tags.join('')}
      </form>`
   }

   const tagInput = (label, type, name, style) => {
      return `<div class="${style}">
         <label>
            ${label}
            <input type="${type}" name="${name}">
         </label>
      </div>`
   }

   const tagHiddenInput = (name, value) => {
      return `<input type="hidden" name=${name} value=${value}>`
   }

   const btnSubmit = (text, name, value, style) => {
      return `<button name="${name}" type="submit" value="${value}" class="${style}">${text}</button>`
   }

   const formatObj = obj => {
      let cell = '<p>'
      Object.entries(obj).forEach(([key, value]) => cell += `<span>${key}: </span>${value}<br>`)
      cell += '</p>'
      return cell
   }

   const formatArray = (arr, searchType) => {
      if (searchType === 'client') {
         return arr.map(elem => {
            const formatElem = formatObj(elem)
            const btn = btnSubmit('View client', 'viewClientByPassID', elem.passportID, 'btn')
            return formatElem + btn
         }).join('<hr>')
      }
      if (searchType === 'card') {
         return arr.map(elem => {
            const formatElem = formatObjCard(elem)
            const btn = btnSubmit('View card', 'viewCardByNum', elem.cardNumber, 'btn')
            return formatElem + btn
         }).join('<hr>')
      }
   }

   const formatObjCard = card => {
      const editedCard = Object.assign({}, card)
      delete editedCard.CVV
      delete editedCard.PIN
      return formatObj(editedCard)
   }

   return {
      webPage: webPage,

      tagH1: tagH1,
      tagH2: tagH2,
      tagForm: tagForm,
      tagInput: tagInput,
      tagHiddenInput: tagHiddenInput,
      btnSubmit: btnSubmit,
      formatObj: formatObj,
      formatArray: formatArray,
      formatObjCard: formatObjCard

   }
}()

const admin = 'admin'
const client = 'client'

const pageConstruct = {
   index: () => {
      const title = Constructor.tagH1('Are you a client<br>or an administrator?', 'main_question')
      const btnAdmin = Constructor.btnSubmit('Admin', 'isAdminClient', admin, 'btn')
      const btnClient = Constructor.btnSubmit('Client', 'isAdminClient', client, 'btn')
      const form = Constructor.tagForm('/', 'GET', 'form', btnAdmin, btnClient)

      return Constructor.webPage('Authorization', title, form)
   },
   successPage: session => {
      const title = Constructor.tagH2('Successful action', 'main_question')
      const btnToMenu = Constructor.btnSubmit('Main menu', 'mainMenu', session.key, 'btn')
      const btnEsc = Constructor.btnSubmit('Quit', 'quit', session.key, 'btn')
      const form = Constructor.tagForm('/', 'POST', 'register', btnToMenu, btnEsc)

      return Constructor.webPage('Success', title, form)
   },
   errorPage: err => {
      const title = Constructor.tagH2(err.message, 'main_question')
      let formMethod
      const btns = []
      if (err.role) {
         formMethod = 'GET'
         btns.push(Constructor.btnSubmit('Back', 'isAdminClient', err.role, 'btn'))
         btns.push(Constructor.btnSubmit('Home', 'index', 'homePage', 'btn'))
      }
      if (err.session) {
         formMethod = 'POST'
         btns.push(Constructor.btnSubmit('Back', 'back', err.session.key, 'btn'))
         btns.push(Constructor.btnSubmit('Main menu', 'mainMenu', err.session.key, 'btn'))
         btns.push(Constructor.btnSubmit('Quit', 'quit', err.session.key, 'btn'))
      }
      const form = Constructor.tagForm('/', formMethod, 'register', ...btns)

      return Constructor.webPage('Error', title, form)
   },
   admin: {
      authorization: () => {
         const id = Constructor.tagInput('Login', 'text', 'id', 'wrapper')
         const pass = Constructor.tagInput('Pass', 'password', 'secret', 'wrapper')
         const btnSubmit = Constructor.btnSubmit('Submit', 'loginSubmit', admin, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', id, pass, btnSubmit)

         return Constructor.webPage('Authorization', form)
      },
      mainMenu: session => {
         const btnViewAllClients = Constructor.btnSubmit('View all clients', 'viewAllClients', session.key, 'btn')
         const btnAddClient = Constructor.btnSubmit('Add client', 'addClient', session.key, 'btn')
         const btnFindClient = Constructor.btnSubmit('Find client', 'findClient', session.key, 'btn')
         const btnAddCard = Constructor.btnSubmit('Add card', 'addCard', session.key, 'btn')
         const btnFindCard = Constructor.btnSubmit('Find card', 'findCard', session.key, 'btn')
         const btnEsc = Constructor.btnSubmit('Quit', 'quit', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', btnViewAllClients, btnAddClient, btnFindClient, btnAddCard, btnFindCard, btnEsc)

         return Constructor.webPage('Main menu', form)
      },
      viewAllClients: session => {
         const title = Constructor.tagH2('Clients list', 'main_question')
         const clients = session.cookie.clients
         const list = Constructor.formatArray(clients, 'client')
         const key = Constructor.tagHiddenInput('keyForClientPage', session.key)
         const btnAddClient = Constructor.btnSubmit('Add client', 'addClient', session.key, 'btn')
         const btnFindClient = Constructor.btnSubmit('Find client', 'findClient', session.key, 'btn')
         const btnToMenu = Constructor.btnSubmit('Main menu', 'mainMenu', session.key, 'btn')
         const btnEsc = Constructor.btnSubmit('Quit', 'quit', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', list, key, btnAddClient, btnFindClient, btnToMenu, btnEsc)

         return Constructor.webPage('Clients list', title, form)
      },
      addClient: session => {
         const title = Constructor.tagH2('Add client', 'main_question')
         const passID = Constructor.tagInput('Passport ID', 'text', 'passID', 'wrapper')
         const firstName = Constructor.tagInput('First name', 'text', 'firstName', 'wrapper')
         const lastName = Constructor.tagInput('Last name', 'text', 'lastName', 'wrapper')
         const birthDay = Constructor.tagInput('Day of birth', 'text', 'birthDay', 'wrapper')
         const btnBack = Constructor.btnSubmit('Back', `back`, session.key, 'btn')
         const btnSubmit = Constructor.btnSubmit('Confirm', 'viewNewClient', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', passID, firstName, lastName, birthDay, btnSubmit, btnBack)

         return Constructor.webPage('Add client', title, form)
      },
      findClient: session => {
         const title = Constructor.tagH2('Find client', 'main_question')
         const passID = Constructor.tagInput('Passport ID', 'text', 'passIDtoFindClient', 'wrapper')
         const btnBack = Constructor.btnSubmit('Back', `back`, session.key, 'btn')
         const btnSubmit = Constructor.btnSubmit('Confirm', 'viewClient', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', passID, btnSubmit, btnBack)

         return Constructor.webPage('Find client', title, form)
      },
      viewClient: session => {
         const title = Constructor.tagH2('Client', 'main_question')
         const client = session.cookie.client
         const formatInfo = Constructor.formatObj(client)
         const btns = []
         if (client.activeStatus) {
            btns.push(Constructor.btnSubmit('Deactivate client', 'deactivateClient', session.key, 'btn'))
            btns.push(Constructor.btnSubmit('View client cards', 'viewClientCards', session.key, 'btn'))
            btns.push(Constructor.btnSubmit('Add card for client', 'addCardForClient', session.key, 'btn'))
         } else {
            btns.push(Constructor.btnSubmit('Activate client', 'activateClient', session.key, 'btn'))
         }
         const btnToMenu = Constructor.btnSubmit('Main menu', 'mainMenu', session.key, 'btn')
         const btnEsc = Constructor.btnSubmit('Quit', 'quit', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', ...btns, btnToMenu, btnEsc)

         return Constructor.webPage('Client', title, formatInfo, form)
      },
      activateClient: session => {
         const title = Constructor.tagH2('Activate client?', 'main_question')
         const btnBack = Constructor.btnSubmit('Back', 'back', session.key, 'btn')
         const btnSubmit = Constructor.btnSubmit('Confirm', 'activateClientConfirm', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', btnSubmit, btnBack)

         return Constructor.webPage('Activate client', title, form)
      },
      deactivateClient: session => {
         const title = Constructor.tagH2('Deactivate client?', 'main_question')
         const key = Constructor.tagHiddenInput('key', session.key)
         const btnBack = Constructor.btnSubmit('Back', 'back', session.key, 'btn')
         const btnSubmit = Constructor.btnSubmit('Confirm', 'success', 'deactivateClient', 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', key, btnSubmit, btnBack)

         return Constructor.webPage('Deactivate client', title, form)
      },
      viewClientCards: session => {
         const title = Constructor.tagH2('Client cards', 'main_question')
         const cards = session.cookie.cards
         const list = Constructor.formatArray(cards, 'card')
         const key = Constructor.tagHiddenInput('keyForCardPage', session.key)
         const btns = []
         btns.push(Constructor.btnSubmit('Add card for client', 'addCardForClient', session.key, 'btn'))
         if (cards.length > 1) btns.push(Constructor.btnSubmit('Find client card', 'findCard', session.key, 'btn'))
         const btnToMenu = Constructor.btnSubmit('Main menu', 'mainMenu', session.key, 'btn')
         const btnEsc = Constructor.btnSubmit('Quit', 'quit', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', list, key, ...btns, btnToMenu, btnEsc)

         return Constructor.webPage('Client cards', title, form)
      },
      addCard: session => {
         const title = Constructor.tagH2('Add card', 'main_question')
         const passID = Constructor.tagInput('Passport ID', 'text', 'passIDtoAddCard', 'wrapper')
         const btnBack = Constructor.btnSubmit('Back', `back`, session.key, 'btn')
         const btnSubmit = Constructor.btnSubmit('Confirm', 'viewCard', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', passID, btnSubmit, btnBack)

         return Constructor.webPage('Add card', title, form)
      },
      findCard: session => {
         const title = Constructor.tagH2('Find card', 'main_question')
         const passID = Constructor.tagInput('Card number', 'text', 'cardNum', 'wrapper')
         const btnBack = Constructor.btnSubmit('Back', `back`, session.key, 'btn')
         const btnSubmit = Constructor.btnSubmit('Confirm', 'viewCard', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', passID, btnSubmit, btnBack)

         return Constructor.webPage('Find card', title, form)
      },
      deactivateClientCard: session => {
         const title = Constructor.tagH2('Deactivate card?', 'main_question')
         const btnBack = Constructor.btnSubmit('Back', `back`, session.key, 'btn')
         const btnSubmit = Constructor.btnSubmit('Confirm', 'deactivateClientCardConfirm', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', btnSubmit, btnBack)

         return Constructor.webPage('Deactivate card', title, form)
      },
      deactivateClientCardConfirm: session => {
         const title = Constructor.tagH2('Deactivation confirm', 'main_question')
         const btnToClient = Constructor.btnSubmit('To card owner', 'viewClient', session.key, 'btn')
         const btnToMenu = Constructor.btnSubmit('Main menu', 'mainMenu', session.key, 'btn')
         const btnEsc = Constructor.btnSubmit('Quit', 'quit', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', btnToClient, btnToMenu, btnEsc)

         return Constructor.webPage('Deactivate card', title, form)
      },
      viewCard: session => {
         const title = Constructor.tagH2('Card', 'main_question')
         const card = session.cookie.card
         const formatInfo = Constructor.formatObjCard(card)
         const btns = []
         btns.push(Constructor.btnSubmit('View client', 'viewClient', session.key, 'btn'))
         btns.push(Constructor.btnSubmit('Refresh card', 'refreshCard', session.key, 'btn'))
         btns.push(Constructor.btnSubmit('Deactivate card', 'deactivateClientCard', session.key, 'btn'))
         const btnToMenu = Constructor.btnSubmit('Main menu', 'mainMenu', session.key, 'btn')
         const btnEsc = Constructor.btnSubmit('Quit', 'quit', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', ...btns, btnToMenu, btnEsc)

         return Constructor.webPage('Card', title, formatInfo, form)
      }
   },
   client: {
      authorization: () => {
         const id = Constructor.tagInput('Card Number', 'text', 'id', 'wrapper')
         const pass = Constructor.tagInput('PIN', 'password', 'secret', 'wrapper')
         const submit = Constructor.btnSubmit('Submit', 'loginSubmit', client, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', id, pass, submit)

         return Constructor.webPage('Authorization', form)
      },
      mainMenu: session => {
         const btnBalance = Constructor.btnSubmit('View balance', 'viewBalance', session.key, 'btn')
         const btnWithdrawMoney = Constructor.btnSubmit('Withdraw money', 'withdrawMoney', session.key, 'btn')
         const btnPutMoney = Constructor.btnSubmit('Put money', 'putMoney', session.key, 'btn')
         const btnChangePIN = Constructor.btnSubmit('Change PIN', 'changePIN', session.key, 'btn')
         const btnDeactivateCard = Constructor.btnSubmit('Deactivate card', 'deactivateCard', session.key, 'btn')
         const btnEsc = Constructor.btnSubmit('Quit', 'quit', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', btnBalance, btnWithdrawMoney, btnPutMoney, btnChangePIN, btnDeactivateCard, btnEsc)

         return Constructor.webPage('Main menu', form)
      },
      balance: session => {
         const title = Constructor.tagH2(`Balance is <br><span>${session.cookie.balance}</span>`, 'main_question')
         const btnWithdrawMoney = Constructor.btnSubmit('Withdraw money', 'withdrawMoney', session.key, 'btn')
         const btnPutMoney = Constructor.btnSubmit('Put money', 'putMoney', session.key, 'btn')
         const btnToMenu = Constructor.btnSubmit('Main menu', 'mainMenu', session.key, 'btn')
         const btnEsc = Constructor.btnSubmit('Quit', 'quit', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', btnWithdrawMoney, btnPutMoney, btnToMenu, btnEsc)

         return Constructor.webPage('Balance', title, form)
      },
      withdrawMoney: session => {
         const title = Constructor.tagH2('Withdraw money', 'main_question')
         const summ = Constructor.tagInput('Summ', 'text', 'summMinus', 'wrapper')
         const btnBack = Constructor.btnSubmit('Back', `back`, session.key, 'btn')
         const btnSubmit = Constructor.btnSubmit('Confirm', 'viewBalance', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', summ, btnSubmit, btnBack)

         return Constructor.webPage('Withdraw money', title, form)
      },
      putMoney: session => {
         const title = Constructor.tagH2('Put money', 'main_question')
         const summ = Constructor.tagInput('Summ', 'text', 'summPlus', 'wrapper')
         const btnBack = Constructor.btnSubmit('Back', `back`, session.key, 'btn')
         const btnSubmit = Constructor.btnSubmit('Confirm', 'viewBalance', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', summ, btnSubmit, btnBack)

         return Constructor.webPage('Put money', title, form)
      },
      changePIN: session => {
         const title = Constructor.tagH2('Change PIN', 'main_question')
         const oldPIN = Constructor.tagInput('PIN', 'password', 'oldPIN', 'wrapper')
         const newPIN = Constructor.tagInput('New PIN', 'text', 'newPIN', 'wrapper')
         const btnBack = Constructor.btnSubmit('Back', `back`, session.key, 'btn')
         const btnSubmit = Constructor.btnSubmit('Confirm', 'success', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', oldPIN, newPIN, btnSubmit, btnBack)

         return Constructor.webPage('Change PIN', title, form)
      },
      deactivateCard: session => {
         const title = Constructor.tagH2('Deactivate card?', 'main_question')
         const btnBack = Constructor.btnSubmit('Back', `back`, session.key, 'btn')
         const btnSubmit = Constructor.btnSubmit('Confirm', 'deactivateConfirm', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', btnSubmit, btnBack)

         return Constructor.webPage('Deactivate card', title, form)
      },
      deactivateConfirm: session => {
         const title = Constructor.tagH2('Deactivation confirm', 'main_question')
         const btnEsc = Constructor.btnSubmit('Quit', 'quit', session.key, 'btn')
         const form = Constructor.tagForm('/', 'POST', 'register', btnEsc)

         return Constructor.webPage('Deactivate card', title, form)
      }
   }
}

module.exports = pageConstruct