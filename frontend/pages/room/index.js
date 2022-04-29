import Image from 'next/image';
import Head from 'next/head';
import OtpInput from 'react-otp-input';
import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { useQuery } from 'react-query'
import { API_URL } from '../../constants';




export default function Room() {

  const [admin, setAdmin] = useState(false);
  const [adminGameCreated, setAdminGameCreated] = useState(false);
  const [username, setUsername] = useState('')
  const [gamePin, setGamePin] = useState(false);
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    setGamePin(localStorage.getItem('gamePin'))
    setAdmin(localStorage.getItem('admin'))
    setAdminGameCreated(localStorage.getItem('adminGameCreated'))
  }, [])

  const { data: createGameResponse, refetch: createGameRefetch, isLoading: createGameLoading } = useQuery(
    ['createGame'],
    async () => {
      const { data } = await axios({
        url: `${API_URL}/api/game/create`,
        method: 'POST',
        data: { 'admin': username }
      });
      return data;
    }, {
      refetchOnWindowFocus: false, 
      enabled: false
    });

    const { data: gameBoardResponse, refetch: refetchGameBoard, isLoading: gameBoardLoading } = useQuery(
      ['fetchGameBoard'],
      async () => {
        const { data } = await axios({
          url: `${API_URL}/api/game/board`,
          method: 'GET',
          data: { 'admin': username }
        });
        return data;
      }, {
        refetchOnWindowFocus: false, 
        enabled: false
      });

  
    const handleCreateGame = async () => {
      if (!username) {
        alert("Please enter a username to continue")
      }
      try {
        response = await createGameRefetch();
        setGameId(response.game_id)
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
                    Room Manager
                  </div>

                  <div className='p-4 text-left'>
                    <div className='mt-2'>
                      <Avatar name="rohinrohin" round="10px" size="35px" />
                      <span className='text-slate-50 text-2xl ml-2 align-middle'>rohinrohin</span>
                    </div>
                    <div className='mt-2'>
                      <Avatar name="yy" round="10px" size="35px" />
                      <span className='text-slate-50 text-2xl ml-2 align-middle'>yy</span>
                    </div>
                    <div className='mt-2'>
                      <Avatar name="kaushal" round="10px" size="35px" />
                      <span className='text-slate-50 text-2xl ml-2 align-middle'>kaushal</span>
                    </div>
                  </div>

                  {adminGameCreated && <div className='text-slate-50 text-2xl text-center font-normal opacity-30 mb-2'>GamePin - {gamePin}</div>}

                  <input className='text-2xl p-2 mx-4 rounded-md' placeholder='Enter your name'></input>
                  <div className='pb-6 mt-4'>
                    <button className='clicky-button font-bold' onClick={(e) => {
                    }}>
                      <span>{admin ? "Create" : "Join"}</span></button>
                  </div>



                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
