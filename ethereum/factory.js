import web3 from './web3';
import CampaignFactory from './build/DriverFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x5Ab6120a3fd29cB6f275B4cB6D2e24ba54186535'
);

export default instance;