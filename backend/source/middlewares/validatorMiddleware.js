const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error, value} = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errorMessages = error.details.map((err) => err.message);
            return res.status(400).json({
                success: false,
                errors: errorMessages
            });
        };

        req.body = value;
        next();
    };
};

module.exports = {
    validateSchema
};