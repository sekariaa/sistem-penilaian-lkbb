import "../services/firebase";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { SigninType, UserType } from "@/types";

/**
 * fungsi dari Firebase untuk melakukan operasi autentikasi, seperti login, logout, dan mendaftar pengguna baru
 * getAuth menyimpan informasi seperti kredensial pengguna yang saat ini aktif dan token
 */
export const Authentication = () => {
  return getAuth();
};

/**
 * fungsi untuk signin user
 * destructuring
 */
export const SignIn = async ({ email, password }: SigninType) => {
  await signInWithEmailAndPassword(Authentication(), email, password);
};

/**
 * mendapatkan pesan error berdasarkan kode error firebase
 * string pertama menandakan input, string kedua menandakan output
 */
export const GetSignInErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "Email tidak terdaftar";
    case "auth/wrong-password":
      return "Password salah";
    default:
      return "Email atau password salah";
  }
};

/**
 * fungsi untuk sign out pengguna
 */
export const SignOut = async () => {
  await signOut(Authentication());
};

/**
 * mendapatkan data pengguna yang sedang login
 */
export const getCurrentUser = (): UserType | null => {
  const user = Authentication().currentUser;
  return user ? { uid: user.uid, email: user.email } : null;
};
