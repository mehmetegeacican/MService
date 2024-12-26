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
            await getSaleHistory(req,res);
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
        test('should successfully create new sale', async () => {

        });
        test('should return 400 if required body parameters are missing', async () => {

        });
        test('should handle server errors, returns 500', async () => {

        });
    });

    describe('updateSale', () => {
        test('should successfully update existing sale', async () => {

        });
        test('should return 404 in case of not finding the saleId', async () => {

        });
        test('should return 400 invalid status in case of not proper status param', async () => {

        });
        test('should handle server errors, return 500', async () => {

        });
    });

    describe('addSaleNote', () => {
        test('should successfully add new sale note', async () => {

        });
        test('should return 404 if sale is not found', async () => {

        });
        test('should handle server errors', async () => {

        });
    });

    describe('editSaleNote', () => {
        test('should successfully update sale note', async () => {

        });
        test('should return 404 if sale is not found by Id', async () => {

        });
        test('should handle server errors', async () => {

        });
    });
});