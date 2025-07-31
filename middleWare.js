export default function validateData(requiredFields) {
  return (req, res, next) => {
   
    // check all the required fields
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required field(s): ${missingFields.join(', ')}`
      });
    }

    next(); 
  };
}