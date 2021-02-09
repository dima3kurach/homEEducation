//INPUTS AND MESSANGER CATCHER
const inputs = Array.from(document.getElementsByTagName('input'))
const errorMessanger = document.getElementsByClassName('errors')[0]

//INPUTS FILTER
const validateFilter = input => {
   switch (input.name) {
      case 'id': Validate.cardNum(input); break
      case 'cardNum': Validate.cardNum(input); break
      case 'secret': Validate.PIN(input); break
      case 'oldPIN': Validate.PIN(input); break
      case 'newPIN': Validate.PIN(input); break
      case 'passID': Validate.passID(input); break
      case 'passIDtoFindClient': Validate.passID(input); break
      case 'passIDtoAddCard': Validate.passID(input); break
      case 'summMinus': Validate.number(input); break
      case 'summPlus': Validate.number(input); break
      case 'firstName': Validate.name(input); break
      case 'lastName': Validate.name(input); break
      case 'birthDay': Validate.date(input); break
      default: break
   }
   switch (input.id) {
      case 'adminId': Validate.text(input); break
      case 'adminSecret': Validate.text(input); break
      default: break
   }
}

//SWITCH BUTTON
const lockBtn = () => {
   const btn = document.getElementById('confirm')
   btn.classList.add('lock')
}
const unlockBtn = () => {
   const btn = document.getElementById('confirm')
   btn.innerText = 'Submit'
   if (inputs.every(cell => cell.isReady === true)) btn.classList.remove('lock')
}
const switchBtn = (input, condition, str, minLength, message) => {
   const length = str.length
   const inputCell = inputs.find(cell => cell.input === input)
   updateErrMessanger(input, condition, length, minLength, message)
   if (!condition) {
      inputCell.isReady = false
      lockBtn()
      return ''
   }
   if (length < minLength) {
      inputCell.isReady = false
      lockBtn()
   }
   if (condition && length >= minLength) {
      inputCell.isReady = true
      unlockBtn()
   }
   return str
}

//UPDATE ERRORS 
const updateErrMessanger = (input, condition, length, minLength, message) => {
   const errMessage = document.getElementById(input.name)
   const err = `<p id="${input.name}">${message}</p>`
   if (!errMessage && length < minLength) errorMessanger.innerHTML += err
   if (condition && length >= minLength && errMessage) errorMessanger.removeChild(errMessage)
}

