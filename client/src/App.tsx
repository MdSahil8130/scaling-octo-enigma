import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import router from "./component/Router";
import { useAppDispatch, useAppSelector } from "./hooks";
import { getUserData } from "./store/userSlice";
import Loading from "./component/Loading";
import Header from "./component/Header/Header";

function App() {
  const dispatch = useAppDispatch();
  const { isDarkMode, loadingUser } = useAppSelector((state) => state.user);

  // useEffect(() => {
  //   dispatch(getUserData());
  // }, []);

  if (loadingUser)
    return (
      <div className="min-h-section flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <>
      <div className={isDarkMode ? "dark" : ""}>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          toastClassName="bg-white text-gray-800 dark:bg-gray-800 dark:text-white"
          theme={isDarkMode ? "dark" : "light"}
        />
        <RouterProvider router={router} /> 

      </div>
    </>
  );
}

export default App;
