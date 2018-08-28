import firebase from 'firebase/app'
import 'firebase/database'
import Connector from 'qrcode-generator'

/*
  TODO: change variables like "to", "data", "size", "padding"
  with more descritive one.
*/

const createConnectorImg = async ({connectorName, to, value, gasPrice = null, gasLimit = null, nonce = null, data = null, size = 5, padding = 10, addressCB, txIdCB}) => {
  var config = {
    apiKey: 'AIzaSyAAS3GK4zF6ZFpDYZuBuF5HCATEyBL8m4w',
    authDomain: 'whitelist-8a24c.firebaseapp.com',
    databaseURL: 'https://master-47318.firebaseio.com/',
    projectId: 'whitelist-8a24c',
    storageBucket: 'whitelist-8a24c.appspot.com',
    messagingSenderId: '456545727795'
  }

  firebase.initializeApp(config)

  let sessionId = window.localStorage[connectorName]

  if (!sessionId || !(await existsOnFirebase(sessionId)) || !(await sameDataOnFirebase(sessionId, to, value, gasPrice, gasLimit, nonce, data))) {
    sessionId = firebase.database().ref('sessions').push({
      tx: {
        to,
        value,
        gasPrice,
        gasLimit,
        nonce,
        data
      }
    }).key
    window.localStorage.setItem(connectorName, sessionId)
  }

  const connectorImg = new Connector(0, 'H')
  connectorImg.addData('atomax-connector:' + sessionId)
  connectorImg.make()

  startSocket(connectorName, sessionId, addressCB, txIdCB)

  return connectorImg.createSvgTag(size, padding)
}

const existsOnFirebase = async (sessionId) => {
  const session = (await firebase.database().ref(`sessions/${sessionId}`).once('value')).val()
  return !!session
}

const sameDataOnFirebase = async (sessionId, to, value, gasPrice, gasLimit, nonce, data) => {
  const tx = (await firebase.database().ref(`sessions/${sessionId}/tx`).once('value')).val()
  return tx.to === to && tx.value === value && tx.gasPrice === gasPrice && tx.gasLimit === gasLimit && tx.nonce === nonce && tx.data === data
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

export default createConnectorImg
