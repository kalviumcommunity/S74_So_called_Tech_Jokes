import express from 'express';
import db from './db.js'; // Import the database connection

const app = express();
app.use(express.json());

app.get('/entities/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [entities] = await db.query("SELECT * FROM entities WHERE created_by = ?", [userId]);
        res.json(entities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching entities', error });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
