const express = require("express");
const router = express.Router();

let items = []; // Temporary in-memory storage
let idCounter = 1;

// **CREATE**: Add a new item
router.post("/", (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: "Name and description are required" });
    }
    const newItem = { id: idCounter++, name, description };
    items.push(newItem);
    res.status(201).json(newItem);
});

// **READ**: Get all items
router.get("/", (req, res) => {
    res.json(items);
});

// **READ**: Get a single item by ID
router.get("/:id", (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
});

// **UPDATE**: Update an item by ID
router.put("/:id", (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }

    const { name, description } = req.body;
    if (name) item.name = name;
    if (description) item.description = description;

    res.json(item);
});

// **DELETE**: Remove an item by ID
router.delete("/:id", (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
    }

    items.splice(itemIndex, 1);
    res.json({ message: "Item deleted successfully" });
});

module.exports = router;
