const Note = require('../model/note.model');

/**
 * Creates a new Note for the given Client
 * @param {*} req 
 * @param {*} res 
 */
const createNewNote = async (req, res) => {
    try {
        // Step 0 -- Variables
        const { title, content, clientId } = req.body;
        // Step 1 -- Ensure all required fields are present
        if (!title || !content || !clientId) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Step 2 -- Create the new note
        const newNote = new Note({
            title: title,
            content: content,
            clientId: clientId
        });
        await newNote.save();

        return res.status(201).json({ message: 'Note created successfully', note: newNote });

    } catch (e) {
        console.error('Error creating note :', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

/**
 * Updates Notes for the given Client
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateExistingNote = async (req, res) => {
    try {
        // Step 0 -- Variables
        const { noteId } = req.params;
        const { title, content } = req.body;

        // Step 1 -- Update the Note directly
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            {
                ...(title && { title }),
                ...(content && { content })
            },
            { new: true }
        );

        // Step 2 -- Check if the note exists
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Step 3 -- Return the updated note
        return res.status(200).json({ message: 'Note updated successfully', note: updatedNote });

    } catch (e) {
        console.error('Error updating note :', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = {
    createNewNote,
    updateExistingNote
}