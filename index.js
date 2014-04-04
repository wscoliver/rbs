var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle={};
handle['/'] = requestHandlers.start;
handle['/start'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;
handle['/login'] = requestHandlers.login;
handle['/add_resident'] = requestHandlers.add_resident;
handle['/resident'] = requestHandlers.all_resident;
handle['/logout'] = requestHandlers.logout;
handle['/blockadmin'] = requestHandlers.blockadmin;
handle['/party'] = requestHandlers.party;
server.start(handle, router.route);

