import { useAppStore, TypeOfList } from "../store/Store";

function NavList(){
    const listNames = ["Recommendations", "Wishlist", "Reading", "Finished"];
    const store = useAppStore()
    return (
        <nav>
            {listNames.map((name) => (
                <ul 
                    key={name} 
                    className={`listName ${store.currentSelectedList === name ? "active" : ""}`} 
                    onClick={() => store.setCurrentList(name as TypeOfList)}
                >
                    {name}
                </ul>
            ))}
        </nav>
    );
}

export default NavList;