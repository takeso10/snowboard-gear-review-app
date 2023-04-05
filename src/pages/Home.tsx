import React, { useState } from 'react'
import {useEffect} from 'react'
import { auth, db } from '../firebase'
import { useAuthState} from "react-firebase-hooks/auth"
import {Header} from '../components/Header'
import {collection, doc, getCountFromServer, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore'
import { useNavigate } from "react-router-dom";


type ReviewItem={
    category:string,
    brand:string,
    gearName:string,
    review:string,
    condition:string,
    day:Timestamp,
    userID:string,
    park:number,
    gt:number,
    carving:number,
    powder:number,
    allMountain:number,
    flex:number,
    total:number,
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
                setReviews((reviews)=>[...reviews,{
                    reviewID:doc.id,
                    reviewItem:doc.data() as ReviewItem,
                    LikedUserCount:LikedUserCount.data().count
                }])
            })
            console.log(reviews)
        })()
    },[])

    const OnGood=async (e:string)=>{
        console.log(e)
        setDoc(doc(db,'reviews',e,'LikedUserID',user!.uid),{
            LikedUser:user!.uid,
            createTime:serverTimestamp()
        })
        const querySnapshot = await getDocs(query(collection(db, "reviews"),orderBy('day','desc')));
        querySnapshot.forEach(async (doc)=>{
            const LikedUserCount = await getCountFromServer(query(collection(db,'reviews',doc.id,'LikedUserID')))
            setReviews((reviews)=>[...reviews,{
                reviewID:doc.id,
                reviewItem:doc.data() as ReviewItem,
                LikedUserCount:LikedUserCount.data().count
            }])
        })
    }

    return(
        <div>
            <>
                <Header/>
                <div className='reviews'>
                    <div>
                        
                    </div>
                    <ul className="review-list">
                        {reviews.map((review:Reviews,index)=>{
                            return(
                                <div key={index} className='review-item'>
                                    <div className='review-detail' onClick={()=>{navigate(`snowboard-gear-review-app/reviewDetail/${review.reviewID}`,{state:{reviewID:review.reviewID}})}} >
                                        <p>{review.reviewItem.brand}</p>
                                        <p>{review.reviewItem.gearName}</p>
                                        <h2>{review.reviewItem.review}</h2>
                                        <p>★{review.reviewItem.total}</p>
                                    </div>
                                    <button onClick={()=>{OnGood(review.reviewID)}}>❤ {review.LikedUserCount}</button>
                                    <br/>
                                </div>
                        )})}
                    </ul>
                    <button onClick={()=>{navigate('snowboard-gear-review-app//newReview')}}>新規投稿</button>
                </div>
            </>
        </div>
    )
}

