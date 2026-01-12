import { NavLink } from "react-router-dom";
export default function Category() {
  return (
    <div className="w-full overflow-x-auto bg-white shadow-sm  ">
      <div
        className="flex items-center justify-start gap-8 sm:gap-6 md:gap-10 lg:gap-28 px-3 py-5
                   text-sm sm:text-base md:text-lg text-gray-700 whitespace-nowrap"
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            `cursor-pointer hover:text-blue-500 transition-colors duration-200 ${
              isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/mobiles-laptop"
          className={({ isActive }) =>
            `cursor-pointer hover:text-blue-500 transition-colors duration-200 ${
              isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
            }`
          }
        >
          Gadgets
        </NavLink>
        <NavLink
          to={"/fashion"}
          className={({ isActive }) =>
            `cursor-pointer hover:text-blue-500 transition-colors duration-200 ${
              isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
            }`
          }
        >
          Fashion
        </NavLink>
        <NavLink
          to={"/books"}
          className={({ isActive }) =>
            `cursor-pointer hover:text-blue-500 transition-colors duration-200 ${
              isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
            }`
          }
        >
          Books
        </NavLink>
        <NavLink
          to={"/tv-and-appliances"}
          className={({ isActive }) =>
            `cursor-pointer hover:text-blue-500 transition-colors duration-200 ${
              isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
            }`
          }
        >
          TV & Appliances
        </NavLink>
         <NavLink
          to={"/home-and-kitchen"}
          className={({ isActive }) =>
            `cursor-pointer hover:text-blue-500 transition-colors duration-200 ${
              isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
            }`
          }
        >
          Home & Kitchen
        </NavLink>
       <NavLink
          to={"/beauty-and-toy"}
          className={({ isActive }) =>
            `cursor-pointer hover:text-blue-500 transition-colors duration-200 ${
              isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
            }`
          }
        >
          Beauty & Toy
        </NavLink>
        <NavLink
          to={"/furniture"}
          className={({ isActive }) =>
            `cursor-pointer hover:text-blue-500 transition-colors duration-200 ${
              isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"
            }`
          }
        >
          Furniture
        </NavLink>
      </div>
    </div>
  );
}
