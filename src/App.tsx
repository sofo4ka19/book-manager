import { useState } from 'react'
import './App.css'
import Profile from './components/Profile'
import User from './models/User';
import BookList from './models/BookList';
import { RecomendationList } from './models/RecommendationList';
import NavList from './components/NavList';
import List from './components/List';

function App() {
  const wishlist = new BookList();
  const reading = new BookList();
  const finished = new BookList();
  const user = new User(
    "anonymus", "anonym@knu.ua", "blablabla", wishlist, reading, finished, {} as RecomendationList, {authors: null, genre: null, language: ["en"] }, null
  );
  const recommends = new RecomendationList(user, null, null); //this logic should be changed
  user.recommends = recommends;
  const[list, setList] = useState(user.lists[0]);
  const [activeList, setActiveList] = useState<string>("Wishlist");
  const listNames = ["Recommendations", "Wishlist", "Reading", "Finished"];
  function transition(name:string){
    const index = listNames.indexOf(name);
    if (index !== -1) {
      setList(user.lists[index]);
      setActiveList(name);
    }
    // switch(name){
    //   case "recommendations": 
    //     setList(user.lists[3]);
    //     break;
    //   case "wishlist": 
    //     setList(user.lists[0]);
    //     break;
    //   case "reading": 
    //     setList(user.lists[1]);
    //     break;
    //   case "finished": 
    //     setList(user.lists[2]);

    // }
  }
  return (
    <>
      <Profile user={user}/>
      <NavList selected={transition} activeList={activeList} listNames={listNames} />
      <List list = {list} />
    </>
  )
}

export default App
