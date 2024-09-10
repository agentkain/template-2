'use client';

import { useState, useEffect } from 'react';
import { getNotes } from '@/lib/firebase/firebaseUtils';

interface Note {
  id: string;
  text: string;
  createdAt: {
    toDate: () => Date;
  };
}

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes as Note[]);
    };

    fetchNotes();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Notes</h2>
      <ul className="space-y-4">
        {notes.map((note) => (
          <li key={note.id} className="bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-500">
              {note.createdAt.toDate().toLocaleString()}
            </p>
            <p className="mt-2">{note.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}