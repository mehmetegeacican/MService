const sinon = require('sinon');
const {
    createNewNote,
    updateExistingNote
} = require('../controller/note.controller');


describe('note controller tests', () => {
    afterEach(() => {
        sinon.restore(); 
    });

    describe('create new note', () => {
        test('successfully creates a new note' , async () => {

        });
        test('returns 400 error if missing required fields' , async () => {

        });
        test('server error occurs, returns 500', async () => {

        });
    });

    describe('update existing note', () => {
        test('successfully updates note', async () => {

        });
        test('note id is not provided, returns 500', async () => {

        });
        test('Note does not exist for the provided noteId, returns 400', async () => {

        });
        test('Handles server errors' , async () => {
            
        });
    });
});