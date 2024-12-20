import { useState } from "react";
import BookCard from "./BookCard";
import {Book} from "../models/Book";
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
        setToggle3(false);
        if(!activeBook){
            alert("Book wasn't chosen. Try again") //do we need it?
            return;
        }
        try{
            await store.removeBookFromList(activeBook.id, activeBook.myRate);
            if(store.currentSelectedList=="Finished" && toList!="Finished"){
                delete activeBook.myRate;
            }
            setToggle2(false);
            store.setCurrentList(toList as TypeOfList)
            await store.addBookToList(activeBook);
        }catch(error){
            if(error instanceof Error){
                switch(error.message){
                    case "problem with removing":
                        alert("Sorry, something is wrong")
                        setToggle2(false)
                    break;
                    case "problem with adding":
                        //perhaps should be changed
                        alert("Sorry, something is wrong, book was deleted from the list, try to add it manually")
                }
            }
        }
        setActiveBook(null);
    }
    async function removeFromList(book:Book){
        try{
            await store.removeBookFromList(book.id, book.myRate);
        }catch(error){
            alert(error + ", try again")
        }
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
            {store.getBooksOfCurrentList().length==0 && (
                <p className="emptyList">{(store.currentSelectedList === "Recommendations")?"Add book to finished list to get recommendations":"This list is empty, click on \"+\" to add the book"}</p>
            )}
        </div> 
        <Modal isOpen={toggle2} onClose={() => {setToggle2(false)
            setToggle3(false)}
        } title="Choose the list">
            <div className="changeTheList">
            {listNames.map((list) => (
                <span 
                    key={list} 
                    className={`listName ${store.currentSelectedList === list ? "hidden" : ""}`}
                    onClick={() => (list === "Finished")?(setToggle3(true)) : changeTheList(list)}
                >{list}</span>
            ))}
            {toggle3 && (
                <div className="setMark">
                    <BasicInput type="number" placeholder="enter your mark from 0 to 5" value={mark} onChange={(e: any) => setMark(validateMark(e.target.value))}></BasicInput>
                    <button onClick={handleMark}>ok</button>
                </div>
                )}
            </div>
            
        </Modal>
        </>
    );
}

export default List;