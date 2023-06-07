import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db, storage } from '../firebase'
import { Timestamp, collection, doc, getCountFromServer, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'
import './FavoriteReviews.scss'

type ReviewItem = {
  category: string
  brand: string
  gearName: string
  review: string
  condition: string
  day: Timestamp
  userID: string
  park: number
  gt: number
  carving: number
  powder: number
  allMountain: number
  flex: number
  total: number
}

type FavoriteReviews = {
  iconURL: string
  reviewerName: string
  reviewID: string
  reviewItem: ReviewItem
}

export default function FavoriteReviwes() {
  const [user] = useAuthState(auth)
  const [reviewerName, setReviewerName] = useState<string>()
  const [iconURL, setIconURL] = useState<string>()
  const [reviews, setReviews] = useState<FavoriteReviews[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const q = await getDocs(query(collection(db, 'profiles', user!.uid, 'LikedReview')))
      const list: string[] = []
      q.forEach(async (doc) => {
        list.push(doc.data().LikedReview)
      })
      list.forEach(async (e) => {
        const docSnap = await getDoc(doc(db, 'reviews', e))
        console.log(docSnap.data())
        const userID: string = docSnap.data()!.userID
        const docRef = doc(db, 'profiles', userID)
        getDoc(docRef).then((doc) => {
          const iconRef = ref(storage, `image/${doc.data()!.ImageName}`)
          setReviewerName(doc.data()!.name)
          getDownloadURL(iconRef).then((url) => {
            setReviews((reviews) => [
              ...reviews,
              {
                iconURL: url,
                reviewerName: doc.data()!.name,
                reviewID: docSnap.id,
                reviewItem: docSnap.data() as ReviewItem,
              },
            ])
            setIconURL(url)
          })
        })
      })
    })()
  }, [])
  return (
    <div>
      <Header />
      <div className="reviews">
        <div className="reviews-title">
          <h2>お気に入りレビュー</h2>
        </div>
        <div className="review-list">
          {reviews.map((review: FavoriteReviews, index) => {
            return (
              <div key={index} className="review-item">
                <div className="icon">
                  {review.iconURL ? <img src={review.iconURL} className="icon-image"></img> : <></>}
                  <p>{review.reviewerName}</p>
                </div>
                <div
                  className="review-overview"
                  onClick={() => {
                    navigate(`reviewDetail/${review.reviewID}`, {
                      state: { reviewID: review.reviewID },
                    })
                  }}
                >
                  <p className="">BRAND：{review.reviewItem.brand}</p>
                  <br />
                  <p>NAME：{review.reviewItem.gearName}</p>
                  <h2>{review.reviewItem.review}</h2>
                  <p className="star-image">★</p>
                  <p className="star-count">{review.reviewItem.total}</p>
                </div>
                <br />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
