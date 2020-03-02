// Modules

const express = require('express');
const axios = require('axios');
const inquirer = require('inquirer');
const fs = require('fs');
const puppeteer = require('puppeteer');


const app = express();

const port = 9999;



// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
      const developerNumberOfFollowing = info.following;
      const developerLocation = info.location;


      axios.get(`https://api.github.com/users/${developerGithub}/starred`)
        .then((response) => {
          // console.log(response.data);
          const developerNumberOfStars = response.data.length;
          createHTML(
            favoriteColor,
            developerName,
            developerGithub,
            developerImageURL,
            developerBlog,
            developerBio,
            developerPublicRepos,
            developerFollowers,
            developerNumberOfFollowing,
            developerNumberOfStars,
            developerLocation
          );
        })

    })
})

// Global Functions

async function createHTML(color, name, profile, imageurl, blog, bio, pubrepos, followers, following, stars, location) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(

      `<!doctype html>
            <html lang="en">
      
            <head>
                <!-- Required meta tags -->
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <!-- Bootstrap CSS -->
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
      
                <title>${name}</title>
            </head>
      
            <body style="background-color: ${color}; width: 850px; height: 1100px">
                <div class="jumbotron" style="margin: 30px">
                    <img style="float: right;
                        border-style: solid;
                        border-color: ${color};
                        border-width: 5px;
                        border-radius: 50%;
                        height: 200px" alt="Qries" src="${imageurl}">
                    <h1 class="display-4">Hello, I'm ${name}!</h1>
                    <p class="lead">${bio}</p>
                    <hr>
                    <div class='container'>
                        <div class='row'>
                            <div class='col-3'>
                            </div>
                            <div class='col-2'>
                                <a href="http://maps.google.com/maps?q=${location}">
                                    Location: ${location}
                                </a>
                            </div>
                            <div class='col-2'>
                                <a href="https://github.com/${profile}">
                                    GitHub: ${profile}
                                </a>
                            </div>
                            <div class='col-2'>
                                <a href="${blog}">
                                    Blog: ${blog}
                                </a>
                            </div>
                            <div class='col-3'>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="jumbotron" style="margin: 30px">
                    <div class='container'>
                        <div class='row' style="margin: 0 0 20px 0">
                            <div class='col-1'>
                            </div>
                            <div class='col-4' style='border-radius: 20%;
                                border-style: solid;
                                border-width: 3px;
                                border-color: ${color};
                                background-color: white;
                                padding: 50px'>
                                <h3>Public Repos</h3>
                                ${pubrepos}
                            </div>
                            <div class='col-2'>
                            </div>
                            <div class='col-4' style='border-radius: 20%;
                                border-style: solid;
                                border-width: 3px;
                                border-color: ${color};
                                background-color: white;
                                padding: 50px'>
                                <h3>Followers</h3>
                                ${followers}
                            </div>
                            <div class='col-1'>
                            </div>
                        </div>
                        <div class='row' style="margin: 0 0 20px 0">
                            <div class='col-1'>
                            </div>
                            <div class='col-4' style='border-radius: 20%;
                                border-style: solid;
                                border-width: 3px;
                                border-color: ${color};
                                background-color: white;
                                padding: 50px'>
                                <h3>GitHub Stars</h3>
                                ${stars}
                            </div>
                            <div class='col-2'>
                            </div>
                            <div class='col-4' style='border-radius: 20%;
                                border-style: solid;
                                border-width: 3px;
                                border-color: ${color};
                                background-color: white;
                                padding: 50px'>
                                <h3>Following</h3>
                                ${following}
                            </div>
                            <div class='col-1'>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
      
            </html>
        `);
    await page.emulateMedia('screen');
    await page.pdf({
      path: `pdfs/${profile}-profile.pdf`,
      format: 'A4',
      printBackground: true
    })

    console.log(`File Location: pdfs/${profile}-profile.pdf`);
    await browser.close();
    process.exit();
  } catch (err) {
    throw err;
  }
}








