const sinon = require('sinon');
const {
    getClients,
    getNotesOfClient,
    createClient,
    updateClient
} = require('../controller/client.controller');
const Client = require('../model/client.model');
const Note = require('../model/note.model');

describe('client controller tests', () => {

    describe('Get Clients', () => {

        afterEach(() => {
            // Restore stubs after each test
            sinon.restore();

        });

        test('successfully retrieves clients with filters', async () => {
            // Given
            const req = { query: { name: 'John' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockClients = [
                { _id: '1', name: 'John Doe', email: 'john@example.com', company: 'Company A' },
                { _id: '2', name: 'John Smith', email: 'john@example.com', company: 'Company B' },
            ];
            const consoleErrorStub = sinon.stub(console, 'error'); // Mock console.error

            // Mocking Client.find() to return a query that has a sort method
            const mockFind = sinon.stub().returns({
                sort: sinon.stub().returns(mockClients), // Ensure sort returns mockClients
            });

            // Stub the Client.find() method
            sinon.stub(Client, 'find').callsFake(mockFind);

            // When
            await getClients(req, res);

            // Then
            sinon.assert.calledOnce(mockFind);
            sinon.assert.calledWith(mockFind, {
                name: { $regex: 'John', $options: 'i' },
            });

            const sortStub = mockFind().sort;
            sinon.assert.calledWith(sortStub, { updatedAt: -1 });

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, {
                success: true,
                data: mockClients,
            });

            // Check if console.error was NOT called (because this is a successful case)
            sinon.assert.notCalled(consoleErrorStub);

            // Restore the stubs after the test
            sinon.restore();
        });

        test('handles server errors', async () => {
            // Given
            const findStub = sinon.stub(Client, 'find').throws(new Error('Database error'));
            const req = { query: {} }; // Empty query for simplicity
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const consoleErrorStub = sinon.stub(console, 'error');
            // When
            await getClients(req, res);
            // Then
            sinon.assert.calledOnce(findStub);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(consoleErrorStub, sinon.match.string, sinon.match.instanceOf(Error));
            sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });
        });
    });

    describe('Get Notes of Clients', () => {
        afterEach(() => {
            // Restore stubs after each test
            sinon.restore();
        });
        test('successfully returns notes of client', async () => {
            // Given
            const clientId = 'mockClientId';
            const req = { params: { clientId } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockNotes = [
                { _id: '1', clientId: clientId, title: 'Note 1', content: 'Content 1' },
                { _id: '2', clientId: clientId, title: 'Note 2', content: 'Content 2' },
            ];
            const findStub = sinon.stub(Note, 'find').resolves(mockNotes);
            // When
            await getNotesOfClient(req, res);
            // Then
            sinon.assert.calledOnce(findStub);
            sinon.assert.calledWith(findStub, { clientId });
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, {
                success: true,
                data: mockNotes,
            });

        });
        test('handles server errors', async () => {
            // Given
            const req = { params: {} };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const consoleErrorStub = sinon.stub(console, 'error');
            const findStub = sinon.stub(Note, 'find').throws(new Error('ID error'));
            // When
            await getNotesOfClient(req, res);
            // Then
            sinon.assert.calledOnce(findStub);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });
            sinon.assert.calledOnce(consoleErrorStub);
            sinon.assert.calledWith(consoleErrorStub, sinon.match.string, sinon.match.instanceOf(Error));
        });
    });

    describe('Creates Client', () => {
        test('successfully creates new client', async () => {

        });
        test('returns 400 if required parameters are missing', async () => {

        });
        test('handles server errors, returns 500', async () => {

        });
    });

    describe('Updates Client', () => {

        afterEach(() => {
            // Restore stubs after each test
            sinon.restore();
        });

        test('successfully updates client', async () => {
            // Given
            const clientId = 'mockClientId';
            const updatedData = { name: 'Updated Name', email: 'updated@example.com', phone: '1234567890' };
            const req = {
                params: { clientId },
                body: updatedData
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockUpdatedClient = {
                _id: clientId,
                ...updatedData
            };
            const findByIdAndUpdateStub = sinon.stub(Client, 'findByIdAndUpdate').resolves(mockUpdatedClient);
            // When
            await updateClient(req, res);
            // Then
            sinon.assert.calledOnce(findByIdAndUpdateStub);
            sinon.assert.calledWith(findByIdAndUpdateStub, clientId, updatedData, { new: true });
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, {
                message: 'Client updated successfully',
                client: mockUpdatedClient,
            });

        });
        test('returns 404 if client is not found', async () => {
            // Given
            const clientId = 'mockClientId';
            const updatedData = { name: 'Updated Name', email: 'updated@example.com' };
            const req = {
                params: { clientId },
                body: updatedData
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const findByIdAndUpdateStub = sinon.stub(Client, 'findByIdAndUpdate').resolves(null);
            // When
            await updateClient(req, res);
            // Then
            sinon.assert.calledOnce(findByIdAndUpdateStub);
            sinon.assert.calledWith(findByIdAndUpdateStub, clientId, updatedData, { new: true });

            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.json, { message: 'Client not found' });
        });
        test('handles server operations,returns 500', async () => {
            // Given
            const clientId = 'mockClientId';
            const updatedData = { name: 'Updated Name', email: 'updated@example.com' };
            const req = {
                params: { clientId },
                body: updatedData
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const consoleErrorStub = sinon.stub(console, 'error');
            const findByIdAndUpdateStub = sinon.stub(Client, 'findByIdAndUpdate').throws(new Error('Server Error'));
            // When
            await updateClient(req, res);
            // Then
            sinon.assert.calledOnce(findByIdAndUpdateStub);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });
            sinon.assert.calledOnce(consoleErrorStub);
            sinon.assert.calledWith(consoleErrorStub, sinon.match.string, sinon.match.instanceOf(Error));
        });
    });

});