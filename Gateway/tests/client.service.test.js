const sinon = require('sinon');
const axios = require('axios');
const {
    getNotesOfClient,
    createClient,
    updateClient,
    createNote,
    updateNote
} = require('../services/client.service');

describe('getNotesOfClient API Gateway', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { clientId: '123' },
            headers: {
                authorization: 'Bearer validToken',
                'x-gateway-secret': 'validSecretKey',
            }
        }; // Simulate the request object

        res = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis()
        }; // Simulate the response object
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs and spies after each test
    });

    test('should return client notes when the request is successful', async () => {
        // Given
        const mockResponse = { data: { notes: ['note1', 'note2'] } };
        const axiosGetStub = sinon.stub(axios, 'get').resolves(mockResponse);

        // When
        await getNotesOfClient(req, res);

        // Then
        sinon.assert.calledOnce(axiosGetStub);
        sinon.assert.calledWith(res.json, mockResponse.data);
    });

    test('should return 500 if there is an error in the axios request', async () => {
        // Given
        const errorMessage = 'Network error';
        const axiosGetStub = sinon.stub(axios, 'get').rejects(new Error(errorMessage));
        const consoleErrorStub = sinon.stub(console, 'error');

        // When
        await getNotesOfClient(req, res);

        // Then
        sinon.assert.calledOnce(consoleErrorStub);
        sinon.assert.calledOnce(axiosGetStub); // Ensure axios.get was called once
        sinon.assert.calledWith(res.status, 500); // Ensure status 500 is returned
        sinon.assert.calledWith(res.json, { message: 'Error getting notes of client' }); // Ensure the error message is correct
    });
});

describe('createClient API Gateway', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { name: 'Test Client', email: 'test@example.com' },
            headers: {
                authorization: 'Bearer validToken',
                'x-gateway-secret': 'validSecretKey',
            }
        }; // Simulate the request object

        res = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis()
        }; // Simulate the response object
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs and spies after each test
    });

    test('should return client data when the request is successful', async () => {
        // Given: Mock the axios.post call to simulate a successful response
        const mockResponse = { data: { clientId: '123', name: 'Test Client' } };
        const axiosPostStub = sinon.stub(axios, 'post').resolves(mockResponse);

        // When: Call the createClient function
        await createClient(req, res);

        // Then: Verify the response
        sinon.assert.calledOnce(axiosPostStub); // Ensure axios.post was called once
        sinon.assert.calledWith(res.json, mockResponse.data); // Ensure res.json was called with the correct data
    });

    test('should return 500 if there is an error in the axios request', async () => {
        // Given: Mock the axios.post call to simulate an error
        const errorMessage = 'Network error';
        const axiosPostStub = sinon.stub(axios, 'post').rejects(new Error(errorMessage));

        // When: Call the createClient function
        await createClient(req, res);

        // Then: Verify the response
        sinon.assert.calledOnce(axiosPostStub); // Ensure axios.post was called once
        sinon.assert.calledWith(res.status, 500); // Ensure status 500 is returned
        sinon.assert.calledWith(res.json, { message: 'Error creating client' }); // Ensure the error message is correct
    });
});

describe('updateClient API Gateway', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { clientId: '123' },
            body: { name: 'Updated Client', email: 'updated@example.com' },
            headers: {
                authorization: 'Bearer validToken',
                'x-gateway-secret': 'validSecretKey',
            }
        };
        res = { json: sinon.stub(), status: sinon.stub().returnsThis() };
    });

    afterEach(() => {
        sinon.restore();
    });
    test('should return updated client data when the request is successful', async () => {
        // Given
        const mockResponse = { data: { clientId: '123', name: 'Updated Client' } };
        sinon.stub(axios, 'put').resolves(mockResponse);
        // When
        await updateClient(req, res);
        // Then
        sinon.assert.calledOnce(axios.put);
        sinon.assert.calledWith(res.json, mockResponse.data);
    });

    test('should return 500 if there is an error in the axios request', async () => {
        // Given
        const errorMessage = 'Network error';
        sinon.stub(axios, 'put').rejects(new Error(errorMessage));
        // When
        await updateClient(req, res);
        // Then
        sinon.assert.calledOnce(axios.put);
        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { message: 'Error updating client' });
    });
});

describe('createNote API Gateway', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { clientId: '123' },
            body: { note: 'This is a new note' },
            headers: {
                authorization: 'Bearer validToken',
                'x-gateway-secret': 'validSecretKey',
            }
        };
        res = { json: sinon.stub(), status: sinon.stub().returnsThis() };
    });

    afterEach(() => {
        sinon.restore();
    });

    test('should return note data when the request is successful', async () => {
        // Given
        const mockResponse = { data: { noteId: '12345', note: 'This is a new note' } };
        sinon.stub(axios, 'post').resolves(mockResponse);
        // When
        await createNote(req, res);
        // Then
        sinon.assert.calledOnce(axios.post);
        sinon.assert.calledWith(res.json, mockResponse.data);
    });

    test('should return 500 if there is an error in the axios request', async () => {
        // Given
        const errorMessage = 'Network error';
        sinon.stub(axios, 'post').rejects(new Error(errorMessage));
        const consoleErrorStub = sinon.stub(console, 'error');
        // When
        await createNote(req, res);
        // Then
        sinon.assert.calledOnce(consoleErrorStub);
        sinon.assert.calledOnce(axios.post);
        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { message: 'Error creating note' });
    });
});

describe('updateNote API Gateway', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { clientId: '123', noteId: '12345' },
            body: { note: 'Updated note content' },
            headers: {
                authorization: 'Bearer validToken',
                'x-gateway-secret': 'validSecretKey',
            }
        };
        res = { json: sinon.stub(), status: sinon.stub().returnsThis() };
    });

    afterEach(() => {
        sinon.restore();
    });

    test('should return updated note data when the request is successful', async () => {
        // Given
        const mockResponse = { data: { noteId: '12345', note: 'Updated note content' } };
        sinon.stub(axios, 'put').resolves(mockResponse);
        // When
        await updateNote(req, res);
        // Then
        sinon.assert.calledOnce(axios.put);
        sinon.assert.calledWith(res.json, mockResponse.data);
    });

    test('should return 500 if there is an error in the axios request', async () => {
        // Given
        const errorMessage = 'Network error';
        sinon.stub(axios, 'put').rejects(new Error(errorMessage));
        // When
        await updateNote(req, res);
        // Then
        sinon.assert.calledOnce(axios.put);
        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { message: 'Error updating note' });
    });
});