import { useEffect, useState } from "react";

import "./App.css";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "../firebase";
import Nav from "../public/components/nav";
import { useStore } from "@nanostores/react";
import { $openedTab, $state, setOpenedTab } from "../store";
import { useNavigate } from "react-router";
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import Loader from "../public/components/loader";

import { formatDistance, toDate } from "date-fns";

interface Task {
  title: string;
  description?: string;
}

function App() {
  const navigate = useNavigate();

  useEffect(function () {
    onAuthStateChanged(auth, (user) => {
      if (!user?.uid) navigate("/sign-in");
    }),
      [];

    document
      .getElementById("taskContainer")
      ?.addEventListener("click", function (e) {
        const taskWrapper = document.getElementById("task-wrapper");
        if (taskWrapper?.contains(e.target as Node)) {
          return;
        } else setOpenedTab("");
      });
  });

  return (
    <div
      tabIndex={0}
      aria-label="Welcome to the Todo App"
      className="md:grid grid-cols-[auto_1fr] h-screen max-w-[1600px] mx-auto">
      <Nav />
      <Main />
    </div>
  );
}

function Main() {
  const [user, setUser] = useState<User>();
  const [loader, setLoader] = useState<boolean>(true);
  const [todos, setTodos] = useState<DocumentData[]>([]);
  const state = useStore($state);
  const userReference = query(
    collection(firestore, `users/${user?.email}/todos`),
    orderBy("time", "desc")
  );

  useEffect(
    function () {
      onAuthStateChanged(auth, (user) => {
        if (user) setUser(user);
      });

      onSnapshot(userReference, (snapshot) => {
        const todos = snapshot.docs.map((doc) => {
          const id = doc.id;
          return { ...doc.data(), id };
        });
        setTodos(todos);
        setLoader(false);
      });
    },
    [user]
  );

  return (
    <main className="p-6 md:px-12  md:space-y-20 max-w-[1000px]">
      <div className="hidden font-semibold md:flex justify-between items-center">
        <h1 className="capitalize">{state}</h1>
        <button
          onClick={() => {
            signOut(auth);
          }}
          aria-label="Sign out"
          className="shadow-lg gap-2 md:py-3 rounded-lg after:content-logout-icon bg-primary flex items-center justify-between px-4 after:block after:h-full py-2 text-white">
          Sign out
        </button>
      </div>

      {state === "dashboard" && (
        <section className="grid grid-cols-2 grid-rows-[auto_20%]">
          <div className="rounded-lg shadow-md lg:p-20 lg:py-10  p-6 md:p-8 col-span-full row-start-1 row-end-2">
            <div>
              <h2
                tabIndex={0}
                aria-live="off"
                className="text-xs sm:text-xl tablet:text-2xl font-bold md:text-2xl lg:text-4xl capitalize">
                Hello, {user?.displayName || "Pal"}
              </h2>
              <p
                aria-live="off"
                tabIndex={0}
                className="text-xs sm:text-sm tablet:text-md md:text-base">
                What do you want to do today
              </p>
            </div>
          </div>
          <img
            className="col-start-2 col-end-3 mt-3 place-self-end row-span-full self-stretch min-h-full mobile:max-w-[100px] md:max-w-[140px] lg:max-w-[220px] lg:-ml-10"
            src="/assets/user-image.svg"
          />
        </section>
      )}

      <section className="grid grid-rows-[auto_auto_auto] md:grid-rows-1 mt-8 md:mt-0 md:grid-cols-[1fr_auto] gap-8">
        <div className="flex justify-between items-center gap-4 md:col-start-1 col-span-full md:row-start-1 row-end-1">
          <h2
            className="text-xs md:text-xl lg:text-3xl tablet:text-base font-semibold"
            aria-label={`Today's ${state} task`}
            tabIndex={0}>
            Today's {state !== "dashboard" && state} Task
          </h2>
          <div className="flex gap-4 md:gap-8">
            {state === "dashboard" && (
              <button
                aria-label="delete all todo"
                onClick={() => {
                  todos.forEach((todo) =>
                    deleteDoc(
                      doc(
                        firestore,
                        `users`,
                        `${user?.email}`,
                        "todos",
                        todo.id
                      )
                    )
                  );
                }}
                className="text-primary-bg font-semibold text-xs tablet:text-base">
                Delete All
              </button>
            )}
            <p
              aria-live="off"
              role="date"
              tabIndex={0}
              className="text-xs tablet:text-base">
              {toDate(new Date()).toDateString()}
            </p>
          </div>
        </div>
        <div
          id="taskContainer"
          className="px-3 overflow-y-auto min-h-[400px] max-h-[400px] md:max-h-[400px] col-start-1 md:row-start-2 relative py-4"
          tabIndex={0}
          aria-label="todo lists">
          <ul className="space-y-5" id="task-wrapper">
            {todos
              .filter((todo) => {
                if (state === "dashboard") return true;
                return todo.status === state;
              })
              .map((todo, i) => (
                <Task todo={todo} id={todo.id} key={i} />
              ))}
            {!todos.length && !loader && (
              <div className="font-bold text-center col-span-full mt-8">
                Your task is empty add a new task
              </div>
            )}
            {loader && <Loader />}
          </ul>
        </div>
        {todos.length && state === "dashboard" ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1 row-start-1 row-span-2 md:justify-self-end md:row-start-2 md:row-end-3">
            <TaskPercentContainer
              todos={todos}
              type="active"
              imgSrc="/assets/active-icon.svg"
            />
            <TaskPercentContainer
              todos={todos}
              type="completed"
              imgSrc="/assets/completed-icon.svg"
            />
          </div>
        ) : (
          ""
        )}
      </section>
    </main>
  );
}
function Task({ todo, id }: { todo: DocumentData; id: string }) {
  const openedTab = useStore($openedTab);

  const [openedDetails, setOpenDetails] = useState(false);
  useEffect(
    function () {
      if (openedTab === id) setOpenDetails(true);
      else if (openedTab !== id && openedDetails) setOpenDetails(false);
    },
    [openedTab]
  );
  const { status, title, time, description } = todo;

  return (
    <li className="relative">
      <div
        id={`container${id}`}
        onClick={() => {
          setOpenedTab(id || "");
          if (openedTab == id && openedDetails) {
            setOpenedTab("");
          }
        }}
        className={`flex ${
          status === "completed" ? "bg-primary-bg" : "bg-white"
        }  rounded-lg shadow-sm items-center  p-5 border border-black/5 gap-3 cursor-pointer -z-50 task`}>
        <input
          type="checkbox"
          name="checkBox"
          onChange={() => {
            setDoc(
              doc(
                firestore,
                `users/${auth?.currentUser?.email}/todos/${todo.id}`
              ),
              { status: status === "active" ? "completed" : "active" },
              { merge: true }
            );
          }}
          id={id}
          checked={status === "completed"}
          className="bg-white accent-[#BA5112]"
        />
        <label
          className="cursor-pointer block capitalize text-sm  md:text-base"
          htmlFor={id}>
          {title}
        </label>
      </div>
      {
        <div
          id={`desc${id}`}
          className={`absolute ${
            openedTab === id ? "block" : "hidden"
          } right-0 z-40 rounded-lg  ${
            todo.status === "completed" ? "bg-primary-bg" : "bg-white"
          }  shadow-xl p-5 gap-3 min-w-48 md:min-w-92 max-w-[70%] cursor-pointer -top-2 border border-black/5 z-50 right-3`}>
          <div>
            <h3 className="text-sm font-bold capitalize">{title}</h3>
            <p className="capitalize text-xs md:text-sm text-primary-bg mt-2">
              {formatDistance(new Date(), time?.toDate() || new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>
          {description && (
            <div className="mt-6">
              <h4 className="text-sm font-bold md:text-base">Description</h4>
              <p className="text-sm md:text-base">{description}</p>
            </div>
          )}

          <div className="mt-8 md:mt-12 flex justify-between">
            <input
              type="checkbox"
              name="checkBox"
              onChange={() => {
                setDoc(
                  doc(
                    firestore,
                    `users/${auth?.currentUser?.email}/todos/${todo.id}`
                  ),
                  { status: status === "active" ? "completed" : "active" },
                  { merge: true }
                );
              }}
              id={id}
              checked={status === "completed"}
              className="bg-white accent-[#BA5112]"
            />
            <button
              onClick={() => {
                deleteDoc(
                  doc(
                    firestore,
                    `users`,
                    `${auth?.currentUser?.email}`,
                    "todos",
                    todo.id
                  )
                );
                setOpenedTab("");
              }}>
              <img src="/assets/Buttons.svg" alt="delete todo" />
            </button>
          </div>
        </div>
      }
    </li>
  );
}

function TaskPercentContainer({
  todos,
  imgSrc,
  type,
}: {
  todos: DocumentData[];
  type: "completed" | "active";
  imgSrc: string;
}) {
  const todoType = todos.filter((todo) => todo.status == type);
  const percentage = (todoType.length / todos.length) * 100;
  return (
    <div
      className={` ${
        type === "active" ? "bg-primary-bg" : "bg-primary"
      } p-3 rounded-lg text-white space-3 flex gap-6 md:max-w-[180px] md:flex-col justify-center
      md:gap-4 md:items-center`}>
      <img src={imgSrc} alt="icon" className="w-6 md:w-8" />
      <div className="text-base md:text-2xl md:text-center">
        <p className="text-base font-semibold text-white">
          {Math.round(percentage)}%
        </p>
        <p className="capitalize text-xs md:text-base">{type} task</p>
      </div>
    </div>
  );
}

export default App;
