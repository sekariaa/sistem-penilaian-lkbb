import "../services/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const FirebaseAuth = getAuth();

export const Authentication = () => {
  return FirebaseAuth;
};

//sign in pengguna
export const SignIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(FirebaseAuth, email, password);
};

//mendapatkan error signin
export const GetSignInErrorMessage = (code: any) => {
  console.log(code);
  switch (code) {
    case "auth/user-not-found":
      return "Email tidak terdaftar";
    case "auth/wrong-password":
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
export const getCurrentUser = (): {
  uid: string;
  email: string | null;
} | null => {
  const user = FirebaseAuth.currentUser;
  if (user !== null) {
    const { uid, email } = user;
    return { uid, email };
  }
  return null;
};
