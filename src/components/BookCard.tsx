import React, { useState } from "react";
import Book from "../models/Book";

function BookCard(book:Book){
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <section className="card card_small">
                <img src={book.info.imageUrl} alt={book.info.title} />
                <h2>{book.info.title}</h2>
                <h3>{book.info.authors.join(', ')}</h3>
                <span onClick={() => setIsOpen(true)}>More</span>
                <button>Change the list</button>
                <span>Remove</span>
            </section>

            {isOpen && ( // Якщо isOpen true, показати модальне вікно
                <div className="modal">
                    <section className="card card_big">
                        <span className="close" onClick={() => setIsOpen(false)}>&times;</span>
                        <img src={book.info.imageUrl} alt={book.info.title} />
                        <h2>{book.info.title}</h2>
                        <h3>{book.info.authors.join(', ')}</h3>
                        <p>{book.info.genres.join(', ')}</p>
                    </section>
                </div>
            )}
        </>
    );
}