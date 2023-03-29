import React, { useState } from 'react'
import {useEffect} from 'react'
import { auth, db } from '../firebase'
import { useAuthState} from "react-firebase-hooks/auth"
import {Header} from '../components/Header'
import { collection, getDocs, query } from 'firebase/firestore'
import { useNavigate } from "react-router-dom";


type Review={
    category:string,
    brand:string,
    gearName:string,
    review:string,
    condition:string,
    day:number,
    userID:string
}

export const Home=()=>{
    const [user]=useAuthState(auth)
    const [reviews,setReviews] =useState<Review[]>([])
    const navigate = useNavigate()

    useEffect(()=>{
        (async ()=>{
        const querySnapshot = await getDocs(collection(db, "reviews"));
        querySnapshot.forEach((doc)=>{
            console.log(doc.id)
            //doc.data().reviewID = doc.id
            console.log(doc.data())
            setReviews((reviews)=>[...reviews,doc.data() as Review])
        })
        console.log(reviews)
        })()
    },[]
    )

    return(
        <div>
            <>
                <Header/>
                <div className='reviews'>
                    <ul className="review-list">
                        {reviews.map((review:Review,index)=>{
                            return(
                                <li className="review-item" key={index} >
                                    <p>{review.brand}</p>
                                    <p>{review.gearName}</p>
                                    <p>{review.review}</p>
                                </li>
                        )})}
                    </ul>
                    <button onClick={()=>{navigate('/newReview')}}>新規投稿</button>
                </div>
            </>
        </div>
    )
}

