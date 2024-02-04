import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../utils/env";

export const initFirebase = () => {
  initializeApp(firebaseConfig);
};
