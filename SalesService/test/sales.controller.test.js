const sinon = require('sinon');
const {
    getSales,
    getSaleHistory,
    createSale,
    updateSale,
    addSaleNote,
    editSaleNote,
} = require('../controller/sales.controller');
const Sale = require('../model/sale.model');
const SaleHistory = require('../model/saleHistory.model');
const SaleNote = require('../model/saleNote.model');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

describe('sales controller tests', () => {

    describe('getSales', () => {

        afterEach(() => {
            sinon.restore(); // Restore mocks/stubs after each test
        });

        test('should successfully return sales with filters', async () => {
            // Given
            const req = { query: { clientId: 'mockClientId1', userId: 'mockUserId1' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockSales = [
                { _id: '1', clientId: 'mockClientId1', userId: 'mockUserId1', amount: 100 },
                { _id: '2', clientId: 'mockClientId1', userId: 'mockUserId1', amount: 200 },
            ];
            const sortStub = sinon.stub().returns(mockSales);
            const findStub = sinon.stub(Sale, 'find').returns({ sort: sortStub });
            sortStub.resolves(mockSales);
            // When
            await getSales(req, res);
            // Then
            sinon.assert.calledOnce(findStub);
            sinon.assert.calledOnce(sortStub);

            sinon.assert.calledWith(findStub, {
                clientId: 'mockClientId1',
                userId: 'mockUserId1',
            });
            sinon.assert.calledWith(sortStub, {
                updatedAt: -1,
            });

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, {
                success: true,
                data: mockSales,
            });

        });

        test('should handle server errors, return 500', async () => {
            // Given
            const req = { query: {} };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const consoleErrorStub = sinon.stub(console, 'error');
            const findStub = sinon.stub(Sale, 'find').throws(new Error('Database error'));
            // When
            await getSales(req, res);
            // Then
            sinon.assert.calledOnce(findStub);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });
            sinon.assert.calledOnce(consoleErrorStub);
            sinon.assert.calledWith(consoleErrorStub, sinon.match.string, sinon.match.instanceOf(Error));
        });

    });

    describe('getSaleHistory', () => {

        afterEach(() => {
            sinon.restore();
        });

        test('shuould successfully return sale history', async () => {
            // Given
            const req = { params: { saleId: 'mockSaleId' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockSaleHistory = [
                { _id: '1', saleId: 'mockSaleId', createdAt: '2024-12-25', details: 'Sale 1' },
                { _id: '2', saleId: 'mockSaleId', createdAt: '2024-12-24', details: 'Sale 2' },
            ];
            const sortStub = sinon.stub().returns(mockSaleHistory);
            const findStub = sinon.stub(SaleHistory, 'find').returns({ sort: sortStub });
            // When
            await getSaleHistory(req, res);
            // Then
            sinon.assert.calledOnce(sortStub);
            sinon.assert.calledOnce(findStub);
            sinon.assert.calledWith(findStub, { saleId: 'mockSaleId' });

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, {
                success: true,
                data: mockSaleHistory,
            });

        });
        test('should handle server errors', async () => {
            // Given
            const req = { params: { saleId: 'mockSaleId' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const findStub = sinon.stub(SaleHistory, 'find').throws(new Error('Database error'));
            const consoleErrorStub = sinon.stub(console, 'error');
            // When
            await getSaleHistory(req, res);
            // Then
            sinon.assert.calledOnce(findStub);
            sinon.assert.calledWith(findStub, { saleId: 'mockSaleId' });
            sinon.assert.calledOnce(consoleErrorStub);
            sinon.assert.calledWith(consoleErrorStub, sinon.match.string, sinon.match.instanceOf(Error));
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });

        });
    });

    describe('createSale', () => {

        afterEach(() => {
            sinon.restore(); // Restore mocks/stubs after each test
        });

        test('should successfully create new sale', async () => {
            // Given
            const req = {
                body: { clientId: 'mockClientId', userId: 'mockUserId' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockSale = { _id: new ObjectId('676d28be7d836af854cb9a55'), clientId: 'mockClientId', userId: 'mockUserId' };
            const saveStub = sinon.stub(Sale.prototype, 'save').resolves(mockSale);
            // When
            await createSale(req, res);
            // Then
            sinon.assert.calledOnce(saveStub);
            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledWith(res.json, {
                success: true,
                data: sinon.match({
                    _id: sinon.match.instanceOf(ObjectId),
                    clientId: 'mockClientId',
                    userId: 'mockUserId'
                }),
            });

        });
        test('should return 400 if required body parameters are missing', async () => {
            // Given
            const req = {
                body: { clientId: 'mockClientId' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockSale = { _id: new ObjectId('676d28be7d836af854cb9a55'), clientId: 'mockClientId', userId: 'mockUserId' };
            const saveStub = sinon.stub(Sale.prototype, 'save').resolves(mockSale);
            // When
            await createSale(req, res);
            // Then
            sinon.assert.notCalled(saveStub);
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.json, {
                message: "Missing required fields",
            });
        });
        test('should handle server errors, returns 500', async () => {
            // Given
            const req = {
                body: { clientId: 'mockClientId', userId: 'mockUserId' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const saveStub = sinon.stub(Sale.prototype, 'save').throws(new Error('Database error'));
            const consoleErrorStub = sinon.stub(console, 'error');
            // When
            await createSale(req, res);
            // Then
            sinon.assert.calledOnce(saveStub);
            sinon.assert.calledOnce(consoleErrorStub);
            sinon.assert.calledWith(consoleErrorStub, sinon.match.string, sinon.match.instanceOf(Error));
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });
        });
    });

    describe('updateSale', () => {

        afterEach(() => {
            sinon.restore(); // Restore mocks/stubs after each test
        });

        test('should successfully update existing sale', async () => {
            // Given
            const req = {
                params: { saleId: 'mockSaleId' },
                body: { status: 'Deal', userId: 'mockUserId', clientId: 'mockClientId' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockSale = { _id: 'mockSaleId', currentStatus: 'New' };
            const mockUpdatedSale = {
                _id: 'mockSaleId',
                currentStatus: 'Deal',
                userId: 'mockUserId',
                clientId: 'mockClientId',
            };
            const findByIdStub = sinon.stub(Sale, 'findById').resolves(mockSale);
            const saveStub = sinon.stub(SaleHistory.prototype, 'save').resolves();
            const findByIdAndUpdateStub = sinon.stub(Sale, 'findByIdAndUpdate').resolves(mockUpdatedSale);
            // When
            await updateSale(req, res);
            // Then
            sinon.assert.calledOnce(findByIdStub);
            sinon.assert.calledWith(findByIdStub, 'mockSaleId');

            sinon.assert.calledOnce(saveStub);

            sinon.assert.calledOnce(findByIdAndUpdateStub);
            sinon.assert.calledWith(findByIdAndUpdateStub, 'mockSaleId', {
                currentStatus: 'Deal',
                userId: 'mockUserId',
                clientId: 'mockClientId',
            }, { new: true });

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, {
                success: true,
                data: mockUpdatedSale,
            });

        });
        test('should return 404 in case of not finding the saleId', async () => {
            // Given
            const req = {
                params: { saleId: 'nonExistentSaleId' },
                body: { status: 'Deal' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            const findByIdStub = sinon.stub(Sale, 'findById').resolves(null);

            // When
            await updateSale(req, res);

            // Then
            sinon.assert.calledOnce(findByIdStub);
            sinon.assert.calledWith(findByIdStub, 'nonExistentSaleId');
            
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.json, { message: 'Sale not found' });
        });
        test('should return 400 invalid status in case of not proper status param', async () => {
            // Given
            const req = {
                params: { saleId: 'mockSaleId' },
                body: { status: 'InvalidStatus' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            const mockSale = { _id: 'mockSaleId', currentStatus: 'New' };

            const findByIdStub = sinon.stub(Sale, 'findById').resolves(mockSale);

            // When
            await updateSale(req, res);

            // Then
            sinon.assert.calledOnce(findByIdStub);
            sinon.assert.calledWith(findByIdStub, 'mockSaleId');

            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.json, { message: 'Invalid status' });
        });
        test('should handle server errors, return 500', async () => {
            // Given
            const req = {
                params: { saleId: 'mockSaleId' },
                body: { status: 'Deal' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            const findByIdStub = sinon.stub(Sale, 'findById').throws(new Error('Database error'));
            const consoleErrorStub = sinon.stub(console, 'error');
            // When
            await updateSale(req, res);

            // Then
            sinon.assert.calledOnce(findByIdStub);
            sinon.assert.calledWith(findByIdStub, 'mockSaleId');
            sinon.assert.calledOnce(consoleErrorStub);
            sinon.assert.calledWith(consoleErrorStub, sinon.match.string, sinon.match.instanceOf(Error));
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });
        });
    });

    describe('addSaleNote', () => {
        afterEach(() => {
            sinon.restore(); // Restore mocks/stubs after each test
        });

        test('should successfully add new sale note', async () => {
            // Given
            const req = {
                params: { saleId: 'mockSaleId' },
                body: { note: 'This is a new sale note' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            const mockSale = { _id: 'mockSaleId' };
            const mockSaleNote = { _id: 'mockNoteId', saleId: 'mockSaleId', note: 'This is a new sale note' };

            const findByIdStub = sinon.stub(Sale, 'findById').resolves(mockSale);
            const saveStub = sinon.stub(SaleNote.prototype, 'save').resolves(mockSaleNote);

            // When
            await addSaleNote(req, res);

            // Then
            sinon.assert.calledOnce(findByIdStub);
            sinon.assert.calledWith(findByIdStub, 'mockSaleId');

            sinon.assert.calledOnce(saveStub);

            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledWith(res.json, {
                success: true,
                data: sinon.match({
                    ...mockSaleNote,
                    _id : sinon.match.instanceOf(ObjectId)
                }),
            });
        });

        test('should return 404 if sale is not found', async () => {
            // Given
            const req = {
                params: { saleId: 'nonExistentSaleId' },
                body: { note: 'This is a new sale note' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            const findByIdStub = sinon.stub(Sale, 'findById').resolves(null);

            // When
            await addSaleNote(req, res);

            // Then
            sinon.assert.calledOnce(findByIdStub);
            sinon.assert.calledWith(findByIdStub, 'nonExistentSaleId');

            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.json, { message: 'Sale not found' });
        });

        test('should handle server errors', async () => {
            // Given
            const req = {
                params: { saleId: 'mockSaleId' },
                body: { note: 'This is a new sale note' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            const findByIdStub = sinon.stub(Sale, 'findById').throws(new Error('Database error'));
            const consoleErrorStub = sinon.stub(console, 'error');
            // When
            await addSaleNote(req, res);

            // Then
            sinon.assert.calledOnce(findByIdStub);
            sinon.assert.calledWith(findByIdStub, 'mockSaleId');
            sinon.assert.calledOnce(consoleErrorStub);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });
        });
    });

    describe('editSaleNote', () => {

        afterEach(() => {
            sinon.restore(); // Restore mocks/stubs after each test
        });
        test('should successfully update sale note', async () => {
            // Given
            const req = {
                params: { noteId: 'mockNoteId' },
                body: { note: 'Updated sale note' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            const mockSaleNote = { _id: 'mockNoteId', note: 'Updated sale note' };
            const findByIdAndUpdateStub = sinon.stub(SaleNote, 'findByIdAndUpdate').resolves(mockSaleNote);
            // When
            await editSaleNote(req, res);

            // Then
            sinon.assert.calledOnce(findByIdAndUpdateStub);
            sinon.assert.calledWith(findByIdAndUpdateStub, 'mockNoteId', { note: 'Updated sale note' }, { new: true });
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, {
                success: true,
                data: mockSaleNote,
            });
        });
        test('should return 404 if sale is not found by Id', async () => {
            // Given
            const req = {
                params: { noteId: 'mockNoteId' },
                body: { note: 'Updated sale note' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const findByIdAndUpdateStub = sinon.stub(SaleNote, 'findByIdAndUpdate').resolves(null);
            // When
            await editSaleNote(req, res);
            // Then
            sinon.assert.calledOnce(findByIdAndUpdateStub);
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.json, { message: 'Sale note not found' });
        });
        test('should handle server errors', async () => {
            // Given
            const req = {
                params: { noteId: 'mockNoteId' },
                body: { note: 'Updated sale note' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const findByIdAndUpdateStub = sinon.stub(SaleNote, 'findByIdAndUpdate').throws(new Error('Error'));
            const consoleErrorStub = sinon.stub(console, 'error');
            // When
            await editSaleNote(req, res);
            // Then
            sinon.assert.calledOnce(findByIdAndUpdateStub);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });
            sinon.assert.calledOnce(consoleErrorStub);
            sinon.assert.calledWith(consoleErrorStub, sinon.match.string, sinon.match.instanceOf(Error));
        });
    });
});