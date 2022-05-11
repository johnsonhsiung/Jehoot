import React, { useState, useEffect } from "react";
import TopCard from "../../components/TopCard";
import GameBoard from "../../components/gameBoard/GameBoard";
import Config from "../../config";

export default function game() {
  const [gameData, setGameData] = useState({});
  const [playersData, setPlayersData] = useState([]);
  const getData = () => {
    return fetch(
      Config["BACKEND_URL"] + "/board?game_id=627ac9198073d592f58e92da"
    ).then((response) => response.json().then((data) => setGameData(data)));
  };

  useEffect(() => {
    let arr = [];
    if (gameData["players"]) {
      for (const [key, value] of Object.entries(gameData["players"])) {
        let temp_obj = {};
        temp_obj["username"] = key;
        temp_obj["last_round_points"] = value["last_round_points"];
        temp_obj["total_points"] = value["total_points"];
        arr.push(temp_obj);
      }
      arr.sort((a, b) => a["total_points"] - b["total_points"]);
    }
    setPlayersData(arr);
  }, [gameData]);

  useEffect(() => {
    setInterval(() => {
      getData();
    }, 1000);
  }, []);

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
          {playersData.map((item, index) => {
            return (
              index < 3 && (
                <TopCard
                  username={item["username"]}
                  lastPoints={item["last_round_points"]}
                  totalPoints={item["total_points"]}
                />
              )
            );
          })}
          {playersData.length > 3 && (
            <div className="h-32 m-4 p-4 flex items-center justify-center text-white text-2xl font-bold">
              +{playersData.length - 3 - 1}
            </div>
          )}
        </div>
      </div>
      {/* <div className="w-auto h-auto"> */}
      <GameBoard entireData={gameData}/>
      {/* </div> */}
    </div>
  );
}
