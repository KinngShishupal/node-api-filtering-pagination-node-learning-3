// const express = require('express');
// const tourRouter = express.Router();
// tourRouter.route('/').get(getAllTours).post(createTour);
// tourRouter.route('/:id').get(getTour).patch(updateTour);

// module.export = tourRouter;

// i have kept the name tourRouter for simplicity
// but usually we keep name router for every router file like below
// below and top things are the same

const express = require('express');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

const router = express.Router();

// param middleware runs for only parameters included to run for
// below will run only for id route not for getAllUser and ceateUser
//  this is useful when we want to check if parameters is coming or not or anything of that sort
// router.param('id', (req, res, next, value) => {
//   console.log(` Parameter is ${value}`);
//   next();
// });

// router.param('id', checkID);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
