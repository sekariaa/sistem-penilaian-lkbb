import "../services/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const FirebaseAuth = getAuth();

export const Authentication = () => {
  return FirebaseAuth;
};

//sign in pengguna
export const SignIn = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(FirebaseAuth, email, password);
  } catch (error: any) {
    console.log("Firebase Error:", error.code, error.message);
    throw error;
  }
};

//mendapatkan error signin
export const GetSignInErrorMessage = (code: any) => {
  console.log(code);
  switch (code) {
    case "auth/user-not-found":
      console.log(code);
      return "Email tidak terdaftar";
    case "auth/wrong-password":
      console.log(code);
      return "Password salah";
    default:
      return "Email atau password salah";
  }
};

//sign out pengguna
export const SignOut = async () => {
  await SignOut();
};

//mendapatkan user yang sign in
export const getCurrentUser = () => {
  const user = FirebaseAuth.currentUser;
  if (user !== null) {
    return user.uid;
  }
  return null;
};
