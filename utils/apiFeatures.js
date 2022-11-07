class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1. Filtering
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObject = { ...this.queryString };

    console.log('eee', queryObject);

    const excludedFields = ['page', 'sort', 'limit', 'fields']; // to exclude these paramaters from query string if they ever come
    excludedFields.forEach((el) => delete queryObject[el]);

    // for advanced Filtering
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );

    //  let query = Tour.find(JSON.parse(queryString));
    this.query = this.query.find(JSON.parse(queryString));
    return this; // this here is entire object
  }

  sort() {
    // 2. Sorting

    //example  http://localhost:3000/api/v1/tours?sort=-duration :  descending
    // http://localhost:3000/api/v1/tours?sort=duration : ascending

    // mutiple sort  http://localhost:3000/api/v1/tours?sort=duration,price and so on separatd by comma

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // to separate comma from sort
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // by default query will be sort in descending order of creation data so that newest comes first
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // query = query.select('name duration price'); incuding these three fields
      // query = query.select('-duration'): everything excluding duration
      // http://localhost:3000/api/v1/tours?fields=-name,-duration, excluding name and duration
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // to not send this autogenerated __v by mongodb to client
    }
    return this;
  }

  paginate() {
    // 4. Pagination
    // it is achieved by using limit and page keyword in api
    // http://localhost:3000/api/v1/tours?page=2&limit=10
    // above api wants page 2 when tours per page is 10
    // skip = how many items we want to skip before getting result
    // limit = how may items we want to get in output

    // setting default value for limit and page
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit); // skips fist 10 items and get next ten items
    return this;
  }
}

module.exports = APIFeatures;
