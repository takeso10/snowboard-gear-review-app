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
        const docRef = doc(db, "profiles",user.email)
        getDoc(docRef).then((docSnap)=>{
            setName(docSnap.data().name)
        })
    },[])

    const signout=()=>{
        auth.signOut()
        console.log(auth)
        navigate('/signin')
    }

    return(
        <>
            <h1>スノギア</h1>
            {user ? (
                <>
                    <p>{name}さん</p>
                    <button onClick={signout}>サインアウト</button>
                    <button onClick={()=>{navigate('/profile')}}>プロフィール</button>
                </>
            ):(
                <>
                    <button onClick={signout}>サインアウト</button>
                    <button onClick={()=>{navigate('/profile')}}>プロフィール</button>
                </>
            )}
        </>
    )
}