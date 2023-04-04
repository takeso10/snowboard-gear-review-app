import { addDoc, collection, getDocs, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header'
import { auth, db } from '../firebase';
import './NewReview.scss'
//import ReactStarsRating from 'react-awesome-stars-rating'

type Inputs={
  category:string,
  brand:string,
  gearName:string,
  review:string,
  day:Timestamp,
  userID:string,
  park:string,
  gt:number,
  carving:number,
  powder:number,
  allMountain:number,
  flex:number,
  total:number,
}

type Brand={
  name:string
}

export default function NewReview() {
  const navigate = useNavigate()
  const [user]=useAuthState(auth)
  const {register, handleSubmit,formState: { errors }}=useForm<Inputs>()
  const [brands, setBrands] = useState<Brand[]>([])
  const [gearNames,setGearNames] = useState<Brand[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>("BURTON")
  const [selectedCategory, setSelectedCategory]= useState('board')

  useEffect(()=>{
    (async()=>{
      const q = query(collection(db, "brands"))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc)=>{
        console.log(doc.data())
        setBrands((brands)=>[...brands,{
          name:doc.data().name
        }])
      })
    })()
  },[])

  const onChangeBrand=(e:any)=>{
    setSelectedBrand(e)
  }

  const OnChangeCategory=async (e:any)=>{
    setSelectedCategory(e)
    console.log(selectedBrand)
    console.log(selectedCategory)
    const gearListDocs = await getDocs(collection(db,"brands",selectedBrand,selectedCategory))
    gearListDocs.forEach((doc)=>{
      setGearNames((gearNames)=>[...gearNames,{
        name:doc.data().name
      }])
      console.log(doc.data())
    })
  }

  const onSubmit:SubmitHandler<Inputs>=(data:Inputs)=>{
    addDoc(collection(db,"reviews"),{
      category:data.category,
      brand:data.brand,
      gearName:data.gearName,
      review:data.review,
      day:serverTimestamp(),
      userID:user!.uid,
      park:data.park,
      gt:data.gt,
      carving:data.carving,
      powder:data.powder,
      allMountain:data.allMountain,
      flex:data.flex,
      total:data.total
    })
    console.log(data)
    navigate('/')
  }

  return (
    <>
      <Header/>
      <div className="new-review">
        <h1>新規レビュー投稿</h1>
        <form className="new-review-form" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor ="name">ブランド</label>
                <br/>
                <button onClick={()=>{navigate('../EditBrands')}}>新規ブランド・ギア追加</button>
                <br/>
                <select 
                  className="brand-input" 
                  placeholder="brand" 
                  {...register("brand",{
                        required:{
                            value:true,
                            message:'入力必須の項目です。'
                        }})}
                  onChange={(e)=>onChangeBrand(e.target.value)}>
                    {brands.map((brand:Brand,index)=>{
                      return(
                        <option key={index} value={brand.name}>{brand.name}</option>
                      )
                    })}
                </select>
                <br/>
                <label htmlFor ="category">カテゴリー</label>
                <br/>
                <select 
                  className="category-input"
                  placeholder="category"
                  {...register("category",{
                    required:{
                      value:true,
                      message:'入力必須の項目です。'
                    }
                  })}
                  onChange={(e)=>OnChangeCategory(e.target.value)}>
                    <option value="board">ボード</option>
                    <option value="binding">ビンディング</option>
                    <option value="boots">ブーツ</option>
                </select>
                <br/>
                <label htmlFor ="gearName">ギア名</label>
                <br/>
                <select
                    placeholder="gearName"
                    className="gearName-input"
                    {...register('gearName',{
                        required:{
                            value:true,
                            message:'入力必須の項目です。'
                        }
                    })}/>
                    {gearNames.map((gearName:Brand,index)=>{
                      return(
                        <option key={index} value={gearName.name}>{gearName.name}</option>
                      )
                    })}
                <br/>
                <label htmlFor ="review">コメント</label>
                <br/>
                <textarea
                    placeholder="review"
                    className="review-input"
                    {...register('review',{
                        required:{
                            value:true,
                            message:"入力必須の項目です。"
                        }
                    })}
                />
                <br/>
                {/*
                {styleList.map((style)=>{
                  return(
                    <>
                      <label>{style}</label>
                      <div className="rate-form">
                        <input id={style+"5"} type="radio" value="5" {...register(style)}/>
                        <label htmlFor={style+"5"}>★</label>
                        <input id={style+"4"} type="radio" value="4" {...register("park")}/>
                        <label htmlFor={style+"4"}>★</label>
                        <input id={style+"3"} type="radio" value="3" {...register("park")}/>
                        <label htmlFor={style+"3"}>★</label>
                        <input id={style+"2"} type="radio" value="2" {...register("park")}/>
                        <label htmlFor={style+"2"}>★</label>
                        <input id={style+"1"} type="radio" value="1" {...register("park")}/>
                        <label htmlFor={style+"1"}>★</label>
                      </div>
                    </>
                  )}
                )}
                  */}
                <h2>スタイル別評価</h2>
                <div>
                <label>パーク</label>
                <div className="rate-form" >
                  <input id="park5" type="radio" value="5" {...register("park")}/>
                  <label htmlFor="park5">★</label>
                  <input id="park4" type="radio" value="4" {...register("park")}/>
                  <label htmlFor="park4">★</label>
                  <input id="park3" type="radio" value="3" {...register("park")}/>
                  <label htmlFor="park3">★</label>
                  <input id="park2" type="radio" value="2" {...register("park")}/>
                  <label htmlFor="park2">★</label>
                  <input id="park1" type="radio" value="1" {...register("park")}/>
                  <label htmlFor="park1">★</label>
                </div>
                <label>グラトリ</label>
                <div className="rate-form" >
                  <input id="gt5" type="radio" value="5" {...register("gt")}/>
                  <label htmlFor="gt5">★</label>
                  <input id="gt4" type="radio" value="4" {...register("gt")}/>
                  <label htmlFor="gt4">★</label>
                  <input id="gt3" type="radio" value="3" {...register("gt")}/>
                  <label htmlFor="gt3">★</label>
                  <input id="gt2" type="radio" value="2" {...register("gt")}/>
                  <label htmlFor="gt2">★</label>
                  <input id="gt1" type="radio" value="1" {...register("gt")}/>
                  <label htmlFor="gt1">★</label>
                </div>
                <label>カービング</label>
                <div className="rate-form">
                  <input id="carving5" type="radio" value="5" {...register("carving")}/>
                  <label htmlFor="carving5">★</label>
                  <input id="carving4" type="radio" value="4" {...register("carving")}/>
                  <label htmlFor="carving4">★</label>
                  <input id="caving3" type="radio" value="3" {...register("carving")}/>
                  <label htmlFor="carving3">★</label>
                  <input id="carving2" type="radio" value="2" {...register("carving")}/>
                  <label htmlFor="carving2">★</label>
                  <input id="carving1" type="radio" value="1" {...register("carving")}/>
                  <label htmlFor="carving1">★</label>
                </div>
                <label>パウダー</label>
                <div className="rate-form">
                  <input id="powder5" type="radio" value="5" {...register("powder")}/>
                  <label htmlFor="powder4">★</label>
                  <input id="powder4" type="radio" value="4" {...register("powder")}/>
                  <label htmlFor="powder4">★</label>
                  <input id="powder3" type="radio" value="3" {...register("powder")}/>
                  <label htmlFor="powder3">★</label>
                  <input id="powder2" type="radio" value="2" {...register("powder")}/>
                  <label htmlFor="powder2">★</label>
                  <input id="powder1" type="radio" value="2" {...register("powder")}/>
                  <label htmlFor="powder1">★</label>
                </div>
                <label>オールマウンテン</label>
                <div className="rate-form">
                  <input id="allMountain5" type="radio" value="5" {...register("allMountain")}/>
                  <label htmlFor="allMountain4">★</label>
                  <input id="allMountain4" type="radio" value="4" {...register("allMountain")}/>
                  <label htmlFor="allMountain4">★</label>
                  <input id="allMountain3" type="radio" value="3" {...register("allMountain")}/>
                  <label htmlFor="allMountain3">★</label>
                  <input id="allMountain2" type="radio" value="2" {...register("allMountain")}/>
                  <label htmlFor="allMountain2">★</label>
                  <input id="allMountain1" type="radio" value="1" {...register("allMountain")}/>
                  <label htmlFor="allMountain1">★</label>
                </div>
                <label>フレックス</label>
                <div className="rate-form" >
                  <input id="flex5" type="radio" value="5" {...register("flex")}/>
                  <label htmlFor="flex5">★</label>
                  <input id="flex4" type="radio" value="4" {...register("flex")}/>
                  <label htmlFor="flex4">★</label>
                  <input id="flex3" type="radio" value="3" {...register("flex")}/>
                  <label htmlFor="flex3">★</label>
                  <input id="flex2" type="radio" value="2" {...register("flex")}/>
                  <label htmlFor="flex2">★</label>
                  <input id="flex1" type="radio" value="1" {...register("flex")}/>
                  <label htmlFor="flex1">★</label>
                </div>
                </div>
                <label>トータル</label>
                <div className="rate-form" >
                  <input id="total5" type="radio" value="5" {...register("total")}/>
                  <label htmlFor="total5">★</label>
                  <input id="total" type="radio" value="4" {...register("total")}/>
                  <label htmlFor="total4">★</label>
                  <input id="total3" type="radio" value="3" {...register("total")}/>
                  <label htmlFor="total3">★</label>
                  <input id="total" type="radio" value="2" {...register("total")}/>
                  <label htmlFor="total2">★</label>
                  <input id="total1" type="radio" value="1" {...register("total")}/>
                  <label htmlFor="total1">★</label>
                </div>
            <button type="submit" className="signup-button">作成</button>
            </form>
      </div>      
    </>
  )
}

