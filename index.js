import firebase from 'firebase/app'
import 'firebase/database'
import Connector from 'qrcode-generator'

const createConnectorImg = async ({ connectorName, signature = false, signatureMessage = null, to = null, value = null, gasPrice = null, gasLimit = null, nonce = null, data = null, size = 5, padding = 10, returnOnlyData = false, addressCB, txIdCB, messageSignedCB }) => {
  if (!signature && !to && !value) {
    console.log('[atomax-connector] You must define "to" and "value" parameters')
    return
  }

  var config = {
    apiKey: 'AIzaSyAAS3GK4zF6ZFpDYZuBuF5HCATEyBL8m4w',
    authDomain: 'whitelist-8a24c.firebaseapp.com',
    databaseURL: 'https://master-47318.firebaseio.com/',
    projectId: 'whitelist-8a24c',
    storageBucket: 'whitelist-8a24c.appspot.com',
    messagingSenderId: '456545727795'
  }

  // initialize firebase only if is it not
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }

  let sessionId = window.localStorage[connectorName]

  let tx
  if (signature) {
    // TODO: to and value should be removed (retrocompatibility issue)
    tx = {
      to,
      value,
      signature,
      signatureMessage
    }
  } else {
    tx = {
      to,
      value,
      gasPrice,
      gasLimit,
      nonce,
      data
    }
  }

  if (!sessionId || !(await existsOnFirebase(sessionId)) || !(await sameDataOnFirebase(sessionId, signature, signatureMessage, to, value, gasPrice, gasLimit, nonce, data))) {
    sessionId = firebase.database().ref('sessions').push({
      tx
    }).key
    window.localStorage.setItem(connectorName, sessionId)
  }

  const connectorImg = new Connector(0, 'H')
  const dataValue = 'atomax-connector:' + sessionId
  connectorImg.addData(dataValue)
  connectorImg.make()

  if (signature) {
    startSignatureSocket(connectorName, sessionId, addressCB, messageSignedCB)
  } else {
    startSocket(connectorName, sessionId, addressCB, txIdCB)
  }

  return returnOnlyData ? dataValue : connectorImg.createSvgTag(size, padding)
}

const existsOnFirebase = async (sessionId) => {
  const session = (await firebase.database().ref(`sessions/${sessionId}`).once('value')).val()
  return !!session
}

const sameDataOnFirebase = async (sessionId, signature, signatureMessage, to, value, gasPrice, gasLimit, nonce, data) => {
  const tx = (await firebase.database().ref(`sessions/${sessionId}/tx`).once('value')).val()
  return (tx.to == to && tx.value == value && tx.gasPrice == gasPrice && tx.gasLimit == gasLimit && tx.nonce == nonce && tx.data == data) || (signature == tx.signature && signatureMessage == tx.signatureMessage)
}

const startSocket = (connectorName, sessionId, addressCB, txIdCB) => {
  firebase.database().ref(`sessions/${sessionId}/address`).on('value', (snapshot) => {
    addressCB(snapshot.val())
  })
  firebase.database().ref(`sessions/${sessionId}/tx`).on('value', (snapshot) => {
    const tx = snapshot.val()
    if (tx && tx.id) {
      window.localStorage.removeItem(connectorName)
    }
    txIdCB(tx)
  })
}

const startSignatureSocket = (connectorName, sessionId, addressCB, messageSignedCB) => {
  firebase.database().ref(`sessions/${sessionId}/address`).on('value', (snapshot) => {
    addressCB(snapshot.val())
  })
  firebase.database().ref(`sessions/${sessionId}/messageSigned`).on('value', (snapshot) => {
    const messageSigned = snapshot.val()
    if (messageSigned) {
      window.localStorage.removeItem(connectorName)
    }
    messageSignedCB(messageSigned)
  })
}

export default createConnectorImg
