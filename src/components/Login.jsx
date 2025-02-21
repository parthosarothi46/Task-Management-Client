import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-md bg-white dark:bg-gray-700 rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          Task Manager
        </h2>
        <p className="text-center mb-6 text-gray-600 dark:text-gray-300">
          Sign in to manage your tasks
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
