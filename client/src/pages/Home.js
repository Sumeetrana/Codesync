import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("Created a new room");
  }

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      }
    });
  }

  const handleEnterPress = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  }

  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <img className='homePageLogo' src="/code-sync.png" alt="code-sync logo" />
        <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
        <div className='inputGroup'>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className='inputBox'
            placeholder='ROOM ID'
            onKeyUp={handleEnterPress}
          />
          <input
            type="text"
            value={username}
            className='inputBox'
            placeholder='USERNAME'
            onKeyUp={handleEnterPress}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className='btn joinBtn' onClick={joinRoom}>Join</button>
          <span className='createInfo'>
            If you don't have an invite then create &nbsp;
            <a href="#" onClick={createNewRoom} className='createNewBtn'>New room</a>
          </span>
        </div>
      </div>
      <footer>
        <h4>Built with 💛 &nbsp;by <span>Sumeet Rana</span></h4>
      </footer>
    </div>
  );
};

export default Home;