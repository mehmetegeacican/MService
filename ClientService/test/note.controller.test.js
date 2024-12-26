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
        test('successfully updates note', async () => {
            // Given
            const noteId = 'mockNoteId';
            const updatedTitle = 'Updated Title';
            const updatedContent = 'Updated Content';
            const req = {
                params: { noteId },
                body: { title: updatedTitle, content: updatedContent },
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            const mockUpdatedNote = {
                _id: noteId,
                title: updatedTitle,
                content: updatedContent,
            };
            const findByIdAndUpdateStub = sinon.stub(Note, 'findByIdAndUpdate').resolves(mockUpdatedNote);
            // When
            await updateExistingNote(req, res);
            // Then
            sinon.assert.calledWith(findByIdAndUpdateStub, noteId, { title: updatedTitle, content: updatedContent }, { new: true });
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, {
                message: 'Note updated successfully',
                note: mockUpdatedNote,
            });
        });
        test('note id is not provided, returns 500', async () => {

        });
        test('Note does not exist for the provided noteId, returns 400', async () => {
            // Given
            const noteId = 'mockNoteId';
            const req = {
                params: { noteId },
                body: { title: 'Updated Title', content: 'Updated Content' },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const findByIdAndUpdateStub = sinon.stub(Note, 'findByIdAndUpdate').resolves(null);
            // When
            await updateExistingNote(req, res);
            // Then
            sinon.assert.calledWith(findByIdAndUpdateStub, noteId, { title: 'Updated Title', content: 'Updated Content' }, { new: true });
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.json, { message: 'Note not found' });
        });
        test('Handles server errors', async () => {
            // Given
            const noteId = 'mockNoteId';
            const req = {
                params: { noteId },
                body: { title: 'Updated Title', content: 'Updated Content' },
            };

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const findByIdAndUpdateStub = sinon.stub(Note, 'findByIdAndUpdate').throws(new Error('Database error'));
            const consoleErrorStub = sinon.stub(console, 'error');
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