import StatusCard from 'components/StatusCard';
import ChartLine from 'components/ChartLine';
import ChartBar from 'components/ChartBar';
import PageVisitsCard from 'components/PageVisitsCard';
import { firestore } from 'components/firebaseContext';
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';
import QuizCard from 'components/QuizCard';

export default function Review() {

  const [quizQuestion, setQuizQuestion] = useState(0);

  function roundTwoDec(num) {
    return Math.round(num * 100) / 100
}

function calculateAverage(num1, num2) {

    let answ = (num1 - num2) / Math.abs(num2);
    
    return roundTwoDec(Math.abs(answ))
}

function determineArrow(num1, num2) {
    let answ = (num2 - num1) / 100 ;
    if (answ > 0) {
        return 'arrow_downward'
    } else {
        return 'arrow_upward'
    }
}

    const sessionRef = firestore.collection('sessions');
    const query = sessionRef.orderBy('date', 'desc').limit(7);

    const [documents] = useCollectionData(query, {idField: 'id', refField: 'ref'});

    const collectionRef = firestore.collection('words');
    const query2 = collectionRef.orderBy('date', 'desc');

    const [collection, load, err] = useCollectionData(query2, {idField: 'id', refField: 'ref'})


    function handleSetQuizQuestion() {

      let prevQuizQuestion = quizQuestion;
      while (true) {
        if (collection.length != 0) {
          let num = Math.floor(Math.random() * collection.length)
          if (num != prevQuizQuestion) {
            setQuizQuestion(num)
            return
          }
        } else {
          return
        }
      }
    }

    return (
        <>
            <div className="bg-light-blue-500 px-3 md:px-8 h-40" />

            <div className="px-3 md:px-8 -mt-24">
                <div className="container mx-auto max-w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mb-4">
                        <StatusCard
                            color="pink"
                            icon="library_books"
                            title="Words Read"
                            amount={documents && documents[0]?.num_words_read}
                            percentage={documents && calculateAverage(documents[0]?.num_words_read, documents[1]?.num_words_read)}
                            percentageIcon={documents && determineArrow(documents[0]?.num_words_read, documents[1]?.num_words_read)}
                            percentageColor={documents && determineArrow(documents[0]?.num_words_read, documents[1]?.num_words_read) == 'arrow_upward' ? 'green' : 'red'}
                            date="Since last week"
                        />
                        <StatusCard
                            color="orange"
                            icon="grading"
                            title="Review Rate"
                            amount={documents && roundTwoDec(documents[0]?.words_correct / documents[0]?.words_wrong)}
                            percentage={documents && calculateAverage(roundTwoDec(documents[0]?.words_correct / documents[0]?.words_wrong), roundTwoDec(documents[1]?.words_correct / documents[1]?.words_wrong))}
                            percentageIcon={documents && determineArrow(roundTwoDec(documents[0]?.words_correct / documents[0]?.words_wrong), roundTwoDec(documents[1]?.words_correct / documents[1]?.words_wrong))}
                            percentageColor={documents && determineArrow(roundTwoDec(documents[0]?.words_correct / documents[0]?.words_wrong), roundTwoDec(documents[1]?.words_correct / documents[1]?.words_wrong)) == 'arrow_upward' ? 'green' : 'red' }
                            date="Since yesterday"
                        />
                        <StatusCard
                            color="purple"
                            icon="bolt"
                            title="Reading Speed"
                            amount={documents && documents[0]?.reading_speed}
                            percentage={documents && calculateAverage(documents[0]?.reading_speed, documents[1]?.reading_speed)}
                            percentageIcon={documents && determineArrow(documents[0]?.reading_speed, documents[1]?.reading_speed)}
                            percentageColor={documents && determineArrow(documents[0]?.reading_speed, documents[1]?.reading_speed) == 'arrow_upward' ? 'green' : 'red'}
                            date="Since yesterday"
                        />
                        <StatusCard
                            color="blue"
                            icon="local_fire_department"
                            title="Reading Streak"
                            amount={documents && documents[0]?.reading_streak}
                            percentage={documents && documents[0]?.reading_streak}
                            percentageIcon={documents && determineArrow(documents[0]?.reading_streak, documents[1]?.reading_streak)}
                            percentageColor={documents && determineArrow(documents[0]?.reading_streak, documents[1]?.reading_streak) == 'arrow_upward' ? 'green' : 'red'}
                            date="Since last streak"
                        />
                    </div>
                </div>
            </div>

            <div className="px-3 md:px-8 h-auto">
                <div className="container mx-auto max-w-full">
                    <div className="grid grid-cols-1 xl:grid-cols-5">
                        <div className="xl:col-start-1 xl:col-end-6 px-4 mb-14">
                            <QuizCard 
                            document={collection && collection[quizQuestion]}
                            handleSetQuizQuestion={handleSetQuizQuestion}
                            currentDay={documents && documents[0]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
