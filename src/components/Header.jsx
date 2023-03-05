import {auth} from "../firebase"
import { useNavigate} from 'react-router-dom'

export const Header=()=>{
    const navigate = useNavigate()

    const signout=()=>{
        auth.signOut()
        navigate('../Signin')
    }

    return(
        <>
            <h1>スノギア</h1>
            <p></p>
            <button onClick={signout}>サインアウト</button>
            <button onClick={navigate('/profile')}/>
        </>
    )
}