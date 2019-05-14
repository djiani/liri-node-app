require("dotenv").config();
const axios = require('axios');

const Spotify = require('node-spotify-api');
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);

//global variable
const OMDB_BASEURL= "http://www.omdbapi.com/";

//get command line argument
const whatToDo = process.argv[2];
const searchArg = process.argv.slice(3).join("+");
//console.log(searchArg);

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

function movieThis(title){
    axios.get(OMDB_BASEURL,{
        params:{
            apikey: 'trilogy',
            t: title ||"Mr. Nobody"
        }
    } ).then(function(response){
        console.log(`
        Title: ${response.data.Title}
        Year: ${response.data.Year}
        IMDB rating: ${response.data.imdbRating}
        Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
        Country of Production: ${response.data.Country}
        Language of the movies: ${response.data.Language}
        Plot: ${response.data.Plot}
        Actors: ${response.data.Actors}
        `)
    }).catch(function(err){
        console.log(err);
    })
    
}
switch (whatToDo) {
    case 'spotify-this-song': spotifyThisSong(searchArg);
        break;
    case 'movie-this': movieThis(searchArg);
        break;
    default:
        console.log("sorry, can find this command! Enter a valid command!");

}

