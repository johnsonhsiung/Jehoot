import React from "react";

export default function topCard({ username, lastPoints, totalPoints }) {
  return (
    <div className="p-4 m-4 h-32 flex flex-col items-center justify-between border-2 border-light-purple rounded-lg text-white">
      <div className="w-full text-right">{totalPoints}</div>
      <div className="w-full text-center text-xl font-bold">{username}</div>
      <div className="w-full text-right">+{lastPoints}</div>
    </div>
  );
}
