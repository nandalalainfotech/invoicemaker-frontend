import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import HomeIcon from "../Icons/HomeIcon";
import ProductIcon from "../Icons/ProductIcon";
import InvoiceIcon from "../Icons/InvoiceIcon";
import ClientPlusIcon from "../Icons/ClientPlusIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import SecurityIcon from "../Icons/SecurityIcon";
import InvoiceNavbarLoading from "../Loading/InvoiceNavbarLoading";
import { getCompanyData } from "../../store/companySlice";
import Skeleton from "react-loading-skeleton";
import Axios from "axios";
import { userRoles } from "../../store/userRoleSlice";


const NAV_DATA = [
  {
    title: "Dashboard",
    link: "dashboard",
    Icon: HomeIcon,
  },
  {
    title: "Invoices",
    link: "invoices",
    Icon: InvoiceIcon,
  },
  {
    title: "Clients",
    link: "clients",
    Icon: ClientPlusIcon,
  },
  {
    title: "Products",
    link: "products",
    Icon: ProductIcon,
  },
];

const navDefaultClasses =
  "fixed inset-0 duration-200 transform lg:opacity-100 z-10 w-72 bg-white h-screen p-3";

const navItemDefaultClasses = "block px-4 py-2 rounded-md flex flex-1";

function Sidebar() {
  const { showNavbar, initLoading, toggleNavbar } = useAppContext();
  const { pathname } = useLocation();
  const company = useSelector(getCompanyData);
  const [userInfo, setUserInfo] = useState([]);

  const dispatch = useDispatch();

  const userId = sessionStorage.getItem('user');
  const id = JSON.parse(userId)
 

  const userRole = useSelector((state) => state.user)
  const loginRole = userRole.user?.userrole;

  
  useEffect(() => {
    dispatch(userRoles());
  }, []);

  const onClickNavbar = useCallback(() => {
    const width = window.innerWidth;

    if (width <= 767 && showNavbar) {
      toggleNavbar();
    }
  }, [showNavbar, toggleNavbar]);

  const aboutRoute = useMemo(() => pathname === "/about", [pathname]);
  return (
    <>

      <nav
        className={
          showNavbar
            ? navDefaultClasses + " translate-x-0 ease-in"
            : navDefaultClasses + " -translate-x-full ease-out"
        }
      >
        <div className="flex justify-between">

          <motion.span
            className="font-bold font-title text-2xl sm:text-2xl p-2 flex justify-center items-center"
            initial={{
              translateX: -300,
            }}
            animate={{
              translateX: showNavbar ? -40 : -300,
              color: "#0066FF",
            }}
            transition={{
              type: "spring",
              damping: 18,
            }}
          >
            { }
            <span className="nav-loading">
              <InvoiceNavbarLoading loop />
            </span>

            Invoice Maker
          </motion.span>
        </div>

        {initLoading && <Skeleton className="px-4 py-5 rounded-md" />}
        {!!company?.image && !initLoading && (
          <motion.span
            className={
              navItemDefaultClasses + " bg-gray-50 flex items-center px-3"
            }
          >
            <img
              className={"object-cover h-10 w-10 rounded-lg"}
              src={company?.image}
              alt="upload_image"
            />
            <span className="flex-1 pl-2 font-title rounded-r py-1 border-r-4 border-indigo-400 flex items-center inline-block whitespace-nowrap text-ellipsis overflow-hidden ">
              {company.companyName}
            </span>
          </motion.span>
        )}
        <ul className="mt-4">

          {/* {NAV_DATA.map(({ title, link, Icon }) => (
            
            <li key={title} className="mb-2" >
              <NavLink
                to={link}
                className={" rounded-md side-link"}
                onClick={onClickNavbar}
              >
                {({ isActive }) => (
                  <motion.span
                    key={`${title}_nav_item`}
                    className={
                      isActive
                        ? navItemDefaultClasses + " primary-self-text "
                        : navItemDefaultClasses + " text-default-color "
                    }
                    whileHover={{
                      color: "rgb(0, 102, 255)",
                      backgroundColor: "rgba(0, 102, 255, 0.1)",
                      translateX: isActive ? 0 : 4,
                      transition: {
                        backgroundColor: {
                          type: "spring",
                          damping: 18,
                        },
                      },
                    }}
                    whileTap={{ scale: isActive ? 1 : 0.9 }}
                  >
                    <Icon className="h-6 w-6 mr-4" />
                    {title}
                  </motion.span>
                )}
              </NavLink>
            </li>
          ))} */}

          {loginRole === 'admin' ? (
            <>
              <li className="mb-2" >
                <NavLink
                  // to={link}
                  className={" rounded-md side-link"}
                  onClick={onClickNavbar}
                >
                  {({ isActive }) => (
                    <motion.span
                      // key={`${title}_nav_item`}
                      className={
                        isActive
                          ? navItemDefaultClasses + " primary-self-text "
                          : navItemDefaultClasses + " text-default-color "
                      }
                      whileHover={{
                        color: "rgb(0, 102, 255)",
                        backgroundColor: "rgba(0, 102, 255, 0.1)",
                        translateX: isActive ? 1 : 4,
                        transition: {
                          backgroundColor: {
                            type: "spring",
                            damping: 18,
                          },
                        },
                      }}
                      whileTap={{ scale: isActive ? 1 : 0.9 }}
                    >
                      <span style={{ paddingRight: "12px" }}>
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
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      </span>
                      Dashboard
                    </motion.span>
                  )}
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  // to={link}
                  className={" rounded-md side-link"}
                  onClick={onClickNavbar}
                >
                  {({ isActive }) => (
                    <motion.span
                      // key={`${title}_nav_item`}
                      className={
                        isActive
                          ? navItemDefaultClasses + " text-default-color " : navItemDefaultClasses + " primary-self-text "
                      }
                      whileHover={{
                        color: "rgb(0, 102, 255)",
                        backgroundColor: "rgba(0, 102, 255, 0.1)",
                        translateX: isActive ? 2 : 4,
                        transition: {
                          backgroundColor: {
                            type: "spring",
                            damping: 18,
                          },
                        },
                      }}
                      whileTap={{ scale: isActive ? 1 : 0.9 }}
                    >
                      <span style={{ paddingRight: "12px" }}>
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </span>
                      Invoices
                    </motion.span>
                  )}
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  // to={link}
                  className={" rounded-md side-link"}
                  onClick={onClickNavbar}
                >
                  {({ isActive }) => (
                    <motion.span
                      // key={`${title}_nav_item`}
                      className={
                        isActive
                          ? navItemDefaultClasses + " text-default-color " : navItemDefaultClasses + " primary-self-text "
                      }
                      whileHover={{
                        color: "rgb(0, 102, 255)",
                        backgroundColor: "rgba(0, 102, 255, 0.1)",
                        translateX: isActive ? 3 : 4,
                        transition: {
                          backgroundColor: {
                            type: "spring",
                            damping: 18,
                          },
                        },
                      }}
                      whileTap={{ scale: isActive ? 1 : 0.9 }}
                    >
                      <span style={{ paddingRight: "12px" }}>
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
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                      </span>
                      Clients
                    </motion.span>
                  )}
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  // to={link}
                  className={" rounded-md side-link"}
                  onClick={onClickNavbar}
                >
                  {({ isActive }) => (
                    <motion.span
                      // key={`${title}_nav_item`}
                      className={
                        isActive
                          ? navItemDefaultClasses + " text-default-color " : navItemDefaultClasses + " primary-self-text "
                      }
                      whileHover={{
                        color: "rgb(0, 102, 255)",
                        backgroundColor: "rgba(0, 102, 255, 0.1)",
                        translateX: isActive ? 1 : 4,
                        transition: {
                          backgroundColor: {
                            type: "spring",
                            damping: 18,
                          },
                        },
                      }}
                      whileTap={{ scale: isActive ? 1 : 0.9 }}
                    >
                      <span style={{ paddingRight: "12px" }}>
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
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                          />
                        </svg>
                      </span>
                      Products
                    </motion.span>
                  )}
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="mb-2">
                <NavLink
                  // to={link}
                  className={" rounded-md side-link"}
                  onClick={onClickNavbar}
                >
                  {({ isActive }) => (
                    <motion.span
                      // key={`${title}_nav_item`}
                      className={
                        isActive
                          ? navItemDefaultClasses + " text-default-color " : navItemDefaultClasses + " primary-self-text "
                      }
                      whileHover={{
                        color: "rgb(0, 102, 255)",
                        backgroundColor: "rgba(0, 102, 255, 0.1)",
                        translateX: isActive ? 2 : 4,
                        transition: {
                          backgroundColor: {
                            type: "spring",
                            damping: 18,
                          },
                        },
                      }}
                      whileTap={{ scale: isActive ? 1 : 0.9 }}
                    >
                      <span style={{ paddingRight: "12px" }}>
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </span>
                      Invoices
                    </motion.span>
                  )}
                </NavLink>
              </li></>
          )}

          {/* </> */}


        </ul>

        <hr />

        <div className="my-4">
          <NavLink to={"about"}>
            <motion.span
              className="block px-4 py-2 rounded-md flex text-default-color"
              style={{
                color: aboutRoute ? "rgb(14 136 14)" : "#777",
              }}
              whileHover={{
                scale: [1.03, 1, 1.03, 1, 1.03, 1, 1.03, 1],
                color: "rgb(14 136 14)",
                textShadow: "0px 0px 3px #85FF66",
                transition: {
                  backgroundColor: {
                    type: "spring",
                    damping: 18,
                  },
                },
              }}
              whileTap={{ scale: 0.9 }}
            >
              <SecurityIcon className="h-6 w-6 mr-4" />
              About Me
            </motion.span>
          </NavLink>
        </div>

        <hr />

        <div className="mt-4">
          <motion.a
            href={"#!"}
            className="block px-4 py-2 rounded-md flex"
            initial={{
              color: "#EC7474",
              backgroundColor: "#FFEEEE",
            }}
            whileHover={{
              translateX: 6,
              color: "#777",
              backgroundColor: "#dfdfdf",
              transition: {
                backgroundColor: {
                  type: "spring",
                  damping: 18,
                },
              },
            }}
            whileTap={{ scale: 0.9 }}
          >
            <DeleteIcon className="h-6 w-6 mr-4" />
            Clear Data
          </motion.a>
        </div>
      </nav>

    </>
  );
}

export default Sidebar;
