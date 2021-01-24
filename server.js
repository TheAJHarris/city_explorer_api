'use strict'

/*
================= Servers ====================
A server needs to respond to information on the internet
When information is sent on the internet it primarily uses http
http is a way to encode data and send it in a uniform way so everyone can talk. Its like the alphabet of talking on the internet

The job of talking over http, and especially listening for http requests is handled by Express
It gets translated by express into javascript

http requests contain a lot of info
The basics are a lot like mail
there is an address: url
there is a to and a from  to: route, from: client url
There can be a letter inside: encode information completely hidden in the response - like a letter in the envelope
There can be info written on the outside of the letter - this is our queries - info on the visible url

Express reads all of this for us and much more


================ Environment  ===============
A server has to run somewhere
Heroku, AWS, terminal
The server needs to run on a PORT on our local we use 3000, 3001, heroku tends to gravitate towards like 27000-32000, aws i have no clue
There are settings our server has to pay attention to when it runs.
We will create dynamic variables instead of hard coded ones that our server can read live.
These variables make up / live in our environment
not goDaddy (goDaddy is a dns, redirects to where it lives)
*/

// ========================== end theory ======================

// ==== packages ====
const express = require('express'); // implies that express has been downloaded via npm
// the command to download it and save it is `npm install -S express`
const cors = require('cors'); // Cross Origin Resource Sharing : allows connection between 2 local servers or websites : It can block or allow access to any list of urls. By default it allows localhost to talk itself
// - needed this week only
require('dotenv').config(); // runs once and loads all the environment variables IF they were declared in a file instead of the terminal

// ==== setup the application (server) ====
const app = express(); // creates a server from the express library
app.use(cors()); // app.use loads middleware - we are loading cors so that requests don't get blocked when they are local

// ==== other global variables ====
const PORT = process.env.PORT || 3000; // all caps because it is a variable future devs should not touch
// magic variables (other things rely on this variable)
// process.env.PORT references the PORT env variable from my terminal

// ==== Routes ====

app.get('/location', location)
app.get('/weather', weather)

// app.get : attaches a listener of method type GET to the server with a (route, and a callback)
// '/' : route - we can visit the server at localhost:3000 or localhost:3000/ and trigger this callback
// (request, response) => : the callback function, think of it ass (event) => on an event handler
// request : all the data from the client
// response: all the data from us + we can attach data to it + we can trigger a response to start with this parameter
// response.send(<anything>) : takes the argument and sends it to the client
app.get('/', (request, response) => {
  response.send('you made it home, party time    ');
});

// localhost:3333/pet-the-pet?name=ginger&quantity=3&lastName=carignan
// expect a key value pair of name:ginger and quantity:3
// send `petting ginger carignan petting ginger petting ginger`
// this lives with all the client data, in the `request (req)` parameter
// inside request will always live a property  query: { name: 'ginger', quantity: '3', lastName: 'carignan' },

// app.get('/pet-the-pet', (req, res) => {
//   console.log(req.query.name);
//   let str = '';
//   for(let i = 0; i < req.query.quantity; i++){
//     str += `petting ${req.query.name} ${req.query.lastName} </br>`;
//   }
//   res.send(str);
// });

// localhost:3333/baked-goods?pie=apple&muffin=blueberry&price=$13.12
// app.get('/baked-goods', (req, res) => {
//   const pieTheyWant = req.query.pie; //?pie=apple === apple
//   const muffin = req.query.muffin; // === 'blueberry';
//   const price = req.query.price; // === '$13.12';
//   console.log(pieTheyWant, muffin, price);
//   res.send(pieTheyWant + muffin + price);
// });

function location(req, res) { // route with endpoint of /location
  try {
    const data = require('./data/location.json')
    const cityLocation = req.query.city
    console.log('req.query', req.query, data);
    const newLocation = new Location(
      cityLocation,
      data
    );
    console.log(newLocation);
    res.status(200).json(newLocation);
  } catch (e) {
    res.status(500).send('Sorry, could not complete request');
  }
}
function weather(req, res) { // route with endpoint of /location
  try {
    const data = require('./data/weather.json')
    const weatherArr = [];
    data.data.forEach(day => {
      weatherArr.push(new Weather(day))
    });
    res.status(200).json(weatherArr);
  } catch (e) {
    res.status(500).send('Sorry, could not complete request');
  }
}


  // we need to normalize our data with a constructor

  // data from the client (search query they submitted)
// app.get('/restaurants', (req, res) => {
//   const data = require('./data/restaurants.json');
//   const arr = [];
//   data.nearby_restaurants.forEach(jsonObj => {
//     const restaurant = new Restaurant(jsonObj);
//     arr.push(restaurant);
//   });

//   res.send(arr);
// });

function Location(search_query, geoData) {
  console.log(search_query, geoData);
  this.search_query = search_query;
  this.formatted_query = geoData[0].formatted_query;
  this.longitude = geoData[0].lon;
  this.latitude = geoData[0].lat;
}

function Weather(day) {
  this.forecast = day.weather.description;
  this.time = day.datetime;
}

app.listen(PORT, () => console.log(`we are up on PORT ${PORT}`));

// ==== Helper Functions ====