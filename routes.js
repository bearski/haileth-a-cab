const routes = require('next-routes')();

routes
  .add('/drivers/new', '/drivers/new')
  .add('/drivers/:address', '/drivers/show')
  .add('/drivers/:address/requests', '/drivers/requests/index')
  .add('/drivers/:address/requests/new', '/drivers/requests/new');


module.exports = routes;
