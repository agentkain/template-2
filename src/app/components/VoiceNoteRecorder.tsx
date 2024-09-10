'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDeepgram } from '@/lib/contexts/DeepgramContext';
import { addDocument } from '@/lib/firebase/firebaseUtils';
import { createClient } from '@deepgram/sdk';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VoiceNoteRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const apiKey = useDeepgram();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const deepgramClientRef = useRef<ReturnType<typeof createClient> | null>(null);
  const connectionRef = useRef<any>(null);

  useEffect(() => {
    if (apiKey) {
      deepgramClientRef.current = createClient(apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      if (deepgramClientRef.current) {
        connectionRef.current = deepgramClientRef.current.listen.live({
          model: 'nova-2',
          language: 'en',
          smart_format: true,
          interim_results: true,
        });

        connectionRef.current.on('transcriptReceived', (message: any) => {
          const transcription = message.channel.alternatives[0].transcript;
          console.log('Received transcription:', transcription); // Add this line for debugging
          setTranscript(prev => prev + ' ' + transcription);
        });

        mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0 && connectionRef.current && connectionRef.current.getReadyState() === 1) {
            connectionRef.current.send(event.data);
          }
        });

        mediaRecorderRef.current.start(250);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (connectionRef.current) {
      connectionRef.current.finish();
      connectionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    mediaRecorderRef.current = null;
    saveNote(transcript);
    setTranscript('');
  };

  const saveNote = async (content: string) => {
    if (content.trim()) {
      try {
        await addDocument('notes', { content, createdAt: new Date() });
        console.log('Note saved successfully');
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={toggleRecording}
        className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out`}
      >
        <MicIcon className="h-6 w-6 mr-2" />
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      <Card className="w-full max-w-md mx-auto">
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Transcription</h3>
          <div className="bg-gray-100 p-4 rounded-md h-40 overflow-y-auto whitespace-pre-wrap">
            {transcript || (isRecording ? 'Listening...' : 'Press the button to start recording')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}