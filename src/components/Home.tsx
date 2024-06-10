import React from "react";
import Link from "next/link";
import CardEvent from "./event/CardEvent";

interface HomeProps {
  user: any;
}

const addEvent = async () => {};

const Home: React.FC<HomeProps> = () => {
  return (
    <div>
      <h1>Welcome</h1>
    </div>
  );
};

export default Home;
