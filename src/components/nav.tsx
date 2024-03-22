import React from "react";

import { TabListBox } from "./list-box";
import { useStore } from "@nanostores/react";
import { $state, setState } from "../../store";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import NewTaskModal from "./newtask-modal";

function Nav() {
  return (
    <div className="p-6 md:px-12 min-w-[320px]">
      <div className="md:space-y-24 flex items-center justify-between gap-4 md:block">
        <h1 className="text-base md:text-2xl lg:text-3xl font-semibold text-primary">
          To-Do App
        </h1>
        <NewTaskModal />
        <button
          onClick={() => {
            signOut(auth);
          }}
          className="shadow-lg md:w-full gap-2 after:align-middle md:py-3 rounded-lg after:content-logout-icon bg-primary flex items-center justify-between px-3  after:text-xs after:h-full py-2 md:hidden text-white sm:after:block  text-xs md:text-base">
          Sign out
        </button>
        <List />
      </div>
      <TabListBox />
    </div>
  );
}

function List() {
  const state = useStore($state);

  return (
    <ul className="space-y-6 hidden md:block">
      {["dashboard", "active", "completed"].map((list, i) => (
        <li
          key={i}
          onClick={() => setState(list)}
          className={`p-4 ${
            state == list ? "bg-primary-bg" : ""
          } cursor-pointer capitalize`}>
          {list}
        </li>
      ))}
    </ul>
  );
}

export default Nav;
