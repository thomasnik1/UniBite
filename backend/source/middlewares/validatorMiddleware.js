const validateSchema = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], { abortEarly: false });
        
        if (error) {
            const errorMessages = error.details.map((err) => err.message);
            return res.status(400).json({
                success: false,
                errors: errorMessages
            });
        };

        req[property] = value;
        next();
    };
};

module.exports = {
    validateSchema
};