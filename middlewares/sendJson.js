const sendJson = (res, { code = 200, message, data } = {}) => {
  if (!isValidHttpStatusCode(code)) {
    code = 500; // Default to internal server error if the code is invalid
  }

  return res.status(code).json({
    data,
    message,
  });
};

function isValidHttpStatusCode(code) {
  return Number.isInteger(code) && code >= 100 && code <= 599;
}

// Export the function
module.exports =  sendJson ;
