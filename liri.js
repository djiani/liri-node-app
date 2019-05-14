require("dotenv").config();
const axios = require('axios');
const fs = require('fs');

const Spotify = require('node-spotify-api');
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);

//global variable
const OMDB_BASEURL= "http://www.omdbapi.com/";
const BANDINTOWN_BASEURL = "https://rest.bandsintown.com/artists/";

//get command line argument
const whatToDo = process.argv[2];
const searchArg = process.argv.slice(3).join("+");
//console.log(searchArg);

function spotifyThisSong(trackName) {
    spotify
        .search({ type: 'track', query: trackName })
        .then(function (response) {
            //console.log(response.tracks.items);
            let dataLog = response.tracks.items.map(function(track){
                return (`
            Album name: ${track.album.name}
            Song's name: ${track.name}
            Arttist: ${track.artists.map(artist =>artist.name)}
            Preview link: ${track.preview_url}   
            `);
            });
            console.log(dataLog.join("\n"));
            appendText(whatToDo, searchArg, dataLog);
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
        let dataLog  = `
        Title: ${response.data.Title}
        Year: ${response.data.Year}
        IMDB rating: ${response.data.imdbRating}
        Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
        Country of Production: ${response.data.Country}
        Language of the movies: ${response.data.Language}
        Plot: ${response.data.Plot}
        Actors: ${response.data.Actors}
        `;
        console.log(dataLog);
        appendText(whatToDo, searchArg, dataLog);
    }).catch(function(err){
        console.log(err);
    })
    
}


function concertThis(artist){
    if(artist){
        axios.get("https://rest.bandsintown.com/artists/"+artist+"/events?app_id=codingbootcamp")
        .then(function(response){
            //console.log(response.data);
            if(!response.data){
                //console.log("Not events fund in town for "+ artist);
            }else{
                let dataLog = response.data.map(function(data) {
                    const dE = new Date(data.datetime);
                    const dataeventFormatted = dE.getMonth()+"/"+dE.getDate()+"/"+dE.getFullYear();
                    return(`
        Venue: ${data.venue.name}
        Location: ${data.venue.city} ${data.venue.region}, ${data.venue.country}
        Date: ${dataeventFormatted}
        `);
                });
                console.log(dataLog.join("\n"));
                appendText(whatToDo, searchArg, dataLog);

            }
        }).catch(function(err){
            console.log(err);
        })
        
    }else{
        console.log("oupps!!!\n The artist name is required. Please, provide one!");
    }
        
}

function appendText(cmd, arg, msg){
    let message =`
        **********************************************\n`;
        message +=`
        ${cmd}  ${arg.split("+").join(" ")}\n`; 
        message += msg;

        fs.appendFile(__dirname+"/log.txt", message, function(err){
            if(err) console.log(err);
            console.log("movie has been add to log file!");
            
        });
}

switch (whatToDo) {
    case 'spotify-this-song': 
        spotifyThisSong(searchArg);
        break;
    case 'movie-this': 
        movieThis(searchArg);
        break;
    case 'concert-this': 
        concertThis(searchArg);
        break;
    case 'do-what-it-says': 
         fs.readFile(__dirname+"/random.txt", 'utf8', function(err, data){
            if(err){
                console.log(err);
            }else{
                let defaultSong = data.split(",")[1].trim();
                console.log(defaultSong);
                spotifyThisSong(defaultSong);
            }
            
        });
        
        break; 
    default:
        console.log("sorry, can find this command! Enter a valid command!");

}

