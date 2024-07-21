const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/personal_webpage', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema and model for stories
const storySchema = new mongoose.Schema({
    title: String,
    content: String,
    type: String, // 'moral' or 'horror'
    //type : add your name 
    date: { type: Date, default: Date.now }
});

const Story = mongoose.model('Story', storySchema);

// Routes
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.post('/addStory', async (req, res) => {
    console.log('Request to add story:', req.body);
    const newStory = new Story({
        title: req.body.title,
        content: req.body.content,
        type: req.body.type
    });

    try {
        const savedStory = await newStory.save();
        console.log('Story saved:', savedStory);
        res.status(200).send(savedStory);
    } catch (err) {
        console.error('Error saving story:', err);
        res.status(500).send(err);
    }
});

app.get('/getStories', async (req, res) => {
    try {
        const stories = await Story.find({});
        console.log('Retrieved stories:', stories);
        res.status(200).send(stories);
    } catch (err) {
        console.error('Error retrieving stories:', err);
        res.status(500).send(err);
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Route to delete a story by ID
app.delete('/deleteStory/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedStory = await Story.findByIdAndDelete(id);
        if (!deletedStory) {
            return res.status(404).json({ message: 'Story not found' });
        }
        return res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
        console.error('Error deleting story:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
