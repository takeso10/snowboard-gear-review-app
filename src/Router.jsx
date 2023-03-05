import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { auth } from './firebase'
import { useAuthState} from "react-firebase-hooks/auth"
import { Home } from './pages/Home'
import {Signin} from './pages/Signin'
import { Profile } from './pages/Profile'


export const Router = () =>{
    const [user]=useAuthState(auth)
    return(
        <BrowserRouter>
            <Routes>
                {user ?(
                    <>
                        <Route path = "/" element={<Home/>}/>
                        <Route path ='profile' element={<Profile/>}/>
                    </>
                ):(
                    <>
                        <Route path = "/" element={<Navigate replace to ="/Signin"/>}/>
                        <Route path ='signin' element={<Signin/>}/>
                    </>
                )}
            </Routes>
        </BrowserRouter>
    )
}