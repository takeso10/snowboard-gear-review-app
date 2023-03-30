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
    condition:string,
    day:Timestamp,
    userID:string
}

export default function ReviewDetail() {
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedReviewID,setSelectedReviewID] = useState(location.state as {reviewID:string})
    const [reviewDetail,setReviewDetail] = useState<ReviewItem>({
        category:' ',
        brand:' ',
        gearName:' ',
        review:' ',
        condition:' ',
        day:2020-04-01 08:30:00,
        userID:''
    })

    useEffect(()=>{
        (async ()=>{
            console.log(selectedReviewID)
            const docRef = doc(db,"reviews",selectedReviewID.reviewID)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                setReviewDetail(docSnap.data() as ReviewItem)
            }else{
                navigate('/')
            }

    })()},
    [])

  return (
    <div className="main">
        <Header/>
        <div className="review">
            <h2>{reviewDetail!.review}</h2>
        </div>
    </div>
  )
}
