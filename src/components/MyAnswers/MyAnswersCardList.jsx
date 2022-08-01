/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { baseUrl } from '../../helper/utils';
import { useAuthCtx } from '../../store/authContext';
import MyAnswersCard from './MyAnswersCard';
import css from './MyAnswers.module.css';

function MyAnswersCardList() {
  const [answers, setAnswers] = useState([]);
  const { user_id } = useParams();
  const { token } = useAuthCtx();

  const [error, setError] = useState(false);
  const [postCreated, setPostCreated] = useState(false);

  const getAllAnswers = async () => {
    const response = await fetch(`${baseUrl}/answers/user/${user_id}`);
    const data = await response.json();
    if (Array.isArray(data)) {
      setAnswers(data);
    }
    return;
  };
  async function deleteFetch(a_id) {
    if (confirm('Ar tikrai norite istrinti?') === false) return;

    const response = await fetch(`${baseUrl}/answers/${a_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.succes) {
      setPostCreated(true);
    }
    setError(data.err);
    if (Array.isArray(data)) {
      setAnswers(data);
    }
  }
  useEffect(() => {
    getAllAnswers();
  }, []);
  //
  async function handleUpdate(a_id, updatedAnswer) {
    // console.log('handleUpdateTodo called in TodoApp', a_id, updatedAnswer);

    const upd = answers.map((tObj) => {
      if (tObj.a_id === a_id) {
        console.log('updatedAnswer', updatedAnswer);

        return { ...tObj, answer: updatedAnswer };
      }
      return { ...tObj };
    });
    // console.log('updatedAnswer', updatedAnswer);
    setAnswers(upd);
    const newOBj = {
      answer: updatedAnswer,
    };
    console.log('upd', upd);
    console.log('newOBj', newOBj);
    fetchEditedQ(a_id, newOBj);
  }
  //
  async function fetchEditedQ(a_id, updatedAnswer) {
    const response = await fetch(`${baseUrl}/answers/${a_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedAnswer),
    });
    console.log('response', response);
    const data = await response.json();
    console.log('data', data);
    if (Array.isArray(data)) {
      setAnswers(data);
    }
  }

  //
  return (
    <>
      {postCreated ? (
        <>
          <div className={css.successMessage}>
            <p>Answer was successfully deleted</p>
            <Link className={css.navLink} to={`/personal/`}>
              <button className={css.btn}>Back to your personal page</button>
            </Link>
            <Link className={css.navLink} to={`/main/`}>
              <button className={css.btn}>Back to main page</button>
            </Link>
          </div>
        </>
      ) : (
        <div>
          <h2>
            All your Answers below
            <p>({answers.length})</p>
          </h2>
          {answers.length > 0 ? (
            answers.map((q) => (
              <MyAnswersCard
                key={q.a_id}
                onEdit={handleUpdate}
                onDelete={deleteFetch}
                {...q}
              />
            ))
          ) : (
            <p>There are no answers yet</p>
          )}
        </div>
      )}
    </>
  );
}

export default MyAnswersCardList;
