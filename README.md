# gds-fe

## Install

    npm install

## Build

    npm run build

## Build for production

    NODE_ENV=production npm run build

## Watch

    npm run watch

## Watch

    npm start

## Configuration

To build, run unit and start locally :

`npm run clean ; npm run build ; npm run local`

To run a specific service :

`npm run local --service=./serviceFile`

To start in debug mode (debug logging and no encryption) :

`npm run local --debug=true`
