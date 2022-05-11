import React, { useState, useEffect } from "react";
import TopCard from "../../components/TopCard";
import GameBoard from "../../components/gameBoard/GameBoard";
import Config from "../../config";

export default function game() {
  const [gameData, setGameData] = useState({});
  const [playersData, setPlayersData] = useState([]);
  const getData = () => {
    return fetch(
      Config["BACKEND_URL"] + "/board?game_id=627c28cb29c69f73685278dd"
    ).then((response) => response.json().then((data) => setGameData(data)));
  };

  const [isSelector, setIsSelector] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (gameData["current_selector"] == localStorage.getItem("username")) {
        setIsSelector(true);
      } else {
        setIsSelector(false);
      }
    }
  }, [gameData]);

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

  function getChosenQuestion(category, points) {
    if (isSelector) {
      // Send Category and points to teh backend
      console.log(category, points);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: { category: category, points: points },
          game_id: gameData["_id"]["$oid"],
          username: localStorage.getItem("username"),
        }),
      };
      fetch(Config["BACKEND_URL"] + "/question/choose", requestOptions).then(
        (response) => {
          if (response.status != 200) {
            alert("Error! Please contact the Admin.");
          }
        }
      );
    } else {
      console.log("Not");
    }
  }

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
      <div>
        {isSelector && gameData["current_selector"] != null ? (
          <>Please choose a question.</>
        ) : (
          <>
            {gameData["current_selector"]} is choosing the category. Please
            wait!
          </>
        )}
      </div>
      {/* <div className="w-auto h-auto"> */}
      <GameBoard entireData={gameData} getChosenQuestion={getChosenQuestion} />
      {/* </div> */}
      {/* <Modal open={gameData['current_selector'] != null} username={} data={gameData}/> */}
    </div>
  );
}
