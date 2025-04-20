import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex }) {

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry! Your browser does not support text to speech');
    }
  };

  return mockInterviewQuestion && (
    <div className='bg-black text-white p-5 border-4 rounded-lg my-10'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {mockInterviewQuestion.map((question, index) => (
          <h2
            key={index}
            onClick={() => setActiveQuestionIndex(index)} // 👈 Makes it clickable
            className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer
              ${activeQuestionIndex === index ? 'bg-primary text-white' : ''}`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      <h2 className='my-5 text-md md:text-md'>
        {mockInterviewQuestion[activeQuestionIndex]?.question}
      </h2>

      <Volume2
        className='cursor-pointer'
        onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
      />

      <div className='border rounded-lg p-5 bg-gray-200 mt-20'>
        <h2 className='flex gap-2 items-center text-primary'>
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
      </div>
    </div>
  );
}

export default QuestionsSection;
