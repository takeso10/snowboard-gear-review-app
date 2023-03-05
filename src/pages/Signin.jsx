import { signInWithPopup } from "firebase/auth";
import {auth, provider } from "../firebase";

export const Signin=()=>{
    const signInWithGoogle = ()=>{
        signInWithPopup(auth, provider)
    }
    return(
        <button onClick={signInWithGoogle}>
        <p>Googleでサインイン</p>
        </button>
    )
}