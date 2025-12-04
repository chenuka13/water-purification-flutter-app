import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
    const { currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    useEffect(() => {
        if (!currentUser) {
            setMessages([{ text: "Please log in to use the chat assistant.", sender: 'bot' }]);
            return;
        }

        const q = query(
            collection(db, `users/${currentUser.uid}/chat_history`),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const history = snapshot.docs.map(doc => doc.data());
            if (history.length === 0) {
                setMessages([{ text: "Hi! Ask me about bottles or water purification.", sender: 'bot' }]);
            } else {
                setMessages(history);
            }
        });

        return () => unsubscribe();
    }, [currentUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const saveMessage = async (text, sender) => {
        if (!currentUser) return;
        try {
            await addDoc(collection(db, `users/${currentUser.uid}/chat_history`), {
                text,
                sender,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            console.error("Error saving message:", error);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || !currentUser) return;

        const text = inputText;
        setInputText("");

        // Save user message
        await saveMessage(text, 'user');

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const prompt = `You are a helpful assistant for a smart water bottle application. 
            The user is asking: "${text}". 
            Answer the question concisely and accurately related to water purification, hydration, or the smart bottle features. 
            If the question is completely unrelated to water, health, or the bottle, politely steer the conversation back to these topics.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const botAnswer = response.text();

            // Save to forum with answer
            await addDoc(collection(db, "forum_posts"), {
                question: text,
                timestamp: serverTimestamp(),
                answers: [{
                    text: botAnswer,
                    user: 'Bot',
                    timestamp: new Date().toISOString()
                }],
                userId: currentUser.uid
            });
            await saveMessage(botAnswer, 'bot');
            await saveMessage("I've also saved this Q&A to your Forum.", 'bot');

        } catch (error) {
            console.error("Error generating response:", error);
            await saveMessage(`Error: ${error.message || "Unknown error connecting to Gemini."}`, 'bot');
        }
    };

    if (!currentUser) return null; // Or show a disabled state

    return (
        <div className="fixed bottom-6 right-6 z-[1000]">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {isOpen && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 sm:w-96 flex flex-col h-[500px] border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">Water Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask a question..."
                                className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:placeholder-gray-400"
                            />
                            <button
                                onClick={handleSend}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
