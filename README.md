# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### About Data

- Raw data in kept in a separate file 'utils/rawData.ts"
- chartConfigs ( mainly color constants) are in separate file. If we decide to move other configs of chart, We can move here later on.
- getUniqueApiAsLabel - is the function where I am taking out the names of unique APIs
- createDataSetsForLabel - is the function where I am prepare DataSets to pass as a prop in LineChart. The main logic of processing the rawData is in this function - ( like sorting, filtering and mapping to x and y coordinates)
- Also please check screenshots in assets directory.
