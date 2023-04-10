import React from 'react'
import { signInWithPopup } from "firebase/auth";
import {auth, provider } from "../firebase";
import {useForm ,SubmitHandler} from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword ,getAuth} from "firebase/auth";
import { useState } from "react";
import "./Signin.scss"

type Inputs ={
    email:string,
    password:string
}
export const Signin=()=>{
    const {register, handleSubmit,formState: { errors }}=useForm<Inputs>();
    const navigate = useNavigate()
    const[error,setErrors]=useState()

    const signInWithGoogle = ()=>{
        signInWithPopup(auth, provider)
        console.log(provider)
        console.log(auth)
    }

    const onSubmit:SubmitHandler<Inputs>=(data)=>{
        const auth = getAuth()
        signInWithEmailAndPassword(auth,data.email,data.password)
        .then(()=>{
            navigate('/')
        })
        .catch((error)=>{
            setErrors(error)
        })
    }

    return(
        <>
        <div className="header">
            <div className="header-title">
                <p>スノーボードギアレビューサイト</p>
                <h1>スノギア</h1>
            </div>
        </div>
        <div className="signin">
            <h1>サインイン</h1>
            <form  className="signin-form" onClick={handleSubmit(onSubmit)}>
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
                    <button type="submit"  className="signup-button">サインイン</button>
            </form>
            {/*<p>{error}</p>*/}
            <button onClick={signInWithGoogle}>Googleでサインイン</button>
            <br/>
            <button  onClick={()=>{navigate('../signup')}}>新規登録の方はこちらから</button>
        </div>
        </>
        
    )
}