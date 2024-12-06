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
import { Navigation, Pagination } from "swiper/modules";
import BasicInput from "./BasicInput";
import BookList from "../models/BookList";

function NavList(){
    const listNames = ["Recommendations", "Wishlist", "Reading", "Finished"];
    const [toggle, setToggle] = useState<boolean>(false);
    const [foundBooks, setFoundBooks] = useState<Book[]>([]); 
    const [mark, setMark] = useState<string>("");
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [author, setAuthor] =useState<string>("");
    const [title, setTitle] = useState<string>("");
    const store = useAppStore()
    async function findBook(e: React.FormEvent){
        e.preventDefault();
        if(author==="" && title===""){
            alert("Please enter either an author or a title.");
            return;
        }//error modal
        else{ 
            let authors = (author!="")? author.split(', '):null;
            const books = new BookList();
            try{
                books.bookArray = await BookApi.searchBooks(title, authors, null);
                if(books.list.length<=0){
                    alert("No books were found")
                    setToggle(false);
                    return;
                }
                books.filterByAnotherLists(store.wishlist, store.currentlyReadingList, store.finishedList)
                if(books.list.length<=0){
                    alert("This book was added to one of your lists")
                    setToggle(false);
                    return;
                }
                setFoundBooks(books.list); 
            }catch(error){
                alert(error);
            }
        }
    }
    async function addBook(book:Book){ //needs implementing mark for finished
        if(store.currentSelectedList==="Finished"){
            const numericMark = parseFloat(mark);

            if (isNaN(numericMark) || numericMark < 0 || numericMark > 5) {
                alert("Please provide a rating between 0 and 5.");
                return;
            }
            book.myRate = numericMark;
        }
        try{
            await store.addBookToList(book);
        }catch(error){
            alert(error + ", try again")
        }
        setToggle(false);
        setFoundBooks([]);
        setMark("");
        setSelectedBook(null)
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
                                <input onChange={(e) => setAuthor(e.target.value)} type="text" />
                                <label>Title</label>
                                <input onChange={(e) => setTitle(e.target.value)} type="text" />
                    </div>
                    {/* perhaps should be transformed to prop */}
                    <button type="submit">Search</button> 
                </form>
            )}
            {foundBooks.length>0 && !selectedBook &&(
                <Swiper 
                slidesPerView={(foundBooks.length<3)?foundBooks.length:3}
                spaceBetween={30}
                slidesPerGroup={3}
                pagination={{
                  clickable: true,
                }}
                navigation
                modules={[Pagination, Navigation]}
                className="mySwiper" id="swiperWork"
            >{foundBooks.map((book) => (
                <SwiperSlide>
                <BookCard book={book}>
                    <button onClick={() => (store.currentSelectedList==="Finished")?setSelectedBook(book): addBook(book)}>Add</button>
                </BookCard>
                </SwiperSlide>
            ))}</Swiper>
            )}
            {selectedBook && store.currentSelectedList === "Finished" && (
                    <div className="setMark_column">
                        <label>Enter your mark to this book</label>
                        <BasicInput value={mark} type="number" placeholder="enter your mark from 0 to 5" onChange={(e: any) => setMark((e.target.value))}/>
                        <button onClick={() => addBook(selectedBook)}>Add to Finished</button>
                    </div>
                )}
                
            </Modal>
            
        </>
    );
}

export default NavList;