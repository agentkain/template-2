import React from 'react';
import Link from "next/link";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Dynamically import client components
const VoiceNoteRecorder = dynamic(() => import('@/app/components/VoiceNoteRecorder'), { ssr: false });
const NotesList = dynamic(() => import('@/app/components/NotesList'), { ssr: false });

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f0f4ff] to-[#e6f0ff]">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="#" className="flex items-center gap-2">
            <MoonIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Lunar Journal</span>
          </Link>
          <nav className="hidden gap-4 md:flex">
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Voice Notes
            </Link>
          </nav>
          <Button className="md:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6">Your Voice Notes</h1>
          <VoiceNoteRecorder />
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Journal Entries</h2>
          <NotesList />
        </section>
      </main>
      {/* Remove or comment out the fixed bottom section if you don't need it anymore */}
      {/* <div className="fixed inset-x-0 bottom-0 flex items-center justify-center z-20 p-4">
        <Card>
          <CardContent className="space-y-4 text-center sm:rounded-lg">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold">How are you feeling today?</h3>
              <div className="flex justify-center mt-2">
                <VoiceNoteRecorder />
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
