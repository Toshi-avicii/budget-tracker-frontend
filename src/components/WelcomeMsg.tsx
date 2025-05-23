'use client';

import { useAppSelector } from "@/store/reduxHooks";
import { useEffect, useState } from "react";

function WelcomeMsg() {
  const username = useAppSelector(state => state.profile.username);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const userFirstName = username.split(' ')[0];
    setFirstName(userFirstName);
  }, []);

  return (
    <h1 className="text-lg lg:text-xl font-semibold">Welcome, {firstName}</h1>
  )
}

export default WelcomeMsg