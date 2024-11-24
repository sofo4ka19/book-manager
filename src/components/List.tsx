import React, { useState } from "react";
import BookCard from "./BookCard";
import BookList from "../models/BookList";
import {Book} from "../models/Book";
import { RecomendationList } from "../models/RecommendationList"; 
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Scrollbar, Navigation } from 'swiper/modules';
import BookApi from "../api/BookApi";
import { useAppStore } from "../models/Store";


function List({list}:{list:BookList|RecomendationList}){
    const [toggle, setToggle] = useState<boolean>(false);
    const [foundBooks, setFoundBooks] = useState<Book[]>([]); //type should be switched to BookList
    let author ="";
    let title = "";
    function add(){
        if(list instanceof RecomendationList){
            list.addBook
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
    function addBook(book:Book){
        useAppStore.getState().addBookToList(list,book);
        setToggle(false);
    }
    return(
        <>
        <div className="list">
            {list.bookArray.map((book) => (
                <BookCard book={book}></BookCard>
            ))}
            <button onClick={add} className="add">+</button>
        </div>

        {toggle && (
            <div className="modal">
                <div className="card">
                    <span className="close" onClick={() => {setToggle(false); setFoundBooks([])}}>&times;</span>
                    {foundBooks.length===0 && (
                        <form className="addCard" onSubmit={findBook}>
                            <h2>Add new book to the list</h2>
                            <div className="fields">
                                <label>Author</label>
                                <input onChange={(e) => author = e.target.value} type="text" />
                                <label>Title</label>
                                <input onChange={(e) => title = e.target.value} type="text" />
                            </div>
                            
                            <button type="submit" className="find">Find</button>
                        </form>
                    )}
                    {foundBooks.length>0 &&(
                        <>
                        <h2>Found books:</h2>
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
                        </>)}
                </div>
            </div>)}
        </>
    );
}

export default List;