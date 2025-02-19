import React, { useEffect, useState } from "react";
import axios from "axios";

const ExamReview = ({ examId }) => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.post("/api/student/examQuestions", 
                    { exam_id: examId }, 
                    { withCredentials: true }
                );
                setQuestions(res.data);
            } catch (err) {
                console.error("Error fetching questions:", err);
            }
        };
    
        if (examId) {
            fetchQuestions();
        }
    }, [examId]);
    

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-indigo-900 mb-8">Exam Review</h2>
            {questions.map((q, index) => (
                <div key={q.ques_id} className="mb-6 p-4 border rounded-lg shadow-lg bg-white">
                    <h3 className="text-lg font-semibold mb-2">
                        {index + 1}. {q.ques}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        {[q.opt1, q.opt2, q.opt3, q.opt4].map((option, i) => {
                            const isCorrect = option === q.correct_ans;
                            const isGiven = option === q.given_ans;

                            let bgColor = "bg-gray-200"; // Default color
                            if (isCorrect && isGiven) bgColor = "bg-green-400 border-2 border-black"; // Correct answer
                            if (isCorrect && !isGiven) bgColor = "bg-green-400";
                            if (isGiven && !isCorrect) bgColor = "bg-red-400"; // Wrong given answer

                            return (
                                <div 
                                    key={i} 
                                    className={`p-2 rounded-lg text-lg font-medium ${bgColor}`}
                                >
                                    {option}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExamReview;
