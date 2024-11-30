import React, { useState } from "react";
import {Book} from "../models/Book";
import Modal from "./Modal";

type BookCardProps = {
    book:Book;
    children?: React.ReactNode; // Кастомний контент (кнопки чи інші елементи)
  };

const BookCard: React.FC<BookCardProps> = ({ book, children }) => { //add myRate if exist
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
    <>
      <div className="bookCard">
        <img onClick={() => setIsOpen(true)} src={book.imageUrl || "../../public/bookCover_default"} alt={book.title} className="book-cover" />
        <h3>{book.title}</h3>
        {/* <p>{book.authors ? book.authors.join(', ') : "Unknown author"}</p> */}
        <div className="booCard-actions">{children}</div>
      </div>
      <Modal isOpen = {isOpen} onClose={() => setIsOpen(false)} title = {book.title}>
            {/* perhaps should add more info */}
            <img src={book.imageUrl} alt={book.title} />
            <h3>{book.authors ? book.authors.join(', ') : "Unknown author"}</h3>
            <p>{book.genres ? book.genres.join(', ') : "Unknown genre"}</p>
        </Modal>
      </>
    );
  };
  
export default BookCard;