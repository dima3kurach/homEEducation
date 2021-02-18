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
   res.render(`${__dirname}/../../presenter/layout`, pageConfig.index())
})

app.post('/', jsonParser, (req, res) => {
   //FUNCTION(page-trigger)---------------
   const viewPage = (session, page) => {
      Session.history(session.history, page)
      return res.render(`${__dirname}/../../presenter/layout`, pageConfig[session.role][page](session))
   }

   try {
      //Actions
      const actionName = req.body.action
      const actionParams = actionName ? Object.values(req.body).slice(0, -1) : null
      const session = actionName ? Action[actionName](...actionParams) : Session.catcher(req.body.key)

      /*switch (req.body.action) {
         case 'login': session = Action.login(req.body.role, req.body.id, req.body.secret); break
         //Admin actions
         case 'addClient': session = Action.addClient(session, req.body.passID, req.body.firstName, req.body.lastName, req.body.birthDay); break
         case 'findClient': session = Action.findClient(session, req.body.passID); break
         case 'viewAllClients': session = Action.viewAllClients(session); break
         default: break
      }*/

      //Links
      const link = actionName ? Action.toLink(actionName) : req.body.link
      Session.clearCookie(session, link)
      viewPage(session, link)



      /*

      //ADMIN(actions)-----------------------
      
      //Add card
      emptyInputError(req.body.viewCard, req.body.passIDtoAddCard)
      if (req.body.passIDtoAddCard) {
         const session = sessionCatcher(req.body.viewCard)
         session.cookie = {
            card: bank.addCard(req.body.passIDtoAddCard)
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
      if (req.body.cardNum && req.body.viewCard) {
         const session = sessionCatcher(req.body.viewCard)
         const findClientCard = card => {
            if (card.passportID === session.cookie.cards[0].passportID && card.cardNumber === req.body.cardNum)
               return card
         }
         session.cookie = {
            card: !session.cookie || !session.cookie.cards ? bank.getCardByNum(req.body.cardNum) : session.cookie.cards.find(findClientCard)
         }
      }
      
      //View client from all clients
      if (req.body.viewClientByPassID) {
         const session = sessionCatcher(req.body.keyForClientPage)
         session.cookie = {
            client: bank.getClient(req.body.viewClientByPassID)
         }
      }
      
      //View card from client cards
      if (req.body.viewCardByNum) {
         const session = sessionCatcher(req.body.keyForCardPage)
         session.cookie = {
            card: bank.getCardByNum(req.body.viewCardByNum)
         }
      }*/

      /*
      //CLIENT(actions)----------------------
      //Withdraw money
      if (req.body.viewBalance && req.body.summMinus && req.body.summMinus <= 0)
         throw {
            message: 'Wrong summ',
            session: sessionCatcher(req.body.viewBalance)
         }
      if (req.body.viewBalance && parseInt(req.body.summMinus)) {
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
      if (req.body.viewBalance && req.body.summPlus && req.body.summPlus <= 0)
         throw {
            message: 'Wrong summ',
            session: sessionCatcher(req.body.viewBalance)
         }
      if (req.body.viewBalance && parseInt(req.body.summPlus)) {
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
      if (req.body.success && parseInt(req.body.newPIN) > 999 && parseInt(req.body.newPIN) < 10000) {
         const id = sessionCatcher(req.body.success).id
         const oldPIN = req.body.oldPIN
         const newPIN = req.body.newPIN
         if (oldPIN !== bank.getCardByNum(id).PIN)
            throw {
               message: 'Wrong PIN',
               session: sessionCatcher(req.body.success)
            }
         bank.changePIN(id, newPIN)
      } else if (req.body.success && req.body.newPIN) {
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
      */
   }
   //ERROR--------------------------------
   catch (err) {
      console.log(err)
      res.render(`${__dirname}/../../presenter/layout`, pageConfig.errorPage(err))
   }
})

app.listen(PORT)
console.log(`Listening port ${PORT}`)

//==========================================================================================================
//MODULES

//VALIDATE
const validate = (str, type) => {
   const validationTypes = {
      cardNum: new RegExp('^(\\d{4})-(\\d{4})-(\\d{4})-(\\d{4})$'),
      PIN: new RegExp('^(\\d{4})$'),
      passID: new RegExp('^([a-zA-Z]{2})(\\d{6})$'),
      date: new RegExp('^(\\d{4})-(\\d{2})-(\\d{2})$'),
      number: new RegExp('^(\\d)$'),
      name: new RegExp('^([a-zA-Z]+-?[a-zA-Z]*)$'),
      freeStr: new RegExp('^([a-zA-Z0-9_-]*)$')
   }
   return validationTypes[type].test(str)
}
const validateTypes = {
   cardNum: 'cardNum',
   PIN: 'PIN',
   passID: 'passID',
   date: 'date',
   number: 'number',
   name: 'name',
   freeStr: 'freeStr'
}