//VALIDATION MODULE
const Validate = function () {
   const validateStr = (str, allowedSymbols) => {
      if (!allowedSymbols.some(symb => symb === str.slice(-1)))
         str = str.substring(0, str.length - 1)
      return str
   }
   const validateChecker = (str, allowedSymbols) => {
      return str.every(symb => allowedSymbols.some(aSymb => aSymb === symb))
   }
   const limitStr = (str, limit) => {
      if (str.length >= limit)
         str = str.substring(0, limit)
      return str
   }

   //Validate Cards
   const cardNum = input => {
      input.oninput = function (e) {
         const allowedSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
         const allowedIndexes = [4, 9, 14]
         const str = validateStr(e.target.value, allowedSymbols).split('').filter(symb => symb != '-')

         const isStrCheck = validateChecker(str, allowedSymbols)
         let strLength = str.length
         if (strLength <= 16) {
            allowedIndexes.forEach(aIndex => {
               if (aIndex < strLength && str[aIndex] != '-') {
                  str.splice(aIndex, 0, '-')
                  ++strLength
               }
            })
            e.target.value = str.join('')
         }

         if (!e.data && e.target.value.slice(-1) === '-')
            e.target.value = e.target.value.substring(0, e.target.value.length - 1)
         e.target.value = limitStr(e.target.value, 19)
         e.target.value = switchBtn(this, isStrCheck, e.target.value, 19, 'Incorrect Card Number')
      }
   }

   //Validate PINs
   const PIN = input => {
      input.oninput = function (e) {
         const allowedSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
         const str = validateStr(e.target.value, allowedSymbols).split('')

         const isStrCheck = validateChecker(str, allowedSymbols)
         e.target.value = limitStr(str.join(''), 4)
         e.target.value = switchBtn(this, isStrCheck, e.target.value, 4, 'Incorrect PIN')
      }
   }

   //Validate Passport IDs
   const passID = input => {
      input.oninput = function (e) {
         const allowedSymbolsPart1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'o', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
         const allowedSymbolsPart2 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
         if (e.target.value.length <= 2) e.target.value = validateStr(e.target.value.toUpperCase(), allowedSymbolsPart1)
         if (e.target.value.length > 2) e.target.value = validateStr(e.target.value, allowedSymbolsPart2)
         const str = e.target.value.toUpperCase().split('')

         const isStrCheck = str.every((symb, index) => {
            if (index < 2 && allowedSymbolsPart1.some(aSymb => aSymb === symb)) return symb
            if (index >= 2 && allowedSymbolsPart2.some(aSymb => aSymb === symb)) return symb
         })
         e.target.value = limitStr(str.join(''), 8).toUpperCase()
         e.target.value = switchBtn(this, isStrCheck, e.target.value, 8, 'Incorrect Passport ID')
      }
   }

   //Validate Numbers
   const number = input => {
      input.oninput = function (e) {
         const allowedSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
         const str = validateStr(e.target.value, allowedSymbols).split('')

         while (str[0] === '0') str.shift()
         const isStrCheck = validateChecker(str, allowedSymbols)
         if (isStrCheck) e.target.value = str.join('')
         e.target.value = switchBtn(this, isStrCheck, e.target.value, 1, 'Incorrect Summ')
      }
   }

   //Validate Names
   const name = input => {
      input.oninput = function (e) {
         const allowedSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-']
         const str = validateStr(e.target.value.toLowerCase(), allowedSymbols).split('')

         while (str[0] === '-') str.shift()
         const isStrCheck = validateChecker(str, allowedSymbols)
         if (str[0]) str[0] = str[0].toUpperCase()
         str.forEach((symb, index) => {
            if (symb === '-' && str[index + 1] === '-') str.splice(index + 1, 1)
            if (symb === '-' && str[index + 1]) str[index + 1] = str[index + 1].toUpperCase()
         })
         if (isStrCheck) e.target.value = str.join('')
         e.target.value = switchBtn(this, isStrCheck, e.target.value, 1, 'Incorrect Value')
      }
      input.onchange = e => {
         const str = e.target.value.split('')
         while (str[str.length - 1] === '-') str.pop()
         e.target.value = str.join('')
      }
   }

   //Validate Dates
   const date = input => {
      input.oninput = function (e) {
         const allowedSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
         const allowedIndexes = [4, 7]
         const str = validateStr(e.target.value, allowedSymbols).split('').filter(symb => symb != '-')

         const isStrCheck = validateChecker(str, allowedSymbols)
         let strLength = str.length
         if (strLength <= 8) {
            allowedIndexes.forEach(aIndex => {
               if (aIndex < strLength && str[aIndex] != '-') {
                  str.splice(aIndex, 0, '-')
                  ++strLength
               }
            })
            e.target.value = str.join('')
         }

         if (!e.data && e.target.value.slice(-1) === '-')
            e.target.value = e.target.value.substring(0, e.target.value.length - 1)
         e.target.value = limitStr(e.target.value, 10)
         e.target.value = switchBtn(this, isStrCheck, e.target.value, 10, 'Incorrect Card Number')
      }
   }

   //Validate Texts
   const text = input => {
      input.oninput = function (e) {
         const allowedSymbolsPart1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'o', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
         const allowedSymbolsPart2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-']
         const allowedSymbolsPart3 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
         const str = validateStr(e.target.value, [...allowedSymbolsPart1, ...allowedSymbolsPart2, ...allowedSymbolsPart3]).split('')

         const isStrCheck = validateChecker(str, [...allowedSymbolsPart1, ...allowedSymbolsPart2, ...allowedSymbolsPart3])
         if (isStrCheck) e.target.value = str.join('')
         e.target.value = switchBtn(this, isStrCheck, e.target.value, 1, 'Incorrect Value')
      }
   }

   return {
      cardNum: cardNum,
      PIN: PIN,
      passID: passID,
      number: number,
      name: name,
      date: date,
      text: text,
   }
}()

//START FILTRATION AND SWITCH CHACKERS
inputs.forEach((input, index) => {
   //validateFilter(input)
   inputs[index] = {
      input: input,
      isReady: false
   }
   validateFilter(input)
})
