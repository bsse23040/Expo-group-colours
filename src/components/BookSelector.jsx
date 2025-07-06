import './BookSelector.css';
import React, { useState } from 'react';

export default function BookSelector({ books, setBooks }) {
  const [newBook, setNewBook] = useState('');

  const handleAddBook = () => {
    const trimmed = newBook.trim();
    if (trimmed && !books.includes(trimmed)) {
      setBooks([...books, trimmed]);
      setNewBook('');
    } else {
      alert("Enter a unique book name.");
    }
  };

  const handleRemoveBook = (bookToRemove) => {
    const updatedBooks = books.filter(book => book !== bookToRemove);
    setBooks(updatedBooks);
  };

  return (
    <div className="book-selector-container">
      <h2 className="book-selector-title">📖 Select Books</h2>
      <div className="book-input-row">
        <input
          type="text"
          value={newBook}
          onChange={(e) => setNewBook(e.target.value)}
          placeholder="Add new book"
          className="book-input-field"
        />
        <button
          onClick={handleAddBook}
          className="book-add-button"
        >
          Add
        </button>
      </div>

      <ul className="book-list">
        {books.map((book, index) => (
          <li key={index} className="book-list-item">
            <span>{book}</span>
            <button
              onClick={() => handleRemoveBook(book)}
              className="book-remove-button"
              title="Remove"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
