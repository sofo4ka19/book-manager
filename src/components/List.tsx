import React, { useState } from "react";
import BookCard from "./BookCard";
import {Book} from "../models/Book";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Scrollbar, Navigation } from 'swiper/modules';
import BookApi from "../api/BookApi";
import { useAppStore } from "../store/Store";
import Modal from "./Modal";


function List(){
    const [toggle, setToggle] = useState<boolean>(false);
    const [foundBooks, setFoundBooks] = useState<Book[]>([]); //type should be switched to BookList
    let author ="";
    let title = "";
    const store = useAppStore();
    function add(){ //to change
        if(store.currentSelectedList === "Recommendations"){
            //list.addBook
        }
        else{
            setToggle(true);
        }
    } 

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
        await useAppStore.getState().addBookToList(book);
        setToggle(false);
    }
    // needs implementation
    function addToList(){

    }
    function changeTheList(){

    }
    function removeFromList(){

    }
    return(
        <>
        <div className="list">
            {store.getBooksOfCurrentList().map((book) => (
                <BookCard book={book}>
                    {(store.currentSelectedList === "Recommendations") &&
                        <button onClick={addToList}>Add</button>
                    }
                    {!(store.currentSelectedList === "Recommendations") &&(
                        <>
                        <button onClick={changeTheList}>Change</button>
                        <span onClick={removeFromList}>Remove</span>
                        </>
                    )}
                </BookCard>
            ))}
            <button onClick={add} className="add">+</button>
        </div>
        <Modal isOpen={toggle} onClose={() => setToggle(false)} title={(foundBooks.length==0)? "Add new book to the list": "Found books:"}>
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
                <Swiper
                slidesPerView={3}
                spaceBetween={30}
                slidesPerGroup={3}
                pagination={{
                    clickable: true,
                }}
                scrollbar={{
                    hide: true,
                  }}
                  navigation={true}
                modules={[Pagination, Scrollbar, Navigation]}
                className="mySwiper"
            >
                {foundBooks.map((book) => (
                    <SwiperSlide>
                        <BookCard book={book}></BookCard>
                        <button onClick={() => addBook(book)}>Add</button>
                    </SwiperSlide>
                 ))}
            </Swiper>
            )}
        </Modal>
        </>
    );
}

export default List;