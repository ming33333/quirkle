# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Updating quirkle.io url 

- pushing to main automatically update githubpages branch, and causes it to crash
- need to push changes up first up?
- change homepage key-value to the target page ("https://ming33333.github.io/quirkle/" or https://quirkle.io/)
- npm run build
- npm run deploy

## DEPLOY TO SITE
 auto deploys when launched on main (changes probagate in about 5 mins?)

## TERMINOLOGY 

- spaced learning, Active Questions, questions in spaced learning that are ready to be taking, active question can be cumulated over time
so some questions will be 'late'. Active questions can be taken late but will still adhere to the same rules if the user get the question right/wrong. 


## Data structuress
- dates are in iso string

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

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
