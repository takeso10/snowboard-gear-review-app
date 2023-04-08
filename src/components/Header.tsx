import React from 'react'
import {auth,db} from "../firebase"
import { useNavigate} from 'react-router-dom'
import { useAuthState} from "react-firebase-hooks/auth"
import {useEffect,useState} from 'react'
import { getDoc,doc} from "firebase/firestore";
import './Header.scss'


export const Header=()=>{
    const navigate = useNavigate()
    const [user]=useAuthState(auth)
    const[name,setName]=useState('')

    useEffect(()=>{
        console.log(user)
        const docRef = doc(db, "profiles",user!.uid!)
        getDoc(docRef).then((docSnap)=>{     
            if (docSnap.data()===undefined){

            }   
            else{
                setName(docSnap.data()!.name)
            }
        })
    },[])

    const signout=()=>{
        auth.signOut()
        console.log(auth)
        navigate('signin')
    }

    return(
        <div className="header">
            <div className="header-title">
                <p>スノーボードギアレビューサイト</p>
                <h1 onClick={()=>{navigate('/')}}>スノギア</h1>
            </div>
            {name ? (
                <div className="header-item">
                    <p>{name} さん</p>
                    <button onClick={signout}>サインアウト</button>
                    <button onClick={()=>{navigate('./profile')}}>プロフィール</button>
                    <br/>
                </div>
            ):(
                <div className="header-item">
                    <button onClick={signout}>サインアウト</button>
                    <button onClick={()=>{navigate('profile')}}>プロフィール</button>
                    <br/>
                </div>
            )}
        </div>
    )
}