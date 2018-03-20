import web3 from './web3';
import DriverFactory from './build/DriverFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(DriverFactory.interface),
  '0x5427Fdb903FC380c485657cD6307f5945B9Ba4E5'
);

export default instance;
