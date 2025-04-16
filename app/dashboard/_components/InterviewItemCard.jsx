import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {
    const router=useRouter();
    const OnStart=()=>{
        router.push('/dashboard/interview/'+interview?.mockId)
    }

    const OnFeedbackClick=()=>{
        router.push('/dashboard/interview/'+interview?.mockId+'/feedback')
    }

  return (
    <div className='border bg-black shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-white'>{interview?.jobPosition}</h2>
      <h2 className= ' text-sm  text-white'>{interview?.jobExperience} Years of Experience</h2>
      <h2 className=' text-xs  text-white'>Created At : {interview?.createdAt}</h2>
      <div className='flex justify-between mt-2 gap-5'>
        <Button size="sm" variant="outline" className=' bg-white text-black w-30'
        onClick={OnFeedbackClick}>Feedback</Button>
        <Button size="sm" variant="outline" className='bg-white text-black w-30'
        onClick={OnStart}>Start</Button>
      </div>
    </div>
  )
}

export default InterviewItemCard
