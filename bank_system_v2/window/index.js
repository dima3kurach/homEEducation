const Bank = require(__dirname + '/../core/core.js')
const bank = new Bank

const express = require('express')
var bodyParser = require('body-parser')
const app = express()

var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: false }))

var root, id

const pageBalance = card => {
   return `<!DOCTYPE html>
      <html lang="en">

      <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Balance</title>

         <link rel="stylesheet" type="text/css" href="../assets/style.css">
      </head>

      <body>
         <h2 class="main_question">Balance is<br><span>${card.balance}</span></h2>
         <form action="/menu" method="GET" autocomplete="off" class="menu">
            <button formmethod="POST" name="escape" type="submit" value="back" class="btn_border">Back</button>
            <button formaction="/" name="escape" type="submit" value="quit" class="btn">Quit</button>
         </form>
      </body>

      </html>`
}

const pageDataInfo = (header, info) => {
   return `<!DOCTYPE html>
      <html lang="en">

      <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Data Information</title>

         <link rel="stylesheet" type="text/css" href="../assets/style.css">
      </head>

      <body>
         <h2 class="main_question">${header}</h2>
         <div class="text_wrapper">
            ${info}
         </div>
         <form action="/menu" method="GET" autocomplete="off" class="menu">
            <button formmethod="POST" name="escape" type="submit" value="back" class="btn_border">Back</button>
            <button formaction="/" name="escape" type="submit" value="quit" class="btn">Quit</button>
         </form>
      </body>

      </html>`
}

const convertObjToStr = obj => {
   let cell = '<p>'
   Object.entries(obj).forEach(([key, value]) => cell += `<span>${key}: </span>${value}<br>`)
   cell += '</p>'
   return cell
}

const formatArray = arr => {
   return arr.map(convertObjToStr).join('<hr>')
}

const prepareCard = card => {
   const editedCard = Object.assign({}, card)
   delete editedCard.CVV
   delete editedCard.PIN
   return convertObjToStr(editedCard)
}

app.use('/assets', express.static(__dirname + '/assets'))

app.get('/', jsonParser, (req, res) => {
   if (req.query.escape === 'quit') {
      id = undefined
      res.sendFile(__dirname + '/pages/getstarted.html')
   }

   res.sendFile(__dirname + '/pages/getstarted.html')
})

app.get('/authorization', jsonParser, (req, res) => {
   root = req.query.isAdminClient

   res.sendFile(__dirname + `/pages/${root}/register.html`)
})

app.post('/menu', jsonParser, (req, res) => {
   id = !id ? req.body.id : id
   const secret = req.body.secret

   if (req.body.escape === 'back') {
      res.sendFile(__dirname + `/pages/${root}/menu.html`)
   } else if (root === 'admin') {
      !bank.getAdmin(id) || bank.getAdmin(id).pass !== secret ? res.status(401).send('Authorization unsuccessful') : res.sendFile(__dirname + `/pages/${root}/menu.html`)
   } else {
      !bank.getCardByNum(id) || bank.getCardByNum(id).PIN !== secret ? res.status(401).send('Authorization unsuccessful') : res.sendFile(__dirname + `/pages/${root}/menu.html`)
   }
})

app.post('/menu/balance', jsonParser, (req, res) => {
   switch (req.body.action) {
      case 'viewBalance': res.send(pageBalance(bank.getCardByNum(id))); break
      case 'withdrawMoney': res.send(pageBalance(bank.updateBalance(id, -parseInt(req.body.summary)))); break
      case 'putMoney': res.send(pageBalance(bank.updateBalance(id, parseInt(req.body.summary)))); break
   }
})

app.post('/menu/withdraw-money', jsonParser, (req, res) => {
   if (req.body.action === 'withdrawMoney') { res.sendFile(__dirname + `/pages/${root}/withdraw_sum.html`) }
})

app.post('/menu/put-money', jsonParser, (req, res) => {
   if (req.body.action === 'putMoney') { res.sendFile(__dirname + `/pages/${root}/put_sum.html`) }
})

app.post('/menu/change-pin', jsonParser, (req, res) => {
   if (req.body.action === 'changePIN') { res.sendFile(__dirname + `/pages/${root}/change_PIN.html`) }
   if (req.body.action === 'changePINconfirm') {
      const secret = req.body.oldPIN
      const newSecret = req.body.newPIN

      bank.getCardByNum(id).PIN !== secret ? res.status(401).send('Wrong PIN') : bank.changePIN(id, newSecret)
      res.sendFile(__dirname + `/pages/${root}/changed_PIN.html`)
   }
})

