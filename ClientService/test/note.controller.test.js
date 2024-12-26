const sinon = require('sinon');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
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
            // Given
            req = {
                body: { title: 'New Note', content: 'New Content', clientId: 'client123' },
            };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockNewNote = {
                title: 'New Note',
                content: 'New Content',
                clientId: 'client123',
                _id: new ObjectId('676d28be7d836af854cb9a55'), // Mock _id value
            };
            const saveStub = sinon.stub(Note.prototype, 'save');
            saveStub.resolves(mockNewNote);
            // When
            await createNewNote(req, res);
            // Then
            sinon.assert.calledOnce(saveStub); // Ensure save was called once
            sinon.assert.calledWith(res.status, 201); // Check the response status
            sinon.assert.calledWith(res.json, { // Check the response body
                message: 'Note created successfully',
                note: sinon.match({
                    title: 'New Note',
                    content: 'New Content',
                    clientId: 'client123',
                    _id: sinon.match.instanceOf(ObjectId), // Check that _id is an instance of ObjectId
                })
            });
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