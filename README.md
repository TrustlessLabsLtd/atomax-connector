![ATOMAX](https://raw.githubusercontent.com/TrustlessLabsLtd/static-files/master/Icona_Atomax_Android_3.png  width=210 align=center)



# Atomax Connector

Javascript library that allows a web app to connect with the Atomax Wallet

[![NPM](https://nodei.co/npm/atomax-connector.png)](https://nodei.co/npm/atomax-connector/)

## Getting Started

The following instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

What things you need to install the software and how to install them

* [Node.js](https://nodejs.org/)
* [NPM](https://www.npmjs.com/)


## Built With

* Node.js
* Rollup
* Babel

## Installation

Using npm:

`$ npm i atomax-connector`

## Usage

The AtomaxConnector has as main scope setting up the transaction
information in the atomax wallet.

The AtomaxConnector accept 3 parameter:
1. Transaction Data (Object)
2. Callback for retrive the wallet address
3. Callback for retrive the transaction ID, when the wallet send the transaction.


1. Transaction Data (Object)

  ** name: REQUIRED - "The name of the connector is used to identify
  each connector placed in one application. You need to
  specify a differente name for each connector istanciated"

  * value: REQUIRED - "Is the ETH value in the transaction"
  * gasPrice: OPTIONAL
  * gasLimit: OPTIONAL
  * nonce: OPTIONAL
  * data: OPTIONAL - here you can add optional raw data in hexadecimal format only.


2. Callback for retrive the wallet address

  * return the address


3. Callback for retrive the transaction ID, when the wallet send the transaction.

  * return the transaction ID


### A simple example of use

```html
<html>
  <head>
    <script src='node_modules/atomax-connector/dist/atomax-connector.js'></script>
  </head>
  <body>
    <div id='atomaxConnector'></div>
    <div id='data'></div>
    <div id='tx'></div>
  </body>
  <script>
    var atomaxDiv = document.getElementById('atomaxConnector')
    AtomaxConnector({
      name: 'test',
      to: '0xbd3696b01a487b012ba99628b06a1a7859f5ca23',
      value: '10000000000000000',
      addressCB: address => {
        var dataDiv = document.getElementById('data')
        dataDiv.innerHTML = address
      },
      txIdCB: tx => {
        var txDiv = document.getElementById('tx')
        txDiv.innerHTML = tx.id || null
      }
    }).then(qrcode => {
      atomaxDiv.innerHTML = qrcode
    })
  </script>
</html>
```
