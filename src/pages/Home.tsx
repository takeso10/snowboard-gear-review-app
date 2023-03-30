import React, { useState } from 'react'
import {useEffect} from 'react'
import { auth, db } from '../firebase'
import { useAuthState} from "react-firebase-hooks/auth"
import {Header} from '../components/Header'
import {collection, doc, getCountFromServer, getDocs, orderBy, query, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore'
import { useNavigate } from "react-router-dom";


type ReviewItem={
    category:string,
    brand:string,
    gearName:string,
    review:string,
    condition:string,
    day:Timestamp,
    userID:string
}

type Reviews = {
    reviewID:string,
    reviewItem:ReviewItem,
    LikedUserCount:number
}

type IDList = {
    reviewID:string,
    review:string,
    userID:string
}

export const Home=()=>{
    const [user]=useAuthState(auth)
    //const [reviews,setReviews] = useState<Review[]>([])
    const [reviews,setReviews] = useState<Reviews[]>([])
    //const [reviewIDList,setReviewIDList] = useState<IDList[]>([])
    const navigate = useNavigate()

    /*
    {useEffect(()=>{
        (async ()=>{
        const querySnapshot = await getDocs(query(collection(db, "reviews"),orderBy('day','desc')));
        querySnapshot.forEach((doc)=>{
            console.log(doc.id)
            doc.data().review = doc.id
            console.log(doc.data().reviewID)
            setReviewIDList((reviewIDList)=>[...reviewIDList,{
                reviewID:doc.id,
                review:doc.data().review,
                userID:doc.data().userId
            }])
            setReviews((reviews)=>[...reviews,doc.data() as Review])
        })
        console.log(serverTimestamp())
        })()
    },[]
    )
    }*/

    useEffect(()=>{
        (async ()=>{
            const querySnapshot = await getDocs(query(collection(db, "reviews"),orderBy('day','desc')));
            querySnapshot.forEach(async (doc)=>{
                const LikedUserCount = await getCountFromServer(query(collection(db,'reviews',doc.id,'LikedUserID')))
                console.log(LikedUserCount.data())
                setReviews((reviews)=>[...reviews,{
                    reviewID:doc.id,
                    reviewItem:doc.data() as ReviewItem,
                    LikedUserCount:LikedUserCount.data().count
                }])
            })
            
        })()
    },[])

    const OnGood=(e:string)=>{
        console.log(e)
        setDoc(doc(db,'reviews',e,'LikedUserID',user!.uid),{
            LikedUser:user!.uid,
            createTime:serverTimestamp()
        })
    }

    return(
        <div>
            <>
                <Header/>
                <div className='reviews'>
                    <ul className="review-list">
                        {reviews.map((review:Reviews,index)=>{
                            return(
                                <div key={index} onClick={()=>{navigate(`reviewDetail/${review.reviewID}`,{state:{reviewID:review.reviewID}})}} className='review-item'>
                                    <div className='review-detail'>
                                        <p>{review.reviewItem.brand}</p>
                                        <p>{review.reviewItem.gearName}</p>
                                        <p>{review.reviewItem.review}</p>
                                    </div>
                                    <button onClick={()=>{OnGood(review.reviewID)}}>❤ {review.LikedUserCount}</button>
                                    <br/>
                                </div>
                        )})}
                    </ul>
                    <button onClick={()=>{navigate('/newReview')}}>新規投稿</button>
                </div>
            </>
        </div>
    )
}

