const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth.middleware');

describe('verifyToken Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: { authorization: 'Bearer mockToken' } };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });

    test('should call next() if the token is valid', async () => {
        // Given
        const mockDecoded = { userId: '123', username: 'testUser' };
        const jwtVerifyStub = sinon.stub(jwt, 'verify').returns(mockDecoded); // Mock jwt.verify to return decoded data

        // When
        await verifyToken(req, res, next);

        // Then
        sinon.assert.calledOnce(jwtVerifyStub); // Ensure jwt.verify was called once
        sinon.assert.calledOnce(next); // Ensure next() was called
    });

    test('should return 401 if token is missing', async () => {
        // Given
        req.headers['authorization'] = undefined; // Simulate missing token
        // When
        await verifyToken(req, res, next);
        // Then
        sinon.assert.calledOnce(res.status); 
        sinon.assert.calledWith(res.status, 401); 
        sinon.assert.calledOnce(res.json); 
        sinon.assert.calledWith(res.json, { message: 'Token is required' }); 
    });

    test('should return 401 if token is invalid', async () => {
        // Given
        const errorMessage = 'Invalid or expired token';
        const jwtVerifyStub = sinon.stub(jwt, 'verify').throws(new Error(errorMessage)); // Mock invalid token error
        // When
        await verifyToken(req, res, next);
        // Then
        sinon.assert.calledOnce(jwtVerifyStub); 
        sinon.assert.calledOnce(res.status); 
        sinon.assert.calledWith(res.status, 401); 
        sinon.assert.calledOnce(res.json); 
        sinon.assert.calledWith(res.json, { message: 'Invalid or expired token' }); 
    });
});