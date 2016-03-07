var libtorrent = require('libtorrent-nodewrap');
var path = require('path');

var session = new libtorrent.session();

//for VM ubuntu
var pieceHashPath = '/home/vagrant/examples/data/output';
var magnet_uri = 'magnet:?xt=urn:btih:b540ae676967ebde47870885f04763b77d9a50a4'; // download 2 file

console.log('--------------Add Torrent Param------------------------');
var params = new libtorrent.add_torrent_params();
params.url = magnet_uri;
params.save_path = pieceHashPath;
params.seed_mode = false;

console.log('--------------Add Torrent Into the session and Seed------------------------');
var torrent_handle = session.add_torrent(params);
torrent_handle.connect_peer('127.0.0.1', 6882, 0);
console.log(torrent_handle.is_valid());

// add info_hash to peer_data
console.log('--------------Add info_hash of torrent object Into the peer_data------------------------');

var time = setInterval(function() {
  var progress = torrent_handle.status().progress;
  var state = torrent_handle.status().state;
  console.log((Number(progress * 100)).toFixed(2) + '% ---- ' + state);
  if (progress === 1 && state === 5)
    clearInterval(time);
  if (state === 4) {
    console.log('Finished');
    clearInterval(time);
  }
},100);