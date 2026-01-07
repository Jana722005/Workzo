import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const status = params.get("status");

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow text-center max-w-md w-full">
        {status === "success" ? (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Email Verified Successfully 🎉
            </h1>
            <p className="text-gray-600">
              Your email has been verified.
              <br />
              Redirecting to login…
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600">
              The verification link is invalid or expired.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
