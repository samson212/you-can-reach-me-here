
import PeerRig from './modules/peerRig.js';

(() => {

	const body = document.querySelector('body'),

		me  = new PeerRig(document.getElementById('me'),
						  document.getElementById('myId'),
						  MY_ID ? new Peer(MY_ID) : new Peer()),

		you = new PeerRig(document.getElementById('you'),
						  document.getElementById('yourId'),
			// this is added to global scope in the template
						  YOUR_ID);
	let currentCall;

	function placeCall() {
		console.log("making the call");
		if (me.peerReady && me.videoReady && you.peerId) {
			// update the UI state
			body.classList.add('calling');

			// place the call!
			currentCall = me.peer.call(you.peerId, me.stream);

			// when we get the stream, attach it to the DOM
			currentCall.on('stream', stream => {
				you.attachStream(stream);
				body.classList.remove('calling');
				body.classList.add('on-call');
			});
		} else {
			if (!me.peerReady) {
				console.log("!!! Peer not ready!");
				alert('Peer not ready to call yet!');
			}
			if (!me.videoReady) {
				console.log("!!! Video not ready!");
				alert('Please enable your webcam!');
			}
			if (!you.peerId) {
				console.log("!!! No peer id???");
				alert("There may be something wrong with the url? I couldn't find a peer ID!");
			}
		}
	}

	// get the webcam video & mic audio; update the UI
	me.acquireWebcamStream(stream => {
		console.log("Acquired webcam");
		body.classList.add('stream-ready');
	});

	// when the connection to the signalling server is open, update the UI
	me.peer.on('open', id => {
		console.log("Connection opened, got id "+id);
		body.classList.add('peer-ready')
	});

	me.peer.on('call', function(call) {
		console.log("incoming call??", call);
	});

	// bind to the button in the DOM
	document.getElementById('call').addEventListener('click', e => {
		placeCall();
	});

})();
