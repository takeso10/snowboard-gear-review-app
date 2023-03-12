import {React,useState,useEffect} from 'react'
import { auth } from '../firebase'
import { useAuthState} from "react-firebase-hooks/auth"
import {Header} from '../components/Header'

export const Home=()=>{
    const [user]=useAuthState(auth)

    useEffect(()=>{
        console.log(user)
    },[]
    )

    return(
        <div>
            <>
                <Header/>
            </>
        </div>
    )
}

