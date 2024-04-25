const ValidationErrors = (error, res) => {
  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json(errors);
  }
};

module.exports = { ValidationErrors };
