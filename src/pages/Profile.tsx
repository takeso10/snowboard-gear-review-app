import React from 'react'
import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { auth, db, storage } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getDoc, doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { getDownloadURL, ref } from 'firebase/storage'
import './Profile.scss'

type Inputs = {
  name: string
  email: string
  style: string
  experience: number
  days: string
  home: string
  ImageName: string
}

export const Profile = () => {
  const [user] = useAuthState(auth)
  const navigate = useNavigate()
  const [iconURL, setIconURL] = useState<string>('')
  const [profile, setProfile] = useState<Inputs>({
    days: '',
    experience: 0,
    home: '',
    style: '',
    name: '',
    email: '',
    ImageName: '',
  })
  const [profileSet, SetProfileSet] = useState(false)

  useEffect(() => {
    const docRef = doc(db, 'profiles', user!.uid!)
    getDoc(docRef).then((docSnap) => {
      if (docSnap.data() === undefined) {
        navigate('../newProfile')
      } else {
        setProfile(docSnap.data() as Inputs)
        const iconRef = ref(storage, `image/${docSnap.data()!.ImageName}`)
        getDownloadURL(iconRef)
          .then((url) => {
            setIconURL(url)
          })
          .catch((error) => {
            switch (error.code) {
              case 'storage/object-not-found':
                // File doesn't exist
                break
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break
              case 'storage/canceled':
                // User canceled the upload
                break

              // ...

              case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                break
            }
          })
      }
    })
  }, [])

  return (
    <>
      <Header />
      <br />
      {profile ? (
        <div className="profile">
          <h1>プロフィール</h1>
          <div>
            <img className="icon" src={iconURL}></img>
            <h2>ユーザー名</h2>
            <p>{profile!.name}</p>
            <h2>メールアドレス</h2>
            <p>{user!.email}</p>
            <h2>スタイル</h2>
            <p>{profile!.style}</p>
            <h2>滑走歴（年）</h2>
            <p>{profile!.experience}年</p>
            <h2>年間滑走日数</h2>
            <p>{profile!.days}</p>
            <h2>ホームゲレンデ</h2>
            <p>{profile!.home}</p>
          </div>
          <button
            onClick={() => {
              navigate('../newProfile')
            }}
          >
            編集
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            navigate('../newProfile')
          }}
        >
          新規作成・編集
        </button>
      )}
    </>
  )
}
