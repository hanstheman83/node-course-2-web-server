const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

var inMaintenance = false;

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

app.use((req, res, next) => {//function will continue when next is called!
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log.');
    }
  });
  next();
});

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

if(inMaintenance){
  app.use((req, res, next) => {
    res.render('maintenance.hbs');
  });
}

app.use(express.static(__dirname + '/public'));//__dirname stores path to root dir. app.use adds dir to path

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express!</h1>');
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMsg: 'Welcome Person'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

// app.listen(3000);//port
app.listen(3000, () => { //action on connection!
  console.log('Server is up on port 3000');
});
