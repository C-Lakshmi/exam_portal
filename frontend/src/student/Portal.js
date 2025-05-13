import React, { useState, useEffect } from "react";
import "./portal.css";
import Navbar from "../student/components/Navbar";
import CapturePhoto from "./components/CapturePhoto";
import axios from "axios";

const Portal = () => {
  const [exams, setExams] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [hasTakenTest,setHasTakenTest] = useState(false);
  const [time, setTime] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [Ques,setQues] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);


  const [timer, setTimer] = useState(0); // Overall timer in seconds
  const [questionTimes, setQuestionTimes] = useState([]); // Array to track time spent on each question
  const [questionStartTime, setQuestionStartTime] = useState(0); // Start time for the current question

  const [showCamera, setShowCamera] = useState(false);
  const [examToStart, setExamToStart] = useState(null);
  const [examCameraStream, setExamCameraStream] = useState(null);
  const [unverified, setUnverified] = useState(0);

  const [currentLevel, setCurrentLevel] = useState('easy');
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);

  useEffect(() => {
    // Fetch upcoming exams
    const fetchExams = async () => {
      try {
        const response = await axios.post("/api/student/upcoming");
        console.log(response.data);
        setExams(response.data); // Update state with fetched exams
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };
    fetchExams();
  }, []);
  
  useEffect(() => {
    // Only set up interval if exams exist
    if (exams.length > 0) {
      const interval = setInterval(() => {
        const now = new Date();
        
      const updatedTimes = exams.map((exam) => {
        if (exam && exam.slot) {
          const diff = new Date(exam.slot) - now; // Calculate difference in milliseconds
         if (diff > 0) {
          return Math.floor(diff/1000);
         } else if(Math.floor(diff/1000) >= -900){
          return -1;
         }
         else{
          return 0;
         } // Convert to seconds or set to 0 if already passed
        }
        return 0; // Default to 0 if no slot is available
      });

      setTime(updatedTimes); 
      }, 1000);
  
      return () => clearInterval(interval); // Clean up the interval
    }
  }, [exams]); // Add exams as a dependency
  //console.log(exams);
  //console.log(time);

const captureAndVerifyPhoto = () => {
  if (examCameraStream) {
    const video = document.createElement("video");
    video.srcObject = examCameraStream;
    video.play();

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const context = canvas.getContext("2d");

    video.onloadeddata = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");

      // Directly call verify without saving
      axios.post("/api/student/verifyPhoto", {
        photo: imageData,
        exam_id: currentExam.exam_id,
      }).then(res => {
        console.log("Face verified:", res.data);
        if(res.data.verified=== false && unverified < 3) {
          setUnverified(unverified+1);
          alert(`Please keep your face in front of the camera with good lighting. This is your ${unverified} warning.`);
        }
        if(res.data.verified=== false && unverified >= 3){
          alert("Three warnings exceeded. Test has been terminated.");
          setIsExamStarted(false);
        }
      }).catch(err => {
        console.error("Face verification failed:", err);
      });
    };
  }
};


useEffect(() => {
  let photoInterval;
  if (isExamStarted) {
    photoInterval = setInterval(() => {
      captureAndVerifyPhoto();
    }, 5 * 60 * 1000); // every 5 minutes
  }
  return () => {
    if (photoInterval) clearInterval(photoInterval);
    if (examCameraStream) {
      examCameraStream.getTracks().forEach(track => track.stop());
    }
  };
}, [isExamStarted, examCameraStream]);


const confirmPhotoAndStartExam = async (image) => {
  try {
    await axios.post("/api/student/uploadPhoto", {
      photo: image,
      exam_id: examToStart.exam_id,
    });
    setShowCamera(false);
    handleStartExam(examToStart.index, examToStart.exam_id);
  } catch (error) {
    console.error("Error uploading photo:", error);
    alert("Failed to upload photo. Please retry.");
  }
};
  const prepareExam = (index, exam_id) => {
  setExamToStart({ index, exam_id });
  setShowCamera(true);
};

  const startExamCamera = async () => {
  try {
    const streamData = await navigator.mediaDevices.getUserMedia({ video: true });
    setExamCameraStream(streamData);
  } catch (err) {
    console.error("Unable to access camera during exam:", err);
    alert("Camera access denied. Exam cannot start.");
    setIsExamStarted(false);
  }
};

