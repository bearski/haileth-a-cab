const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

let driverPath;
let source;
let output;

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

//  Driver.sol
driverPath = path.resolve(__dirname, 'contracts', 'Driver.sol');
source = fs.readFileSync(driverPath, 'utf8');
output = solc.compile(source, 1).contracts;

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}

//  Escrow.sol
driverPath = path.resolve(__dirname, 'contracts', 'Escrow.sol');
source = fs.readFileSync(driverPath, 'utf8');
output = solc.compile(source, 1).contracts;

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}
