# Atomax Connector

[![NPM](https://nodei.co/npm/atomax-connector.png)](https://nodei.co/npm/atomax-connector/)

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
