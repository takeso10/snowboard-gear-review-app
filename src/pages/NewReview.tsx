import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header'
import { auth, db } from '../firebase';

type Inputs={
  category:string,
  brand:string,
  gearName:string,
  review:string,
  condition:string,
  day:number,
  userID:string,
}

export default function NewReview() {
  const navigate = useNavigate()
  const [user]=useAuthState(auth)
  const {register, handleSubmit,formState: { errors }}=useForm<Inputs>();

  const [brandList,setBrandList]=useState([])


  const onSubmit:SubmitHandler<Inputs>=(data)=>{
    data.day=new Date().getTime()
    const test =new Date().getTime()
    console.log(new Date(test))
    data.userID=user!.uid
    addDoc(collection(db,"reviews"),data)
    console.log(data)
    navigate('/')
  }

  return (
    <>
      <Header/>
      <div className="new-review">
        <h1>新規レビュー投稿</h1>
        <form className="new-review-form" onClick={handleSubmit(onSubmit)}>
                <label htmlFor ="name">ブランド</label>
                <br/>
                <select {...register("brand")} className="brand-input" placeholder="brand">
                    <option>CAPITA</option>
                    <option>BURTON</option>
                    <option>SALOMON</option>
                    <option>SIMS</option>
                    <option>RIDE</option>
                </select>
                <br/>
                <label htmlFor ="category">カテゴリー</label>
                <br/>
                <select {...register("category")} className="category-input" placeholder="category">
                    <option>ボード</option>
                    <option>ビンディング</option>
                    <option>ブーツ</option>
                </select>
                <br/>
                <label htmlFor ="gearName">ギア名</label>
                <br/>
                <input
                    type="text"
                    placeholder="gearName"
                    className="gearName-input"
                    {...register('gearName',{
                        required:{
                            value:true,
                            message:'入力必須の項目です。'
                        }
                    })}/>
                <br/>
                <label htmlFor ="condition">コンディション</label>
                <br/>
                <select {...register("condition")} className="condition-input" placeholder="category">
                    <option>パウダー</option>
                    <option>圧雪</option>
                    <option>シャバ雪</option>
                </select>
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
            <button type="submit"  className="signup-button">作成</button>
            </form>
      </div>      
    </>
  )
}

