var libtorrent = require('libtorrent-nodewrap');
var path = require('path');

var session = new libtorrent.session();
session.listen_on(6882, 6882);

console.log('Torrent client are literning at port: ' + session.listen_port());

var file_storage = new libtorrent.file_storage();

// for VM
var dataPath = '/home/vagrant/example-question/data/input';
var pieceHashPath = '/home/vagrant/example-question/data';

// add files into file_storage
console.log('--------------------------------------');
console.log('Create torrent_info from torrent_entry');
file_storage.add_file(dataPath);

console.log('File Name:', file_storage.file_name_ptr(0));
console.log('Number of files:', file_storage.num_files());

// create torrent
console.log('Create create_torrent');
var create_torrent = new libtorrent.create_torrent(file_storage);
create_torrent.set_comment('Comment');
create_torrent.set_creator('Creator');
create_torrent.async_set_piece_hashes(pieceHashPath, function() {
  // Generate Torrent file
  console.log('Create torrent_info');

  var bencode = create_torrent.bencode();
  var torrent_info = new libtorrent.torrent_info(bencode, bencode.length, 0);

  console.log('Create magnet_link');
  var magnet_link = torrent_info.make_magnet_uri();
  console.log('magnet link = ', magnet_link);

  console.log('--------------Add Torrent to the session and Seed------------------------');
  session.start_dht();
  session.add_port_mapping(2, 6882, 6882);
  session.start_upnp();

  session.async_add_torrent({
    ti: torrent_info,
    save_path: pieceHashPath,
    seed_mode: true,
  }, function(torrent_handle) {

    var time = setInterval(function() {
      var progress = torrent_handle.status().progress;
      var state = torrent_handle.status().state;
      console.log((Number(progress * 100)).toFixed(2) + '% ---- ' + state);
      if (progress === 1 && state === 5) {
        clearInterval(time);
      }
    },1);
  });
});

console.log('Seeding ................................');
setTimeout(function() {
  session.stop_session();
  console.log('Done!');
}, 30000000);