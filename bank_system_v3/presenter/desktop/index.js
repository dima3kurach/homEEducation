const Bank = require(`${__dirname}/../../model/core.js`)
const bank = new Bank

const admin = 'admin'
const client = 'client'

const pageConstruct = require(`${__dirname}/../../view/page_constructor.js`)

const express = require('express')
var bodyParser = require('body-parser')
const app = express()

var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: false }))

const port = 3000
const sessions = []
const sessionCatcher = (key) => {
   return sessions.find(session => session.key === key)
}
const sessionHistory = (history, currentPage) => {
   if (history[0] != currentPage) history.unshift(currentPage)
   if (history.length > 5) history.pop()
}

app.use('/assets', express.static(`${__dirname}/../../view/assets`))

app.get('/', jsonParser, (req, res) => {
   //AUTHORIZATION------------------------
   if (req.query.isAdminClient) {
      const role = req.query.isAdminClient
      res.send(pageConstruct[role].authorization())
   }

   //HOME---------------------------------
   if (req.query.index) {
      res.send(pageConstruct.index())
   }
   res.send(pageConstruct.index())
})

app.post('/', jsonParser, (req, res) => {
   try {
      //AUTHORIZATION CONFIRM----------------
      if (req.body.loginSubmit) {
         const id = req.body.id
         const secret = req.body.secret
         const role = req.body.loginSubmit
         const loginAdmin = role === admin && bank.getAdmin(id) && bank.getAdmin(id).pass === secret ? true : false
         const loginClient = role === client && bank.getCardByNum(id) && bank.getCardByNum(id).PIN === secret ? true : false
         if (!loginAdmin && !loginClient)
            throw {
               message: 'Authorization unsuccessful',
               role: role
            }
         const session = {
            key: Math.random().toString(36).substring(6),
            id: id,
            role: role,
            history: ['mainMenu']
         }
         sessions.push(session)
         res.send(pageConstruct[session.role].mainMenu(session))
      }

      //CLEAR COOKIE-------------------------
      if (req.body.mainMenu) {
         delete sessionCatcher(req.body.mainMenu).cookie
      }

      //ADMIN(actions)-----------------------
      //Check input for error
      const emptyInputError = (btn, input) => {
         if (btn && input === '') {
            const session = sessionCatcher(btn)
            throw {
               message: 'Empty input',
               session: session
            }
         }
      }
      //Add client
      if (req.body.viewNewClient) {
         const session = sessionCatcher(req.body.viewNewClient)
         const newClientInfo = [req.body.passID, req.body.firstName, req.body.lastName, req.body.birthDay]
         const unemptyInputs = newClientInfo.every(elem => elem.length > 0)
         if (unemptyInputs) {
            session.cookie = {
               client: bank.addClient(...newClientInfo).client
            }
         } else {
            throw {
               message: 'Empty inputs',
               session: session
            }
         }
      }
      //Find client
      emptyInputError(req.body.viewClient, req.body.passIDtoFindClient)
      if (req.body.viewClient) {
         const session = sessionCatcher(req.body.viewClient)
         if (!session.cookie || !session.cookie.client) session.cookie = {
            client: req.body.passIDtoFindClient ? bank.getClient(req.body.passIDtoFindClient) : bank.getClient(session.cookie.card.passportID)
         }
      }
      //Activate client
      if (req.body.activateClientConfirm) {
         const session = sessionCatcher(req.body.activateClientConfirm)
         bank.activateClient(session.cookie.client.passportID)
      }
      //Deactivate client
      if (req.body.success === 'deactivateClient') {
         const session = sessionCatcher(req.body.key)
         bank.deactivateClient(session.cookie.client.passportID)
      }
      //Add card
      emptyInputError(req.body.viewCard, req.body.passIDtoAddCard)
      if (req.body.passIDtoAddCard) {
         const session = sessionCatcher(req.body.viewCard)
         session.cookie = {
            card: bank.addCard(req.body.passIDtoAddCard)
         }
      }
      //Add card for client
      if (req.body.addCardForClient) {
         const session = sessionCatcher(req.body.addCardForClient)
         session.cookie = {
            card: session.cookie.client ? bank.addCard(session.cookie.client.passportID) : bank.addCard(session.cookie.cards[0].passportID)
         }
      }
      //Refresh card
      if (req.body.refreshCard) {
         const session = sessionCatcher(req.body.refreshCard)
         session.cookie = {
            card: bank.refreshCard(session.cookie.card.cardNumber)
         }
      }
      //Deactivate card
      if (req.body.deactivateClientCardConfirm) {
         const session = sessionCatcher(req.body.deactivateClientCardConfirm)
         bank.deactivateCard(session.cookie.card.cardNumber)
      }
      //Find card
      emptyInputError(req.body.viewCard, req.body.cardNum)
      if (req.body.cardNum) {
         const session = sessionCatcher(req.body.viewCard)
         const findClientCard = card => {
            if (card.passportID === session.cookie.cards[0].passportID && card.cardNumber === req.body.cardNum)
               return card
         }
         session.cookie = {
            card: !session.cookie || !session.cookie.cards ? bank.getCardByNum(req.body.cardNum) : session.cookie.cards.find(findClientCard)
         }
      }
      //View all clients
      if (req.body.viewAllClients) {
         const session = sessionCatcher(req.body.viewAllClients)
         session.cookie = {
            clients: bank.getAllClients()
         }
      }
      //View client from all clients
      if (req.body.viewClientByPassID) {
         const session = sessionCatcher(req.body.keyForClientPage)
         session.cookie = {
            client: bank.getClient(req.body.viewClientByPassID)
         }
      }
      //View client cards
      if (req.body.viewClientCards) {
         const session = sessionCatcher(req.body.viewClientCards)
         session.cookie = {
            cards: bank.getCards(session.cookie.client.passportID)
         }
      }
      //View card from client cards
      if (req.body.viewCardByNum) {
         const session = sessionCatcher(req.body.keyForCardPage)
         session.cookie = {
            card: bank.getCardByNum(req.body.viewCardByNum)
         }
      }

      //CLIENT(actions)----------------------
      //Withdraw money
      if (parseInt(req.body.summMinus) > 0) {
         const id = sessionCatcher(req.body.viewBalance).id
         const summ = parseInt(req.body.summMinus)
         const balance = bank.getCardByNum(id).balance
         if (balance >= summ) {
            bank.updateBalance(id, -summ)
         } else {
            throw {
               message: 'Balance is too low',
               session: sessionCatcher(req.body.viewBalance)
            }
         }
      } else if (req.body.summMinus) {
         throw {
            message: 'Wrong summ',
            session: sessionCatcher(req.body.viewBalance)
         }
      }
      //Put money
      if (parseInt(req.body.summPlus) > 0) {
         const id = sessionCatcher(req.body.viewBalance).id
         const summ = parseInt(req.body.summPlus)
         bank.updateBalance(id, summ)
      } else if (req.body.summPlus) {
         throw {
            message: 'Wrong summ',
            session: sessionCatcher(req.body.viewBalance)
         }
      }
      //View balance
      if (req.body.viewBalance) {
         const session = sessionCatcher(req.body.viewBalance)
         session.cookie = {
            balance: bank.getCardByNum(session.id).balance
         }
      }
      //Change PIN
      if (parseInt(req.body.newPIN) > 999 & parseInt(req.body.newPIN) < 10000) {
         const id = sessionCatcher(req.body.success).id
         const oldPIN = req.body.oldPIN
         const newPIN = req.body.newPIN
         if (oldPIN === bank.getCardByNum(id).PIN) {
            bank.changePIN(id, newPIN)
         } else {
            throw {
               message: 'Wrong PIN',
               session: sessionCatcher(req.body.success)
            }
         }
      } else if (req.body.newPIN) {
         throw {
            message: 'Incorrect new PIN',
            session: sessionCatcher(req.body.success)
         }
      }
      //Deactivate card
      if (req.body.deactivateConfirm) {
         const id = sessionCatcher(req.body.deactivateConfirm).id
         bank.deactivateCard(id)
      }
   }
   //ERROR--------------------------------
   catch (err) {
      res.send(pageConstruct.errorPage(err))
   }

   //SUCCESS------------------------------
   if (req.body.success) {
      const session = req.body.key ? sessionCatcher(req.body.key) : sessionCatcher(req.body.success)
      res.send(pageConstruct.successPage(session))
   }

   //BACK---------------------------------
   if (req.body.back) {
      const session = sessionCatcher(req.body.back)
      session.history.shift()
      res.send(pageConstruct[session.role][session.history[0]](session))
   }

   //QUIT---------------------------------
   if (req.body.quit) {
      const sessionToDelete = sessions.findIndex(session => session.key === req.body.quit)
      sessions.splice(sessionToDelete, 1)
      res.send(pageConstruct.index())
   }

   //FUNCTION-TRIGGER---------------------
   const seePage = (condition, page) => {
      if (condition) {
         const session = sessionCatcher(condition)
         sessionHistory(session.history, page)
         return res.send(pageConstruct[session.role][page](session))
      }
   }

   //MAIN MENU----------------------------
   seePage(req.body.mainMenu, 'mainMenu')

   //ADMIN(pages)-------------------------
   seePage(req.body.viewAllClients, 'viewAllClients')
   seePage(req.body.addClient, 'addClient')
   seePage(req.body.findClient, 'findClient')
   seePage(req.body.viewNewClient, 'viewClient')
   seePage(req.body.viewClient, 'viewClient')
   seePage(req.body.keyForClientPage, 'viewClient')
   seePage(req.body.activateClientConfirm, 'viewClient')
   seePage(req.body.activateClient, 'activateClient')
   seePage(req.body.deactivateClient, 'deactivateClient')
   seePage(req.body.viewClientCards, 'viewClientCards')
   seePage(req.body.addCard, 'addCard')
   seePage(req.body.findCard, 'findCard')
   seePage(req.body.deactivateClientCardConfirm, 'deactivateClientCardConfirm')
   seePage(req.body.deactivateClientCard, 'deactivateClientCard')
   seePage(req.body.viewCard, 'viewCard')
   seePage(req.body.addCardForClient, 'viewCard')
   seePage(req.body.refreshCard, 'viewCard')
   seePage(req.body.keyForCardPage, 'viewCard')

   //CLIENT(pages)------------------------
   seePage(req.body.viewBalance, 'balance')
   seePage(req.body.withdrawMoney, 'withdrawMoney')
   seePage(req.body.putMoney, 'putMoney')
   seePage(req.body.changePIN, 'changePIN')
   seePage(req.body.deactivateCard, 'deactivateCard')
   seePage(req.body.deactivateConfirm, 'deactivateConfirm')
})

app.listen(port)
console.log(`Listening port ${port}`)