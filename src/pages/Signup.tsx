import React from 'react'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {useForm,SubmitHandler} from 'react-hook-form';
import { signInWithPopup } from "firebase/auth";
import {auth, provider } from "../firebase";
import {createUserWithEmailAndPassword,getAuth } from "firebase/auth";

type Inputs ={
    email:string,
    password:string
}

export const Signup=()=>{
    const navigate = useNavigate()
    const {register, handleSubmit,formState: { errors }}=useForm<Inputs>();
    const[error,setErrors]=useState()

    const onSubmit:SubmitHandler<Inputs>=(data)=>{
        const auth = getAuth()
        console.log(data)
        createUserWithEmailAndPassword(auth,data.email,data.password)
        .then(()=>{
            navigate('snowboard-gear-review-app/signin') 
        })
        .catch((error)=>{
            setErrors(error)
        })
    }

    const signUpWithGoogle = ()=>{
        signInWithPopup(auth, provider)
        console.log(provider)
        console.log(auth)
    }

    return(
        <>
            <h1>ユーザー登録</h1>    
            <form onClick={handleSubmit(onSubmit)}>
                <label htmlFor='email'>メールアドレス</label>
                <br />
                <input
                    type="email"
                    placeholder="email"
                    className="email-input" 
                    {...register('email',{
                        required:{
                            value:true,
                            message:'入力が必須の項目です。',
                        }
                })}/>
                {errors.email && <div>入力が必須の項目です</div>}
                <br />
                <label htmlFor='password'>パスワード</label>
                    <br />
                    <input
                        type="password"
                        placeholder="password"
                        
                        className="password-input" 
                        {...register('password',{
                            required:{
                                value:true,
                                message:'入力が必須の項目です。'
                            },
                            minLength:{
                                value:8,
                                message:'8文字以上入力してください。'
                            }

                        })}/>
                        {errors.password && <div>入力が必須の項目です</div>}
                    <br />
                    <button type="submit"  className="signup-button">作成</button>
            </form>
            <p>{error}</p>
            <button onClick={signUpWithGoogle}>
                <p>Googleでサインアップ</p>
            </button>
            <br/>
            <button onClick={()=>{navigate('snowboard-gear-review-app/signin')}}>
            <p>ログイン</p>
            </button>
        </>
    )
}