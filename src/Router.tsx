import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { auth } from './firebase'
import { useAuthState} from "react-firebase-hooks/auth"
import { Home } from './pages/Home'
import { Signin } from './pages/Signin'
import { Profile } from './pages/Profile'
import { Signup} from "./pages/Signup"
import {NewProfile} from "./pages/NewProfile"
import NewReview from './pages/NewReview'
import {ReviewDetail} from './pages/ReviewDetail'
import EditBrands from './pages/EditBrands'


export const Router = () =>{
    const [user]=useAuthState(auth)
    return(
        <BrowserRouter>
            <Routes>
                {user ?(
                    <>
                        <Route path = "/" element={<Home/>}/>
                        <Route path ='profile' element={<Profile/>}/>
                        <Route path ="signin" element={<Navigate replace to ="/"/>}/>
                        <Route path ="newProfile" element={<NewProfile/>}/>
                        <Route path ="newReview" element={<NewReview/>}/> 
                        <Route path ="reviewDetail/:id" element={<ReviewDetail/>}/> 
                        <Route path ="editBrands" element={<EditBrands/>}/>
                    </>
                ):(
                    <>
                        <Route path = "/" element={<Navigate replace to ="signin"/>}/>
                        <Route path ='signin' element={<Signin/>}/>
                        <Route path ="profile" element={<Navigate replace to ="signin"/>}/>
                        <Route path ='signup' element={<Signup/>}/>

                    </>
                )}
            </Routes>
        </BrowserRouter>
    )
}