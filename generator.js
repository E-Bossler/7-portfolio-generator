// Modules

const express = require('express');
const axios = require('axios');
const inquirer = require('inquirer');
const fs = require('fs');

const app = express();

const port = 9999;

// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Variables

let developerGithub;
let developerImageURL;
let developerBlog;
let developerBio;
let developerPublicRepos;
let developerFollowers;
let developerNumberOfStars;
let developerNumberOfFollowing;

// Inquirer

inquirer.prompt([
  {
    message: "What is the person's name?",
    name: 'devName'
  },
  {
    message: "What is the person's Github username?",
    name: 'devGithub'
  },
  {
    type: 'list',
    message: "What is thier favorite color?",
    name: 'favColor',
    choices: [
      'pink',
      'bright green',
      'light blue',
      'orange'
    ]
  }
]).then(({ devName, devGithub, favColor }) => {
  const developerGithubUrl = `https://api.github.com/users/${devGithub}`;
  const favoriteColor = favColor;
  const developerName = devName;

  axios.get(developerGithubUrl)
    .then((response) => {
      console.log(response.data)
      const info = response.data;
      const developerGithub = info.login;
      const developerImageURL = info.avatar_url;
      const developerBlog = info.glob;
      const developerBio = info.bio;
      const developerPublicRepos = info.public_repos;
      const developerFollowers = info.followers;
      const developerNumberOfFollowing = info.following;;
      

      axios.get(`https://api.github.com/users/${developerGithub}/starred`)
        .then((response) => {
          // console.log(response.data);
          const developerNumberOfStars = response.data.length;
          createHTML(
              developerGithub,
              developerImageURL,
              developerBlog,
              developerBio,
              developerPublicRepos,
              developerFollowers,
              developerNumberOfFollowing,
              developerNumberOfStars
          );
        })

    })
})

// Global Functions

function createHTML () {

}

function createPDF () {

}



// html variable template 




// conversion({ html: '<h1>Hello World</h1>' }, function (err, result) {
//   if (err) {
//     return console.error(err);
//   }

//   console.log(result.numberOfPages);
//   console.log(result.logs);
//   result.stream.pipe(fs.createWriteStream('/path/to/anywhere.pdf'));
//   conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
// });