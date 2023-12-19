import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DraggableItem from './DraggableItem';
import DroppableArea from './DroppableArea';
import quizData from '../quizData.json';

const QuizApp = () => {
    const [questions, setQuestions] = useState([]);
    const [options, setOptions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [retrievedValue, setRetrievedValue] = useState('');
    const [score, setScore] = useState(0);
  
    useEffect(() => {
      // Fetch and set the questions from the imported JSON file
      setQuestions(quizData.questions);
      // Set the initial options based on the first question
      setOptions(quizData.questions[0].options);
    }, []);
  
    const onDragEnd = (result) => {
      const { source, destination } = result;
  
      if (!destination) return;
  
      const draggedItemId = result.draggableId;
  
      if (source.droppableId === 'droppable-options' && destination.droppableId === 'droppable-answer') {
        const draggedItem = options.find((item) => item.id === draggedItemId);
        setOptions((prevOptions) => prevOptions.filter((item) => item.id !== draggedItemId));
  
        if (answers.length === 0) {
          setAnswers([draggedItem]);
        } else {
          const replacedItem = answers[0];
          setOptions((prevOptions) => [...prevOptions, replacedItem]);
          setAnswers([draggedItem]);
        }
      }
  
      if (source.droppableId === 'droppable-answer' && destination.droppableId === 'droppable-options') {
        const draggedItem = answers.find((item) => item.id === draggedItemId);
        setAnswers([]);
        setOptions((prevOptions) => {
          const newOptions = [...prevOptions];
          newOptions.splice(destination.index, 0, draggedItem);
          return newOptions;
        });
      }
  
      if (source.droppableId === 'droppable-answer' && destination.droppableId === 'droppable-answer') {
        const draggedItem = answers.find((item) => item.id === draggedItemId);
        setAnswers([draggedItem]);
      }
    };
  
  
    const notifyCorrectAnswer = () => {
      toast.success('Correct answer!', {
        autoClose: 2000,
      });
    };
  
    const notifyWrongAnswer = () => {
      toast.error('Wrong answer!', {
        autoClose: 2000,
      });
    };
  
    const notifyQuizCompleted = () => {
      toast.info(`Quiz completed! Your final score: ${score}`, {
        autoClose: 2000,
      });
    };
  
    const verifyAnswerAndMoveToNext = () => {
      if (answers.length > 0) {
        const currentQuestion = questions[currentQuestionIndex];
        const selectedAnswerId = answers[0].id; // Get the ID of the selected answer
        
        if (currentQuestion.correctAnswerId === selectedAnswerId) { // Compare with correctAnswerId
          setScore(score + 1);
          notifyCorrectAnswer();
        } else {
          notifyWrongAnswer();
        }
    
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setOptions(questions[currentQuestionIndex + 1].options); // Set options for the next question
          setAnswers([]); // Clear previous answers
          setRetrievedValue('');
        } else {
          notifyQuizCompleted();
        }
      } else {
        setRetrievedValue('No option selected');
      }
    };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'static', justifyContent: 'space-around', marginTop: '20px' }}>
          {questions.length > 0 && (
            <h3>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].content}</h3>
          )}
          <DroppableArea droppableId="droppable-options" items={options} title="Options" />
          <DroppableArea droppableId="droppable-answer" items={answers} title="Answer" />
        </div>
      </DragDropContext>

      <div style={{ display: 'flex', alignItems: 'left' }}>
        <button onClick={verifyAnswerAndMoveToNext}>Next</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default QuizApp;
