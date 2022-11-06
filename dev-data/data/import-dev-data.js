//  This file is to import tours-simple.json data in our database
// this has nothing to do with express or node this is a standalone feature
// lets learn how to achieve this

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');

dotenv.config({
  path: './config.env', // path of our configuation file
});

const DB = process.env.DATABASE_CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    // console.log('hjk', conn.connections);
    console.log('Successfully Connected');
  });

// Read File

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import data into database

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Loaded Successfully ....');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete existing data from database
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted Successfully ....');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

console.log(process.argv);

// NOte: try to run ::: node dev-data/data/import-dev-data.js
// it gives array with path of node and import-dev-data.js path in array form

// node dev-data/data/import-dev-data.js --import, add import has third element

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// now to run command with --import or --delete to get desired output
