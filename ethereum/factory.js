import web3 from './web3';
import DriverFactory from './build/DriverFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(DriverFactory.interface),
  '0xbf1E8a47a74737363ba63D03CFe78196c9325101'
);

export default instance;
