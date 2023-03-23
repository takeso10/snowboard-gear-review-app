import React from 'react'
import {auth,db} from "../firebase"
import { useNavigate} from 'react-router-dom'
import { useAuthState} from "react-firebase-hooks/auth"
import {useEffect,useState} from 'react'
import { getDoc,doc} from "firebase/firestore";


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
        navigate('/signin')
    }

    return(
        <>
            <button onClick={()=>{navigate('/')}}><h1>スノギア</h1></button>
            <br/>
            {name ? (
                <>
                    <p>{name}さん</p>
                    <button onClick={signout}>サインアウト</button>
                    <button onClick={()=>{navigate('/profile')}}>プロフィール</button>
                    <br/>
                </>
            ):(
                <>
                    <button onClick={signout}>サインアウト</button>
                    <button onClick={()=>{navigate('/profile')}}>プロフィール</button>
                    <br/>
                </>
            )}
        </>
    )
}