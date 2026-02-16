require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, bio: user.bio, skills: user.skills } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/user/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, username, email, bio, skills FROM users WHERE id = ?', [req.user.id]);
        res.json(users[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/user/update', authenticateToken, async (req, res) => {
    const { bio, username, skills } = req.body;
    try {
        await db.execute('UPDATE users SET bio = ?, username = ?, skills = ? WHERE id = ?', [bio, username, skills, req.user.id]);
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/user/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const [users] = await db.execute('SELECT password FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = users[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, req.user.id]);

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/user/terminate', authenticateToken, async (req, res) => {
    const connection = await db.getConnection(); 
    try {
        await connection.beginTransaction();
        const userId = req.user.id;
        await connection.execute('DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?', [userId, userId]);
        await connection.execute('DELETE FROM friendships WHERE sender_id = ? OR receiver_id = ?', [userId, userId]);
        await connection.execute('DELETE FROM notifications WHERE user_id = ?', [userId]);
        await connection.execute('DELETE FROM snippets WHERE user_id = ?', [userId]);
        const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            throw new Error('User not found during termination');
        }

        await connection.commit();
        res.json({ message: 'Account and all related data purged successfully' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

app.get('/api/snippets', authenticateToken, async (req, res) => {
    try {
        const [snippets] = await db.execute('SELECT * FROM snippets WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(snippets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/snippets', authenticateToken, async (req, res) => {
    const { title, language, code, description } = req.body;
    try {
        await db.execute(
            'INSERT INTO snippets (user_id, title, language, code, description) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, title, language, code, description]
        );
        res.status(201).json({ message: 'Snippet saved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/snippets/:id', authenticateToken, async (req, res) => {
    try {
        await db.execute('DELETE FROM snippets WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Snippet deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users/search', authenticateToken, async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);
    try {
        const [users] = await db.execute(
            'SELECT id, username, skills FROM users WHERE username LIKE ? AND id != ? LIMIT 5', 
            [`%${q}%`, req.user.id]
        );
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, username, bio, skills, created_at FROM users WHERE id = ?', 
            [req.params.id]
        );
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });

        const [snippets] = await db.execute(
            'SELECT * FROM snippets WHERE user_id = ? ORDER BY created_at DESC', 
            [req.params.id]
        );
        res.json({ user: users[0], snippets });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/friends/request', authenticateToken, async (req, res) => {
    const { receiver_id } = req.body;
    try {
        const [exists] = await db.execute(
            'SELECT * FROM friendships WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)',
            [req.user.id, receiver_id, receiver_id, req.user.id]
        );
        if (exists.length > 0) return res.status(400).json({ error: 'Request already exists' });

        await db.execute('INSERT INTO friendships (sender_id, receiver_id) VALUES (?, ?)', [req.user.id, receiver_id]);
        
        await db.execute(
            'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
            [receiver_id, 'friend_request', `${req.user.username} sent you a friend request!`]
        );
        res.json({ message: 'Request sent!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/friends', authenticateToken, async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id, u.username, u.skills, f.status, f.sender_id, f.receiver_id
            FROM friendships f
            JOIN users u ON (u.id = f.sender_id OR u.id = f.receiver_id)
            WHERE (f.sender_id = ? OR f.receiver_id = ?)
            AND u.id != ?
        `;
        const [rows] = await db.execute(query, [req.user.id, req.user.id, req.user.id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/friends/accept', authenticateToken, async (req, res) => {
    const { sender_id } = req.body;
    try {
        await db.execute(
            'UPDATE friendships SET status = "accepted" WHERE sender_id = ? AND receiver_id = ?',
            [sender_id, req.user.id]
        );
        await db.execute(
            'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
            [sender_id, 'friend_accept', `${req.user.username} accepted your friend request!`]
        );
        res.json({ message: 'Friendship accepted!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/friends/:friendId', authenticateToken, async (req, res) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM friendships WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)',
            [req.user.id, req.params.friendId, req.params.friendId, req.user.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Connection not found' });
        res.json({ message: 'Removed' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const [notifs] = await db.execute(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', 
            [req.user.id]
        );
        res.json(notifs);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
    try {
        await db.execute('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Marked as read' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/notifications/read-all', authenticateToken, async (req, res) => {
    try {
        await db.execute('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [req.user.id]);
        res.json({ message: 'All marked as read' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/messages/:friendId', authenticateToken, async (req, res) => {
    try {
        const [msgs] = await db.execute(
            'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC',
            [req.user.id, req.params.friendId, req.params.friendId, req.user.id]
        );
        res.json(msgs);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
    const { receiver_id, content } = req.body;
    try {
        await db.execute(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
            [req.user.id, receiver_id, content]
        );
        await db.execute(
            'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
            [receiver_id, 'info', `New message from ${req.user.username}`]
        );
        res.json({ message: 'Sent' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));