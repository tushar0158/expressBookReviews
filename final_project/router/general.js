const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');

const public_users = express.Router();

// Get all books
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(
            'https://openlibrary.org/subjects/fiction.json?limit=10'
        );

        res.json(response.data.works);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error retrieving books' });
    }
});

// Get book by ISBN / local book ID
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        const response = await axios.get(
            'https://openlibrary.org/search.json',
            {
                params: {
                    title: book.title
                }
            }
        );

        res.json(book);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Error retrieving book'
        });
    }
});

// Get books by author using Axios
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;

        const response = await axios.get(
            'https://openlibrary.org/search.json',
            {
                params: {
                    author: author
                }
            }
        );

        res.json(response.data.docs);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Error retrieving books by author'
        });
    }
});

// Get books by title using Axios
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;

        const response = await axios.get(
            'https://openlibrary.org/search.json',
            {
                params: {
                    title: title
                }
            }
        );

        res.json(response.data.docs);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Error retrieving books by title'
        });
    }
});

// Get book reviews
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.json(book.reviews || {});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Error retrieving reviews'
        });
    }
});

module.exports.general = public_users;