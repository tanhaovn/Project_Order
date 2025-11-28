import { SignIn } from "@clerk/clerk-react";
import "./login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg"
            }
          }}
          afterSignInUrl="/"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
};

export default Login;
