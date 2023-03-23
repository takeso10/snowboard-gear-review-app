import React from 'react'
import {useEffect,useState} from 'react'
import {Header} from "../components/Header"
import {auth,db} from "../firebase"
import { useAuthState} from "react-firebase-hooks/auth"
import { getDoc,doc} from "firebase/firestore";
import { useNavigate } from 'react-router-dom'

type Inputs={
    name:string,
    style:string,
    experience:number,
    days:string,
    home:string
}



export const Profile =()=>{
    const [user]=useAuthState(auth)
    const navigate = useNavigate()
    const [profile,setProfile]=useState<Inputs>(
        {
            days:'',
            experience:0,
            home:'',
            style:'',
            name:''
        }
    )
    const [profileSet,SetProfileSet]=useState(false)
    
    useEffect(()=>{
        const docRef = doc(db, "profiles",user!.uid!)
        getDoc(docRef).then((docSnap)=>{
            if(docSnap.data()===undefined){
                navigate('/newProfile')
            }
            else{
                setProfile(docSnap.data() as Inputs)
            }
        })
    },[])
    
    return(
        <>
        <Header/>
        {profile?(
        <div className="profile">
            <h1>ユーザー名</h1>
            <p>{profile!.name}</p>
            <h2>メールアドレス</h2>
            <p>{user!.email}</p>
            <h2>スタイル</h2>
            <p>{profile!.style}</p>
            <h2>滑走歴（年）</h2>
            <p>{profile!.experience}</p>
            <h2>年間滑走日数</h2>
            <p>{profile!.days}</p>
            <h2>ホームゲレンデ</h2>
            <p>{profile!.home}</p>
            <br/>
            <button onClick={()=>{navigate('/newProfile')}}>編集</button>
        </div>
        ):(
            <button onClick={()=>{navigate('/newProfile')}}>新規作成・編集</button>
        )}

        
        </>
    )
}