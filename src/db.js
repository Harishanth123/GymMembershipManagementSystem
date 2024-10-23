import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
    filename: './members.db',
    driver: sqlite3.Database
});


async function initDatabase() {
    const db = await dbPromise;
    await db.exec(`
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            phone TEXT,
            email TEXT,
            membershipType TEXT
        )
    `);
}

async function getAllMembers() {
    const db = await dbPromise;
    return await db.all('SELECT * FROM members');
}

async function addMember(member) {
    const db = await dbPromise;
    const { name, age, gender, phone, email, membershipType } = member;
    const result = await db.run('INSERT INTO members (name, age, gender, phone, email, membershipType) VALUES (?, ?, ?, ?, ?, ?)', 
                                 [name, age, gender, phone, email, membershipType]);
    return { id: result.lastID, ...member };
}

async function getMemberById(id) {
    const db = await dbPromise;
    return await db.get('SELECT * FROM members WHERE id = ?', [id]);
}

async function updateMember(id, member) {
    const db = await dbPromise;
    await db.run('UPDATE members SET name = ?, age = ?, gender = ?, phone = ?, email = ?, membershipType = ? WHERE id = ?', 
                 [member.name, member.age, member.gender, member.phone, member.email, member.membershipType, id]);
    return { id, ...member };
}

async function deleteMember(id) {
    const db = await dbPromise;
    await db.run('DELETE FROM members WHERE id = ?', [id]);
    return { id };
}

export { initDatabase, getAllMembers, addMember, getMemberById, updateMember, deleteMember };
