const { checkGatewayCode } = require('../middleware/gateway.middleware');
const sinon = require('sinon');

describe('checkGatewayCode Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        // Reset request, response, and next mocks
        req = { headers: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.spy();
        process.env.GATEWAY_SECRET_KEY = 'validSecretKey'; // Set environment variable for testing
    });
    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });
    test('should call next() when the correct gateway secret is provided', async () => {
        // Given
        req.headers['x-gateway-secret'] = 'validSecretKey';
        // When
        await checkGatewayCode(req, res, next());
        // Then
        sinon.assert.calledOnce(next);
    });
    test('should return 403 when the gateway secret is invalid', async () => {
        // Given
        req.headers['x-gateway-secret'] = 'invalidSecretKey';
        // When
        await checkGatewayCode(req, res, next);
        // Then
        sinon.assert.calledWith(res.status, 403); // Ensure status 403 is returned
        sinon.assert.calledWith(res.json, { message: 'Forbidden: The API requests must be made from the API Gateway' }); // Ensure correct message
        sinon.assert.notCalled(next); // Ensure next() was not called
    });
    test('should return 500 if there is an error in the middleware', async () => {
        // Given
        const errorMessage = 'Test error';
        sinon.stub(checkGatewayCode, 'apply').callsFake((req, res, next) => {
            throw new Error(errorMessage); // Simulate an error being thrown
        });
        const consoleErrorStub = sinon.stub(console, 'error');
        // When
        await checkGatewayCode(req,res,next());
        // Then
        sinon.assert.calledOnce(res.status); 
        sinon.assert.calledWith(res.status, 500); 
        sinon.assert.calledOnce(res.json);
        // Logging
        sinon.assert.calledOnce(consoleErrorStub);
        sinon.assert.calledWith(res.json, { message: 'Error checking in gateway' });
    });
});