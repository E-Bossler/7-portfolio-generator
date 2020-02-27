/ Node modules required
const axios = require('../node_modules/axios/lib/axios');
const inquirer = require('../node_modules/inquirer/lib/inquirer');
const puppeteer = require('../node_modules/puppeteer');
//const fs = require('fs');

// Variables
let themeColor;
let profileName;
let userInfo;
let username;
let numStars;
let profileData;
let profileHTML;

// Run Inquirer to prompt user questions
// Then get data from GitHub and call function to print to PDF
inquirer.prompt([
  {
    message: 'Enter team member name:',
    name: 'name'
  },
  {
    message: 'Enter team member GitHub username:',
    name: 'username'
  },
  {
    type: 'list',
    message: 'Enter team member favorite color:',
    name: 'favColor',
    choices: [
        'red',
        'yellow',
        'green',
        'blue'
    ]
  } 
])
.then(({ name, username, favColor }) => {
  const profileURL = `https://api.github.com/users/${username}`;
  const color = favColor;
  profileName = name;
  setTheme(color);
  renderProfileData(profileURL);
});


// ----- FUNCTIONS ----- //


// Function to get Bootstap color from user-chosen color
function setTheme(color) {
  if (color === 'red') {
    themeColor = 'danger';
  } else if (color === 'yellow') {
    themeColor = 'warning';
  } else if (color === 'green') {
    themeColor = 'success';
  } else {
    themeColor = 'primary';
  }
}
 
// Function to render profile data from GitHub using Axios
function renderProfileData(url) {
  axios.get(url)
  .then((res) => {
    const starsURL = `https://api.github.com/users/${res.data.login}/starred`;
    userInfo = res.data;
    username = userInfo.login;
    getProfileStars(starsURL);
  });
}

// Function to get profile stars then call HTML & PDF functions
function getProfileStars(url) {
  axios.get(url)
  .then((res) => {
    numStars = res.data.length;
    makeHTML();
    printPDF(username, profileHTML);
  })
}

// Function to print HTML to PDF using puppeteer
async function printPDF(username, html) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);
    await page.emulateMedia('screen');
    await page.pdf({
      path: `${username}-profile.pdf`,
      format: 'A4',
      printBackground: true
    })

    console.log(`GitHub profile info written to ${username}-profile.pdf`);
    await browser.close();
    process.exit();
  } catch (err) {
    throw err;
  }
}

// Function to write HTML from profile data
function makeHTML() {
  profileData = {
    name: profileName,
    color: themeColor,
    imageURL: userInfo.avatar_url,
    username: userInfo.login,
    location: userInfo.location,
    profileLink: userInfo.html_url,
    blog: userInfo.blog,
    bio: userInfo.bio,
    repos: userInfo.public_repos,
    followers: userInfo.followers,
    stars: numStars,
    following: userInfo.following
  }

  // deconstruct profileData object
  const { name, color, imageURL, username, location, profileLink, blog, bio, repos, followers, stars, following } = profileData;

  // HTML to write to PDF
  profileHTML = 
  `<!DOCTYPE html>
  <html lang="en">
  <head><meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Developer Profile</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
  
  <style>
      img { 
          height: 200px;
          width: 200px;
      }
      </style>
  </head>
  <body>
      <div class="jumbotron jumbotron-fluid bg-white pt-5 pb-2">
          <div class="container text-center">
            <h1 class="display-4">${name}</h1>
            <p class="lead">GitHub username: ${username}</p>
            <img src="${imageURL}" alt="GitHub profile image" class="border border-${color} rounded">
          </div>
      </div>
      <div class="container text-center">
          <div class="row py-2">
              <div class="col">
              Location: 
              <a href=https://www.google.com/maps/place/${location}>${location}</a>
              </div>
          </div>
          <div class="row py-2">
              <div class="col">
                  GitHub profile:
                  <a href=${profileLink}>${profileLink}</a>
              </div>
              <div class="col">
                  Blog:
                  <a href=https://${blog}>https://${blog}</a>
              </div>
          </div>
      </div>
      <div class="container">
          <div class="row">
              <div class="col-12">
                  <div class="card my-4">
                      <div class="card-body">
                        <h4 class="card-title">Bio:</h4>
                        <p class="card-text">${bio}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      <div class="container text-center">
          <div class="row">
              <div class="col-6">
                  <div class="card text-white bg-${color} mb-3">
                      <div class="card-body">
                        <h5 class="card-title">Public repositories:</h5>
                        <p class="card-text">${repos}</p>
                      </div>
                  </div>
              </div>
              <div class="col-6">
                  <div class="card text-white bg-${color} mb-3">
                      <div class="card-body">
                        <h5 class="card-title">GitHub stars:</h5>
                        <p class="card-text">${stars}</p>
                      </div>
                  </div>
              </div>
          </div>
          <div class="row">
              <div class="col-6">
                  <div class="card text-white bg-${color} mb-3">
                      <div class="card-body">
                        <h5 class="card-title">Followers:</h5>
                        <p class="card-text">${followers}</p>
                      </div>
                  </div>
              </div>
              <div class="col-6">
                  <div class="card text-white bg-${color} mb-3">
                      <div class="card-body">
                        <h5 class="card-title">Following:</h5>
                        <p class="card-text">${following}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      <script src='index.js'></script>
      </body>
      
  </html>`;
}

// Function to write profile data to HTML file
// function writeToHTML() {
//   fs.writeFile('profile.html', profileHTML, (err) => {
//     if (err) {
//       return err
//     }

//     console.log('written to profile.html');
//   })
// }

