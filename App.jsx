import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const days = ['M', 'T', 'W', 'Th', 'F', 'S/S'];
const initWeek = () => ({
  days: days.map((day) => ({
    day,
    workout: '',
    cardio: '',
    notes: '',
    done: false
  })),
  checkpoint: '',
  weight: '',
  progressPic: ''
});

const App = () => {
  const [user, setUser] = useState(null);
  const [weeks, setWeeks] = useState(Array.from({ length: 12 }, () => initWeek()));

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const docSnap = await getDoc(doc(db, 'users', u.uid));
        if (docSnap.exists()) {
          setWeeks(docSnap.data().weeks);
        }
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleChange = (weekIndex, dayIndex, field, value) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex][field] = value;
    setWeeks(newWeeks);
  };

  const toggleDone = (weekIndex, dayIndex) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].done = !newWeeks[weekIndex].days[dayIndex].done;
    setWeeks(newWeeks);
  };

  const saveData = async () => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { weeks });
      alert('Data saved!');
    }
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return <div style={{ padding: 20 }}><button onClick={login}>Sign in with Google</button></div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.displayName} <button onClick={logout}>Logout</button></h2>
      {weeks.map((week, wIdx) => (
        <div key={wIdx} style={{ margin: '20px 0', border: '1px solid #ccc', padding: 10 }}>
          <h3>Week {wIdx + 1}</h3>
          {week.days.map((day, dIdx) => (
            <div key={dIdx} style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
              <b>{day.day}</b>
              <input placeholder='Workout' value={day.workout} onChange={(e) => handleChange(wIdx, dIdx, 'workout', e.target.value)} />
              <input placeholder='Cardio' value={day.cardio} onChange={(e) => handleChange(wIdx, dIdx, 'cardio', e.target.value)} />
              <input placeholder='Notes' value={day.notes} onChange={(e) => handleChange(wIdx, dIdx, 'notes', e.target.value)} />
              <button onClick={() => toggleDone(wIdx, dIdx)}>{day.done ? '✔' : 'Mark'}</button>
            </div>
          ))}
          <textarea
            placeholder='Weekly Checkpoint'
            value={week.checkpoint}
            onChange={(e) => {
              const newWeeks = [...weeks];
              newWeeks[wIdx].checkpoint = e.target.value;
              setWeeks(newWeeks);
            }}
          />
          <input
            placeholder='Weight'
            value={week.weight}
            onChange={(e) => {
              const newWeeks = [...weeks];
              newWeeks[wIdx].weight = e.target.value;
              setWeeks(newWeeks);
            }}
          />
        </div>
      ))}
      <button onClick={saveData}>💾 Save Progress</button>
    </div>
  );
};

export default App;