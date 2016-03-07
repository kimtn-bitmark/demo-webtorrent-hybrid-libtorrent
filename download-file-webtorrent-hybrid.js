var WebTorrent = require('webtorrent-hybrid');

var client = new WebTorrent({
  tracker: false
});
var magnetURI = 'magnet:?xt=urn:btih:b540ae676967ebde47870885f04763b77d9a50a4';
// var magnetURI = 'magnet:?xt=urn:btih:99f347326746d751f5e19a29be332e43db35d95d';

console.log('start webtorrent...');
client.add(magnetURI, function (torrent) {
    // Got torrent metadata!
  console.log('Client is downloading:', torrent.infoHash);

  var swarm = torrent.swarm;
  swarm.addPeer('127.0.0.1:6882'); // add a peer
});

client.on('torrent', function (torrent) {
  console.log('on torrent');
});