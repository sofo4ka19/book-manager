import { useState } from "react";
import BookCard from "./BookCard";
import {Book} from "../models/Book";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Scrollbar, Navigation } from 'swiper/modules';
import { useAppStore } from "../store/Store";
import Modal from "./Modal";
import { TypeOfList } from "../store/Store";
import BasicInput from "./BasicInput";


function List(){
    const listNames = ["Wishlist", "Reading", "Finished"];
    const [toggle2, setToggle2] = useState<boolean>(false);
    const [toggle3, setToggle3] = useState<boolean>(false);
    const [mark, setMark] = useState<number|"">("");
    const [activeBook, setActiveBook] = useState<Book|null>(null);
    const store = useAppStore();
    
    
    async function changeTheList(toList:string){
        if(!activeBook){
            return; //error
        }
        if(!(store.currentSelectedList === "Recommendations")){
            await store.removeBookFromList(activeBook.id, activeBook.myRate);
            console.log(activeBook.myRate)
        }
        if(store.currentSelectedList=="Finished" && toList!="Finished"){
            delete activeBook.myRate;
        }
        store.setCurrentList(toList as TypeOfList)
        await store.addBookToList(activeBook);
        setActiveBook(null);
        setToggle2(false);
    }
    async function removeFromList(book:Book){
        await store.removeBookFromList(book.id, book.myRate);
    }
    function validateMark(value:string){
        const num = Number(value);
        if (num >= 0 && num <= 5) return num; // Correct value
        return ""; //uncorrect value
    }
    async function handleMark(){
        if(mark==""){
            alert("Please enter a valid mark between 0 and 5.");
            return;
        }
        if(activeBook) activeBook.myRate = mark;
        
        await changeTheList("Finished");
        setToggle3(false);
        setMark("");
    }
    return(
        <>
        <div className="list">
            {store.getBooksOfCurrentList().map((book) => (
                <BookCard book={book}>
                    {(store.currentSelectedList === "Recommendations") &&
                        <button onClick={() => {
                            setToggle2(true);
                            setActiveBook(book);
                            }}>Add</button>
                    }
                    {!(store.currentSelectedList === "Recommendations") &&(
                        <>
                        <button onClick={() => {
                            setToggle2(true);
                            setActiveBook(book);
                            }}>
                                Change</button>
                        <span onClick={() => {
                            removeFromList(book);
                            }}>Remove</span>
                        </>
                    )}
                </BookCard>
            ))}
        </div>
                {/* // needs to be set
            //     <Swiper
            //     slidesPerView={3}
            //     spaceBetween={30}
            //     slidesPerGroup={3}
            //     pagination={{
            //         clickable: true,
            //     }}
            //     scrollbar={{
            //         hide: true,
            //       }}
            //       navigation={true}
            //     modules={[Pagination, Scrollbar, Navigation]}
            //     className="mySwiper"
            // >
            //     {foundBooks.map((book) => (
            //         <SwiperSlide>
            //             <BookCard book={book}></BookCard>
            //             <button onClick={() => addBook(book)}>Add</button>
            //         </SwiperSlide>
            //      ))}
            // </Swiper> */}
        <Modal isOpen={toggle2} onClose={() => setToggle2(false)} title="Choose the list">
            {listNames.map((list) => (
                <span 
                    key={list} 
                    className={`listName ${store.currentSelectedList === list ? "hidden" : ""}`}
                    onClick={() => (list === "Finished")?(setToggle3(true)) : changeTheList(list)}
                >{list}</span>
            ))}
            {toggle3 && (
                <div>
                    <BasicInput type="number" placeholder="enter your mark from 0 to 5" value={mark} onChange={(e: any) => setMark(validateMark(e.target.value))}></BasicInput>
                    <button onClick={handleMark}>ok</button>
                </div>
                )}
        </Modal>
        </>
    );
}

export default List;