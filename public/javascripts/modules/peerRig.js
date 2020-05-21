
export default class PeerRig {

	constructor(video, label, peer=null) {
		this.video = video;
		this.label = label;
		this.peer = peer;
		if (peer) {
			if (typeof peer == 'string') {
				// this is just the id string
				// set the id and update the label
				this.peerId = peer;
			} else {
				// this is the rig for the local peer; setup the bindings we need to keep the ui fresh
				peer.on('open', id => {
					this.peerId = id;
					this.peerReady = true;
				});
				// when the connection to the signalling server drops, renew the connection
				// existing calls / data connections will stay open, but new ones can't be negotiated until the connection is reestablished
				peer.on('disconnected', () => {
					peer.reconnect();
				});
				// fail loudly!
				peer.on('error', err => {
					console.log(`Peer errored (type ${err.type}): "${err.message}"`, err);
					alert(''+err);
				});
			}
		}
	}

	set peerId(peerId) {
		this._peerId = peerId;
		this.label.innerText = peerId;
	}
	get peerId() { return this._peerId }

	acquireWebcamStream(cb) {
		// get the webcam video & mic audio
		const stream = navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
			// hook the stream up to the video
			this.attachStream(stream);
			// pass the stream back
			cb && cb(stream);
		}).catch(err => {
			console.log("Failed to get user media stream! "+err.message);
		});
	}
	attachStream(stream) {
		// save and hook up the stream to 'my' video tag
		this.stream = stream;
		this.video.srcObject = stream;
		// play the video
		this.video.play();

		this.videoReady = true;
	}
	killStream() {
		this.videoReady = false;
		// pause the video
		this.video.pause();
		// clear the stream
		this.video.removeAttribute('src');
		// TODO: do I need this \/ \/ ?
		//this.video.removeAttribute('srcObject');
		// this is for firefox?
		this.video.load();

		// reset the label
		this.peerId = '';
	}
}

