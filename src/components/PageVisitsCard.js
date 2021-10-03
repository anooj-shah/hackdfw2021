import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import Button from '@material-tailwind/react/Button';
import { firestore } from 'components/firebaseContext';
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect } from 'react';
import { useHistory } from "react-router-dom";

export default function PageVisitsCard() {
    const history = useHistory();

    const collectionRef = firestore.collection('words');
    const query = collectionRef.orderBy('date', 'desc');

    const [collection, load, err] = useCollectionData(query, {idField: 'id', refField: 'ref'})

    const handleRoute = () =>{ 
        history.push("/review");
      }

    return (
        <Card>
            <CardHeader color="blue" contentPosition="none">
                <div className="w-full flex items-center justify-between">
                    <h2 className="text-white text-2xl">Words to Review</h2>
                    <Button
                        color="transparent"
                        buttonType="link"
                        size="lg"
                        style={{ padding: 0 }}
                        onClick={handleRoute}
                    >
                        Begin Review
                    </Button>
                </div>
            </CardHeader>
            <CardBody className="h-96 overflow-y-scroll">
                <div className="overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr>
                                <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                    Word
                                </th>
                                <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                    Definition
                                </th>
                                <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                    Correct
                                </th>
                                <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                    Wrong
                                </th>
                                <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (collection && collection.length !== 0) ? collection.map((c) => 
                                {   
                                    let displayDate = new Date(c.date.toDate()).toLocaleDateString('en-us')

                                    return (                                
                                    <tr>
                                        <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                            {c.word}
                                        </th>
                                        <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                            {c.definition}
                                        </td>
                                        <td onClick={() => {c.ref.update({num_correct: c.num_correct + 1})}} className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                            {c.num_correct}
                                        </td>
                                        <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                            {c.num_incorrect}
                                        </td>
                                        <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                            {displayDate}
                                        </td>
                                    </tr>)
                                }
                                )
                            :
                            <p></p>
                            }
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
    );
}
