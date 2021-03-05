const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const expressLayouts = require('express-ejs-layouts')

const Bank = require(`${__dirname}/../../model/core.js`)
const bank = new Bank
const pageConfig = require(`${__dirname}/../../presenter/config.js`)
const layoutDirection = `${__dirname}/../../presenter/layouts/pages`

const PORT = 3000
const admin = 'admin'
const client = 'client'
const sessions = []

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set('layout', `${__dirname}/../../presenter/layouts/main`)
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/assets', express.static(`${__dirname}/../../presenter/assets`))

app.get('/', jsonParser, (req, res) => {
   res.render(`${layoutDirection}/authorization`, pageConfig.authorization())


   /*//AUTHORIZATION------------------------
   if (req.query.isAdminClient) {
      const role = req.query.isAdminClient
      res.render(`${__dirname}/../../presenter/layout`, pageConfig[role].authorization())
   }
   //HOME---------------------------------
   if (req.query.index) {
      res.render(`${__dirname}/../../presenter/layout`, pageConfig.index())
   }
   res.render(`${__dirname}/../../presenter/layout`, pageConfig.index())*/
})

app.post('/', jsonParser, (req, res) => {
   //FUNCTION(page-trigger)---------------
   const viewPage = (session, link) => {
      //Success page
      if (link === 'success') {
         return res.render(`${__dirname}/../../presenter/layout`, pageConfig.successPage(session))
      }
      //Link to back
      if (link === 'back') {
         session.history.shift()
         return res.render(`${__dirname}/../../presenter/layout`, pageConfig[session.role][session.history[0]](session))
      }
      //Link to quit
      if (link === 'quit') {
         const sessionToDelete = sessions.findIndex(cell => cell.key === session.key)
         sessions.splice(sessionToDelete, 1)
         return res.render(`${__dirname}/../../presenter/layout`, pageConfig.index())
      }
      //All links
      Session.history(session.history, link)
      return res.render(`${__dirname}/../../presenter/layout`, pageConfig[session.role][link](session))
   }

   try {
      //Actions
      const actionName = req.body.action
      const actionParams = actionName ? Object.values(req.body).slice(0, -1) : null
      const session = actionName ? Action[actionName](...actionParams) : Session.catcher(req.body.key)

      //Links
      const link = actionName ? Action.toLink(actionName) : req.body.link
      Session.clearCookie(session, link)
      viewPage(session, link)
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
      number: new RegExp('^(\\d)+$'),
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
   //Find card owner
   const findCardOwner = key => {
      const session = Session.catcher(key)
      session.cookie = { client: bank.getClient(session.cookie.card.passportID) }
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
   //Find card
   const findCard = (key, cardNum) => {
      const session = Session.catcher(key)
      if (!validate(cardNum, validateTypes.cardNum)) throw {
         message: 'Incorrect values',
         session: session
      }
      const cards = session.cookie ? session.cookie.cards : null
      session.cookie = { card: bank.getCardByNum(cardNum) }
      if (cards && cards.every(card => card.cardNumber != cardNum)) throw {
         message: "Client doesn't have that card",
         session: session
      }
      return session
   }
   //Refresh card
   const refreshCard = key => {
      const session = Session.catcher(key)
      session.cookie = { card: bank.refreshCard(session.cookie.card.cardNumber) }
      return session
   }
   //Deactivate card
   const deactivateClientCard = key => {
      const session = Session.catcher(key)
      bank.deactivateCard(session.cookie.card.cardNumber)
      session.cookie = { client: bank.getClient(session.cookie.card.passportID) }
      return session

   }
   //View client cards
   const viewClientCards = key => {
      const session = Session.catcher(key)
      session.cookie = { cards: bank.getCards(session.cookie.client.passportID) }
      return session
   }

   //CLIENT(actions)----------------------
   //View balance
   const viewBalance = key => {
      const session = Session.catcher(key)
      session.cookie = { balance: bank.getCardByNum(session.id).balance }
      return session
   }
   //Withdraw money
   const withdrawMoney = (key, summ) => {
      const session = Session.catcher(key)
      if (!validate(summ, validateTypes.number)) throw {
         message: 'Incorrect values',
         session: session
      }
      const balance = bank.getCardByNum(session.id).balance
      summ = parseInt(summ, 10)
      if (balance < summ)
         throw {
            message: 'Balance is too low',
            session: session
         }
      session.cookie = { balance: bank.updateBalance(session.id, -summ).balance }
      return session
   }
   //Put money
   const putMoney = (key, summ) => {
      const session = Session.catcher(key)
      if (!validate(summ, validateTypes.number)) throw {
         message: 'Incorrect values',
         session: session
      }
      summ = parseInt(summ, 10)
      session.cookie = { balance: bank.updateBalance(session.id, summ).balance }
      return session
   }
   //Change PIN
   const changePIN = (key, oldPIN, newPIN) => {
      const session = Session.catcher(key)
      if (!validate(oldPIN, validateTypes.PIN) || !validate(newPIN, validateTypes.PIN)) throw {
         message: 'Incorrect values',
         session: session
      }
      const card = bank.getCardByNum(session.id)
      if (oldPIN != card.PIN) throw {
         message: 'Wrong PIN',
         session: session
      }
      bank.changePIN(session.id, newPIN)
      return session
   }
   //Deactivate card
   const deactivateCard = key => {
      const session = Session.catcher(key)
      bank.deactivateCard(session.id)
      return session
   }

   //Action To Link
   const toLink = action => {
      switch (action) {
         case 'login': return 'mainMenu'
         //Admin
         case 'addClient': return 'viewClient'
         case 'findClient': return 'viewClient'
         case 'findCardOwner': return 'viewClient'
         case 'activateClient': return 'viewClient'
         case 'deactivateClient': return 'viewClient'
         case 'viewAllClients': return 'viewAllClients'
         case 'addCard': return 'viewCard'
         case 'addCardForClient': return 'viewCard'
         case 'findCard': return 'viewCard'
         case 'refreshCard': return 'viewCard'
         case 'deactivateClientCard': return 'deactivateClientCardConfirm'
         case 'viewClientCards': return 'viewClientCards'
         //Client
         case 'viewBalance': return 'viewBalance'
         case 'withdrawMoney': return 'viewBalance'
         case 'putMoney': return 'viewBalance'
         case 'changePIN': return 'success'
         case 'deactivateCard': return 'deactivateConfirm'

         default: break
      }
   }

   return {
      login: login,
      addClient: addClient,
      findClient: findClient,
      findCardOwner: findCardOwner,
      activateClient: activateClient,
      deactivateClient: deactivateClient,
      viewAllClients: viewAllClients,
      addCard: addCard,
      addCardForClient: addCardForClient,
      findCard: findCard,
      refreshCard: refreshCard,
      deactivateClientCard: deactivateClientCard,
      viewClientCards: viewClientCards,

      viewBalance: viewBalance,
      withdrawMoney: withdrawMoney,
      putMoney: putMoney,
      changePIN: changePIN,
      deactivateCard: deactivateCard,

      toLink: toLink
   }
}()
