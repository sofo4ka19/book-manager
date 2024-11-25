import React, { useState } from "react";
import {Book} from "../models/Book";
import Modal from "./Modal";

function BookCard({book} :{book:Book}){
    const [isOpen, setIsOpen] = useState<boolean>(false);
// need functions for remove and change the list
    return (
        <>
            <section className="card card_small">
                <img src={book.imageUrl} alt={book.title} />
                <h2>{book.title}</h2>
                <h3>{book.authors.join(', ')}</h3>
                <span onClick={() => setIsOpen(true)}>More</span>
                <button>Change the list</button> 
                <span>Remove</span>
            </section> 
            <Modal isOpen = {isOpen} onClose={() => setIsOpen(false)} title = {book.title}>
                {/* perhaps should add more info */}
                <img src={book.imageUrl} alt={book.title} />
                <h3>{book.authors.join(', ')}</h3>
                <p>{book.genres.join(', ')}</p>
            </Modal>
            {/* {isOpen && ( 
                <div className="modal">
                    <section className="card card_big">
                        <span className="close" onClick={() => setIsOpen(false)}>&times;</span>
                        <img src={book.imageUrl} alt={book.title} />
                        <h2>{book.title}</h2>
                        <h3>{book.authors.join(', ')}</h3>
                        <p>{book.genres.join(', ')}</p>
                    </section>
                </div>
            )} */}
        </>
    );
}

export default BookCard;