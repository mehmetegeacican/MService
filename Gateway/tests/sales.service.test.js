const sinon = require('sinon');
const axios = require('axios');
const {
    getSales,
    getSaleHistory,
    createSale,
    updateSale,
    addSaleNote,
    editSaleNote
} = require('../services/sales.service');

describe('getSales', () => {
    let req, res;

    beforeEach(() => {
        req = { headers: { authorization: 'Bearer mockToken' } };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });

    test('should return sales data when the request is successful', async () => {
        // Given
        const mockResponse = { data: [{ id: 1, sale: 'Sale 1' }, { id: 2, sale: 'Sale 2' }] };
        const axiosGetStub = sinon.stub(axios, 'get').resolves(mockResponse); // Mock successful response

        // When
        await getSales(req, res);

        // Then
        sinon.assert.calledOnce(axiosGetStub); // Ensure axios.get was called once
        sinon.assert.calledWith(res.json, mockResponse.data); // Ensure res.json is called with the mock data
    });

    test('should return 500 error if there is an error in getting sales', async () => {
        // Given
        const errorMessage = 'Error getting sales';
        const axiosGetStub = sinon.stub(axios, 'get').rejects(new Error(errorMessage)); // Mock error response

        // When
        await getSales(req, res);

        // Then
        sinon.assert.calledOnce(axiosGetStub); // Ensure axios.get was called once
        sinon.assert.calledWith(res.status, 500); // Ensure 500 status was returned
        sinon.assert.calledWith(res.json, { message: 'Error getting sales' }); // Ensure proper error message was sent
    });
});

describe('getSaleHistory', () => {
    let req, res;

    beforeEach(() => {
        req = { headers: { authorization: 'Bearer mockToken' } };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });

    test('should return sale history when the request is successful', async () => {
        // Given
        req.params = {
            saleId: "asd"
        }
        const mockResponse = { data: [{ saleId: 'asd', statusChange: "In Contact - Deal" }] };
        const axiosGetStub = sinon.stub(axios, 'get').resolves(mockResponse);
        // When
        await getSaleHistory(req, res);
        // Then
        sinon.assert.calledOnce(axiosGetStub);
        sinon.assert.calledWith(res.json, mockResponse.data);
    });
    test('should return 500 error if there is an error in getting sale history', async () => {
        // Given
        req.params = {
            saleId: "asd"
        }
        const errorMessage = 'Error getting sale history';
        const axiosGetStub = sinon.stub(axios, 'get').rejects(new Error(errorMessage));
        // When
        await getSaleHistory(req, res);
        // Then
        sinon.assert.calledOnce(axiosGetStub);
        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { message: 'Error getting sale history' });
    });
});

