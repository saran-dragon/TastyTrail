import React from "react";
import FoodList from "../components/FoodList";
import "../styles/FoodList.css";


const Home = () => {
  return (
    <div>
      {/* <h1 className="text-2xl font-bold text-center my-4">🍔 Our Menu</h1> */}
      <h1 className="menu">🍔 Our Menu</h1>
      <FoodList className="fd-list" />
      {/* Hello Home */}
    </div>
  );
};

export default Home;
