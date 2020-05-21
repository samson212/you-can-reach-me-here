
import PeerRig from './modules/peerRig.js';

const globalVar = "this is global!";

(() => {

	const body = document.querySelector('body'),

		me  = new PeerRig(document.getElementById('me'),
						  document.getElementById('myId'),
						  new Peer({ host: '/', path: '/peer' })),

		yourId = window.location.href.replace(/\/$/, '').replace(/.*\//, ''),
		you = new PeerRig(document.getElementById('you'),
						  document.getElementById('yourId'),
						  yourId);
	let currentCall;

	function placeCall() {
		console.log("placeCall()");
		if (me.peerReady && me.videoReady && you.peerId) {
			// when we get the stream, attach it to the DOM
			currentCall.on('stream', stream => {
				you.attachStream(stream);
				body.classList.remove('calling');
				body.classList.add('on-call');
			});

			// update the UI state
			body.classList.add('calling');

			// we're ready, place the call!
			currentCall = me.peer.call(you.peerId, me.stream);
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

	// get the webcam video & mic audio
	me.acquireWebcamStream(stream => {
		// set the UI state
		body.classList.add('stream-ready');
	});

	// when the connection to the signalling server is open, update the UI
	me.peer.on('open', id => { body.classList.add('peer-ready') });

	me.peer.on('call', function(call) {
		console.log("incoming call??", call);
	});

	// bind to the button in the DOM
	document.getElementById('call').addEventListener('click', e => {
		placeCall();
	});

})();
