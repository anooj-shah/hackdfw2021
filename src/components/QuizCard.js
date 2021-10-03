import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import Button from '@material-tailwind/react/Button';
import { firestore } from 'components/firebaseContext';
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import Input from '@material-tailwind/react/Input';

export default function QuizCard(props) {

  const [displayCorrectFlashMessage, setDisplayCorrectFlashMessage] = useState(false);
  const [displayIncorrectFlashMessage, setIncorrectFlashMessage] = useState(false);

  function handleQuizQuestion() {
    let num = Math.floor(Math.random() * 2)
    if (num === 0) {
      return props.document?.definition
    } else{
      let idx = props.document?.sentence.indexOf(props.document?.word);
      if (idx === -1) {
        return props.document?.definition
      }
      let retString = props.document?.sentence.replace(props.document?.word, '___________');
      if (retString) {
        return retString
      } else {
        return props.document?.definition
      }
    }
  }

  function keyPress(e){
    if(e.keyCode == 13){
      let val = e.target.value;
      if (val === props.document?.word) {
        props.document?.ref.update({num_correct: props.document?.num_correct + 1})
        props.currentDay?.ref.update({words_correct: props.currentDay?.words_correct + 1})
        setDisplayCorrectFlashMessage(true);
        setTimeout(() => {setDisplayCorrectFlashMessage(false)}, 500)
      } else{
        props.document?.ref.update({num_incorrect: props.document?.num_incorrect + 1})
        props.currentDay?.ref.update({words_wrong: props.currentDay?.words_wrong + 1})
        setIncorrectFlashMessage(true);
        setTimeout(() => {setIncorrectFlashMessage(false)}, 500)
      }
       
      props.handleSetQuizQuestion();
      e.target.value = '';
       // put the login here
    }
 }

  return (
    <>
    { displayCorrectFlashMessage &&
    <div className="quiz-centered"><svg xmlns="http://www.w3.org/2000/svg" className="h-96 w-96" fill="none" viewBox="0 0 24 24" stroke="green">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg></div>
    }
    {
      displayIncorrectFlashMessage && 
      <div className="quiz-centered"><svg xmlns="http://www.w3.org/2000/svg" className="h-96 w-96" fill="none" viewBox="0 0 24 24" stroke="red">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg></div>
    }
    <Card>
      <CardBody className="h-96 overflow-y-scroll flex justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center">
          <div className="mb-12 text-4xl mt-12 text-center" style={{minHeight: 150}}>                    
            {handleQuizQuestion()}
          </div>
          <div className="w-full lg:w-6/12 mb-4 font-light" style={{width: 500}}>
            <Input
              type="text"
              color="purple"
              placeholder="Answer"
              onKeyUp={keyPress}
            />
          </div>
        </div>
      </CardBody>
    </Card>
    </>
  );
}
