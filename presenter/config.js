const e = require("express")

const admin = 'admin'
const client = 'client'

const formatList = (list, type) => {
   Array.isArray(list) ? list : list = [list]
   if (type === 'clients') {
      return list.map(elem => {
         return {
            unit: elem,
            passID: elem.passportID,
            name: 'action',
            value: 'findClient',
            text: 'View client',
            style: 'btn btn-warning p-3 w-100 bg-gradient'
         }
      })
   }
   if (type === 'client') {
      return list.map(elem => {
         return {
            unit: elem
         }
      })
   }
   if (type === 'cards') {
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
            style: 'btn btn-warning p-3 w-100 bg-gradient'
         }
      })
   }
   if (type === 'card') {
      return list.map(elem => {
         const editedElem = Object.assign({}, elem)
         delete editedElem.CVV
         delete editedElem.PIN
         return {
            unit: editedElem
         }
      })
   }
}

const pageConfiguration = {
   authorization: () => {
      return {
         title: 'Authorization',
         form: {
            admin: {
               method: 'POST',
               hidden: {
                  name: 'role',
                  value: admin
               },
               list: false,
               inputs: [
                  {
                     label: 'Login',
                     id: 'adminId',
                     type: 'text',
                     name: 'id',
                     placeholder: 'Employee pseudo..'
                  },
                  {
                     label: 'Password',
                     id: 'adminSecret',
                     type: 'password',
                     name: 'secret',
                     placeholder: '***'
                  },
               ],
               btns: [
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'login',
                     text: 'Log in',
                  }
               ]
            },
            client: {
               method: 'POST',
               hidden: {
                  name: 'role',
                  value: client
               },
               list: false,
               inputs: [
                  {
                     label: 'Card Number',
                     id: 'clientId',
                     type: 'text',
                     name: 'id',
                     placeholder: '0000 0000 0000 0000'
                  },
                  {
                     label: 'PIN',
                     id: 'clientSecret',
                     type: 'password',
                     name: 'secret',
                     placeholder: '****'
                  },
               ],
               btns: [
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'login',
                     text: 'Log in',
                  }
               ]
            }
         },
         layout: `${__dirname}/layouts/index`
      }
   },




   index: () => {
      return {
         title: 'Authorization',
         h1: {
            text: 'Are you a client or an administrator?',
            style: 'text-center fw-bolder'
         },
         h2: false,
         form: {
            method: 'GET',
            style: 'container-sm g-2',
            hidden: false,
            list: false,
            inputs: false,
            btns: [
               {
                  name: 'isAdminClient',
                  value: admin,
                  text: 'Admin',
                  style: 'btn btn-primary p-3 w-100 bg-gradient'
               },
               {
                  name: 'isAdminClient',
                  value: client,
                  text: 'Client',
                  style: 'btn btn-primary p-3 w-100 bg-gradient'
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
            style: 'text-center fw-bolder'
         },
         form: {
            method: 'POST',
            style: 'container-sm g-2',
            hidden: [
               {
                  name: 'key',
                  value: session.key
               }
            ],
            list: false,
            inputs: false,
            btns: [
               {
                  name: 'link',
                  value: 'mainMenu',
                  text: 'Main menu',
                  style: 'btn btn-primary p-3 w-100 bg-gradient'
               },
               {
                  name: 'link',
                  value: 'quit',
                  text: 'Quit',
                  style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'GET',
               style: 'container-sm g-2',
               hidden: false,
               list: false,
               inputs: false,
               btns: [
                  {
                     name: 'isAdminClient',
                     value: err.role,
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'index',
                     value: 'homePage',
                     text: 'Home',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: err.session.key
                  }
               ],
               list: false,
               inputs: false,
               btns: [
                  {
                     name: 'link',
                     value: 'back',
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'mainMenu',
                     text: 'Main menu',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn btn-dark p-3 w-100 bg-gradient'
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
               style: 'container-sm g-2',
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
                     style: 'col-sm-6 form-floating my-2',
                  },
                  {
                     label: 'Pass',
                     id: 'adminSecret',
                     type: 'password',
                     name: 'secret',
                     style: 'col-sm-6 form-floating my-2',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'login',
                     text: 'Submit',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
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
               style: 'container-sm g-2',
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
                     name: 'link',
                     value: 'addClient',
                     text: 'Add client',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'findClient',
                     text: 'Find client',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'addCard',
                     text: 'Add card',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'findCard',
                     text: 'Find card',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'action',
                     value: 'viewAllClients',
                     text: 'View all clients',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
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
               list: formatList(session.cookie.clients, 'clients'),
               inputs: false,
               btns: [
                  {
                     name: 'link',
                     value: 'addClient',
                     text: 'Add client',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'findClient',
                     text: 'Find client',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'mainMenu',
                     text: 'Main menu',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: [
                  {
                     label: 'Passport ID',
                     type: 'text',
                     name: 'passID',
                     style: 'col-sm-6 form-floating my-2',
                  },
                  {
                     label: 'First name',
                     type: 'text',
                     name: 'firstName',
                     style: 'col-sm-6 form-floating my-2',
                  },
                  {
                     label: 'Last name',
                     type: 'text',
                     name: 'lastName',
                     style: 'col-sm-6 form-floating my-2',
                  },
                  {
                     label: 'Day of birth',
                     type: 'text',
                     name: 'birthDay',
                     style: 'col-sm-6 form-floating my-2',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'addClient',
                     text: 'Confirm',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'back',
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: [
                  {
                     label: 'Passport ID',
                     type: 'text',
                     name: 'passID',
                     style: 'col-sm form-floating my-2',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'findClient',
                     text: 'Confirm',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'back',
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'btn btn-primary p-3 w-100 bg-gradient'
            },
            {
               name: 'action',
               value: 'viewClientCards',
               text: 'View client cards',
               style: 'btn btn-primary p-3 w-100 bg-gradient'
            },
            {
               name: 'action',
               value: 'addCardForClient',
               text: 'Add card for client',
               style: 'btn btn-primary p-3 w-100 bg-gradient'
            }
         ]
         const unactiveBtns = [
            {
               name: 'link',
               value: 'activateClient',
               text: 'Activate client',
               style: 'btn btn-primary p-3 w-100 bg-gradient'
            }
         ]
         const clientBtns = session.cookie.client.activeStatus ? activeBtns : unactiveBtns
         return {
            title: 'Client',
            h1: false,
            h2: {
               text: 'Client',
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: formatList(session.cookie.client, 'client'),
               inputs: false,
               btns: [
                  ...clientBtns,
                  {
                     name: 'link',
                     value: 'mainMenu',
                     text: 'Main menu',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: false,
               btns: [
                  {
                     name: 'action',
                     value: 'activateClient',
                     text: 'Confirm',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'back',
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: false,
               btns: [
                  {
                     name: 'action',
                     value: 'deactivateClient',
                     text: 'Confirm',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'back',
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
                  }
               ]
            }
         }
      },
      viewClientCards: session => {
         const findCardBtn = [
            {
               name: 'link',
               value: 'findCard',
               text: 'Find client card',
               style: 'btn btn-primary p-3 w-100 bg-gradient'
            }
         ]
         const cardsBtns = session.cookie.cards.length > 1 ? findCardBtn : []
         return {
            title: 'Client cards',
            h1: false,
            h2: {
               text: 'Client cards',
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  },
                  {
                     name: 'cardNum',
                     value: ''
                  },
               ],
               list: formatList(session.cookie.cards, 'cards'),
               inputs: false,
               btns: [
                  ...cardsBtns,
                  {
                     name: 'link',
                     value: 'mainMenu',
                     text: 'Main menu',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               list: false,
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               inputs: [
                  {
                     label: 'Passport ID',
                     type: 'text',
                     name: 'passID',
                     style: 'col-sm form-floating my-2',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'addCard',
                     text: 'Confirm',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'back',
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: [
                  {
                     label: 'Card number',
                     type: 'text',
                     name: 'cardNum',
                     style: 'col-sm form-floating my-2',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'findCard',
                     text: 'Confirm',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'back',
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: false,
               btns: [
                  {
                     name: 'action',
                     value: 'deactivateClientCard',
                     text: 'Confirm',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'back',
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               key: false,
               btns: [
                  {
                     name: 'link',
                     value: 'viewClient',
                     text: 'To card owner',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'mainMenu',
                     text: 'Main menu',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: formatList(session.cookie.card, 'card'),
               inputs: false,
               btns: [
                  {
                     name: 'action',
                     value: 'findCardOwner',
                     text: 'View client',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'action',
                     value: 'refreshCard',
                     text: 'Refresh card',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'deactivateClientCard',
                     text: 'Deactivate card',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'mainMenu',
                     text: 'Main menu',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'role',
                     value: client
                  }
               ],
               list: false,
               inputs: [
                  {
                     label: 'Card Number',
                     type: 'text',
                     name: 'id',
                     style: 'col-sm-6 form-floating my-2',
                  },
                  {
                     label: 'PIN',
                     type: 'password',
                     name: 'secret',
                     style: 'col-sm-6 form-floating my-2',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'login',
                     text: 'Submit',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
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
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: false,
               btns: [
                  {
                     name: 'action',
                     value: 'viewBalance',
                     text: 'View balance',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'withdrawMoney',
                     text: 'Withdraw money',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'putMoney',
                     text: 'Put money',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'changePIN',
                     text: 'Change PIN',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'deactivateCard',
                     text: 'Deactivate card',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
                  },
               ]
            }
         }
      },
      viewBalance: session => {
         return {
            title: 'Balance',
            h1: {
               text: 'Balance is',
               style: 'text-center fw-bolder'
            },
            h2: {
               text: session.cookie.balance,
               style: 'display-2 text-center fw-normal'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: false,
               btns: [
                  {
                     name: 'link',
                     value: 'withdrawMoney',
                     text: 'Withdraw money',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'putMoney',
                     text: 'Put money',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'mainMenu',
                     text: 'Main menu',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: [
                  {
                     label: 'Summ',
                     type: 'text',
                     name: 'summ',
                     style: 'col-sm form-floating my-2',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'withdrawMoney',
                     text: 'Confirm',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'back',
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: [
                  {
                     label: 'Summ',
                     type: 'text',
                     name: 'summ',
                     style: 'col-sm form-floating my-2',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'putMoney',
                     text: 'Confirm',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'back',
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: [
                  {
                     label: 'PIN',
                     type: 'password',
                     name: 'oldPIN',
                     style: 'col-sm-6 form-floating my-2',
                  },
                  {
                     label: 'New PIN',
                     type: 'password',
                     name: 'newPIN',
                     style: 'col-sm-6 form-floating my-2',
                  }
               ],
               btns: [
                  {
                     name: 'action',
                     id: 'confirm',
                     value: 'changePIN',
                     text: 'Confirm',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'back',
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: false,
               btns: [
                  {
                     name: 'action',
                     value: 'deactivateCard',
                     text: 'Confirm',
                     style: 'btn btn-primary p-3 w-100 bg-gradient'
                  },
                  {
                     name: 'link',
                     value: 'back',
                     text: 'Back',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
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
               style: 'text-center fw-bolder'
            },
            form: {
               method: 'POST',
               style: 'container-sm g-2',
               hidden: [
                  {
                     name: 'key',
                     value: session.key
                  }
               ],
               list: false,
               inputs: false,
               btns: [
                  {
                     name: 'link',
                     value: 'quit',
                     text: 'Quit',
                     style: 'btn btn-outline-dark p-3 w-100 bg-gradient'
                  }
               ]
            }
         }
      }
   }
}

module.exports = pageConfiguration
