const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const Bank = require(`${__dirname}/../../model/core.js`)
const bank = new Bank
const pageConfig = require(`${__dirname}/../../presenter/config.js`)

const PORT = 3000
const admin = 'admin'
const client = 'client'
const sessions = []

const sessionCatcher = (key) => {
   return sessions.find(session => session.key === key)
}
const sessionHistory = (history, currentPage) => {
   if (history[0] != currentPage) history.unshift(currentPage)
   if (history.length > 5) history.pop()
}

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/assets', express.static(`${__dirname}/../../presenter/assets`))

app.get('/', jsonParser, (req, res) => {
   //AUTHORIZATION------------------------
   if (req.query.isAdminClient) {
      const role = req.query.isAdminClient
      res.render(`${__dirname}/../../presenter/layout`, pageConfig[role].authorization())
   }

   //HOME---------------------------------
   if (req.query.index) {
      res.render(`${__dirname}/../../presenter/layout`, pageConfig.index())
   }
   //res.send(pageConstruct.index())
   res.render(`${__dirname}/../../presenter/layout`, pageConfig.index())
})

app.post('/', jsonParser, (req, res) => {
   //FUNCTION(page-trigger)---------------
   const viewPage = (condition, page) => {
      if (condition) {
         const session = sessionCatcher(condition)
         sessionHistory(session.history, page)
         return res.render(`${__dirname}/../../presenter/layout`, pageConfig[session.role][page](session))
      }
   }

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
         res.render(`${__dirname}/../../presenter/layout`, pageConfig[role].mainMenu(session))
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
         const emptyInputs = newClientInfo.some(elem => elem.length === 0)
         if (emptyInputs)
            throw {
               message: 'Empty inputs',
               session: session
            }
         session.cookie = {
            client: bank.addClient(...newClientInfo).client
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
      if (req.body.summMinus <= 0)
         throw {
            message: 'Wrong summ',
            session: sessionCatcher(req.body.viewBalance)
         }
      if (parseInt(req.body.summMinus)) {
         const id = sessionCatcher(req.body.viewBalance).id
         const summ = parseInt(req.body.summMinus)
         const balance = bank.getCardByNum(id).balance
         if (balance < summ)
            throw {
               message: 'Balance is too low',
               session: sessionCatcher(req.body.viewBalance)
            }
         bank.updateBalance(id, -summ)
      }
      //Put money
      if (req.body.summPlus <= 0)
         throw {
            message: 'Wrong summ',
            session: sessionCatcher(req.body.viewBalance)
         }
      if (parseInt(req.body.summPlus)) {
         const id = sessionCatcher(req.body.viewBalance).id
         const summ = parseInt(req.body.summPlus)
         bank.updateBalance(id, summ)
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
         if (oldPIN !== bank.getCardByNum(id).PIN)
            throw {
               message: 'Wrong PIN',
               session: sessionCatcher(req.body.success)
            }
         bank.changePIN(id, newPIN)
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

      //PAGES--------------------------------
      //SUCCESS------------------------------
      if (req.body.success) {
         const session = req.body.key ? sessionCatcher(req.body.key) : sessionCatcher(req.body.success)
         res.render(`${__dirname}/../../presenter/layout`, pageConfig.successPage(session))
      }
      //BACK---------------------------------
      if (req.body.back) {
         const session = sessionCatcher(req.body.back)
         session.history.shift()
         res.render(`${__dirname}/../../presenter/layout`, pageConfig[session.role][session.history[0]](session))
      }
      //QUIT---------------------------------
      if (req.body.quit) {
         const sessionToDelete = sessions.findIndex(session => session.key === req.body.quit)
         sessions.splice(sessionToDelete, 1)
         res.render(`${__dirname}/../../presenter/layout`, pageConfig.index())
      }
      //MAIN MENU----------------------------
      viewPage(req.body.mainMenu, 'mainMenu')
      //ADMIN(pages)-------------------------
      viewPage(req.body.viewAllClients, 'viewAllClients')
      viewPage(req.body.addClient, 'addClient')
      viewPage(req.body.findClient, 'findClient')
      viewPage(req.body.viewNewClient, 'viewClient')
      viewPage(req.body.viewClient, 'viewClient')
      viewPage(req.body.keyForClientPage, 'viewClient')
      viewPage(req.body.activateClientConfirm, 'viewClient')
      viewPage(req.body.activateClient, 'activateClient')
      viewPage(req.body.deactivateClient, 'deactivateClient')
      viewPage(req.body.viewClientCards, 'viewClientCards')
      viewPage(req.body.addCard, 'addCard')
      viewPage(req.body.findCard, 'findCard')
      viewPage(req.body.deactivateClientCardConfirm, 'deactivateClientCardConfirm')
      viewPage(req.body.deactivateClientCard, 'deactivateClientCard')
      viewPage(req.body.viewCard, 'viewCard')
      viewPage(req.body.addCardForClient, 'viewCard')
      viewPage(req.body.refreshCard, 'viewCard')
      viewPage(req.body.keyForCardPage, 'viewCard')
      //CLIENT(pages)------------------------
      viewPage(req.body.viewBalance, 'balance')
      viewPage(req.body.withdrawMoney, 'withdrawMoney')
      viewPage(req.body.putMoney, 'putMoney')
      viewPage(req.body.changePIN, 'changePIN')
      viewPage(req.body.deactivateCard, 'deactivateCard')
      viewPage(req.body.deactivateConfirm, 'deactivateConfirm')
   }
   //ERROR--------------------------------
   catch (err) {
      console.log(err)
      res.render(`${__dirname}/../../presenter/layout`, pageConfig.errorPage(err))
   }
})

app.listen(PORT)
console.log(`Listening port ${PORT}`)
