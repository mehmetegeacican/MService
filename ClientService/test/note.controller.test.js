const sinon = require('sinon');
const {
    createNewNote,
    updateExistingNote
} = require('../controller/note.controller');
const Note = require('../model/note.model');

describe('note controller tests', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('create new note', () => {
        test('successfully creates a new note', async () => {

        });
        test('returns 400 error if missing required fields', async () => {

        });
        test('server error occurs, returns 500', async () => {

        });
    });

    describe('update existing note', () => {
        
        let req, res, findByIdAndUpdateStub, consoleErrorStub;

        beforeEach(() => {
            req = {
                params: { noteId: 'mockNoteId' },
                body: { title: 'Updated Title', content: 'Updated Content' },
            };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            // Stub `console.error` to suppress error logs
            consoleErrorStub = sinon.stub(console, 'error');
        });
    
        test('successfully updates note', async () => {
            // Given
            const mockUpdatedNote = {
                _id: req.params.noteId,
                title: req.body.title,
                content: req.body.content,
            };
    
            findByIdAndUpdateStub = sinon.stub(Note, 'findByIdAndUpdate').resolves(mockUpdatedNote);
    
            // When
            await updateExistingNote(req, res);
    
            // Then
            sinon.assert.calledWith(findByIdAndUpdateStub, req.params.noteId, { title: req.body.title, content: req.body.content }, { new: true });
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, {
                message: 'Note updated successfully',
                note: mockUpdatedNote,
            });
        });
    
        test('note does not exist for the provided noteId, returns 404', async () => {
            // Given
            findByIdAndUpdateStub = sinon.stub(Note, 'findByIdAndUpdate').resolves(null);
    
            // When
            await updateExistingNote(req, res);
    
            // Then
            sinon.assert.calledWith(findByIdAndUpdateStub, req.params.noteId, { title: req.body.title, content: req.body.content }, { new: true });
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.json, { message: 'Note not found' });
        });
    
        test('handles server errors', async () => {
            // Given
            findByIdAndUpdateStub = sinon.stub(Note, 'findByIdAndUpdate').throws(new Error('Database error'));
    
            // When
            await updateExistingNote(req, res);
    
            // Then
            sinon.assert.calledOnce(findByIdAndUpdateStub);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(consoleErrorStub, sinon.match.string, sinon.match.instanceOf(Error));
            sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });
        });
    });
    
});