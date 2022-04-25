
module.exports = async (req, res, next) => {
  if(!/assets/.test(req.path))
  console.log(req.headers['user-agent'], req.path)
  next()
};
