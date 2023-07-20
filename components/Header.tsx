"use client";
// import fetchSuggestion from "@/lib/fetchSuggestion";
import { useBoardStore } from "@/store/AppStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { AiOutlineSearch } from "react-icons/ai";

const Header = () => {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);
  // const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  useEffect(() => {
    if (board.columns.size === 0) return;
    // setLoading(true);
    const fetchSuggestionFunc = async () => {
      // const suggestion = await fetchSuggestion(board);
      // setSuggestion(suggestion);
      // setLoading(false);
    };
    fetchSuggestionFunc();
  }, [board]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center md:justify-between px-4 py-2 bg-white">
        <Image
          src={
            "data:image/png;base64,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"
          }
          // Compare this snippet from app\components\Header.tsx:
          alt="Trello Clone"
          width={200}
          height={200}
        />
        <div className="flex gap-4 items-center">
          <form className="flex flex-1 md:flex-initial bg-white rounded-md p-2 shadow-lg items-center gap-3">
            <AiOutlineSearch size={30} />
            <input
              type="text"
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="bg-white rounded-lg p-2 flex-1 outline-none"
            />
          </form>
          <Avatar
            size="50"
            name="Ahmer Khan"
            className=" rounded-[50%]"
            color="blue"
          />
        </div>
      </div>
      <div className="flex items-center justify-center px-5 md:py-5">
        {/* <p className="flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-lg cursor-pointer bg-gray-100 text-blue-800 gap-2">
          <BiUserCircle
            size={30}
            className={`inline-block h-10 w-10 text-[#005501] mr-1 ${
              loading && "animate-spin"
            }`}
          />
          {suggestion && !loading
            ? suggestion
            : "Gpt is loading your suggestion.."}
        </p> */}
      </div>
    </header>
  );
};

export default Header;
