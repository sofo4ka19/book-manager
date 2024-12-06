import React, { useState } from "react";
import {Book} from "../models/Book";
import Modal from "./Modal";

type BookCardProps = {
    book:Book;
    children?: React.ReactNode; // Кастомний контент (кнопки чи інші елементи)
  };

const BookCard: React.FC<BookCardProps> = ({ book, children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
    <>
      <div className="bookCard">
        <img onClick={() => setIsOpen(true)} src={book.imageUrl || "../../public/bookCover_default"} alt={book.title} className="book-cover" />
        <h3 className="bookTitle">{book.title}</h3>
        <div className="booCard-actions">{children}</div>
      </div>
      <Modal isOpen = {isOpen} onClose={() => setIsOpen(false)} title = "Book info">
            {/* perhaps should add more info */}
            <div className="bookCard_big">
              <img src={book.imageUrl} alt={book.title} />
              <div className="info">
                <h3>{book.title}</h3>
                <p>{book.authors ? book.authors.join(', ') : "Unknown author"}</p>
                <p><br/>Genre: {book.genres ? book.genres.join(', ') : "Unknown genre"}</p>
                {book.isbn && <p>ISBN: {book.isbn}</p>}
                {book.rate && <p>Rating: {book.rate}</p>}
                {book.myRate && <p>My rate: {book.myRate}</p>}
              </div>
            </div>
        </Modal>
      </>
    );
  };
  
export default BookCard;