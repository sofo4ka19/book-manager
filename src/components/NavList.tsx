import React from "react";
import BookList from "../models/BookList";

function NavList({selected}:{selected: (listName:string) => BookList}){
    return(
        <nav>
            <ul className="listName" onClick={() => selected("recommendations")}>Recommendations</ul>
            <ul className="listName" onClick={() => selected("wishlist")}>Wishlist</ul>
            <ul className="listName" onClick={() => selected("reading")}>Reading</ul>
            <ul className="listName" onClick={() => selected("finished")}>Finished</ul>
        </nav>
    )
}

export default NavList;