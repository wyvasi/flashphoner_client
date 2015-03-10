/**
 * Created by nazar on 04.02.2015.
 */
//Init WCS JavaScript API
var f = Flashphoner.getInstance();
var stream;
var player;
var audioPlayer;
var avReceiver;


function initAPI() {
    f.addListener(WCSEvent.ErrorStatusEvent, errorEvent);
    f.addListener(WCSEvent.ConnectionStatusEvent, connectionStatusListener);
    f.addListener(WCSEvent.StreamStatusEvent, streamStatusListener);
    f.addListener(WCSEvent.OnBinaryEvent, binaryListener);
    ConfigurationLoader.getInstance(function (configuration) {
        f.init(configuration);
        initMpeg();
        initAudio();
        avReceiver = new AVReceiver(player, audioPlayer);
        connect();

    });
}

function initMpeg() {
    // Show loading notice
    var canvas = document.getElementById('videoCanvas');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#444';
    ctx.fillText('Loading...', canvas.width/2-30, canvas.height/3);

    this.player = new jsmpeg(null, {canvas:canvas});
    player.initSocketClient(null, f.configuration.videoWidth, f.configuration.videoHeight);
}

function playFirstSound() {
    var audioBuffer = audioPlayer.context.createBuffer(1, 441, 44100);
    var output = audioBuffer.getChannelData(0);
    for (var i = 0; i < output.length; i++) {
        output[i] = Math.random() * 2 - 1;;
    }
    var src = audioPlayer.context.createBufferSource();
    src.buffer = audioBuffer;
    src.connect(audioPlayer.context.destination);
    src.start(0);
}

function initAudio() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioContext = new AudioContext();
        audioPlayer = new AudioPlayer(audioContext, f.configuration.incomingAudioBufferLength);
    } catch(e) {
        alert('Web Audio API is not supported in this browser' + e);
    }
}

function connect() {
    f.connect({appKey: "defaultApp", useRTCSessions: false, useWsTunnel: true, useBase64BinaryEncoding: false});
}

//Connection Status
function connectionStatusListener(event) {
    console.log(event.status);
    if (event.status == ConnectionStatus.Established) {
        console.log('Connection has been established. Retrieve stream');
        playStream();
    } else if (event.status == ConnectionStatus.Disconnected) {
        audioPlayer.stop();
        console.log("Disconnected");
    } else if (event.status == ConnectionStatus.Failed) {
        f.disconnect();
    }
}

function binaryListener(event) {
    avReceiver.onDataReceived(event);
}

//Connection Status
function streamStatusListener(event) {
    console.log(event.status);
    if (event.status == StreamStatus.Failed) {
        player.stop();
        audioPlayer.stop();
    } else if (event.status == StreamStatus.Stoped) {
        player.stop();
        audioPlayer.stop();
    }
}

//Error
function errorEvent(event) {
    console.log(event.info);
    player.stop();
    audioPlayer.stop();
}

function playStream() {
    var stream = new Stream();
    stream.name = parseUrlId();
    stream.hasVideo = true;
    stream.sdp = "v=0\r\n" +
        "o=- 1988962254 1988962254 IN IP4 192.168.56.1\r\n" +
        "c=IN IP4 192.168.56.1\r\n" +
        "t=0 0\r\n" +
    "a=sdplang:en\r\n"+
    "a=range:npt=now-\r\n" +
    "a=control:*\r\n" +

    "m=video 6000 RTP/AVP 32\r\n" +
        "a=rtpmap:32 MPV/90000\r\n" +
        "a=recvonly\r\n" +
    "m=audio 6002 RTP/AVP 0\r\n" +
    "a=rtpmap:0 PCMU/8000\r\n" +
    "a=recvonly\r\n";
    this.stream = stream;
    f.playStream(stream);
}

function parseUrlId() {
    var idTrans = [];
    var address = window.location.toString();
    var pattern = /https?:\/\/.*\?id\=(.*)/;
    idTrans = address.match(pattern);
    return idTrans[1];
}

$(document).ready(function () {
    $("#enableAudio").click(function () {
        playFirstSound();
    });
});
