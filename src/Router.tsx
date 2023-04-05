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
                        <Route path = "snowboard-gear-review-app" element={<Home/>}/>
                        <Route path ='/snowboard-gear-review-app/profile' element={<Profile/>}/>
                        <Route path ="/snowboard-gear-review-app/signin" element={<Navigate replace to ="/snowboard-gear-review-app"/>}/>
                        <Route path ="/snowboard-gear-review-app/newProfile" element={<NewProfile/>}/>
                        <Route path ="/snowboard-gear-review-app/newReview" element={<NewReview/>}/> 
                        <Route path ="/snowboard-gear-review-app/reviewDetail/:id" element={<ReviewDetail/>}/> 
                        <Route path ="/snowboard-gear-review-app/editBrands" element={<EditBrands/>}/>
                    </>
                ):(
                    <>
                        <Route path = "/snowboard-gear-review-app" element={<Navigate replace to ="/snowboard-gear-review-app/signin"/>}/>
                        <Route path ='/snowboard-gear-review-app/signin' element={<Signin/>}/>
                        <Route path ="/snowboard-gear-review-app/profile" element={<Navigate replace to ="/snowboard-gear-review-app/signin"/>}/>
                        <Route path ='/snowboard-gear-review-app/signup' element={<Signup/>}/>

                    </>
                )}
            </Routes>
        </BrowserRouter>
    )
}