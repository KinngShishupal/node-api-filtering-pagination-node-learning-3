const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
  path: './config.env', // path of our configuation file
});

// above two line should always be on top
const app = require('./app');

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

// console.log(app.get('env')); // To check the enviornment we are currently in
// console.log(process.env); // list of enviornments which node uses internally
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server has started on Port ${port}`);
});
