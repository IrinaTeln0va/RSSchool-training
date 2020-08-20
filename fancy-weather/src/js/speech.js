window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new window.SpeechRecognition();

recognition.interimResults = true;
recognition.lang = 'en';

export default recognition;
