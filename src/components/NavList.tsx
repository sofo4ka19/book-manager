import React from "react";

function NavList({selected, activeList, listNames}:{selected: (listName:string) => void, activeList:string, listNames: string[]}){

  return (
    <nav>
            {listNames.map((name) => (
                <ul 
                    key={name} 
                    className={`listName ${activeList === name ? "active" : ""}`} 
                    onClick={() => selected(name)}
                >
                    {name}
                </ul>
            ))}
        </nav>
  );
}
    // return(
    //     <nav>
    //         <ul className="listName" onClick={() => selected("recommendations")}>Recommendations</ul>
    //         <ul className="listName" onClick={() => selected("wishlist")}>Wishlist</ul>
    //         <ul className="listName" onClick={() => selected("reading")}>Reading</ul>
    //         <ul className="listName" onClick={() => selected("finished")}>Finished</ul>
    //     </nav>
    // )
//}

export default NavList;