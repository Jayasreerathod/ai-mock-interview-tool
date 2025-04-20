"use client"
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from '@/utils/GeminiAIModel';
import { Loader2Icon, LoaderCircle } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@utils/db';
import { useRouter } from 'next/navigation';


function AddNewInterview() {
    const [openDailog,setOpenDailog ]=useState(false);
    const [jobPosition,setJobPosition]=useState("");
    const [jobDesc,setJobDesc]=useState("");
    const [jobExperience,setJobExperience]=useState("");
    const [loading,setLoading]=useState(false);
    const [jsonResponse,setJsonResponse]=useState([]);
    const router=useRouter();
    const {user}=useUser();

    const onSubmit=async(e)=>{
      setLoading(true)
      e.preventDefault()
      console.log(jobPosition,jobDesc,jobExperience);

      const InputPrompt= "Job position : " +jobPosition+ " , Job Description : "+jobDesc+" , Years Of Experience : "+jobExperience+" .Depending on this information , please provide me with "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview questions with Answers in Json Format, Give question and answer as field in JSON "
      
      const result=await chatSession.sendMessage(InputPrompt);
      
      const MockJsonResp=(result.response.text()).replace('```json','').replace('```','')
      const output = await JSON.parse(MockJsonResp);
      console.log(output);
      setJsonResponse(MockJsonResp);

      if (MockJsonResp)
      {
        if (!user?.primaryEmailAddress?.emailAddress) {
          console.error("User not authenticated. Cannot proceed with insert.");
          setLoading(false);
          return;
        }
      
      const resp=await db.insert(MockInterview)
      .values({
        mockId:uuidv4(),
        jsonMockResp:MockJsonResp,
        jobPosition:jobPosition,
        jobDesc:jobDesc,
        jobExperience:jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,

        createdAt:moment().format('DD-MM-yyyy')
      }).returning({mockId:MockInterview.mockId});

      console.log("Insterted ID:",resp)
      if(resp){
        setOpenDailog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId)
      }
    }
    else{
      console.log("ERROR");
    }
      setLoading(false);
    }

  return (
    <div>
        <div className='p-10 border rounded-lg bg-white hover:scale-105 hover:shadow-md cursor-pointer transition-all '
       onClick={()=>setOpenDailog(true)} >
            <h2 className='text-primary text-lg text-center'> + Add New</h2>
        </div>
        <Dialog open={openDailog}>
        <DialogContent className=" bg-black max-w-2xl">
            <DialogHeader>
            <DialogTitle className='font-bold text-white  text-2xl'>Tell us more about your job interview</DialogTitle>
            <DialogDescription asChild>
  <div>
    <form onSubmit={onSubmit}>
      <div className='text-cyan-100'>
        <h2 className=" text-sm   mt-4">
          Add Details about your job position/role, Job description and years of experience
        </h2>
        <div className='mt-7 my-3 '> 
          <label>Job Role/Job Position</label>
          <Input placeholder="Ex. Full Stack Developer" required
            onChange={(event)=>setJobPosition(event.target.value)} 
          />
        </div>
        <div className='my-3 '> 
          <label>Job Description/ Tech Stack(In Short)</label>
          <Textarea placeholder="Ex. React , Angular ,NodeJs , MySql etc" required 
            onChange={(event)=>setJobDesc(event.target.value)} 
          />
        </div>
        <div className='my-3 '> 
          <label>Years Of Experience</label>
          <Input placeholder="Ex. 5" max="50" type="number" required
            onChange={(event)=>setJobExperience(event.target.value)} 
          />
        </div>
        <div className='flex gap-5 justify-end '>
          <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}> Cancel </Button>
          <Button type="submit" disabled={loading} >
            {loading ? (
              <>
                <LoaderCircle className='animate-spin' /> Generating from AI
              </>
            ) : 'Start Interview'}
          </Button>
        </div>
      </div>
    </form>
  </div>
</DialogDescription>

            </DialogHeader>
        </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewInterview
