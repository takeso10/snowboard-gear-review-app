import React, { useState } from 'react'
import {useEffect} from 'react'
import { auth, db } from '../firebase'
import { useAuthState} from "react-firebase-hooks/auth"
import {Header} from '../components/Header'
import { collection, getDocs, query } from 'firebase/firestore'
import { useNavigate } from "react-router-dom";


export const Home=()=>{
    const [user]=useAuthState(auth)
    const [reviews,setReviews] =useState([{}])
    const navigate = useNavigate()

    useEffect(()=>{
        console.log(user)
        const querySnapshot = getDocs(collection(db, "reviews"));
        console.log(querySnapshot)
        querySnapshot.forEach((doc)=>{
            console.log(doc.data())
            setReviews([...reviews,doc.data()])
        })
    },[]
    )

    return(
        <div>
            <>
                <Header/>
                <div className='reviews'>
                    <div className="review">
                        
                    </div>
                    <button onClick={()=>{navigate('/newReview')}}>新規投稿</button>
                </div>
            </>
        </div>
    )
}

