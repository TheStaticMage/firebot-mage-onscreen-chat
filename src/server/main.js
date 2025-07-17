const express = require('express')
const path = require('path');
const app = express()
const port = process.env.PORT || 7473
const static_dir = process.env.STATIC_DIR || path.join(__dirname, '../../static')

app.use(express.json());

const deletedMessages = new Set();
const instructions = [];
const messages = [];
const pollInterval = 200; // Polling interval in milliseconds

function logger(req, message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${message}`);
}

app.post('/delete-message', (req, res) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || !body.id || typeof body.id !== 'string') {
        logger(req, 'Invalid request body: missing or malformed "id" field');
        return res.status(400).json({ error: 'Invalid request body: missing or malformed "id" field' });
    }

    const messageId = body.id;
    const messageIndex = messages.findIndex(msg => msg.message.id === messageId);
    if (messageIndex === -1) {
        logger(req, `Message with ID ${messageId} not found`);
        return res.status(404).json({ error: `Message with ID ${messageId} not found` });
    }
    messages[messageIndex].isDeleted = true;
    deletedMessages.add(messageId);

    const instruction = {
        action: 'delete',
        messageId: messages[messageIndex].message.id,
    };
    instructions.push(instruction);

    logger(req, `Message with ID ${messageId} deleted`);
    res.status(200).json({ success: true });
});

app.post('/clear-messages', (req, res) => {
    const instruction = {
        action: 'clear',
    };
    instructions.push(instruction);

    for (const message of messages) {
        message.isDeleted = true;
        deletedMessages.add(message.message.id);
    }

    logger(req, 'All messages cleared');
    res.status(200).json({ success: true });
});

app.post('/post-message', (req, res) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || !body.message || typeof body.message !== 'object' || !body.message.id || typeof body.message.id !== 'string') {
        logger(req, 'Invalid message: missing or malformed "id" field');
        return res.status(400).json({ error: 'Invalid message: missing or malformed "id" field' });
    }

    const message = body.message;
    const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidv4Regex.test(message.id)) {
        logger(req, 'Invalid message: "id" is not a valid UUIDv4');
        return res.status(400).json({ error: 'Invalid message: "id" is not a valid UUIDv4' });
    }

    const timestamp = Date.now();
    messages.push({message: message, timestamp: timestamp});

    const instruction = {
        action: 'show',
        message: message,
        timestamp: timestamp,
    };
    instructions.push(instruction);

    logger(req, `Received message ID: ${message.id}: total messages: ${messages.length}, total instructions: ${instructions.length}`);
    res.status(200).json({ success: true });
});

app.get('/poll.json', (req, res) => {
    let since = isNaN(Number(req.query.since)) ? -1 : Number(req.query.since);

    // Make sure "since" is within bounds
    if (since < -1 || since > instructions.length) {
        logger(req, `"since" parameter out of bounds: ${since}`);
        since = -1; // Reset to -1 to return all messages
    }

    // If since is -1, return all messages.
    if (since === -1) {
        const filteredMessages = messages.filter(msg => !msg.isDeleted);
        const newInstructions = filteredMessages.map(msg => ({
            action: 'show',
            message: msg.message
        }));

        logger(req, `Returned initial instructions with ${newInstructions.length} instructions`);
        return res.json({ instructions: newInstructions, next: instructions.length });
    }

    // Respond when we have new instructions
    function checkForNewInstructions() {
        // Initial case when the instructions array is empty
        if (since === 0 && instructions.length === 0) {
            return setTimeout(checkForNewInstructions, pollInterval);
        }

        const newInstructions = since === -1 ? instructions : instructions.slice(since);
        const validInstructions = newInstructions.filter(inst => !(inst.action === 'show' && deletedMessages.has(inst.message?.id)));
        if (validInstructions.length > 0) {
            logger(req, `Returning ${validInstructions.length} instructions since position: ${since}`);
            res.json({ instructions: validInstructions, next: instructions.length });
        } else {
            setTimeout(checkForNewInstructions, pollInterval);
        }
    }

    checkForNewInstructions();
});

app.use(express.static(static_dir));

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
