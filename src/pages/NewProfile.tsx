import {Header} from "../components/Header"
import {auth, db} from "../firebase"
import { useAuthState} from "react-firebase-hooks/auth"
import { doc, getDoc, setDoc} from "firebase/firestore";
import {useForm ,SubmitHandler} from 'react-hook-form';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { SetprofileSet } from "./Profile";

type Inputs ={
    name:string,
    email:string,
    style:string,
    experience:number,
    days:string,
    home:string
}

export const NewProfile =()=>{
    const navigate = useNavigate()
    const [user]=useAuthState(auth)
    const {register, handleSubmit,formState: { errors }}=useForm<Inputs>();
    const [profile,setProfile]=useState<Inputs>(
        {
            days:'',
            experience:0,
            home:'',
            style:'',
            name:'',
            email:""
        }
    )

    const onSubmit:SubmitHandler<Inputs> = (data)=>{
        console.log(user)
        data.email=user!.email!
        console.log(data)
        setDoc(doc(db, "profiles",user!.uid!),data)
        //SetprofileSet(true)
        navigate('/profile')
    }

    useEffect(()=>{
        const docRef = doc(db, "profiles",user!.uid!)
        getDoc(docRef).then((docSnap)=>{
            if(docSnap.data()===undefined){
            }
            else{
                setProfile(docSnap.data() as Inputs)
            }
        })
    },[])

    return(
        <>
        <Header/>
        <div className="new-profile">
            <h1>プロフィール作成</h1>
            <form className="profile-form" onClick={handleSubmit(onSubmit)}>
                <label htmlFor ="name">ユーザー名</label>
                <br/>
                <input
                    type="text"
                    placeholder="username"
                    className="name-input"
                    defaultValue={profile.name}
                    {...register('name',{
                        required:{
                            value:true,
                            message:'入力必須の項目です。'
                        }
                    })}/>
                <br/>
                <label htmlFor="email">メールアドレス</label>
                <br/>
                <p>{user!.email}</p>
                <br/>
                <label htmlFor ="style">スタイル</label>
                <br/>
                <select {...register("style")} className="style-input" placeholder="style" defaultValue={profile.style}>
                    <option>パーク</option>
                    <option>パウダー</option>
                    <option>カービング</option>
                    <option>グラトリ、ジブ</option>
                    <option>オールマウンテン</option>
                </select>
                <br/>
                <label htmlFor="experience">滑走歴（年）</label>
                <br/>
                <input
                    type="number"
                    placeholder="experience"
                    className="experience-input"
                    defaultValue={profile.experience}
                    {...register('experience',{
                        required:{
                            value:true,
                            message:'入力必須の項目です。'
                        }
                })}/>
                <br/>
                <label htmlFor="days">年間滑走日数</label>
                <br/>
                <select {...register("days")} className="days-input" placeholder="style" defaultValue={profile.experience}>
                    <option>1~10</option>
                    <option>11~21</option>
                    <option>21~30</option>
                    <option>40~</option>
                </select>
                <br/>
                <label htmlFor="home">ホーム（よく行くところ）</label>
                <br/>
                <input
                    type="text"
                    placeholder="home"
                    className="home-input"
                    defaultValue={profile.home}
                    {...register('home',{
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