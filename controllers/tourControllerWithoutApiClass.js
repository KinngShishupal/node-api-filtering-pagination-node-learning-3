const Tour = require('../models/tourModel');

const aliasTopTours = (req, res, next) => {
  // middleware to get top 5 best tours
  // here we will manipulate the request query before it passes on to getAllTours
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'ratingsAverage,price,name,summary,difficulty';
  next();
};

// const getAllTours = async (req, res) => {

// This contains only filtering , normal and advanced
//   try {
//     // eslint-disable-next-line node/no-unsupported-features/es-syntax
//     const queryObject = { ...req.query };
//     const excludedFields = ['page', 'sort', 'limit', 'fields']; // to exclude these paramaters from query string if they ever come
//     excludedFields.forEach((el) => delete queryObject[el]);
//     // console.log(queryObject);

//     // for advanced Filtering
//     let queryString = JSON.stringify(queryObject);
//     queryString = queryString.replace(
//       /\b(gte|gt|lt|lte)\b/g,
//       (match) => `$${match}`
//     );
//     // above function replaces every instance of gte, gt, lt, lte with $gte, $gt, $lt, $lte respectively
//     // we could have done await Tour.find(queryObject)
//     // but to make sort limit page etc work we need to do it like thie below

//     // BUILD QUERY
//     console.log(JSON.parse(queryString));
//     // const query = Tour.find(req.query)
//     const query = Tour.find(JSON.parse(queryString));

//     // EXECUTE QUERY
//     const tours = await query; //first way to apply query

//     // const tours = await Tour.find().where('duration').equals(5).where('price').equals(100) //second way
//     // we have here less than greater than all sort of stuff

//     res.status(200).send({
//       status: 'success',
//       result: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (error) {
//     res.status(404).send({
//       status: 'fail',
//       message: 'Unable To Find Tours',
//     });
//   }
// };

const getAllTours = async (req, res) => {
  console.log('query', req.query);
  // This contains filetring, and sorting
  try {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    // 1. Filtering
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObject = { ...req.query };

    console.log('eee', queryObject);

    const excludedFields = ['page', 'sort', 'limit', 'fields']; // to exclude these paramaters from query string if they ever come
    excludedFields.forEach((el) => delete queryObject[el]);
    // console.log(queryObject);

    // for advanced Filtering
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );
    // above function replaces every instance of gte, gt, lt, lte with $gte, $gt, $lt, $lte respectively
    // we could have done await Tour.find(queryObject)
    // but to make sort limit page etc work we need to do it like thie below

    // BUILD QUERY

    // const query = Tour.find(req.query)
    let query = Tour.find(JSON.parse(queryString));

    // 2. Sorting

    //example  http://localhost:3000/api/v1/tours?sort=-duration :  descending
    // http://localhost:3000/api/v1/tours?sort=duration : ascending

    // mutiple sort  http://localhost:3000/api/v1/tours?sort=duration,price and so on separatd by comma

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' '); // to separate comma from sort
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // by default query will be sort in descending order of creation data so that newest comes first
    }

    // 3. Limiting
    // http://localhost:3000/api/v1/tours?fields = name, duration: to get only name and duration

    if (req.query.fields) {
      // query = query.select('name duration price'); incuding these three fields
      // query = query.select('-duration'): everything excluding duration
      // http://localhost:3000/api/v1/tours?fields=-name,-duration, excluding name and duration
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // to not send this autogenerated __v by mongodb to client
    }

    // 4. Pagination
    // it is achieved by using limit and page keyword in api
    // http://localhost:3000/api/v1/tours?page=2&limit=10
    // above api wants page 2 when tours per page is 10
    // skip = how many items we want to skip before getting result
    // limit = how may items we want to get in output

    // setting default value for limit and page
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit); // skips fist 10 items and get next ten items

    // to throw an error if user selects any page which doesnot exists
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('This Page Doesnot Exists ...');
      }
    }
    // EXECUTE QUERY

    const tours = await query; //first way to apply query

    // const tours = await Tour.find().where('duration').equals(5).where('price').equals(100) //second way
    // we have here less than greater than all sort of stuff

    res.status(200).send({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).send({
      status: 'fail',
      message: error,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id:req.params.id}) upper is shorthand for this
    res.status(200).send({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).send({
      status: 'fail',
      message: 'Unable to find tour',
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).send({
      status: 'success',
      data: newTour,
    });
  } catch (error) {
    res.status(400).send({
      status: 'fail',
      message: 'Could Not Create Tour',
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).send({
      status: 'success',
      data: tour,
    });
  } catch (error) {
    res.status(400).send({
      status: 'fail',
      message: error,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).send({
      status: 'success',
      data: tour,
    });
  } catch (error) {
    res.status(400).send({
      status: 'fail',
      message: error,
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
};
