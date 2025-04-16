"use client";

import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Feedback({ params: paramsPromise }) {
  const params = React.use(paramsPromise);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    setFeedbackList(result);
    setLoading(false);
  };

  return (
    <div className='p-10'>
      {loading ? (
        <h2 className='font-bold text-xl text-primary'>Loading your feedback...</h2>
      ) : feedbackList.length === 0 ? (
        <h2 className='font-bold text-xl text-primary'>
          You haven't attempted this Interview!!
        </h2>
      ) : (
        <>
          <h2 className='text-3xl font-bold text-green-500'>Congratulations!!</h2>
          <h2 className='font-bold font-2xl'>Here is your interview feedback</h2>
          <h2 className='text-primary text-lg my-3'>
            Your Overall Interview Rating: <strong>7/10</strong>
          </h2>
          <h2 className='text-sm text-gray-500'>
            Find below interview questions with correct answers, your answers, and feedback for improvement.
          </h2>

          {feedbackList.map((item, index) => (
            <Collapsible key={index} className='mt-7'>
              <CollapsibleTrigger className='p-2 bg-black text-white rounded-lg flex justify-between my-2 text-left gap-7 w-full'>
                {item.question} <ChevronsUpDown className='h-5 w-5 gap-7' />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-green-500 p-2 border rounded-lg'>
                    <strong>Rating: </strong>{item.rating}
                  </h2>
                  <h2 className='p-2 border rounded-lg bg-primary text-sm text-white'>
                    <strong>Your Answer: </strong> {item.userAns}
                  </h2>
                  <h2 className='p-2 border rounded-lg bg-primary text-sm text-white'>
                    <strong>Correct Answer: </strong> {item.correctAns}
                  </h2>
                </div>
                <h2 className='p-2 border rounded-lg bg-primary text-sm text-white'>
                  <strong>Feedback: </strong> {item.feedback}
                </h2>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}

      <Button className='mt-6' onClick={() => router.replace('/dashboard')}>
        Go Home
      </Button>
    </div>
  );
}

export default Feedback;
