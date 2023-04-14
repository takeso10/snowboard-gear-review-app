import React, { useState } from 'react'
import {useEffect} from 'react'
import { auth, db, storage } from '../firebase'
import { useAuthState} from "react-firebase-hooks/auth"
import {Header} from '../components/Header'
import {collection, doc, getCountFromServer,getDoc,getDocs, orderBy, query, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore'
import { useNavigate } from "react-router-dom";
import "./Home.scss"
import { getDownloadURL, ref } from 'firebase/storage'

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
    iconURL:string,
    reviewerName:string,
    reviewID:string,
    reviewItem:ReviewItem,
    LikedUserCount:number
}

/*type Reviews = {
    reviewID:string,
    reviewItem:ReviewItem,
    LikedUserCount:number
}
*/


type IDList = {
    reviewID:string,
    review:string,
    userID:string
}

type Brand={
    name:string,
    checked:boolean
  }

export const Home=()=>{
    const [user]=useAuthState(auth);
    //const [reviews,setReviews] = useState<Review[]>([])
    const [reviews,setReviews] = useState<Reviews[]>([])
    //const [reviewIDList,setReviewIDList] = useState<IDList[]>([])
    const navigate = useNavigate()
    const [brands, setBrands] = useState<Brand[]>([])
    const [ImageName,setImageName] = useState<string>()
    const [reviewerName, setReviewerName]=useState<string>()
    const [iconURL,setIconURL] = useState<string>()
    const [selectedBrands,setSelectedBrands]=useState<string[]>([])

    useEffect(()=>{
        (async ()=>{
            const querySnapshot = await getDocs(query(collection(db, "reviews"),orderBy('day','desc')));
            querySnapshot.forEach(async (Snapshot)=>{
                const LikedUserCount = await getCountFromServer(query(collection(db,'reviews',Snapshot.id,'LikedUserID')))
                const userID:string = Snapshot.data().userID
                const docRef = doc(db,"profiles",userID)
                getDoc(docRef).then((docSnap)=>{
                    const iconRef = ref(storage, `image/${docSnap.data()!.ImageName}`)
                    setReviewerName(docSnap.data()!.name)
                    getDownloadURL(iconRef)
                    .then((url)=>{
                        setReviews((reviews)=>[...reviews,{
                            iconURL:url,
                            reviewerName:docSnap.data()!.name,
                            reviewID:Snapshot.id,
                            reviewItem:Snapshot.data() as ReviewItem,
                            LikedUserCount:LikedUserCount.data().count
                        }])
                        setIconURL(url)
                    })
                })
            })
            const b = query(collection(db, "brands"))
            const brandsSnapshot = await getDocs(b)
            const list: any[]=[]
            brandsSnapshot.forEach((doc)=>{
                list.push(doc.data().name)
                console.log(doc.data().name)
                setBrands((brands)=>[...brands,{
                    name:doc.data().name,
                    checked:true
                }])
            })
            setSelectedBrands(list as string[])
        })()
    },[])
    

    const OnGood=async (e:string)=>{
        console.log(e)
        setDoc(doc(db,"profiles",user!.uid,"LikedReview",e),{
            LikedReview:e,
            createTime:serverTimestamp()
        })
        setDoc(doc(db,'reviews',e,'LikedUserID',user!.uid),{
            LikedUser:user!.uid,
            createTime:serverTimestamp()
        })
        const querySnapshot = await getDocs(query(collection(db, "reviews"),orderBy('day','desc')));
        querySnapshot.forEach(async (doc)=>{
            const LikedUserCount = await getCountFromServer(query(collection(db,'reviews',doc.id,'LikedUserID')))
            setReviews((reviews)=>[...reviews,{
                iconURL:iconURL!,
                reviewerName:reviewerName!,
                reviewID:doc.id,
                reviewItem:doc.data() as ReviewItem,
                LikedUserCount:LikedUserCount.data().count
            }])
        })
    }

    const onChangeBrand=(e:any)=>{
        e.target.checked?(
            setSelectedBrands([...selectedBrands,e.target.value])
        ):(
            setSelectedBrands(selectedBrands.filter((brand)=>brand.match(e.target.value)===null))
        )
    }

    
    console.log(brands)
    console.log(selectedBrands)
    let newReviews=reviews.filter((data:Reviews)=>selectedBrands.includes(data.reviewItem.brand))
    


    return(
        <div>
            <Header/>
            <main>
                <div className="review-view">
                    <div className="review-serch">
                        <h2>絞り込み</h2>
                        <div className="search-input">
                            <h3>ブランド</h3>
                            {brands.map((brand,index)=>{
                                return(
                                    <div className="brand-inputs" key={index}>
                                        <input id={brand.name} className="brand-input" value={brand.name} type="checkbox" onChange={onChangeBrand} defaultChecked></input>
                                        <label htmlFor={brand.name}>{brand.name}</label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <br/>
                    <button onClick={()=>{navigate('../newReview')}}>新規投稿</button>
                    <br/>
                    <button onClick={()=>{navigate('../favoriteReviews')}}>お気に入りレビュー一覧</button>
                </div>
                <div className='reviews'>
                    <div className="reviews-title">
                        <h2>レビュー</h2>
                    </div>
                    <div className="review-list">
                        {newReviews.map((review:Reviews,index)=>{
                            return(
                                <div key={index} className='review-item'>
                                    <div className="icon">
                                    {review.iconURL?(
                                        <img src={review.iconURL} className="icon-image"></img>
                                    ):(
                                        <></>
                                    )}
                                    <p>{review.reviewerName}</p>
                                    </div>
                                    <div className='review-overview' onClick={()=>{navigate(`reviewDetail/${review.reviewID}`,{state:{reviewID:review.reviewID}})}} >
                                        <p className="">BRAND：{review.reviewItem.brand}</p>
                                        <br/>
                                        <p>NAME：{review.reviewItem.gearName}</p>
                                        <h2>{review.reviewItem.review}</h2>
                                        <p className="star-image">★</p>
                                        <p className="star-count">{review.reviewItem.total}</p>
                                    </div>
                                    <button className="good-button" onClick={()=>{OnGood(review.reviewID)}}>❤ {review.LikedUserCount}</button>
                                    <br/>
                                </div>
                        )})}
                    </div>
                </div>
            </main>
        </div>
    )
}

