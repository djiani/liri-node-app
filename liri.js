require("dotenv").config();
const Spotify = require('node-spotify-api');


const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);




//console.log(keys);

const whatToDo = process.argv[2];
const searchArg = process.argv.slice(3).join("+");
console.log(searchArg);

function spotifyThisSong(trackName) {
    spotify
        .search({ type: 'track', query: trackName })
        .then(function (response) {
            console.log(response.tracks.items);
            response.tracks.items.map(function(track){
                console.log(`
            Album name: ${track.album.name}
            Song's name: ${track.name}
            Arttist: ${track.artists.map(artist =>artist.name)}
            Preview link: ${track.preview_url}   
            `);
            })
        })
        .catch(function (err) {
            console.log(err);
        });
}

switch (whatToDo) {
    case 'spotify-this-song': spotifyThisSong();
        break;
    default:
        console.log("sorry, can find this command! Enter a valid command!");

}

