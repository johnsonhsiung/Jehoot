import Image from 'next/image';
import Head from 'next/head';
import OtpInput from 'react-otp-input';
import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { useQuery } from 'react-query'
import { API_URL } from '../../constants';
const axios = require('axios').default;



export default function Room() {

  const [admin, setAdmin] = useState(false);
  const [adminGameCreated, setAdminGameCreated] = useState(false);
  const [username, setUsername] = useState('')
  const [gamePin, setGamePin] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [gameBoard, setGameBoard] = useState(null);

  useEffect(() => {
    setGamePin(localStorage.getItem('gamePin'))
    setAdmin(localStorage.getItem('admin'))
    setGameId(localStorage.getItem('gameId'))
    setAdminGameCreated(localStorage.getItem('adminGameCreated'))
  }, [])


  const createGameAPI = async () => {
    return await axios.request({
      url: `${API_URL}/api/game/create`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { 'admin': username }
    })
      .then((response) => response.data)
  }

  const fetchGameBoardAPI = async (gameIdParam) => {
    return await axios.request({
      url: `${API_URL}/api/game/board?game_id=${gameIdParam}`,
      method: 'GET',
    })
      .then((response) => response.data)
  }

  const joinGameAPI = async () => {
    return await axios.request({
      url: `${API_URL}/api/game/join`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: {
        'username': username,
        'game_pin': gamePin
      }
    })
      .then((response) => response.data)
  }


  let polling = false;
  useEffect(() => {
    if (gameId !== null && !polling) {
      alert("init");
      setInterval(() => {
        try {
          let data = fetchGameBoardAPI(gameId);
          setGameBoard(data);
          setGamePin(data.)
          console.log(data);
        } catch (error) {
          alert("Unexpected Error in fetching gameboard, please contact your admin. ")
        }
      }, 1000);
    }
  }, gameId, []);


  // const { data: gameBoardResponse, refetch: refetchGameBoard, isLoading: gameBoardLoading } = useQuery(
  //   ['fetchGameBoard', gameId],
  //   async () => {
  //     const { data } = await axios({
  //       url: `${API_URL}/api/game/board/${gameId}`,
  //       method: 'GET',
  //     });
  //     return data;
  //   }, {
  //   refetchOnWindowFocus: false,
  //   enabled: false
  // });


  const handleCreateGame = async () => {
    if (!username) {
      return alert("Please enter a username to continue")
    }
    try {
      let data = await createGameAPI();
      setGameId(data.game_id);
      setAdminGameCreated(true);
      localStorage.setItem('adminGameCreated', true)
      localStorage.setItem('gameId', data.game_id)
    } catch (error) {
      alert(error)
    }
  }

  const handleJoinGame = async () => {
    if (!username) {
      return alert("Please enter a username to continue")
    }
    try {
      let data = await createGameAPI();
      setGameId(data.game_id);
      localStorage.setItem('adminGameCreated')
      localStorage.setItem('gameId', data.game_id)
    } catch (error) {
      alert(error)
    }
  }


  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      </Head>
      <div className="relative w-screen h-screen flex content-center items-center justify-center overflow-hidden" style={{ minHeight: '100vh', minHeight: '-webkit-fill-available' }}>
        <div className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: "url(/assets/jehoot-bg.svg)"
          }}>
          <span id="blackOverlay" className="w-full h-full absolute opacity-40 bg-black"></span>
        </div>
        <div className="container relative mx-auto h-full">
          <div className="items-center flex flex-wrap h-full">
            <div className="flex h-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className='flex flex-row h-full justify-center items-center'>
                <div className='flex flex-col'>

                  <div className='text-5xl font-bold text-white'>
                    {admin ? "Waiting for other players..." : "Game Manager"}
                  </div>

                      <div className='p-4 text-left'>
                  {gameBoard?.current_players?.map((player) => {
                    return (
                        <div className='mt-2'>
                          <Avatar name={player.username} round="10px" size="35px" />
                          <span className='text-slate-50 text-2xl ml-2 align-middle'>{player.username}</span>
                        </div>
                        )
                  })}
                      </div>
                        {/* <div className='mt-2'>
                          <Avatar name="yy" round="10px" size="35px" />
                          <span className='text-slate-50 text-2xl ml-2 align-middle'>yy</span>
                        </div>
                        <div className='mt-2'>
                          <Avatar name="kaushal" round="10px" size="35px" />
                          <span className='text-slate-50 text-2xl ml-2 align-middle'>kaushal</span>
                        </div> */}

                  { adminGameCreated && <div className='text-slate-50 text-2xl text-center font-normal opacity-30 mb-2'>GamePin - {gamePin}</div> }

                    {
                      !adminGameCreated &&
                      <>
                        <input className='text-2xl p-2 mx-4 rounded-md' placeholder='Enter your name' value={username} onChange={(e) => { setUsername(e.target.value); }}></input><div className='pb-6 mt-4'>
                          <button className='clicky-button font-bold' onClick={async (e) => {
                            if (admin) {
                              let data = await handleCreateGame();
                            } else {
                              alert("not implemented yet");
                            }
                          }}>
                            <span>{admin ? "Create" : "Join"}</span></button>
                        </div>
                      </>
                    }

                    {
                      adminGameCreated && <div className='p-2 mx-4 rounded-md'>
                        <button className='clicky-button font-bold' onClick={async (e) => {
                          if (admin) {
                            let data = await handleCreateGame();
                          } else {
                            alert("not implemented yet");
                          }
                        }}>
                          <span>Start</span>
                        </button>
                      </div>
                    }


                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
