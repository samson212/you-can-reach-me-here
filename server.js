
// load .env
require('dotenv').config();

// load dependenies
const debug = require('debug')('ycrmh:server'),
	express = require('express'),
	app = express(),
	session = require('express-session'),
	redis = require('redis'),
	redisClient = redis.createClient(),
	RedisStore = require('connect-redis')(session),
// set up peerjs
	ExpressPeerServer = require('peer').ExpressPeerServer,
	options = { debug: false },
	peerServer = ExpressPeerServer(server, options),
//start the server
	server = app.listen(process.env.PORT);

app.set('view engine', 'ejs');

app.use(session({
	store: new RedisStore({ client: redisClient }),
	secret: process.env.SESSION_SECRET,
	resave: false,
	cookie: { /* secure: true, */ maxAge: 1000*60*60 }
}));

// serve static assets
app.use('/', express.static('public'));

// endpoint for the signaling server
app.use('/peer', peerServer);

// ui for setting up a call
app.get('/', (req, res) => res.render('index'));

// ui for establishing a connection with a peer by id
app.get('/:id', (req, res) => res.render('call'));

/*
app.get("/api/peers", function(req, res) {  
  console.log(peers);
  return res.json(Array.from(peers));
});

// Client should send their own id to this endpoint
// to be removed from the available peer list
app.get("/api/peers/consume/:id", function(req, res) {  
  const consumedPeer = req.params.id;
  const result = peers.delete(consumedPeer);
  return res.json({
    success: result
  });
});
*/

/*
peerServer.on("connection", function(id) {
  peers.add(id);
});

peerServer.on("disconnect", function(id) {
  peers.delete(id);  
});
*/
