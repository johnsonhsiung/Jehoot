import Image from 'next/image';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      </Head>
      <div className="relative h-screen w-screen flex content-center items-center justify-center">
        <div className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: "url(/assets/jehoot-bg.svg)"
          }}>
          <span id="blackOverlay" className="w-full h-full absolute opacity-40 bg-black"></span>
        </div>
        <div className="container relative mx-auto">
          <div className="items-center flex flex-wrap">
            <div className="flex lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className='flex-1 flex-col'>
                <div className='flex flex-col mb-2 items-center justify-center'>
                  <div className="text-violet-300 text-3xl text-center font-normal opacity-75 mb-2">Kahoot vs Jeapordy? <br></br>Now you don&apos;t have to choose. </div>
                  <Image src={"/assets/Jehoot-logo.svg"} alt="Hello" width={350} height={200} />
                </div>
                <div className='flex-1 justify-center items-center'>
                  <img className='mx-auto' src={"/assets/pog-frog.png"} alt="Hello" style={{maxWidth: '30%', height: 'auto', width: 'auto', textAlign: 'center'}}></img>
                </div>
                <div className='flex-1 mt-8'>
                  <button className='clicky-button font-bold'><span>Join Game</span></button>
                  <div className='mt-3 text-slate-50 text-lg text-center font-normal opacity-75'>or <span className='underline '>Start a new game</span></div>
                  <div className='mt-16 text-slate-50 text-lg text-center font-normal opacity-25'>You will be asked to sign in before joining or starting a Game</div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
