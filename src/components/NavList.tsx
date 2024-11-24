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

export default NavList;