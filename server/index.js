const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));

mongoose.connect('mongodb://127.0.0.1:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    name: String,
    age: {
        type: Number,
        min: [1, 'Age must be a positive number']
    },
    city: String
});

const User = mongoose.model('User', userSchema);

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const variable = await User.findByIdAndDelete(id);
        
        if (!variable) {
            return res.status(404).json({ message: "User not found" });
        }

        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post("/users", async (req, res) => {
    try {
        const { name, age, city } = req.body;

        if (!name || !age || !city) {
            return res.status(400).send({ message: "All Fields Required" });
        }

        if (age <= 0) {
            return res.status(400).send({ message: "Age must be a positive number." });
        }

        const newUser = new User({ name, age, city });
        await newUser.save();
        res.json({ message: "User Detail added successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.patch("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, city } = req.body;

        if (!name || !age || !city) {
            return res.status(400).send({ message: "All Fields Required" });
        }

        if (age <= 0) {
            return res.status(400).send({ message: "Age must be a positive number." });
        }

        await User.findByIdAndUpdate(id, { name, age, city });
        res.json({ message: "User Detail updated successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
