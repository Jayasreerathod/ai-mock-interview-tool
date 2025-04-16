"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState([]); // ✅ to store all responses
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Append latest transcript
  useEffect(() => {
    if (results.length > 0) {
      const lastResult = results[results.length - 1];
      setUserAnswer((prevAns) => prevAns + " " + lastResult.transcript);
    }
  }, [results]);

  // ✅ Save answer when recording stops
  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      console.log("⏹ Recording stopped. Saving answer...");
      UpadateUserAnswer();
    }
  }, [isRecording]);

  // Debug logs
  useEffect(() => {
    console.log("Recording:", isRecording);
    console.log("Interim:", interimResult);
    console.log("Final Results:", results);
    if (error) {
      console.error("Speech Recognition Error:", error);
    }
  }, [isRecording, interimResult, results, error]);

  // Start/Stop mic
  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      console.log(userAnswer);
    } else {
      startSpeechToText();
    }
  };

  // Save answer + feedback
  const UpadateUserAnswer = async () => {
    console.log("🔁 Called UpadateUserAnswer");
    console.log("userAnswer:", userAnswer);

    setLoading(true);

    const feedbackPrompt =
      "Question:" +
      mockInterviewQuestion[activeQuestionIndex]?.question +
      ",User Answer:" +
      userAnswer +
      ", Depending on question and user answer for the given interview question" +
      " please provide the rating for the answer and feedback as area of improvement if any" +
      " in about 3 to 5 lines to improve it in JSON format with rating field and feedback field";

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const rawText = await result.response.text();
      const mockJsonResp = rawText.replace("```json", "").replace("```", "");
      console.log("Gemini Response JSON:", mockJsonResp);
      const JsonFeedbackResp = JSON.parse(mockJsonResp);

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD_MM_YYYY"),
      });

      if (resp) {
        toast("User Answer recorded Successfully");

        setAllAnswers((prev) => [
          ...prev,
          {
            question: mockInterviewQuestion[activeQuestionIndex]?.question,
            answer: userAnswer,
            feedback: JsonFeedbackResp?.feedback,
            rating: JsonFeedbackResp?.rating,
          },
        ]);

        setUserAnswer("");
        setResults([]);
      }
    } catch (err) {
      console.error("❌ Error saving user answer:", err);
    }

    setLoading(false);
  };

  // ✅ Show all responses after 5
  useEffect(() => {
    if (allAnswers.length === 5) {
      console.log("✅ All Answers Collected:", allAnswers);
    }
  }, [allAnswers]);

  return (
    <div className="flex items-center justify-center flex-col">
      {/* Webcam Container */}
      <div className="flex flex-col mt-20 justify-center bg-black items-center rounded-lg p-5 relative">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          alt="record"
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>

      {/* Record Button */}
      <Button disabled={loading} variant="outline" className="my-10" onClick={StartStopRecording}>
        {isRecording ? (
          <h2 className="flex items-center text-red-600 gap-2">
            <StopCircle size={18} />
            Stop Recording
          </h2>
        ) : (
          <h2 className="text-primary flex gap-2 items-center">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
