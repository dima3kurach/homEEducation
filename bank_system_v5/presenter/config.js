const e = require("express")

const admin = 'admin'
const client = 'client'

const formatList = (list, type) => {
   Array.isArray(list) ? list : list = [list]
   if (list.length === 1 && type === 'client') return [{ unit: list[0] }]
   if (type === 'client') {
      return list.map(elem => {
         return {
            unit: elem,
            passID: elem.passportID,
            name: 'action',
            value: 'findClient',
            text: 'View client',
            style: 'btn'
         }
      })
   }
   if (type === 'card') {
      return list.map(elem => {
         const editedElem = Object.assign({}, elem)
         delete editedElem.CVV
         delete editedElem.PIN
         return {
            unit: editedElem,
            cardNum: editedElem.cardNumber,
            name: 'action',
            value: 'findCard',
            text: 'View card',
            style: 'btn'
         }
      })
   }
}

const pageConfiguration = {
   index: () => {
      return {
         title: 'Authorization',
         h1: {
            text: 'Are you a client or an administrator?',
            style: 'main_question'
         },
         h2: false,
         form: {
            method: 'GET',
            style: 'form',
            hidden: false,
            list: false,
            inputs: false,
            btns: [
               {
                  name: 'isAdminClient',
                  value: admin,
                  text: 'Admin',
                  style: 'btn'
               },
               {
                  name: 'isAdminClient',
                  value: client,
                  text: 'Client',
                  style: 'btn'
               },
            ]
         }
      }
   },
   successPage: session => {
      return {
         title: 'Success',
         h1: false,
         h2: {
            text: 'Successful action',
            style: 'main_question'
         },
         form: {
            method: 'POST',
            style: 'register',
            hidden: false,
            list: false,
            inputs: false,
            btns: [
               {
                  name: 'mainMenu',
                  value: session.key,
                  text: 'Main menu',
                  style: 'btn'
               },
               {
                  name: 'quit',
                  value: session.key,
                  text: 'Quit',
                  style: 'btn'
               }
            ]
         }
      }
   },
   errorPage: err => {
      if (err.role)
         return {
            title: 'Error',
            h1: false,
            h2: {
               text: err.message,
               style: 'main_question'
            },
            form: {
               method: 'GET',
               style: 'register',
               hidden: false,
               list: false,
               inputs: false,
               btns: [
                  {
                     name: 'isAdminClient',
                     value: err.role,
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'index',
                     value: 'homePage',
                     text: 'Home',
                     style: 'btn'
                  }
               ]
            }
         }
      if (err.session)
         return {
            title: 'Error',
            h1: false,
            h2: {
               text: err.message,
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: false,
               inputs: false,
               btns: [
                  {
                     name: 'back',
                     value: err.session.key,
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'mainMenu',
                     value: err.session.key,
                     text: 'Main menu',
                     style: 'btn'
                  },
                  {
                     name: 'quit',
                     value: err.session.key,
                     text: 'Quit',
                     style: 'btn'
                  }
               ]
            }
         }
   },
   admin: {
      authorization: () => {
         return {
            title: 'Authorization',
            h1: false,
            h2: false,
            form: {
               method: 'POST',
               style: 'register',
               hidden: [
                  {
                     name: 'role',
                     value: admin
                  }
               ],
               list: false,
               inputs: [
                  {
                     label: 'Login',
                     id: 'adminId',
                     type: 'text',
                     name: 'id',
                     style: 'wrapper',
                  },
                  {
                     label: 'Pass',
                     id: 'adminSecret',
                     type: 'password',
                     name: 'secret',
                     style: 'wrapper',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'login',
                     text: 'Submit',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      mainMenu: session => {
         return {
            title: 'Main menu',
            h1: false,
            h2: false,
            form: {
               method: 'POST',
               style: 'register',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               inputs: false,
               list: false,
               btns: [
                  {
                     name: 'action',
                     value: 'viewAllClients',
                     text: 'View all clients',
                     style: 'btn'
                  },
                  {
                     name: 'link',
                     value: 'addClient',
                     text: 'Add client',
                     style: 'btn'
                  },
                  {
                     name: 'link',
                     value: 'findClient',
                     text: 'Find client',
                     style: 'btn'
                  },
                  {
                     name: 'link',
                     value: 'addCard',
                     text: 'Add card',
                     style: 'btn'
                  },
                  {
                     name: 'link',
                     value: 'findCard',
                     text: 'Find card',
                     style: 'btn'
                  },
                  {
                     name: 'action',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn'
                  },
               ]
            }
         }
      },
      viewAllClients: session => {
         return {
            title: 'Clients list',
            h1: false,
            h2: {
               text: 'Clients list',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  },
                  {
                     name: 'passID',
                     value: ''
                  },
               ],
               list: formatList(session.cookie.clients, 'client'),
               inputs: false,
               btns: [
                  {
                     name: 'link',
                     value: 'addClient',
                     text: 'Add client',
                     style: 'btn'
                  },
                  {
                     name: 'link',
                     value: 'findClient',
                     text: 'Find client',
                     style: 'btn'
                  },
                  {
                     name: 'link',
                     value: 'mainMenu',
                     text: 'Main menu',
                     style: 'btn'
                  },
                  {
                     name: 'action',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn'
                  },
               ]
            }
         }
      },
      addClient: session => {
         return {
            title: 'Add client',
            h1: false,
            h2: {
               text: 'Add client',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               key: {
                  name: 'key',
                  value: session.key
               },
               list: false,
               inputs: [
                  {
                     label: 'Passport ID',
                     type: 'text',
                     name: 'passID',
                     style: 'wrapper',
                  },
                  {
                     label: 'First name',
                     type: 'text',
                     name: 'firstName',
                     style: 'wrapper',
                  },
                  {
                     label: 'Last name',
                     type: 'text',
                     name: 'lastName',
                     style: 'wrapper',
                  },
                  {
                     label: 'Day of birth',
                     type: 'text',
                     name: 'birthDay',
                     style: 'wrapper',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     value: 'back',
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'addClient',
                     text: 'Confirm',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      findClient: session => {
         return {
            title: 'Find client',
            h1: false,
            h2: {
               text: 'Find client',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               key: {
                  name: 'key',
                  value: session.key
               },
               list: false,
               inputs: [
                  {
                     label: 'Passport ID',
                     type: 'text',
                     name: 'passID',
                     style: 'wrapper',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     value: 'back',
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'findClient',
                     text: 'Confirm',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      viewClient: session => {
         const activeBtns = [
            {
               name: 'link',
               value: 'deactivateClient',
               text: 'Deactivate client',
               style: 'btn'
            },
            {
               name: 'action',
               value: 'viewClientCards',
               text: 'View client cards',
               style: 'btn'
            },
            {
               name: 'action',
               value: 'addCardForClient',
               text: 'Add card for client',
               style: 'btn'
            }
         ]
         const unactiveBtns = [
            {
               name: 'link',
               value: 'activateClient',
               text: 'Activate client',
               style: 'btn'
            }
         ]
         const clientBtns = session.cookie.client.activeStatus ? activeBtns : unactiveBtns
         return {
            title: 'Client',
            h1: false,
            h2: {
               text: 'Client',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               key: {
                  name: 'key',
                  value: session.key
               },
               list: formatList(session.cookie.client, 'client'),
               inputs: false,
               btns: [
                  ...clientBtns,
                  {
                     name: 'link',
                     value: 'mainMenu',
                     text: 'Main menu',
                     style: 'btn'
                  },
                  {
                     name: 'action',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      activateClient: session => {
         return {
            title: 'Activate client',
            h1: false,
            h2: {
               text: 'Activate client?',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               key: {
                  name: 'key',
                  value: session.key
               },
               list: false,
               inputs: false,
               btns: [
                  {
                     name: 'action',
                     value: 'back',
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'action',
                     value: 'activateClient',
                     text: 'Confirm',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      deactivateClient: session => {
         return {
            title: 'Deactivate client',
            h1: false,
            h2: {
               text: 'Deactivate client?',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               key: {
                  name: 'key',
                  value: session.key,
               },
               list: false,
               inputs: false,
               btns: [
                  {
                     name: 'action',
                     value: 'back',
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'action',
                     value: 'deactivateClient',
                     text: 'Confirm',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      viewClientCards: session => {
         const findCardBtn = [
            {
               name: 'action',
               value: 'findClientCard',
               text: 'Find client card',
               style: 'btn'
            }
         ]
         const cardsBtns = session.cookie.cards.length > 1 ? findCardBtn : []
         return {
            title: 'Client cards',
            h1: false,
            h2: {
               text: 'Client cards',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               key: {
                  name: 'key',
                  value: session.key
               },
               list: formatList(session.cookie.cards, 'card'),
               inputs: false,
               btns: [
                  ...cardsBtns,
                  {
                     name: 'link',
                     value: 'mainMenu',
                     text: 'Main menu',
                     style: 'btn'
                  },
                  {
                     name: 'action',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      addCard: session => {
         return {
            title: 'Add card',
            h1: false,
            h2: {
               text: 'Add card',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: {
                  name: 'key',
                  value: session.key
               },
               inputs: [
                  {
                     label: 'Passport ID',
                     type: 'text',
                     name: 'passID',
                     style: 'wrapper',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     value: 'back',
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'addCard',
                     text: 'Confirm',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      findCard: session => {
         return {
            title: 'Find card',
            h1: false,
            h2: {
               text: 'Find card',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: false,
               inputs: [
                  {
                     label: 'Card number',
                     type: 'text',
                     name: 'cardNum',
                     style: 'wrapper',
                  }
               ],
               btns: [
                  {
                     name: 'back',
                     value: session.key,
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'viewCard',
                     id: 'confirm',
                     value: session.key,
                     text: 'Confirm',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      deactivateClientCard: session => {
         return {
            title: 'Deactivate card',
            h1: false,
            h2: {
               text: 'Deactivate card?',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: false,
               inputs: false,
               btns: [
                  {
                     name: 'back',
                     value: session.key,
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'deactivateClientCardConfirm',
                     value: session.key,
                     text: 'Confirm',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      deactivateClientCardConfirm: session => {
         return {
            title: 'Deactivate card',
            h1: false,
            h2: {
               text: 'Deactivation confirm',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: false,
               inputs: false,
               btns: [
                  {
                     name: 'viewClient',
                     value: session.key,
                     text: 'To card owner',
                     style: 'btn'
                  },
                  {
                     name: 'mainMenu',
                     value: session.key,
                     text: 'Main menu',
                     style: 'btn'
                  },
                  {
                     name: 'quit',
                     value: session.key,
                     text: 'Quit',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      viewCard: session => {
         return {
            title: 'Card',
            h1: false,
            h2: {
               text: 'Card',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               list: formatList(session.cookie.card, 'card'),
               key: false,
               inputs: false,
               btns: [
                  {
                     name: 'viewClient',
                     value: session.key,
                     text: 'View client',
                     style: 'btn'
                  },
                  {
                     name: 'refreshCard',
                     value: session.key,
                     text: 'Refresh card',
                     style: 'btn'
                  },
                  {
                     name: 'deactivateClientCard',
                     value: session.key,
                     text: 'Deactivate card',
                     style: 'btn'
                  },
                  {
                     name: 'mainMenu',
                     value: session.key,
                     text: 'Main menu',
                     style: 'btn'
                  },
                  {
                     name: 'quit',
                     value: session.key,
                     text: 'Quit',
                     style: 'btn'
                  }
               ]
            }
         }
      }
   },
   client: {
      authorization: () => {
         return {
            title: 'Authorization',
            h1: false,
            h2: false,
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: false,
               inputs: [
                  {
                     label: 'Card Number',
                     type: 'text',
                     name: 'id',
                     style: 'wrapper',
                  },
                  {
                     label: 'PIN',
                     type: 'password',
                     name: 'secret',
                     style: 'wrapper',
                  }
               ],
               btns: [
                  {
                     name: 'loginSubmit',
                     id: 'confirm',
                     value: client,
                     text: 'Submit',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      mainMenu: session => {
         return {
            title: 'Main menu',
            h1: false,
            h2: false,
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: false,
               inputs: false,
               btns: [
                  {
                     name: 'viewBalance',
                     value: session.key,
                     text: 'View balance',
                     style: 'btn'
                  },
                  {
                     name: 'withdrawMoney',
                     value: session.key,
                     text: 'Withdraw money',
                     style: 'btn'
                  },
                  {
                     name: 'putMoney',
                     value: session.key,
                     text: 'Put money',
                     style: 'btn'
                  },
                  {
                     name: 'changePIN',
                     value: session.key,
                     text: 'Change PIN',
                     style: 'btn'
                  },
                  {
                     name: 'deactivateCard',
                     value: session.key,
                     text: 'Deactivate card',
                     style: 'btn'
                  },
                  {
                     name: 'quit',
                     value: session.key,
                     text: 'Quit',
                     style: 'btn'
                  },
               ]
            }
         }
      },
      balance: session => {
         return {
            title: 'Balance',
            h1: {
               text: 'Balance is',
               style: 'main_question'
            },
            h2: {
               text: session.cookie.balance,
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: false,
               inputs: false,
               btns: [
                  {
                     name: 'withdrawMoney',
                     value: session.key,
                     text: 'Withdraw money',
                     style: 'btn'
                  },
                  {
                     name: 'putMoney',
                     value: session.key,
                     text: 'Put money',
                     style: 'btn'
                  },
                  {
                     name: 'mainMenu',
                     value: session.key,
                     text: 'Main menu',
                     style: 'btn'
                  },
                  {
                     name: 'quit',
                     value: session.key,
                     text: 'Quit',
                     style: 'btn'
                  },
               ]
            }
         }
      },
      withdrawMoney: session => {
         return {
            title: 'Withdraw money',
            h1: false,
            h2: {
               text: 'Withdraw money',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: false,
               inputs: [
                  {
                     label: 'Summ',
                     type: 'text',
                     name: 'summMinus',
                     style: 'wrapper',
                  }
               ],
               btns: [
                  {
                     name: 'back',
                     value: session.key,
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'viewBalance',
                     id: 'confirm',
                     value: session.key,
                     text: 'Confirm',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      putMoney: session => {
         return {
            title: 'Put money',
            h1: false,
            h2: {
               text: 'Put money',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: false,
               inputs: [
                  {
                     label: 'Summ',
                     type: 'text',
                     name: 'summPlus',
                     style: 'wrapper',
                  }
               ],
               btns: [
                  {
                     name: 'back',
                     value: session.key,
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'viewBalance',
                     id: 'confirm',
                     value: session.key,
                     text: 'Confirm',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      changePIN: session => {
         return {
            title: 'Change PIN',
            h1: false,
            h2: {
               text: 'Change PIN',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: false,
               inputs: [
                  {
                     label: 'PIN',
                     type: 'password',
                     name: 'oldPIN',
                     style: 'wrapper',
                  },
                  {
                     label: 'New PIN',
                     type: 'password',
                     name: 'newPIN',
                     style: 'wrapper',
                  }
               ],
               btns: [
                  {
                     name: 'back',
                     value: session.key,
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'success',
                     id: 'confirm',
                     value: session.key,
                     text: 'Confirm',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      deactivateCard: session => {
         return {
            title: 'Deactivate card',
            h1: false,
            h2: {
               text: 'Deactivate card?',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: false,
               inputs: false,
               btns: [
                  {
                     name: 'back',
                     value: session.key,
                     text: 'Back',
                     style: 'btn'
                  },
                  {
                     name: 'deactivateConfirm',
                     value: session.key,
                     text: 'Confirm',
                     style: 'btn'
                  }
               ]
            }
         }
      },
      deactivateConfirm: session => {
         return {
            title: 'Deactivate card',
            h1: false,
            h2: {
               text: 'Deactivation confirm',
               style: 'main_question'
            },
            form: {
               method: 'POST',
               style: 'register',
               list: false,
               key: false,
               inputs: false,
               btns: [
                  {
                     name: 'quit',
                     value: session.key,
                     text: 'Quit',
                     style: 'btn'
                  }
               ]
            }
         }
      }
   }
}

module.exports = pageConfiguration
