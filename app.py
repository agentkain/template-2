from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from deepgram import (
    DeepgramClient,
    PrerecordedOptions,
    FileSource
)

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize the Deepgram client with the API key from environment variables
DEEPGRAM_API_KEY = os.getenv("NEXT_PUBLIC_DEEPGRAM_API_KEY")
deepgram = DeepgramClient(DEEPGRAM_API_KEY)

@app.route('/api/transcribe', methods=['POST'])
async def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    
    try:
        # Use the v3 SDK methods for transcription
        source = FileSource(buffer=audio_file.read(), mimetype='audio/wav')
        options = PrerecordedOptions(
            model="nova-2",
            language="en-US",
            smart_format=True
        )
        
        response = await deepgram.listen.prerecorded.v("1").transcribe_file(source, options)
        
        # Extract the transcript from the response
        transcript = response['results']['channels'][0]['alternatives'][0]['transcript']
        return jsonify({'transcript': transcript})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)