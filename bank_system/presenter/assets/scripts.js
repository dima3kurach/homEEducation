//INPUTS AND MESSANGER CATCHER
const inputs = Array.from(document.querySelectorAll('input:not([type=hidden])'))
const btn = document.querySelector('#confirm')

//INPUTS FILTER
const inputFilter = input => {
   switch (input.name) {
      case 'id': inputManager(input, 'cardNum'); break
      case 'cardNum': inputManager(input, 'cardNum'); break
      case 'secret': inputManager(input, 'PIN'); break
      case 'oldPIN': inputManager(input, 'PIN'); break
      case 'newPIN': inputManager(input, 'PIN'); break
      case 'passID': inputManager(input, 'freeStr', 'passID'); break
      case 'summ': inputManager(input, 'number'); break
      case 'firstName': inputManager(input, 'freeStr', 'name'); break
      case 'lastName': inputManager(input, 'freeStr', 'name'); break
      case 'birthDay': inputManager(input, 'date'); break
      default: break
   }
   switch (input.id) {
      case 'adminId': inputManager(input, 'freeStr'); break
      case 'adminSecret': inputManager(input, 'freeStr'); break
      default: break
   }
}

//INPUT MANAGER
const inputManager = (input, formatType, validateType = formatType) => {
   input.oninput = Format[formatType]
   input.onchange = e => {
      const isValid = validate(e.target.value, validateType)
      const inputCell = inputs.find(cell => cell.input === input)
      inputCell.isValid = isValid
      errSwitcher(inputCell)
   }
}

//BUTTON MANAGER
const btnManager = btn => {
   btn.onclick = e => {
      inputs.forEach(input => { if (!input.isValid) errSwitcher(input) })
      return inputs.every(input => input.isValid)
      /*return inputs.filter(input => {
         if (input.isValid) return input
         if (!input.isValid) errSwitcher(input)
      }).length === inputs.length*/
   }
}

//FORMATTING MODULE
const Format = function () {
   //Limit string
   const limitStr = (strArray, limit) => {
      return strArray.slice(0, limit).join('')
   }

   //Card Formatting
   const cardNum = e => {
      const strLimit = 19
      const dashPlaces = [4, 9, 14]
      const allowedValue = new RegExp('^\\d?$')
      const strArray = e.target.value.split('').filter(symb => allowedValue.test(symb))
      dashPlaces.forEach(dash => { if (strArray.length > dash) strArray.splice(dash, 0, '-') })
      if (!e.data && strArray[strArray.length - 1] === '-') strArray.pop()
      e.target.value = limitStr(strArray, strLimit)
   }

   //PIN Formatting
   const PIN = e => {
      const strLimit = 4
      const allowedValue = new RegExp('^\\d?$')
      let str = e.target.value
      if ((e.data && !allowedValue.test(e.data)) || str.length > strLimit) str = str.substring(0, str.length - 1)
      e.target.value = str
   }

   //Date Formatting
   const date = e => {
      const strLimit = 10
      const dashPlaces = [4, 7]
      const allowedValue = new RegExp('^\\d?$')
      const strArray = e.target.value.split('').filter(symb => allowedValue.test(symb))
      dashPlaces.forEach(dash => { if (strArray.length > dash) strArray.splice(dash, 0, '-') })
      if (!e.data && strArray[strArray.length - 1] === '-') strArray.pop()
      e.target.value = limitStr(strArray, strLimit)
   }

   //Number Formatting
   const number = e => {
      const allowedValue = new RegExp('^\\d?$')
      let str = e.target.value
      while (str[0] === '0') str = str.substring(1, str.length)
      if (e.data && !allowedValue.test(e.data)) str = str.substring(0, str.length - 1)
      e.target.value = str
   }

   //Text Formatting
   const freeStr = e => {
      const allowedValue = new RegExp('^\\w?-?[^_]$')
      let str = e.target.value
      if (e.data && !allowedValue.test(e.data)) str = str.substring(0, str.length - 1)
      e.target.value = str
   }

   return {
      cardNum: cardNum,
      PIN: PIN,
      date: date,
      number: number,
      freeStr: freeStr
   }
}()

//VALIDATION
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

//ERROR
const errSwitcher = inputCell => {
   const label = inputCell.input.closest('div')
   if (!inputCell.isValid) {
      inputCell.input.classList.add('err_input')
      setTimeout(() => inputCell.input.classList.remove('err_input'), 2000);
      label.classList.add('err_message')
      label.style.setProperty('--err', `"Incorrect ${label.innerText}"`)
   }
   if (inputCell.isValid) label.classList.remove('err_message')
}

//START FILTRATION AND SWITCH BUTTON
inputs.forEach((input, index) => {
   inputs[index] = {
      input: input,
      isValid: false
   }
   inputFilter(input)
})
btnManager(btn)



/*
//KEYS ANALYZER MODULE
const KeyCheck = function () {
   //Allowed keys and Key commands
   const isAllowKeyCommand = e => {
      if (e.ctrlKey && e.code === 'KeyA') return true
      if (e.ctrlKey && e.code === 'KeyZ') return true
      if (e.ctrlKey && e.code === 'KeyX') return true
      if (e.ctrlKey && e.code === 'KeyC') return true
      if (e.ctrlKey && e.code === 'KeyV') return true
      if (e.code === 'ArrowLeft') return true
      if (e.code === 'ArrowRight') return true
      if (e.code === 'Backspace') return true
      if (e.code === 'Delete') return true
   }

   //Keys for Numbers
   const isFigure = e => {
      const allowedValue = new RegExp('^\\d?$')
      return isAllowKeyCommand(e) || allowedValue.test(e.key)
   }

   //Keys for Characters
   const isCharacter = e => {
      const allowedValue = new RegExp('^[a-zA-Z]?-?$')
      return isAllowKeyCommand(e) || allowedValue.test(e.key)
   }

   //Keys for Characters and Numbers
   const isSymbol = e => {
      const allowedValue = new RegExp('^\\w?-?_?$')
      return isAllowKeyCommand(e) || allowedValue.test(e.key)
   }

   return {
      isFigure: isFigure,
      isCharacter: isCharacter,
      isSymbol: isSymbol
   }
}()
*/
