import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { initDatabase, getAllMembers, addMember, getMemberById, updateMember, deleteMember } from './db.js';
import { Parser } from 'json2csv';
import fs from 'fs';


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.resolve('public')));

// to fetch index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'));
});

let members = [];
let currentId = 1;

// to get all members
app.get('/api/members', async (req, res) => {
    const members = await getAllMembers();
    res.status(200).json(members);
});

// to add a new member
app.post('/api/members', async (req, res) => {
    const newMember = await addMember(req.body);
    res.status(200).json(newMember);
});

// to get a member by ID
app.get('/api/members/:id', async (req, res) => {
    const member = await getMemberById(req.params.id);
    if (member) {
        res.status(200).json(member);
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
});

// to update a member
app.put('/api/members/:id', async (req, res) => {
    const updatedMember = await updateMember(req.params.id, req.body);
    res.status(200).json(updatedMember);
});

// to delete a member
app.delete('/api/members/:id', async (req, res) => {
    const deletedMember = await deleteMember(req.params.id);
    res.status(200).json(deletedMember);
});

// to start the server
app.listen(PORT, async () => {
    await initDatabase(); // Initialize the database
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;