const sinon = require('sinon');
const {
    getSales,
    getSaleHistory,
    createSale,
    updateSale,
    addSaleNote,
    editSaleNote,
} = require('../controller/sales.controller');
describe('sales controller tests', () => {

    describe('getSales', () => {

        test('should successfully return sales without filters', async () => {

        });

        test('should successfully return sales with filters', async () => {

        });

        test('should handle server errors, return 500', async () => {

        });
    });

    describe('getSaleHistory', () => {
        test('shuould successfully return sale history', async () => {

        });
        test('should handle server errors', async () => {

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

    describe('editSaleNote',() => {
        test('should successfully update sale note', async () => {

        });
        test('should return 404 if sale is not found by Id', async () => {

        });
        test('should handle server errors', async () => {

        });
    });
});