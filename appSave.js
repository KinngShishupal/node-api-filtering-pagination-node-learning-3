// this file show us all the ways to define routes
// all the routes are kept at one place only
// this file is for reference purpose to show how routes can be defined in diffrent ways

const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
// this is used to log all the activities without having to console them separately
// morgan tells us which api has been hit and what was its response tie and status

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json()); // middleware

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// ROUTE HANDLERS
const getAllTours = (req, res) => {
  console.log('requestTime', req.requestTime);
  res.status(200).json({
    status: 'success',
    result: tours.length,
    reuestedAt: req.requestTime,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  // to get hold of parameters in the specified url
  // can have any number of parameters /:id /:area/:pid etc
  // to  mark any parametr optional  /:id /:area?/:pid , use question mark
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id Found ...',
    });
  }
  const tour = tours.find((t) => t.id === req.params.id * 1);
  //  req.params.id * 1::: converts string into number

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  // res.send(req.body);
  const newId = Number(tours[tours.length - 1].id) + 1;

  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  // update functionality will be written later on
};

const getAllUsers = (req, res) => {};

const createUser = (req, res) => {};

const getUser = (req, res) => {};

const updateUser = (req, res) => {};

const deleteUser = (req, res) => {};

/*
app.get('/api/v1/tours', getAllTours);

app.get('/api/v1/tours/:id', getTour);

app.post('/api/v1/tours', createTour);

app.patch('/api/v1/tours/:id', updateTour);
*/

// Above Routes can also be written as :

// ROUTES
const tourRouter = express.Router();
const userRouter = express.Router();

// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour);

// tourRouter.route('/api/v1/tours').get(getAllTours).post(createTour);
// tourRouter.route('/api/v1/tours/:id').get(getTour).patch(updateTour);

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour);

// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app
//   .route('/api/v1/users/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`Server has started on Port ${port}`);
});