const fetchQ = async (exam_id, difficulty) => {
  try {
    const response = await axios.post("/api/student/question", {
      exam_id,
      difficulty
    });

    if (response.data === "Test taken!") {
      console.log("Student has already taken the test.");
      return null;
    }

    console.log("Questions fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return null;
  }
  };

const handleNextAdaptiveQuestion = async (exam_id) => {
  const questions = await fetchQ(exam_id, currentLevel);

  if (questions && questions.length > 0) {
    // ❗ Filter out questions already shown (by ques_id)
    const filteredQuestions = questions.filter(
      (q) => !Ques.some((shown) => shown.ques_id === q.ques_id)
    );

    if (filteredQuestions.length > 0) {
      const nextQ = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
      setCurrentQuestion(nextQ);
      setQues((prev) => [...prev, nextQ]);
      console.log(Ques)
      setSelectedAnswers((prev) => [...prev, null]);
    } else {
      console.log(`No NEW questions left for level: ${currentLevel}`);
      if(currentLevel == "Hard") setCurrentLevel("Medium")
      else if(currentLevel == "Medium") setCurrentLevel("Easy")
      else setCurrentLevel("Medium")
    }
  } else {
    console.log("No questions found for level:", currentLevel);
    if(currentLevel == "Hard") setCurrentLevel("Medium")
    else if(currentLevel == "Medium") setCurrentLevel("Easy")
    else setCurrentLevel("Medium")
  }
};

  const handleAnswerEvaluation = (isCorrect) => {
  if (isCorrect) {
    setCorrectStreak(prev => prev + 1);
    setWrongStreak(0);

    if (currentLevel === 'easy' && correctStreak + 1 >= 2) {
      setCurrentLevel('medium');
      setCorrectStreak(0);
      console.log("Moved to MEDIUM");
    } else if (currentLevel === 'medium' && correctStreak + 1 >= 2) {
      setCurrentLevel('hard');
      setCorrectStreak(0);
      console.log("Moved to HARD");
    }
  } else {
    setWrongStreak(prev => prev + 1);
    setCorrectStreak(0);

    if (currentLevel === 'medium' && wrongStreak + 1 >= 2) {
      setCurrentLevel('easy');
      setWrongStreak(0);
      console.log("Moved back to EASY");
    } else if (currentLevel === 'hard' && wrongStreak + 1 >= 2) {
      setCurrentLevel('medium');
      setWrongStreak(0);
      console.log("Moved back to MEDIUM");
    }
  }
};

  const handleStartExam = (index,exam_id) => {
    setIsExamStarted(true);
    setCurrentExam(exams[index]);
    setTimer(exams[index].duration * 60);
    startExamCamera();
    console.log(exam_id)
    setCurrentQuestionIndex(0);
  setTimeout(() => {
    handleNextAdaptiveQuestion(exam_id);
  }, 500);
  };
  const resetExamState = () => {
  setCurrentQuestion(null);
  setQues([]);
  setSelectedAnswers([]);
  setQuestionTimes([]);
  setCorrectStreak(0);
  setWrongStreak(0);
  setCurrentLevel('easy');
};

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && isExamStarted) {
      // Capture time for the current question before ending the exam
      const currentTime = Date.now();
      const timeSpent = Math.floor((currentTime - questionStartTime) / 1000);
      setQuestionTimes((prevTimes) => {
        const updatedTimes = [...prevTimes];
        
        updatedTimes[Ques.length - 1] = (updatedTimes[Ques.length - 1] || 0) + timeSpent;
        
        return updatedTimes;
      });
      
      alert("Time's up! The exam has ended.");
      setIsExamStarted(false);
      resetExamState();
    }
  
    return () => clearInterval(interval);
  }, [timer, isExamStarted]);
  
  useEffect(() => {
    if (!isExamStarted && !hasTakenTest) {
      const sendExamData = async () => {
        try {
          const payload = {
            questionTimes: questionTimes,
            selectedAnswers: selectedAnswers,
            examId: currentExam.exam_id, // Assuming exam_id is part of the currentExam object
            questions: Ques,
          };
          const response = await axios.post("/api/student/submit", payload);
          console.log("Exam data submitted successfully:", response.data);
        } catch (error) {
          console.error("Error submitting exam data:", error);
          alert("Failed to submit your exam data. Please try again.");
        }
      };
  
      // Send the data only if the exam had started and there are valid results
      if (currentExam && questionTimes.length > 0 && selectedAnswers.length > 0) {
        sendExamData();
      }
    }
  }, [isExamStarted, currentExam]);
  

const handleOptionChange = (e) => {
  const selectedOption = e.target.value;
  setSelectedAnswers((prevAnswers) => {
    const updated = [...prevAnswers];
    updated[Ques.length - 1] = selectedOption; // Always update the latest question's answer
    return updated;
  });
};


