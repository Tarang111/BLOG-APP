import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import EditorJs from '@editorjs/editorjs'
import Header from '@editorjs/header'
import Marker from '@editorjs/marker'
import List from '@editorjs/list'
import embed from '@editorjs/embed'
import { ImCross } from "react-icons/im";
import ImageTool from '@editorjs/image';
function Addblog() { 
    const [blogdata,setblog]=useState({title:"",description:"",image: null,content:"",draft:false,
      tags:[]})
     
   const {token}=useSelector(slice => slice.user)
   const editorRef=useRef(null)
   const navigate=useNavigate()
 
 function initializeEditor()
 {
   editorRef.current=new EditorJs({
    holder:"editorjs",
    placeholder:"Write Something Here... :)",
    tools:{
   header:{
    class:Header,
    inlineToolbar:true,
    config: {
        placeholder: 'Enter a header',
        levels: [2, 3, 4],
        defaultLevel: 3
      },
     },
     List:{
      class:List,
      inlineToolbar:true
     },
     Marker:Marker,
     Embed:embed,
     image:{
      class:ImageTool,
      config:{
        uploader:{
         
          uploadByFile:async (image)=>{
           
            return {
                success: 1,
                file: {
                  url:URL.createObjectURL(image),
                  image,
                  imageid:""
               
                }
              
            }
          }
        }
      }
     }
    },
    onChange:async () =>{
  const data = await editorRef.current.save();
console.log(data);

  setblog((prev) => ({ ...prev, content: data }));
    },
  })
    
  
  
}
function deletetag(index)
{
  const tagg=blogdata.tags.filter((item,indexx)=>(indexx!=index))||[]
  console.log(tagg);
 setblog((prev)=>({...prev,tags:tagg}))
}

   function handleKeyDown(e) {
    const tag = e.target.value.toLowerCase();

    if (e.code === "Space" || e.keyCode == "32") {
      e.preventDefault();
    }

    if ((e.code == "Enter" || e.keyCode == "13") && tag !== "") {
      if (blogdata.tags.length >= 10) {
        e.target.value = "";
        return toast.error("You can add upto maximum 10 tags");
      }
      if (blogdata.tags.includes(tag)) {
        e.target.value = "";
        return toast.error("This tag already added");
      }
      setblog((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      e.target.value = "";
    }
  }

    useEffect(()=>{
          if(!token)
          {
            return navigate("/signin")
          }
    },[])
    
      useEffect(()=>{
        initializeEditor()
       return () => {
  if (editorRef.current) {
    editorRef.current.destroy();
    editorRef.current = null;
  }
};

      },[])
    
    
      const config = {
  headers: {
    'Authorization': `Bearer ${token}`, 
     'Content-Type': "multipart/form-data"

  }
}; 
       async function Handlesubmit() {
          
             try {
                  const formdata=new FormData
                 const {title,description,image,content,draft,tags}=blogdata
                 formdata.append('image',image)
         content.blocks.forEach((block)=>{
          if(block.type ==='image'&&block.data.file.image)
          {
            formdata.append("images",block.data.file.image)
          }
         })  
                   formdata.append('title',title)
                   formdata.append('description',description)
                   formdata.append('draft',draft)
                   formdata.append('content',JSON.stringify(content))
                   formdata.append('tags',tags) 
                 const res=await axios.post(`${import.meta.env.VITE_BACKENED_URL}/blog`,formdata,config)
                 toast.success(res.data.message)
                  return navigate("/")
                
                
             }
              catch (error) {
                 console.log(error);
                 toast.error(error.response.data.message)
                 
             }
       }
        
    return (
   <div className="md:w-[80%] w:[100%]  mx-auto mt-10 md:p-0 p-2 flex flex-col gap-5 ">
     {/* image and title */}
     <div className="flex w-full md:flex-row flex-col gap-5 ">
        <div className="md:w-[50%] w-[100%] flex flex-col gap-3">
          <h1 className="text-4xl">Image:-</h1>
         <label htmlFor="image" className="aspect-video object-cover bg-slate-600 ">
            {(blogdata.image)? <img src={URL.createObjectURL(blogdata.image)} alt="" />: (<div className="aspect-video bg-slate-600 flex justify-center h-[10] items-center">Select image</div>)}
          </label>
       </div>
       <div className="flex flex-col md:w-[50%] w-[100%] gap-2">
              <label htmlFor="" className="text-4xl">Title:-</label> <input type="text"  placeholder="Enter title..." className=" border-2 h-10 p-2" onChange={(e)=>{setblog((prev)=>({...prev,title:e.target.value}))}}/><br />
               <label htmlFor="" className="text-4xl">Tags:-</label> 
           <div className="w-[100%]">
               <input type="text"  placeholder="Enter tag..." className=" border-2 w-[100%] h-10 p-2" onKeyDown={handleKeyDown}/><br />
              <div className=" flex md:flex-row flex-col justify-between">
                <p className="font-normal ">*Press enter to save tag</p>
                <p className="font-normal">you have {10-blogdata.tags.length} tags remaining</p>
              </div>

           </div>
      <div className=" flex gap-2 w-[100%] flex-wrap">
       {blogdata.tags.map((item,index)=>(
            <p className="border-2 p-3 w-fit rounded-2xl text-[15px] flex justify-center items-center gap-2 bg-black text-white font-bold">{item} 
            <ImCross className="text-[20px] rounded-full bg-gray-500 p-1 cursor-pointer" onClick={()=>{deletetag(index)}}/>
            </p>
               
        )

        )}
      </div>
       </div>
    
     </div>

        
      <div className="w-full flex-col flex gap-3">
         <label htmlFor="" className="text-4xl">Description:-</label>
           <textarea type="text" rows={5} placeholder="Enter description..." className=" border-2 p-2 resize-none" onChange={(e)=>{setblog((prev)=>({...prev,description:e.target.value}))}}></textarea> <br />
          
      </div>
        <div className="w-full flex-col flex gap-3">
         <label htmlFor="" className="text-4xl">Draft:-</label>
        <select id="" name="" defaultValue={false} className="border-2 h-10 p-2 cursor-pointer" onChange={(e)=>{setblog((prev)=>({...prev,draft:e.target.value}))}}>
            <option value="true">True</option>
            <option value="false">False</option>
        </select>
          
      </div>
          
        <input id="image"
         type="file"
          accept=".png, .jpeg,.jpg"
         className=" hidden" 
          onChange={(e)=>{setblog((prev)=>({...prev,image:e.target.files[0]}))}} 
          /><br />
       <div className="flex flex-col justify-start gap-5 md:w-[60%] w-[100%]">
         <h1 className="text-4xl">Content:-</h1>
          <div id="editorjs" className="border mb-1.5 p-1 w-full justify-start"></div>
       </div>
       <div className="w-full  flex mb-10 ">
         <button className="border-2 p-2 md-w-[20%] w-fit rounded-2xl text-2xl bg-black text-white font-bold " onClick={Handlesubmit}>Post</button>
       </div>

   </div>
  )
}

export default Addblog
