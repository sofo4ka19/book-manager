import Profile from './Profile'
import NavList from './NavList';
import List from './List';
import { useAppStore } from '../store/Store';
import { useNavigate } from 'react-router-dom';

function Home() {
  const user = useAppStore((state) => state.user);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return; 
  }

  return (
    <div className='home'>
      <Profile />
      <NavList  />
      <List />
    </div>
  )
}

export default Home