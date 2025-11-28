import { SignUp } from "@clerk/clerk-react";
import "./signup.css";

const SignUpPage = () => {
  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg"
            }
          }}
          afterSignUpUrl="/"
          signInUrl="/login"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
