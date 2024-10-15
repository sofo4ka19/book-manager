import React, { useState } from "react";
import BookCard from "./BookCard";
import BookList from "../models/BookList";
import Book from "../models/Book";
import { RecomendationList } from "../models/RecommendationList"; 
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Scrollbar, Navigation } from 'swiper/modules';
const apiKey = import.meta.env.REACT_APP_GOOGLE_BOOKS_API_KEY;


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
        e.preventDefault;
        if(author==="" && title===""){
            alert("Please enter either an author or a title.");
            return;
        }//error modal
        else{ //this should be made separate because we have it also used in RecommendationList class
            const params = [];
            if(author) params.push(`inauthor:${author}`);
            if(title) params.push(`intitle:${title}`);
            const query = params.join('+');
            const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&&printType=books&key=${apiKey}`;
            const response = await fetch(url);
            if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
             }
            const data = await response.json();
            const books = data.items.map((item: any) => new Book(
             item.volumeInfo.title,
             item.volumeInfo.authors /*? item.volumeInfo.authors.join(', ') :*/ || "Unknown Author", // З'єднуємо авторів у рядок
             item.volumeInfo.categories /*? item.volumeInfo.categories.join(', ') :*/ || "Unknown Genre", // З'єднуємо жанри у рядок
             item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers[0].identifier : "Unknown ISBN",
             item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : "/bookCover_default.png",
             item.volumeInfo.averageRating || 0,
             item.volumeInfo.language || "Unknown Language"
            ));
            //should be optimized
            
            if(books.length<=0){
                alert("No books were found")
                setToggle(false);
                return;
            }
            setFoundBooks(books); //need func to check if it is in other lists
        }
    }
    function addBook(book:Book){
        list.addBook(book);
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

        (toggle &&
            <div className="modal">
                <div className="card">
                    <span className="close" onClick={() => {setToggle(false); setFoundBooks([])}}>&times;</span>
                    {foundBooks.length===0 && (
                        <form className="addCard" onSubmit={findBook}>
                            <h2>Add new book to the list</h2>
                            <label>Author</label>
                            <input onChange={(e) => author = e.target.value} type="text" />
                            <label>Title</label>
                            <input onChange={(e) => title = e.target.value} type="text" />
                            <button type="submit" className="find">Find</button>
                        </form>
                    )}
                    {foundBooks.length>0 &&(
                        <>
                        <h2>Found books:</h2>
                        <Swiper
                            slidesPerView={3}
                            spaceBetween={30}
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
                        </>
                    )}
                </div>
            </div>
        )
        </>
    );
}

export default List;