import React, { useState } from "react";
import BookCard from "./BookCard";
import BookList from "../models/BookList";
import { RecomendationList } from "../models/RecommendationList"; //?


function List({list}:{list:BookList|RecomendationList}){
    /*const [toggle, setToggle] = useState<boolean>(false);
    function add(){
        if(list instanceof RecomendationList){
            list.addBook
        }
        else{
            setToggle(true);
        }
    }*/
    return(
        <>
        <div className="list">
            {list.bookArray.map((book) => (
                <BookCard book={book}></BookCard>
            ))}
            {/* <button onClick={add} className="add">+</button> */}
        </div>

        
        </>
    );
}

export default List;