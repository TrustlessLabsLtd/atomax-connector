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
