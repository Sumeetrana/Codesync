import toast from 'react-hot-toast';
import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';

import ACTIONS from '../Actions';
import { initSocket } from '../socket';
import Client from '../components/Client';
import Editor from '../components/Editor';

const EditorPage = () => {
  const socketRef = useRef(null);
  const [clients, setClients] = useState([]);

  const { roomId } = useParams();
  const location = useLocation();
  const reactNavigator = useNavigate();

  if (!location.state) {
    <Navigate to="/" />
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      // WS error handling
      socketRef.current.on("connect_error", (err) => handleErrors(err))
      socketRef.current.on("connect_failed", (err) => handleErrors(err))

      function handleErrors(e) {
        console.log("Socket error: ", e);
        toast.error('Socket connection failed, try again later');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username
      })

      // listening joined event
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (location.state?.username !== username) {
          toast.success(`${username} joined`);
        }
        setClients(clients);
      })

      // listening disconnected event
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter(client => socketId !== client.socketId)
        })
      })
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