//SESSION HANDLER
const Session = function () {
   //Catch
   const catcher = key => {
      return sessions.find(session => session.key === key)
   }

   //History
   const history = (history, currentPage) => {
      if (history[0] != currentPage) history.unshift(currentPage)
      if (history.length > 5) history.pop()
   }

   //Clear cookie
   const clearCookie = (session, page) => {
      if (page === 'mainMenu') delete session.cookie
   }

   return {
      catcher: catcher,
      history: history,
      clearCookie: clearCookie
   }
}()

//ACTIONS
const Action = function () {
   //Authorization
   const login = (role, id, secret) => {
      if (role === admin && (!validate(id, validateTypes.freeStr) || !validate(secret, validateTypes.freeStr)))
         throw {
            message: 'Incorrect values',
            role: role
         }
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
      return session
   }

   //ADMIN(actions)-----------------------
   //Add client
   const addClient = (key, passID, firstName, lastName, birthDay) => {
      const session = Session.catcher(key)
      const isInputsValid = []
      isInputsValid.push(validate(passID, validateTypes.passID))
      isInputsValid.push(validate(firstName, validateTypes.name))
      isInputsValid.push(validate(lastName, validateTypes.name))
      isInputsValid.push(validate(birthDay, validateTypes.date))
      if (isInputsValid.some(isValid => !isValid)) throw {
         message: 'Incorrect values',
         session: session
      }
      session.cookie = { client: bank.addClient(passID, firstName, lastName, birthDay).client }
      return session
   }
   //Find client
   const findClient = (key, passID) => {
      const session = Session.catcher(key)
      if (!validate(passID, validateTypes.passID)) throw {
         message: 'Incorrect values',
         session: session
      }
      session.cookie = { client: bank.getClient(passID) }
      return session
   }
   //Activate client
   const activateClient = key => {
      const session = Session.catcher(key)
      bank.activateClient(session.cookie.client.passportID)
      return session
   }
   //Deactivate client
   const deactivateClient = key => {
      const session = Session.catcher(key)
      bank.deactivateClient(session.cookie.client.passportID)
      return session
   }



   //View all clients
   const viewAllClients = key => {
      const session = Session.catcher(key)
      session.cookie = { clients: bank.getAllClients() }
      return session
   }
   //Add card
   const addCard = (key, passID) => {
      const session = Session.catcher(key)
      if (!validate(passID, validateTypes.passID)) throw {
         message: 'Incorrect values',
         session: session
      }
      session.cookie = { client: bank.addCard(passID) }
      return session
   }
   //Add card for client
   const addCardForClient = key => {
      const session = Session.catcher(key)
      const passID = session.cookie.client ? session.cookie.client.passportID : session.cookie.cards[0].passportID
      session.cookie = { card: bank.addCard(passID) }
      return session
   }


   //View client cards
   const viewClientCards = key => {
      const session = Session.catcher(key)
      session.cookie = { cards: bank.getCards(session.cookie.client.passportID) }
      return session
   }



   //////
   //Add card for client
   /*if (req.body.addCardForClient) {
      const session = sessionCatcher(req.body.addCardForClient)
      session.cookie = {
         card: session.cookie.client ? bank.addCard(session.cookie.client.passportID) : bank.addCard(session.cookie.cards[0].passportID)
      }
   }*/


   //viewCard

   //if (session.cookie) session.cookie = { client: bank.getClient(session.cookie.card.passportID) }
   //else 


   //Action To Link
   const toLink = action => {
      switch (action) {
         case 'login': return 'mainMenu'
         //Admin
         case 'addClient': return 'viewClient'
         case 'findClient': return 'viewClient'
         case 'activateClient': return 'viewClient'
         case 'deactivateClient': return 'viewClient'
         case 'viewAllClients': return 'viewAllClients'
         case 'addCard': return 'viewCard'
         case 'addCardForClient': return 'viewCard'
         case 'viewClientCards': return 'viewClientCards'

         default: break
      }
   }

   return {
      login: login,
      addClient: addClient,
      findClient: findClient,
      activateClient: activateClient,
      deactivateClient: deactivateClient,
      viewAllClients: viewAllClients,
      addCard: addCard,
      addCardForClient: addCardForClient,
      viewClientCards: viewClientCards,

      toLink: toLink
   }
}()
