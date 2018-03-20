import web3 from './web3';
import DriverFactory from './build/DriverFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(DriverFactory.interface),
  '0xC7515d051E6d41D4AE0aE8375c781AB8b98C7cF4'
);

export default instance;
