
import PeerRig from './modules/peerRig.js'

(() => {

	/* *************** *
	 *    "globals"    *
	 * *************** */

	// get DOM elements
	const body = document.querySelector('body'),
	// and build the peer rigs
		me = new PeerRig(document.getElementById('me'),
						 document.getElementById('myId'),
						 MY_ID ? new Peer(MY_ID) : new Peer()),

		you = new PeerRig(document.getElementById('you'),
						  document.getElementById('yourId'));

	let currentCall;

	/* *************** *
 	 *    bindings     *
 	 * *************** */

	// when the connection to the signalling server is open, update the UI state
	me.peer.on('open', id => {
		console.log("Connection opened, got id "+id);
		body.classList.add('peer-ready');
	});

	// what is this event for? the docs aren't totally clear
	me.peer.on('close', () => {
		console.log("!!!!!!!!!! Peer's on close -- do I care?");
	});

	// when the connection to the signalling server drops, update the UI state
	me.peer.on('disconnected', () => {
		body.classList.remove('peer-ready');
	});

	// when an incoming call is received, answer it!
	me.peer.on('call', function(call) {
		console.log("got a call: ", call);
		if (!currentCall) {
			// set the label ui and save the peer id
			you.peerId = call.peer;

			// bind events for the call and save a reference
			bindToCall(call);

			// answer the call with the webcam stream
			call.answer(me.stream);

			// update the UI state
			body.classList.remove('calling');
			body.classList.add('on-call');
		} else {
			console.log("Already on a call!");
			call.close();
		}
	});

	function bindToCall(call) {
		// save a reference to the call
		currentCall = call;

		// when we get the remote stream, attach it to the DOM
		call.on('stream', stream => { you.attachStream(stream) });

		// when we lose the connection, kill the DOM video and update the UI state
		call.on('close', () => {
			you.killStream()
			body.classList.remove('on-call');
		});

		// catch errors and show the error
		call.on('error', err => {
			console.log(`Call had an error of type ${err.type}: "${err.message}"`, err);
			alert(''+err);
		});
	}

	/* *************** *
 	 *    let's go!    *
 	 * *************** */

	// get the webcam video & mic audio, then update the UI state
	me.acquireWebcamStream(stream => {
		console.log("Acquired webcam");
		body.classList.add('stream-ready')
	});

	// once the peering & webcam are set up, the generate button will be displayed (handled in CSS)
	document.querySelector('#generate button').addEventListener('click', e => {

		// compose the call URL
		const url = location.host+'/'+me.peer.id;

		// set the link's target 
		document.querySelector('#copy-text').href = url;
		
		// display the URL in the DOM for copying
		document.querySelector('#copy-text').innerText = url;

		// update the UI state
		body.classList.add('call-ready');
	});

	new ClipboardJS('#generate .call-url button');

})();
