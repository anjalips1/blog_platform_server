const handleError = (error) => {
  console.log("inside handle error",error);
  
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return {
            code : 400 ,
            message : `${field} already exists. Please use a different one.`
        }
    }

      return {
        code: error.code ?? 500,
        message: error?.message ?? 'Internal server error',
      }
}


module.exports = { handleError }
