import {Header} from "../components/Header"
import {auth, db} from "../firebase"
import { useAuthState} from "react-firebase-hooks/auth"
import { doc, getDoc, setDoc} from "firebase/firestore";
import {useForm ,SubmitHandler} from 'react-hook-form';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase"
import {getDownloadURL, ref, uploadBytes} from "firebase/storage"
//import { SetprofileSet } from "./Profile";

type Inputs ={
    name:string,
    email:string,
    style:string,
    experience:number,
    days:string,
    home:string,
    ImageName:string
}

export const NewProfile =()=>{
    const navigate = useNavigate()
    const [user]=useAuthState(auth)
    const {register, handleSubmit,formState: { errors }}=useForm<Inputs>();
    const [ImageName, setImageName]=useState<string>('')
    const [iconURL,setIconURL]=useState<string>('')

    const [profile,setProfile]=useState<Inputs>(
        {
            days:'',
            experience:0,
            home:'',
            style:'',
            name:'',
            email:"",
            ImageName:""
        }
    )

    const UploadImage=(e:any)=>{
        console.log(e.target.files[0])
        const file = e.target.files[0]
        const storageRef = ref(storage, "image/" + file.name)
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
        setImageName(file.name)
        const iconRef = ref(storage, `image/${file.name}`)
        getDownloadURL(iconRef)
            .then((url)=>{
                setIconURL(url)
            })
            .catch((error)=>{
                switch (error.code) {
                    case 'storage/object-not-found':
                      // File doesn't exist
                      break;
                    case 'storage/unauthorized':
                      // User doesn't have permission to access the object
                      break;
                    case 'storage/canceled':
                      // User canceled the upload
                      break;
              
                    // ...
              
                    case 'storage/unknown':
                      // Unknown error occurred, inspect the server response
                      break;
                  }
            })
    }

    const onSubmit:SubmitHandler<Inputs> = (data)=>{
        console.log(user)
        data.email=user!.email!
        data.ImageName=ImageName
        console.log(data)
        setDoc(doc(db, "profiles",user!.uid!),data)
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
            <h1>プロフィール作成・編集</h1>
            <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor = "icon">アイコン</label>
                <br/>
                <input type = "file" accept = ".png, .jpeg, .jpg" onChange={UploadImage}></input>
                <br/>
                <img src={iconURL}></img>
                <br/>
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
            <button type="submit"  className="signup-button">作成・編集</button>
            </form>
        </div>
        </>
    )
}