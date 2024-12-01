import { useState } from "react";
import { useAppStore, TypeOfList } from "../store/Store";
import { Book } from "../models/Book";
import Modal from "./Modal";
import BookApi from "../api/BookApi";
import BookCard from "./BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import { v4 as uuidv4 } from 'uuid';

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
        <nav>
        <ul>
            {listNames.map((name) => (
                <li 
                    key={name} 
                    className={`listName ${store.currentSelectedList === name ? "active" : ""}`} 
                    onClick={() => store.setCurrentList(name as TypeOfList)}
                >
                    {name}
                </li>
            ))}
        </ul>
        {!(store.currentSelectedList === "Recommendations") && <button onClick={() => setToggle(true)} className="add">+</button>}
        
        </nav>
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
                    <button type="submit">Search</button> 
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
                navigation
                modules={[Pagination, Navigation]}
                className="mySwiper" id="swiperWork"
            >{foundBooks.map((book) => (
                <SwiperSlide key={uuidv4()}>
                <div>
                    hey
                </div>
                </SwiperSlide>
            ))}</Swiper>
            )}
                
            </Modal>
        </>
    );
}

export default NavList;