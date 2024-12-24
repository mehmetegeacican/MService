const { GATEWAY_SECRET_KEY } = process.env;
/**
 * This Middleware checks if the request is coming from the Gateway
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const checkGatewayCode = (req, res, next) => {
    try{
        const gatewaySecret = req.headers['x-gateway-secret'];
        if (gatewaySecret !== GATEWAY_SECRET_KEY) {
            return res.status(403).json({ message: 'Forbidden: The API requests must be made from the API Gateway' });
        }
        else{
            next();
        }
    } catch(error){
        console.error(error);
        res.status(500).json({message: 'Error checking in gateway'});
    }
}

module.exports = {
    checkGatewayCode
};