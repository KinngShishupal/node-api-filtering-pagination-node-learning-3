const express = require('express');

const app = express();

const morgan = require('morgan');
// this is used to log all the activities without having to console them separately
// morgan tells us which api has been hit and what was its response tie and status
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
// MIDDLEWARES
// console.log('process.env.NODE_ENV', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // to restrict logging to development only
}
app.use(express.json()); // middleware
app.use(express.static(`${__dirname}/public`));
// if we write in browser http://localhost:3000/overview.html : opens overview.html
// as it will now look for overview.html file in public folder
// say we want to open image from img folder -- http://localhost:3000/img/pin.png

// custom middleware
app.use((req, res, next) => {
  console.log('Hello from Middleware');
  next(); // if we doesnot use this then our req response cyle get struck
});

app.use((req, res, next) => {
  // modifying req in middleware
  req.requestTime = new Date().toISOString();
  next();
});

// middlewares defined above applies to all routes but below
// two middlewares applies to only specific routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
