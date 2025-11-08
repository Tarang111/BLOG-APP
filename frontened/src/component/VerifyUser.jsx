import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

function VerifyUser() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyUser() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKENED_URL}/user/verifyemail/${token}`
        );

        toast.success(res.data.message);
        console.log(res.data);

        navigate("/signin");
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Verification failed");
        navigate("/signin");
      }
    }

    verifyUser();
  }, [token, navigate]);

  return <h2 className="text-center mt-12">Verifying your email...</h2>;
}

export default VerifyUser;
