import { useState } from 'react'
import './App.css'
import Profile from './components/Profile'
import User from './models/User';
import NavList from './components/NavList';
import List from './components/List';

function App() {
  const user = new User(
    "Sofiia Broiako", "anonym@knu.ua", "Student at Taras Shevchenko National University of Kyiv" 
  );
  const[list, setList] = useState(user.lists[0]);
  const [activeList, setActiveList] = useState<string>("Wishlist");
  const listNames = ["Recommendations", "Wishlist", "Reading", "Finished"];
  function transition(name:string){
    const index = listNames.indexOf(name);
    if (index !== -1) {
      const updatedList = user.lists[index];
      setList(updatedList);
      setActiveList(name);
    }
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
