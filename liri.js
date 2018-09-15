// get data from keys.js 
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('node-spotify-api')
var client = new twitter(keys.twitterKeys);
var fs = require('fs')

//arg array
var nodeArgv = process.argv;
var command = process.argv[2]

//song or movie
var x = ''

// to attack multiple word arguments
for (var i = 3; i < nodeArgv.length; i++) {
    if (i > 3 && i < nodeArgv.length){
        x = x + "+" + nodeArgv[i];
    } else{
        x = x + nodeArgv[i];
    }
}

// switch case
switch(command){
    case "my-tweets":
        showTweets();
    break;

    case "spotify-this-song":
        if(x){
            omdbData(x)
        } else{
            omdbData("Flourescent Adolescent");
        }
    break;

    case "movie-this":
        if(x){
            omdbData(x)
        } else{
            omdbData("Mr. Nobody")
        }
    break;

    case "do-what-it-says":
        doThing();
    break;

    default:
        console.log("{Please enter a correct command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
    break;
}

function spotifySong(song){
    spotify.search({ type: 'track', query: song}, function(error, data){
        if (!error){
            for (var i = 0; i <data.tracks.items.length; i++){
                var songData = data.tracks.items[i];
                //artist
                console.log(`Artist: ${songData.artists[0].name}`);
                //song
                console.log(`Song: ${songData.name}`);
                //preview
                console.log(`Preview URL: ${songData.preview_url}`);
                //album
                console.log(`Album: ${songData.album.name}`);
                console.log("---------------------------------")

                //Adds data to log.txt
                fs.appendFile('log.txt', songData.artists[0].name);
                fs.appendFile('log.txt', songData.name);
                fs.appendFile('log.txt', songData.preview_url);
                fs.appendFile('log.txt', songData.album.name);
                fs.appendFile('log.txt', "------------------------");
            }
        }   else{
            console.log("There was an error with your request")
        }  
    });  
}

function omdbData(movie){
    var omdbURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&&r=json&tomatoes=true&apikey=trilogy";


    request(omdbURL, function(error, response, body){
        if(!error && response.statusCode == 200){
            var body = JSON.parse(body);

            console.log(`Title: ${body.Title}`);
            console.log(`Release Year: ${body.Year}`);
            console.log(`IMbD Rating: ${body.imdbRating}`);
            console.log(`Country: ${body.Country}`);
            console.log(`Language: ${body.Language}`);
            console.log(`Plot: ${body.Plot}`);
            console.log(`Actors: ${body.Actors}`);
            console.log(`RT Rating: ${body.tomatoRating}`);
            console.log(`RT URL: ${body.tomatoURL}`);

            //Add data to log.txt
            fs.appendFile('log.txt', `Title: ${body.Title}`);
            fs.appendFile('log.txt', `Release Year: ${body.Year}`);
            fs.appendFile('log.txt', `IMdB Rating: ${body.imdbRating}`);
            fs.appendFile('log.txt', `Country: ${body.Country}`);
            fs.appendFile('log.txt', `Language: ${body.Language}`);
            fs.appendFile('log.txt', `Plot: ${body.Plot}`);
            fs.appendFile('log.txt', `Actors: ${body.Actors}`);
            fs.appendFile('log.txt', `RT Rating: ${body.tomatoRating}`);
            fs.appendFile('log.txt', `RT URL: ${body.tomatoURL}`);

        } else{
            console.log("there was an error with your request");
        }
        if(movie === "Mr. Nobody") {
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");

            //add data to log.txt
            fs.appendFile('log.txt', "-----------------------");
            fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            fs.appendFile('log.txt', "It's on Netflix!");
        }
    });
}

function doThing() {
    fs.readFile('random.txt', "utf8", function(error, data){
        var txt = data.split(',');
        spotifySong(txt[1]);
    });
}