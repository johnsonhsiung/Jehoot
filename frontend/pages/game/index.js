import React from "react";
import TopCard from "../../components/TopCard";
import GameBoard from '../../components/gameBoard/GameBoard'

export default function game() {
  return (
    <div
      className="relative w-screen h-screen flex flex-col content-center items-center overflow-hidden"
      style={{
        minHeight: "100vh",
        minHeight: "-webkit-fill-available",
        backgroundImage: "url(/assets/jehoot-bg.svg)",
      }}
    >
      <div className="flex flex-col items-center mt-4">
        <div className="text-3xl text-light-purple">Top players</div>
        <div className="flex">
          <TopCard username="kaushal" lastPoints="5" totalPoints="25" />
          <TopCard username="kaushal" lastPoints="5" totalPoints="25" />
          <TopCard username="kaushal" lastPoints="5" totalPoints="25" />
          <div className="h-32 m-4 p-4 flex items-center justify-center text-white text-2xl font-bold">
            +20
          </div>
        </div>
      </div>
      {/* <div className="w-auto h-auto"> */}
        <GameBoard />
      {/* </div> */}
    </div>
  );
}
