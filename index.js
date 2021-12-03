const express = require('express');
const Lessons = require('./models/dbHelpers');

const server = express();

server.use(express.json());

const PORT = 5000;

server.get("", (req, res) => {
    res.json({ message: "Hello World!" });
});

server.get("/api/lessons", (req, res) => {
    Lessons.find()
        .then(lessons => {
            res.status(200).json(lessons);
        })
        .catch(error => {
            res.status(500).json({ message: "Unable to retrieve lessons" });
        });
});

server.get("/api/lessons/:id", (req, res) => {
    const { id } = req.params;
    Lessons.findById(id)
        .then(lesson => {
            if (lesson) {
                res.status(200).json(lesson);
            } else {
                res.status(404).json({ message: "Record not found" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Unable to retrieve lesson" });
        })
});

server.post("/api/lessons", (req, res) => {
    Lessons.add(req.body)
        .then(lesson => {
            res.status(200).json(lesson);
        })
        .catch(error => {
            res.status(500).json({ message: "cannot add lesson" });
        });
});

server.delete("/api/lessons/:id", (req, res) => {
    const { id } = req.params;

    Lessons.remove(id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "Successfully deleted" });
            } else {
                res.status(404).json({ message: "Unable to locate record" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Unable to delete" });
        })
});

server.patch("/api/lessons/:id", (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    Lessons.update(id, changes)
        .then(lesson => {
            if (lesson) {
                res.status(200).json(lesson);
            } else {
                res.status(404).json({ message: 'Record not found' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Error updating record' });
        });
});

server.post("/api/lessons/:id/messages", (req, res) => {
    const { id } = req.params;
    const msg = req.body;

    if (!msg.lesson_id) {
        msg["lesson_id"] = parseInt(id, 10);
    }

    Lessons.findById(id)
        .then(lesson => {
            if (!lesson) {
                res
                    .status(404)
                    .json({ message: "Invalid id" });
            }
            // Check for all required fields
            if (!msg.sender || !msg.text) {
                res
                    .status(400)
                    .json({ message: "Must provide both Sender and Text values" });
            }

            Lessons.addMessage(msg, id)
                .then(message => {
                    if (message) {
                        res.status(200).json(message);
                    }
                })
                .catch(error => {
                    res.status(500).json({ message: "Failed to add message" });
                })
        })
        .catch(error => {
            res.status(500).json({ message: "Error finding lesson" })
        });
});

server.listen(PORT, () => {
    console.log(`\n*** Server running on port ${PORT} ***\n`);
});