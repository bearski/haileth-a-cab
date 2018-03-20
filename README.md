# Decentralised Cab Hailing Service

An attempt at a cab hailing service dapp for the ethereum network.

## Build Setup

In the root folder, `npm install` or `yarn` to load dependencies.

To compile and deploy contracts:
```
cd ethereum/
node compile.js
node deployEscrowFactory.js
node deploy.js
```

`deploy.js`, `deployEscrowFactory.js` and `web3.js` have config for the rinkeby.infura network.  Edit that if needed, you don't have to. It's dev and it's free :)