const handleNextQuestion = async () => {
  const currentAns = selectedAnswers[Ques.length - 1];
  const correctAns = currentQuestion.ans;

  const currentTime = Date.now();
  const timeSpent = Math.floor((currentTime - questionStartTime) / 1000);

  setQuestionTimes((prevTimes) => [...prevTimes, timeSpent]);

  // ✅ Evaluate the answer safely
  if (!currentAns) {
    console.log("Skipped or unanswered.");
  } else if (currentAns === correctAns) {
    handleAnswerEvaluation(true);
  } else {
    handleAnswerEvaluation(false);
  }

  setQuestionStartTime(currentTime);
   console.log(currentExam.total_qs, currentExam)
  // ✅ 🛡 SAFELY Check if exam should finish BEFORE fetching next
  if (Ques.length >= currentExam.total_qs) {
    console.log("Finish triggered as Ques.length >= total_qs");
    alert("Exam is completed!");
    setIsExamStarted(false);
    return; // ❗ Hard return → no next question fetching occurs
  }

  
  const questions = await fetchQ(currentExam.exam_id, currentLevel);

  if (questions && questions.length > 0) {
  // ✅ Now safely fetch next adaptive question
   const shownQuesIds = Ques.map((q) => q.ques_id);

    // ✅ Use the snapshot for filtering
    const filteredQuestions = questions.filter(
      (q) => !shownQuesIds.includes(q.ques_id)
    );

    if (filteredQuestions.length > 0) {
      const nextQ = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
      setCurrentQuestion(nextQ);
      setQues((prev) => [...prev, nextQ]);
      setSelectedAnswers((prev) => [...prev, null]);
    } else {
      console.log(`No NEW questions left for level: ${currentLevel}`);
      if(currentLevel == "Hard") setCurrentLevel("Medium")
      else if(currentLevel == "Medium") setCurrentLevel("Easy")
      else setCurrentLevel("Medium")
    }
  } else {
    console.log("No questions found for level:", currentLevel);
    if(currentLevel == "Hard") setCurrentLevel("Medium")
      else if(currentLevel == "Medium") setCurrentLevel("Easy")
      else setCurrentLevel("Medium")
  }
};

  
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds-hrs*3600) / 60);
    const secs = (seconds-hrs*3600-mins*60) % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };
  const toDate = (e) =>{
  const date= new Date(e);
  return date;
  };
  
 return (
    <div className="bg-[#FFFCFC]">
      
    <div className="exam-portal">
        
        {!isExamStarted ? (
        <> <Navbar/> 
          <div className="relative min-h-screen bg-no-repeat pl-8" style={{backgroundImage: "url('/exam1.jpg')"}}>
          {showCamera && (
            <CapturePhoto
              onCaptureConfirm={(image) => confirmPhotoAndStartExam(image)}
              onCancel={() => setShowCamera(false)}
            />
          )}


          <div className="right-side-panel">
          <h1>Upcoming Exams</h1>
          <div className="exam-list">
            {exams.map((exam,index) => (
              <div key={exam.id} className="exam-card">
                <h2>{exam.exam_name}</h2>
                <p>Start Time: {toDate(exam.slot).toLocaleTimeString()}</p>
                  <div className="exam_btns">
                  <button className="start_exam"
                    onClick={()=>{prepareExam(index,exam.exam_id)}}
                    disabled={time[index] > 40 * 60} // Enable button 5 minutes before the start time
                  >
                    {time[index] > 0
                      ? `Starts in: ${formatTime(time[index])}`
                      : "Start Exam"}
                  </button>
                  
               
                <button className="view_result"
                  onClick={() => (window.location.href = `/student/results`)}
                >
                  View Result
                </button>
                </div>
              </div>
            ))}
          </div>
          <div className="instructions">
            <h2>General Instructions</h2>
            <ul>
              <li>The test link will only be active for 15 minutes.</li>
              <li>Please ensure that you log in at the right time, or the test will no longer be available in that slot.</li>
              <li>The time for the test starts the moment you log into the link. Candidates must complete the test in one shot.</li>
              <li>Do not refresh the page during the exam. Read each question carefully before answering.</li>
              <li>Best of luck!</li>
            </ul>
          </div>
      </div>
    </div>
        </>
      ) : (
        <div className="exam-container">
            {/* Display the timer in the top-right corner */}
          <div className="exam-timer" style={{ position: "absolute", top: "10px", right: "10px", fontSize: "18px", fontWeight: "bold" }}>
            Time Left: {formatTime(timer)}
          </div>
          <div className="exam-title">{currentExam?.exam_name}</div>
          <div className="question-container">
 {currentQuestion ? (
  <>
    <p>
      <strong>Q{Ques.length}:</strong> {currentQuestion.ques}
    </p>
    <div className="options">
      {[currentQuestion.opt1, currentQuestion.opt2, currentQuestion.opt3, currentQuestion.opt4].map((opt, idx) => (
        <div key={idx}>
          <label>
            <input
              type="radio"
              name={`question-${Ques.length - 1}`}
              value={opt}
              checked={selectedAnswers[Ques.length - 1] === opt}
              onChange={handleOptionChange}
            />{" "}
            {opt}
          </label>
        </div>
      ))}
    </div>
  </>
) : (
  <p>Loading question...</p>
)}

          </div>
          <div className="ques-btns">
          <button onClick={handleNextQuestion} className="next-button">
            {Ques.length >= currentExam.total_qs
              ? "Finish Exam"
              : "Next"}
          </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Portal; 