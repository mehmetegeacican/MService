const sinon = require('sinon');
const axios = require('axios');
const {
    login,
    signup,
    getUsers,
    updateUser
} = require('../services/user.service');

describe('getUsers', () => {
    let req, res;

    beforeEach(() => {
        req = {
            headers: { authorization: 'Bearer mockToken' },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });

    test('should return users data when the request is successful', async () => {
        // Given
        const mockResponse = { data: [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }] };
        const axiosGetStub = sinon.stub(axios, 'get').resolves(mockResponse);
        // When
        await getUsers(req, res);
        // Then
        sinon.assert.calledOnce(axiosGetStub);
        sinon.assert.calledWith(res.json, mockResponse.data);
    });

    test('should return 500 error if there is an error getting users', async () => {
        // Given
        const errorMessage = 'Error getting users';
        const axiosGetStub = sinon.stub(axios, 'get').rejects(new Error(errorMessage));
        // When
        await getUsers(req, res);
        // Then
        sinon.assert.calledOnce(axiosGetStub);
        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { message: 'Error getting users' });
    });
});

describe('login', () => {
    let req, res;

    beforeEach(() => {
        req = { body: { username: 'testUser', password: 'testPass' } };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });
    test('should return login data when the request is successful', async () => {
        // Given
        const mockResponse = { data: { token: 'mockToken' } };
        const axiosPostStub = sinon.stub(axios, 'post').resolves(mockResponse);
        // When
        await login(req, res);
        // Then
        sinon.assert.calledOnce(axiosPostStub);
        sinon.assert.calledWith(res.json, mockResponse.data);

    });
    test('should return 500 error if there is an error logging in', async () => {
        // Given
        const errorMessage = 'Error logging in';
        const axiosPostStub = sinon.stub(axios, 'post').rejects(new Error(errorMessage)); // Mock error response
        const consoleErrorStub = sinon.stub(console, 'error');
        // When
        await login(req, res);
        // Then
        sinon.assert.calledOnce(axiosPostStub);
        sinon.assert.calledOnce(consoleErrorStub);
        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { message: 'Error logging in' });
    });
});

describe('signup', () => {
    let req, res;

    beforeEach(() => {
        req = { body: { username: 'testUser', email: 'testemail@email.com', password: 'testPass' } };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });
    test('should return signup data when the request is successful', async () => {
        // Given
        const mockResponse = { data: { user: { id: 1, username: 'testUser' } } };
        const axiosPostStub = sinon.stub(axios, 'post').resolves(mockResponse); // Mock successful response

        // When
        await signup(req, res);

        // Then
        sinon.assert.calledOnce(axiosPostStub);
        sinon.assert.calledWith(res.json, mockResponse.data);

    });
    test('should return 500 error if there is an error signing up', async () => {
        // Given
        const errorMessage = 'Error signing up';
        const axiosPostStub = sinon.stub(axios, 'post').rejects(new Error(errorMessage)); // Mock error response
        const consoleErrorStub = sinon.stub(console, 'error');
        // When
        await signup(req, res);

        // Then
        sinon.assert.calledOnce(axiosPostStub);
        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledOnce(consoleErrorStub);
        sinon.assert.calledWith(res.json, { message: 'Error signing up' });
    });
});

describe('User Update', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { userId: '123' },
            body: { username: 'updatedUser' },
            headers: { authorization: 'Bearer mockToken' }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });

    test('should update user when the request is successful', async () => {
        // Given
        const mockResponse = { data: { userId: '123', username: 'updatedUser' } };
        const axiosPutStub = sinon.stub(axios, 'put').resolves(mockResponse); // Mock successful response

        // When
        await updateUser(req, res);

        // Then
        sinon.assert.calledOnce(axiosPutStub);
        sinon.assert.calledWith(res.json, mockResponse.data); 
        
    });

    test('should return 500 error if there is an error updating user', async () => {
        // Given
        const errorMessage = 'Error updating user';
        const axiosPutStub = sinon.stub(axios, 'put').rejects(new Error(errorMessage)); // Mock error response
        const consoleErrorStub = sinon.stub(console, 'error');
        // When
        await updateUser(req, res);

        // Then
        sinon.assert.calledOnce(axiosPutStub); 
        sinon.assert.calledWith(res.status, 500); 
        sinon.assert.calledOnce(consoleErrorStub);
        sinon.assert.calledWith(res.json, { message: 'Error updating users' }); 
    });
});