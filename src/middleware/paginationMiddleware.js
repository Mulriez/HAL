const paginationMiddleware = (req, res, next) => {
  let pageSize = parseInt(req.query.pageSize);
  let page = parseInt(req.query.page);
  let offset = 0;

  if (isNaN(pageSize) && isNaN(page)) {
    return next();
  }

  if (isNaN(page)) {
    offset = 0;
    page = 1;
  } else {
    offset = (page - 1) * pageSize;
  }

  req.query.offset = offset;
  req.query.pageSize = pageSize;
  req.query.page = page;
  next();
};

module.exports = paginationMiddleware ;
