import React, { useState, useEffect } from "react";
import "./portal.css";
import Navbar from "../student/components/Navbar";
import axios from "axios";

const Portal = () => {
  const [exams, setExams] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [hasTakenTest,setHasTakenTest] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeToStart, setTimeToStart] = useState();
  const [time, setTime] = useState([]);
  const [Ques,setQues] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);


  const [timer, setTimer] = useState(0); // Overall timer in seconds
  const [questionTimes, setQuestionTimes] = useState([]); // Array to track time spent on each question
  const [questionStartTime, setQuestionStartTime] = useState(0); // Start time for the current question

  useEffect(() => {
    // Fetch upcoming exams
    const fetchExams = async () => {
      try {
        const response = await axios.post("/api/student/upcoming");
        //console.log(response.data);
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

  const handleStartExam = (ind,exam_id) => {
    setIsExamStarted(true);
    setCurrentExam(exams[ind]);
    setTimer(exams[ind].duration * 60);
    //fetch questions of exam
    const fetchQ = async () => {
        try {
          const response = await axios.post("/api/student/question",{exam_id});
          console.log(response.data);
          if(response.data=="Test taken!"){
            alert("You have already taken the test!")
            setIsExamStarted(false);
            setHasTakenTest(true);
          
          } // Record the start time for the first question
          else{
          setQues(response.data); // Update state with fetched exams
          setQuestionTimes(new Array(response.data.length).fill(0)); // Initialize questionTimes array
          setSelectedAnswers(new Array(response.data.length).fill(null));
          setQuestionStartTime(Date.now());
          }
          } catch (error) {
          console.error("Error fetching exams:", error);
        }
      };
      fetchQ();
    setCurrentQuestionIndex(0);
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
        if (updatedTimes[currentQuestionIndex]) {
          updatedTimes[currentQuestionIndex] += timeSpent;
        } else {
          updatedTimes[currentQuestionIndex] = timeSpent;
        }
        return updatedTimes;
      });
      
      alert("Time's up! The exam has ended.");
      setIsExamStarted(false);
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
    const selectedOption = e.target.value; // Get the value of the selected option
    setSelectedAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = selectedOption; // Update the selected answer for the current question
      return updatedAnswers;
    });
  }; 
  const handlePrevQuestion = () => {
    const currentTime = Date.now();
    const timeSpent = Math.floor((currentTime - questionStartTime) / 1000); // Calculate time spent on the current question
  
    // Update the total time for the current question
    setQuestionTimes((prevTimes) => {
      const updatedTimes = [...prevTimes];
      if (updatedTimes[currentQuestionIndex]) {
        updatedTimes[currentQuestionIndex] += timeSpent; // Add to existing time if it exists
      } else {
        updatedTimes[currentQuestionIndex] = timeSpent; // Initialize if no time exists
      }
      return updatedTimes;
    });
  
    // Navigate to the previous question
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setQuestionStartTime(currentTime); // Reset start time for the previous question
    } else {
      alert("This is the first question.");
    }
  };
  

  const handleNextQuestion = () => {
    const currentTime = Date.now();
    const timeSpent = Math.floor((currentTime - questionStartTime) / 1000); // Calculate time spent on the current question
  
    // Update the total time for the current question
    setQuestionTimes((prevTimes) => {
      const updatedTimes = [...prevTimes];
      if (updatedTimes[currentQuestionIndex]) {
        updatedTimes[currentQuestionIndex] += timeSpent; // Add to existing time if it exists
      } else {
        updatedTimes[currentQuestionIndex] = timeSpent; // Initialize if no time exists
      }
      return updatedTimes;
    });
  
    // Navigate to the next question
    if (currentQuestionIndex < Ques.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setQuestionStartTime(currentTime); // Reset start time for the next question
    } else {
      setTimeout(() => {
        //console.log("Time spent on each question:", questionTimes);
        //console.log("Selected answers:", selectedAnswers);
        alert("You have completed the exam!");
        setIsExamStarted(false);
      }, 1000);
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
          <div className="right-side-panel">
          <h1>Upcoming Exams</h1>
          <div className="exam-list">
            {exams.map((exam,index) => (
              <div key={exam.id} className="exam-card">
                <h2>{exam.exam_name}</h2>
                <p>Start Time: {toDate(exam.slot).toLocaleTimeString()}</p>
                  <div className="exam_btns">
                  <button className="start_exam"
                    onClick={()=>{handleStartExam(index,exam.exam_id)}}
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
  {Ques.length > 0 && Ques[currentQuestionIndex] ? (
    <>
      <p>
                  <strong>Q{currentQuestionIndex + 1}:</strong>{" "}
                  {Ques[currentQuestionIndex].ques}
                </p>
                <div className="options">
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`} // Group radio buttons by question
                        value={Ques[currentQuestionIndex].opt1} // Store the answer text
                        checked={
                          selectedAnswers[currentQuestionIndex] === Ques[currentQuestionIndex].opt1
                        }
                        onChange={handleOptionChange}
                      />{" "}
                      {Ques[currentQuestionIndex].opt1}
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={Ques[currentQuestionIndex].opt2} // Store the answer text
                        checked={
                          selectedAnswers[currentQuestionIndex] === Ques[currentQuestionIndex].opt2
                        }
                        onChange={handleOptionChange}
                      />{" "}
                      {Ques[currentQuestionIndex].opt2}
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={Ques[currentQuestionIndex].opt3} // Store the answer text
                        checked={
                          selectedAnswers[currentQuestionIndex] === Ques[currentQuestionIndex].opt3
                        }
                        onChange={handleOptionChange}
                      />{" "}
                      {Ques[currentQuestionIndex].opt3}
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={Ques[currentQuestionIndex].opt4} // Store the answer text
                        checked={
                          selectedAnswers[currentQuestionIndex] === Ques[currentQuestionIndex].opt4
                        }
                        onChange={handleOptionChange}
                      />{" "}
                      {Ques[currentQuestionIndex].opt4}
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <p>Loading question...</p>
            )}
          </div>
          <div className="ques-btns">
          <button onClick={handlePrevQuestion} className="prev-button"> Prev </button>
          <button onClick={handleNextQuestion} className="next-button">
            {currentQuestionIndex === Ques.length - 1
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