app.post('/menu/deactivation', jsonParser, (req, res) => {
   if (req.body.action === 'deactivateCard') {
      bank.deactivateCard(id)
      res.sendFile(__dirname + `/pages/${root}/deactivate.html`)
   }
})

app.post('/menu/all-clients', jsonParser, (req, res) => {
   if (req.body.action === 'viewAllClients') {
      const clients = formatArray(bank.getAllClients())
      res.send(pageDataInfo('Clients', clients))
   }
})

app.post('/menu/client', jsonParser, (req, res) => {
   if (req.body.action === 'viewClient') {
      res.sendFile(__dirname + `/pages/${root}/input_passportID.html`)
   }
   if (req.body.action === 'viewClientConfirm') {
      const client = convertObjToStr(bank.getClient(req.body.passID))
      res.send(pageDataInfo('Client', client))
   }
})

app.post('/menu/client-cards', jsonParser, (req, res) => {
   if (req.body.action === 'viewClientCards') {
      res.sendFile(__dirname + `/pages/${root}/input_passportIDforCards.html`)
   }
   if (req.body.action === 'viewClientCardsConfirm') {
      let cards = bank.getCards(req.body.passID).map(card => Object.assign({}, card))
      cards.forEach(card => {
         delete card.CVV
         delete card.PIN
         return card
      })
      cards = cards.length > 1 ? formatArray(cards) : convertObjToStr(cards[0])
      res.send(pageDataInfo('Client cards', cards))
   }
})

app.post('/menu/client-card', jsonParser, (req, res) => {
   if (req.body.action === 'viewClientCard') {
      res.sendFile(__dirname + `/pages/${root}/input_cardNum.html`)
   }
   if (req.body.action === 'viewClientCardConfirm') {
      const card = prepareCard(bank.getCardByNum(req.body.cardNum))
      res.send(pageDataInfo('Client card', card))
   }
})

app.post('/menu/add-client', jsonParser, (req, res) => {
   if (req.body.action === 'addClient') {
      res.sendFile(__dirname + `/pages/${root}/input_clientInfo.html`)
   }
   if (req.body.action === 'addClientConfirm') {
      const newClient = bank.addClient(req.body.passID, req.body.firstName, req.body.lastName, req.body.birthDay)
      const card = prepareCard(newClient.card)
      const client = convertObjToStr(newClient.client)
      res.send(pageDataInfo('New client and card', `${client}<hr>${card}`))
   }
})

app.post('/menu/activate-client', jsonParser, (req, res) => {
   if (req.body.action === 'activateClient') {
      res.sendFile(__dirname + `/pages/${root}/input_passportIDforActivation.html`)
   }
   if (req.body.action === 'activateClientConfirm') {
      const activatedClient = bank.activateClient(req.body.passID)
      const card = prepareCard(activatedClient.card)
      const client = convertObjToStr(activatedClient.client)
      res.send(pageDataInfo('Activated client and card', `${client}<hr>${card}`))
   }
})

app.post('/menu/deactivate-client', jsonParser, (req, res) => {
   if (req.body.action === 'deactivateClient') {
      res.sendFile(__dirname + `/pages/${root}/input_passportIDforDeactivation.html`)
   }
   if (req.body.action === 'deactivateClientConfirm') {
      const client = convertObjToStr(bank.deactivateClient(req.body.passID))
      res.send(pageDataInfo('Deactivated client', client))
   }
})

app.post('/menu/add-card', jsonParser, (req, res) => {
   if (req.body.action === 'addCard') {
      res.sendFile(__dirname + `/pages/${root}/input_passportIDforCard.html`)
   }
   if (req.body.action === 'addCardConfirm') {
      const card = prepareCard(bank.addCard(req.body.passID))
      res.send(pageDataInfo('New card', card))
   }
})

app.post('/menu/refresh-card', jsonParser, (req, res) => {
   if (req.body.action === 'refreshCard') {
      res.sendFile(__dirname + `/pages/${root}/input_cardNumForRefresh.html`)
   }
   if (req.body.action === 'refreshCardConfirm') {
      const card = prepareCard(bank.refreshCard(req.body.cardNum))
      res.send(pageDataInfo('Refreshed card', card))
   }
})

app.post('/menu/deactivate-card', jsonParser, (req, res) => {
   if (req.body.action === 'deactivateCard') {
      res.sendFile(__dirname + `/pages/${root}/input_cardNumForDeactivation.html`)
   }
   if (req.body.action === 'deactivateCardConfirm') {
      const card = prepareCard(bank.deactivateCard(req.body.cardNum))
      res.send(pageDataInfo('Deactivated card', card))
   }
})

app.listen(3000)