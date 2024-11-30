import { useState } from "react";
import { useAppStore, TypeOfList } from "../store/Store";
import { Book } from "../models/Book";
import Modal from "./Modal";
import BookApi from "../api/BookApi";
import BookCard from "./BookCard";

function NavList(){
    const listNames = ["Recommendations", "Wishlist", "Reading", "Finished"];
    const [toggle, setToggle] = useState<boolean>(false);
    const [foundBooks, setFoundBooks] = useState<Book[]>([]); 
    let author ="";
    let title = "";
    const store = useAppStore()
    async function findBook(e: React.FormEvent){
        e.preventDefault();
        if(author==="" && title===""){
            alert("Please enter either an author or a title.");
            return;
        }//error modal
        else{ 
            let authors = (author!="")? author.split(', '):null;
            const books = await BookApi.searchBooks(title, authors, null);
            if(books.length<=0){
                alert("No books were found")
                setToggle(false);
                return;
            }
            setFoundBooks(books); //need func to check if it is in other lists
        }
    }
    async function addBook(book:Book){
        await store.addBookToList(book);
        setToggle(false);
        setFoundBooks([]);
        console.log(store.user)
    }
    return (
        <>
        <section className="listBar">
        <nav>
            {listNames.map((name) => (
                <ul 
                    key={name} 
                    className={`listName ${store.currentSelectedList === name ? "active" : ""}`} 
                    onClick={() => store.setCurrentList(name as TypeOfList)}
                >
                    {name}
                </ul>
            ))}
        </nav>
        {!(store.currentSelectedList === "Recommendations") && <button onClick={() => setToggle(true)} className="add">+</button>}
        
        </section>
        <Modal isOpen={toggle} onClose={() => {setToggle(false) 
            setFoundBooks([])}} title={(foundBooks.length==0)? "Add new book to the list": "Found books:"}>
            {foundBooks.length===0 && (
                <form className="addCard" onSubmit={findBook}>
                    <div className="fields">
                                {/* perhaps should make it used useState */}
                                <label>Author</label>
                                <input onChange={(e) => author = e.target.value} type="text" />
                                <label>Title</label>
                                <input onChange={(e) => title = e.target.value} type="text" />
                            </div>
                            {/* perhaps should be transformed to prop */}
                            <button type="submit" className="find">Find</button> 
                </form>
            )}
            {foundBooks.length>0 &&(
                foundBooks.map((book) => (
                    <div>
                        <BookCard book={book}>
                            <button style={{marginRight: '30px'}} onClick={() => addBook(book)}>Add</button>
                        </BookCard>
                    </div>
                )))}
                </Modal>
        </>
    );
}

export default NavList;