const sinon = require('sinon');
const {
    getClients,
    getNotesOfClient,
    createClient,
    updateClient
} = require('../controller/client.controller');


describe('client controller tests', () => { 

    describe('Get Clients', () => { 
        test('successfully retrieves clients', async () => { 

        });
        test('handles server errors', async () => {

        });
    });

    describe('Get Notes of Clients', () => {
        test('successfully returns notes of client', async () => {

        });
        test('returns 500 when the userId is not valid', async () => {

        });
        test('handles server errors', async () => {

        });
    });

    describe('Creates Client', () => {
        test('successfully creates new client', async () => {

        });
        test('returns 400 if required parameters are missing', async () => {

        });
        test('handles server errors, returns 500' , async () => {

        });
    });

    describe('Updates Client', () => {
        test('successfully updates client', async () => {

        });
        test('returns 404 if client is not found', async () => {

        });
        test('handles server operations,returns 500', async () => {

        });
    });

});