import React, { useState } from 'react'
import { IoEyeOff, IoEye } from "react-icons/io5";

function Input({ type, placeholder, setdata, field, icon }) {
  const [passhow, setshow] = useState(false);

  // Determine input type dynamically
  const inputType = type === "password" && passhow ? "text" : type;

  return (
    <div className="flex justify-center items-center border-2 pl-0.5 pr-0.5 gap-1 w-[90%] bg-white">
      {icon}

      <input
        type={inputType}
        placeholder={placeholder}
        defaultValue=""
        className="bg-white w-full p-1 outline-0 rounded-[5px]"
        onChange={(e) => setdata((prev) => ({ ...prev, [field]: e.target.value }))}
      />

      {/* 👇 Toggle icon based on visibility */}
      {type === "password" && (
        passhow ? (
          <IoEye
            className="text-2xl cursor-pointer"
            onClick={() => setshow(false)}
          />
        ) : (
          <IoEyeOff
            className="text-2xl cursor-pointer"
            onClick={() => setshow(true)}
          />
        )
      )}
    </div>
  );
}

export default Input;