describe('createSale', () => {
    let req, res;

    beforeEach(() => {
        req = {
            headers: { authorization: 'Bearer mockToken' },
            body: { saleName: 'New Sale', amount: 100 }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });

    test('should return sale data when the sale is created successfully', async () => {
        // Given
        req.body = {
            userId: "67694d02fc1566e3cbc219b1",
            clientId: "6769774405967311a22f9467"
        }
        const mockResponse = { data: { saleId: "223423", currentStatus: 'New' } };
        const axiosPostStub = sinon.stub(axios, 'post').resolves(mockResponse);
        // When
        await createSale(req, res);
        // Then
        sinon.assert.calledOnce(axiosPostStub);
        sinon.assert.calledWith(res.json, mockResponse.data);
    });
    test('should return 500 error if there is an error creating the sale', async () => {
        // Given
        req.body = {
            userId: "67694d02fc1566e3cbc219b1",
            clientId: "6769774405967311a22f9467"
        }
        const errorMessage = 'Error creating client';
        const axiosPostStub = sinon.stub(axios, 'post').rejects(new Error(errorMessage)); // Mock error response

        // When
        await createSale(req, res);

        // Then
        sinon.assert.calledOnce(axiosPostStub); // Ensure axios.post was called once
        sinon.assert.calledWith(res.status, 500); // Ensure 500 status was returned
        sinon.assert.calledWith(res.json, { message: 'Error creating sale' }); // Ensure proper error message was sent
    });
});

describe('updateSale', () => {
    let req, res;

    beforeEach(() => {
        req = {
            headers: { authorization: 'Bearer mockToken' },
            params: { saleId: '123' }, // Sale ID to be updated
            body: { status: 'Deal' }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });

    test('should return updated sale data when the sale is updated successfully', async () => {
        // Given
        const mockResponse = { data: { id: '123', saleName: 'Updated Sale', amount: 150 } };
        const axiosPutStub = sinon.stub(axios, 'put').resolves(mockResponse); // Mock successful response

        // When
        await updateSale(req, res);

        // Then
        sinon.assert.calledOnce(axiosPutStub);
        sinon.assert.calledWith(res.json, mockResponse.data);
    });

    test('should return 500 error if there is an error updating the sale', async () => {
        // Given
        const errorMessage = 'Error updating sale';
        const axiosPutStub = sinon.stub(axios, 'put').rejects(new Error(errorMessage)); // Mock error response

        // When
        await updateSale(req, res);

        // Then
        sinon.assert.calledOnce(axiosPutStub); // Ensure axios.put was called once
        sinon.assert.calledWith(res.status, 500); // Ensure 500 status was returned
        sinon.assert.calledWith(res.json, { message: 'Error updating sale' }); // Ensure proper error message was returned
    });
});

describe('addSaleNote', () => {
    let req, res;

    beforeEach(() => {
        req = {
            headers: { authorization: 'Bearer mockToken' },
            params: { saleId: '123' }, // Sale ID to add the note to
            body: { note: 'New sale note' }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });

    test('should return sale note data when the note is added successfully', async () => {
        // Given
        const mockResponse = { data: { saleId: '123', note: 'New sale note' } };
        const axiosPostStub = sinon.stub(axios, 'post').resolves(mockResponse);
        // When
        await addSaleNote(req, res);
        // Then
        sinon.assert.calledOnce(axiosPostStub);
        sinon.assert.calledWith(res.json, mockResponse.data);
    });

    test('should return 500 error if there is an error adding the sale note', async () => {
        // Given
        const errorMessage = 'Error adding note to sale';
        const axiosPostStub = sinon.stub(axios, 'post').rejects(new Error(errorMessage));
        const consoleErrorStub = sinon.stub(console, 'error');
        // When
        await addSaleNote(req, res);
        // Then
        sinon.assert.calledOnce(axiosPostStub);
        sinon.assert.calledOnce(consoleErrorStub);
        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { message: 'Error adding note to sale' });
    });
});

describe('editSaleNote', () => {
    let req, res;

    beforeEach(() => {
        req = {
            headers: { authorization: 'Bearer mockToken' },
            params: { saleId: '123', noteId: '456' }, // Sale and Note IDs
            body: { note: 'Updated sale note' }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });

    test('should return updated sale note data when the note is edited successfully', async () => {
        // Given
        const mockResponse = { data: { saleId: '123', noteId: '456', note: 'Updated sale note' } };
        const axiosPutStub = sinon.stub(axios, 'put').resolves(mockResponse); // Mock successful response
        // When
        await editSaleNote(req, res);
        // Then
        sinon.assert.calledOnce(axiosPutStub); 
        sinon.assert.calledWith(res.json, mockResponse.data); 
    });

    test('should return 500 error if there is an error editing the sale note', async () => {
        // Given
        const errorMessage = 'Error editing note';
        const axiosPutStub = sinon.stub(axios, 'put').rejects(new Error(errorMessage)); 
        // When
        await editSaleNote(req, res);
        // The
        sinon.assert.calledOnce(axiosPutStub);

        sinon.assert.calledWith(res.status, 500); 
        sinon.assert.calledWith(res.json, { message: 'Error editing note' }); 
    });
});