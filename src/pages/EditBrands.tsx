import React, { useEffect ,useState} from 'react'
import { Header } from '../components/Header'
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

type Brand={
  name:string
}

type Inputs={
  brand:string,
  category:string,
  gearName:string
}

export default function EditBrands() {
  const navigate = useNavigate() 
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrand, setSelectedBrand]=useState<string>("BURTON")
  const [boards, setBoards] = useState<string[]>([])
  const [bindings, setBindings] = useState<string[]>([])
  const [boots, setBoots] = useState<string[]>([])
  const {register, handleSubmit,formState: { errors }}=useForm<Inputs>()

  useEffect(()=>{
    (async()=>{
      const q = query(collection(db, "brands"))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc)=>{
        console.log(doc.data())
        setBrands((brands)=>[...brands,{
          name:doc.data().name
        }])
      })
    })()
  },[])

  const handleBrand=(e:string)=>{
    (async()=>{
      setSelectedBrand(e);
      const boardDocs = await getDocs(collection(db, "brands",e,"board"))
      const boardList:string[] = []
      boardDocs.forEach((doc)=>{
        boardList.push(doc.data().name)
        console.log(doc.data())
      })
      setBoards(boardList)

      const bindingDocs = await getDocs(collection(db, "brands",e,"binding"))
      const bindingList:string[] = []
      bindingDocs.forEach((doc)=>{
        bindingList.push(doc.data().name)
        console.log(doc.data())
      })
      setBindings(bindingList)

      const bootsDocs = await getDocs(collection(db, "brands",e,"boot"))
      const bootsList:string[] = []
      bootsDocs.forEach((doc)=>{
        bootsList.push(doc.data().name)
        console.log(doc.data())
      })
      setBoots(bootsList)
    })()
  }

  const onSubmit:SubmitHandler<Inputs>=async (data:Inputs)=>{
    await setDoc(doc(db,"brands",data.brand!),{
      name:data.brand
    })
    await setDoc(doc(db,"brands",data.brand,data.category,data.gearName),{
      name:data.gearName
    })
    navigate('../snowboard-gear-review-app/newReview')
  }

  return (
    <>
      <Header/>
      <div className="main">
        <form className="create-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="brand-form">
            <label htmlFor="brand">ブランド</label>
            <br/>
            <input
              placeholder="brand"
              className="brand-input"
              defaultValue={selectedBrand}
              {...register("brand",{
                required:{
                  value:true,
                  message:"入力必須の項目です。"
                }
              })}  
            ></input>
          </div>
          <div className="category-form">
            <label htmlFor="category">カテゴリー</label>
            <br/>
            <select
              placeholder="category"
              className="category-inputs"
              {...register("category",{
                required:{
                  value:true,
                  message:"入力必須の項目です。"
                }
              })}
            >
              <option value="board">ボード</option>
              <option value="binding">ビンディング</option>
              <option value="boots">ブーツ</option>
            </select>
          </div>
          <div className="gear-form">
            <label htmlFor="gearName">ギア名</label>
            <br/>
            <input
              placeholder="gearName"
              className="gearName-inputs"
              {...register("gearName",{
                required:{
                  value:true,
                  message:"入力必須な項目です。"
                }
              })}
            ></input>
          </div>
          <br/>
          <button type='submit' className="add-button">追加</button>
        </form>
        <ul className="brandList">
          <h2>掲載ブランド</h2>
          {brands.map((brand:Brand,index)=>{
            return(
              <li onClick={()=>handleBrand(brand.name)} key={index} value={brand.name}>{brand.name}</li>
            )
          })}
        </ul>
        <ul className="gearList">
          <h2>掲載ギア</h2>
          <div className="boardList">
            <h3>ボード</h3>
            {boards.map((board:string,index)=>{
              return(
                <li key={index}>{board}</li>
              )
            })}
          </div>
          <div className="bindingList">
            <h3>ビンディング</h3>
            {bindings.map((binding:string,index)=>{
              return(
                <li key={index}>{binding}</li>
              )
            })}
          </div>
          <div className="bootsList">
            <h3>ブーツ</h3>
            {boots.map((boot:string,index)=>{
              return(
                <li key={index}>{boot}</li>
              )
            })}
          </div>
        </ul>
      </div>
    </>
  )
}
