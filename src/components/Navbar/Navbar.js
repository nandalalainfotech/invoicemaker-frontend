import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import InvoiceNavbarLoading from "../Loading/InvoiceNavbarLoading";
import Button from "../../components/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { removeItem } from "localforage";

function Navbar() {
  const { toggleNavbar, showNavbar } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useMemo(() => {
    const defaultClasses =
      "bg-white flex items-center pr-3 z-12 fixed w-full z-10 border-b border-slate-50 transition-all";

    if (!showNavbar) {
      return defaultClasses + " pl-3 ";
    }
    return defaultClasses + " pl-72 ";
  }, [showNavbar]);

  const logoutclass = useMemo(() => {
    const defaultClasses =
      "bg-white flex items-center pr-3 z-12 fixed w-full z-10 border-b border-slate-50 transition-all";

    if (!showNavbar) {
      return defaultClasses + " pl-3 ";
    }
    return defaultClasses + " pl-2 ";
  }, [showNavbar]);

  const singIn = () => {
    navigate("/login");
  };

  const singnout = () => {
    navigate("/");
    window.location.reload(true);
    sessionStorage.removeItem("user");
  };

  const { user } = useSelector((state) => state.user);
  // console.log("user-------->", user)

  const userDetail = JSON.parse(sessionStorage.getItem("user") || null);

  //   userDetail?.map((item) => {
  // console.log("item===>",item);
  //   })

  // console.log("userDetail====>", userDetail);
  return (
    <>
      <header className={userDetail ? classes : logoutclass}>
        {!userDetail && <img src="logo_nanda.png" className=" w-28" />}
        {userDetail ? (
          <motion.button
            className="p-2 focus:outline-none rounded-md"
            onClick={toggleNavbar}
            initial={{
              translateX: 0,
            }}
            animate={{
              color: showNavbar ? "#777" : "#0066FF",
              rotate: showNavbar ? "360deg" : "0deg",
            }}
            transition={{
              type: "spring",
              damping: 25,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={showNavbar ? "M15 19l-7-7 7-7" : "M4 6h16M4 12h16M4 18h7"}
              />
            </svg>
          </motion.button>
        ) : null}
        {/* <img src="logo_nanda.png" className="flex w-28" /> */}
        <div
          className="block flex-1 text-2xl sm:text-3xl font-bold p-4 relative justify-center items-center"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >
          {showNavbar && <>&nbsp;</>}
          {!showNavbar && (
            <motion.div
              className=" relative font-bold font-title text-2xl px-2 flex flex-row justify-center items-center"
              initial={{
                translateX: "10vw",
                opacity: 0.8,
              }}
              animate={{
                translateX: 0,
                opacity: 1,
                color: "#0066FF",
              }}
              transition={{
                type: "spring",
                damping: 20,
              }}
            >
              {/* <InvoiceNavbarLoading loop className="nav-loading-right " /> */}
            </motion.div>
          )}
        </div>

        {userDetail ? (
          <>
            <div
              className="font-title text-right sm:pr-8 sm:block mb-1"
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "350px",
              }}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  fill="currentColor"
                  class="bi bi-person"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z" />
                </svg>
              </div>

              <div className="text-lg">{userDetail.email}</div>
              <div style={{ display: "inline" }}>
                <button size="sm" onClick={singnout}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="currentColor"
                    class="bi bi-box-arrow-in-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {location.pathname !== "/login" && (
              <div className="font-title w-full sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block mb-1">
                <Button size="sm" block={1} onClick={singIn}>
                  {/* <PlusCircleIcon style={IconStyle} className="h-5 w-5" /> */}
                  Sign In
                </Button>
              </div>
            )}
          </>
        )}
      </header>
    </>
  );
}

export default Navbar;
