import {React,useState} from 'react'
import { auth } from '../firebase'
import { useAuthState} from "react-firebase-hooks/auth"

export const Home=()=>{
    const [user]=useAuthState(auth)

    return(
        <div>
            <>
            </>
        </div>
    )
}

