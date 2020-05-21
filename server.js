
// load .env
require('dotenv').config();

// load dependenies
const debug = require('debug')('ycrmh:server'),
	express = require('express'),
	app = express();

app.set('view engine', 'ejs');

// serve static assets
app.use('/', express.static('public'));

// ui for setting up a call
app.get('/', (req, res) => res.render('index'));

// ui for establishing a connection with a peer by id
app.get('/:id', (req, res) => res.render('call', { id: req.params.id }));

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

//start the server
app.listen(process.env.PORT || 9000);
