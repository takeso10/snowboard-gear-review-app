import {useEffect,useState} from 'react'
import {Header} from "../components/Header"
import {auth,db} from "../firebase"
import { useAuthState} from "react-firebase-hooks/auth"
import { getDoc,doc} from "firebase/firestore";
import { useNavigate } from 'react-router-dom'

export const Profile =()=>{
    const [user]=useAuthState(auth)
    const navigate = useNavigate()
    const [profile,setProfile]=useState({})
    
    useEffect(()=>{
        const docRef = doc(db, "profiles",user.email)
        getDoc(docRef).then((docSnap)=>{
            setProfile(docSnap.data())
        })
    },[])

    return(
        <>
        <Header/>
        <div className="profile">
            <h1>ユーザー名</h1>
            <p>{profile.name}</p>
            <h2>メールアドレス</h2>
            <p>{user.email}</p>
            <h2>スタイル</h2>
            <p>{profile.style}</p>
            <h2>滑走歴（年）</h2>
            <p>{profile.experience}</p>
            <h2>年間滑走日数</h2>
            <p>{profile.days}</p>
            <h2>ホームゲレンデ</h2>
            <p>{profile.home}</p>
        </div>
        <button onClick={()=>{navigate('/newProfile')}}>新規作成・編集</button>
        </>
    )
}