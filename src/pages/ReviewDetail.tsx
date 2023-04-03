import { doc, getDoc, Timestamp } from 'firebase/firestore'
import React, { useEffect ,useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { db } from '../firebase'

type ReviewItem={
    category:string,
    brand:string,
    gearName:string,
    review:string,
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

export function ReviewDetail() {
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedReviewID,setSelectedReviewID] = useState(location.state as {reviewID:string})
    const [reviewDetail,setReviewDetail] = useState<ReviewItem>()

    useEffect(()=>{
        (async ()=>{
            console.log(selectedReviewID.reviewID)
            const docRef = doc(db,"reviews",selectedReviewID.reviewID)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                console.log(docSnap.data())
                setReviewDetail(docSnap.data() as ReviewItem)
            }else{
                navigate('/')
            }
            console.log(reviewDetail)
    })()},
    [])

  return (
    <>
        <Header/>
        <div className="main">
            <p>{reviewDetail?.brand}</p>
            <p>{reviewDetail?.gearName}</p>
            <h2>{reviewDetail?.review}</h2>
        </div>
    </>
  )
}
