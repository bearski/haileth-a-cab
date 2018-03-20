const routes = require('next-routes')();

routes
  .add('/drivers/new', '/drivers/new')
  .add('/drivers/:address', '/drivers/show');

module.exports = routes;
