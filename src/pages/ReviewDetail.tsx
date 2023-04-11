import { doc, getDoc, Timestamp } from 'firebase/firestore'
import React, { useEffect ,useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { db } from '../firebase'
import "./ReviewDetail.scss"

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
        <div className="review-detail">
            <h1>REVIEW</h1>
            <h3>BRAND</h3>
            <p>{reviewDetail?.brand}</p>
            <h3>GEAR</h3>
            <p>{reviewDetail?.gearName}</p>
            <h2>COMMENT</h2>
            <p className="review">{reviewDetail?.review}</p>
            <div className="category">
                <h2>CATEGORY</h2>
                <span className="rate-wrap">PARK　　　　　　<span className="rate park" style={{['--park' as any]:reviewDetail?.park}}></span><span className="num">{reviewDetail?.park}</span></span>
                <span className="rate-wrap">GROUNDTRICK　　<span className="rate gt" style={{['--gt' as any]:reviewDetail?.gt}}></span><span className="num">{reviewDetail?.gt}</span></span>
                <span className="rate-wrap">POWDER　　　　　<span className="rate powder" style={{['--powder' as any]:reviewDetail?.powder}}></span><span className="num">{reviewDetail?.powder}</span></span>
                <span className="rate-wrap">CARVING　　　　<span className="rate carving" style={{['--carving' as any]:reviewDetail?.carving}}></span><span className="num">{reviewDetail?.carving}</span></span>
                <span className="rate-wrap">ALLMOUNTAIN　　<span className="rate allMountain" style={{['--allMountain' as any]:reviewDetail?.allMountain}}></span><span className="num">{reviewDetail?.allMountain}</span></span>
                <span className="rate-wrap">FLEX　　　　　　<span className="rate flex" style={{['--flex' as any]:reviewDetail?.flex}}></span><span className="num">{reviewDetail?.flex}</span></span>
            </div>
            <h2>TOTAL</h2>
            <span className="rate-wrap">FLEX　　　　　　　　<span className="rate total" style={{['--total' as any]:reviewDetail?.total}}></span><span className="num">{reviewDetail?.total}</span></span>
        </div>
    </>
  )
}
