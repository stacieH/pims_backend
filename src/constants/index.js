const PORT = process.env.PORT || 3020

const isDevelopment = process.env.NODE_ENV !== 'production';

const MONGO_URI = process.env.PIMS_MONGO_URI;

module.exports = {
    PORT,
    isDevelopment,
    MONGO_URI
}