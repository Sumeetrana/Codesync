import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import ACTIONS from '../Actions';
import { initSocket } from '../socket';
import Client from '../components/Client';
import Editor from '../components/Editor';

const EditorPage = () => {
  const socketRef = useRef(null);
  const [clients, setClients] = useState([
    {
      socketId: 1,
      username: 'Harry P'
    },
    {
      socketId: 2,
      username: 'Emma W'
    },
    {
      socketId: 3,
      username: 'Ron W'
    },
  ])

  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

    }
    init();
  }, []);

  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img src="/code-sync.png" alt="logo" className='logo-image' />
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {clients.map((client) => {
              return <Client username={client.username} key={client.socketId} />
            })}
          </div>
        </div>
        <button className='btn copyBtn'>Copy ROOM ID</button>
        <button className='btn leaveBtn'>Leave</button>
      </div>
      <div className="editorWrap">
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;