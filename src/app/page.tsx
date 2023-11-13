"use client";

import dynamic from "next/dynamic";

const DynamicSquares = dynamic(() => import("./squares"), { ssr: false });

const Home = () => <DynamicSquares />;

export default Home;
