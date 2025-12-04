import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, where } from 'firebase/firestore';
import { MessageSquare, Send, Clock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Forum = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAnswers, setNewAnswers] = useState({});

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        // Removed orderBy to avoid needing a composite index for now.
        // We will sort client-side.
        const q = query(
            collection(db, "forum_posts"),
            where("userId", "==", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort client-side
            postsData.sort((a, b) => {
                const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
                const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
                return timeB - timeA;
            });

            setPosts(postsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching posts:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleAddAnswer = async (postId) => {
        const answerText = newAnswers[postId];
        if (!answerText || !answerText.trim()) return;

        try {
            const postRef = doc(db, "forum_posts", postId);
            await updateDoc(postRef, {
                answers: arrayUnion({
                    text: answerText,
                    timestamp: new Date().toISOString(), // Simple timestamp for now
                    user: currentUser.displayName || "User"
                })
            });
            setNewAnswers(prev => ({ ...prev, [postId]: "" }));
        } catch (error) {
            console.error("Error adding answer: ", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-700">Please log in to view your saved questions.</h2>
                <button
                    onClick={() => navigate('/login')}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Login
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors mb-4"
            >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
            </button>

            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Saved Questions</h1>
                <p className="text-gray-600 dark:text-gray-400">Questions you've asked the assistant.</p>
            </div>

            <div className="space-y-6">
                {posts.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No saved questions yet. Ask the chatbot something related to water purification!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{post.question}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                <Clock className="w-3 h-3" />
                                                <span>
                                                    {post.timestamp?.toDate ? post.timestamp.toDate().toLocaleDateString() : 'Just now'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Answers Section */}
                                <div className="mt-6 space-y-4">
                                    {post.answers && post.answers.length > 0 && (
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Answers</h4>
                                            {post.answers.map((answer, idx) => (
                                                <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold text-xs text-blue-600 dark:text-blue-400 block mb-1">{answer.user}</span>
                                                    {answer.text}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Answer Input */}
                                    <div className="flex gap-2 mt-4">
                                        <input
                                            type="text"
                                            value={newAnswers[post.id] || ""}
                                            onChange={(e) => setNewAnswers(prev => ({ ...prev, [post.id]: e.target.value }))}
                                            placeholder="Add a note..."
                                            className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:placeholder-gray-400"
                                        />
                                        <button
                                            onClick={() => handleAddAnswer(post.id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <Send size={16} />
                                            Save Note
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Forum;
