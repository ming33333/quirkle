# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Updating quirkle.io

- pushing to main automatically update githubpages branch, and causes it to crash
- need to push changes up first up?
- change homepage key-value to the target page ("https://ming33333.github.io/quirkle/" or https://quirkle.io/)
- npm run build
- npm run deploy
- 
## DEPLOY TO SITE
 auto deploys when launched on main (unsure when changes probagate)
## TODO
https://ming33333.github.io/quirkle/
~~ make side bar on appear if clicked, default appear (this is on on lyf or desktip view)~~

~~ add in firebase (added must add more data and organize data accessing)~~

~~ documents/users showing up as nonexistent~~


~~fix data access~~
~~- - option to add more quizzes~~
~~ change quiz based on selection ~~
~~have previous and nav buttons adjust to side bar size~~
~~have button to click to change side bar size~~

| Date               | Action                                          |
| Date               | Action                                          |
|--------------------|-------------------------------------------------|
| Apr 26, 2025 (Sat) | ✅ Feature: Add more questions to quiz or take quiz |
| Apr 27, 2025 (Sun) | ✅ Add point system                                |
| Apr 28, 2025 (Mon) |  ✅Add buying system and Show bought items on screen    |
| Apr 30, 2025 (Wednes) | Troubleshoot displayed bought items             |
| May 3, 2025 (Thurs)    ✅| Change DNS                               |
| May 1, 2025 (Fri)  |  Add Google Ads                                  |
| May 2, 2025 (Sat)    |  Fix up site to look less sketchy                |
| May 3, 2025 (Sun)    |        Fix point systems so it only 1 point once per day per quiz  and already purchased bug     |
| May 4, 2025 (Mon)    | study rooom not working probably bc i switch to multiplayer         |
| May 5, 2025 (Tues)    |  Fully integrate friend system             |

lower priority

- - hide login fire base temp site https://firebase.google.com/docs/auth/web/google-signin#expandable-4
- - use the context folder
- - move login feature into utils 
~~add logging of when friend request sent and accepted
- should move users creation in login section
- update so user is made in DB at login
- dont override request just update them
- seperate friendcollection system from user search
- deny friend feature
- fix routing
- profile, add friends
- star questions and then only get starred questions 
- better system for adding questions


## Firebase
can deploy rules with this line: firebase deploy --only firestore:rules
check ways to make db more secure here: https://www.youtube.com/watch?v=hQI_w4AZ92I

## Firebase structure

co
quizzes | users | { questions: {}, profile: {} } |  


system | admins |
       | site   | 

## Available Scripts

In the project directory, you can run:

### test on mobile phone 
make sure phone and computer on same wifi
turn on application
run command: ipconfig getifaddr en0
use that internal IP adresss and port on mobile ex. xxx.xxx.xxx.xx:3000

can also be seen when you do "npm start" . should say "On your local network"

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy`

deploy to github pages, this does does add commit to main

npm run deploy -- -m "adding layout"

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
