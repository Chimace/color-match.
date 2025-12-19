import React, { useState } from 'react';

// Define a User type or use specific fields if known, for now treating strict 'any' as 'unknown' or 'Record<string, unknown>' isn't easy without casting. 
// However, the error is 'Unexpected any'. 
// We will use a more specific type if possible, or `unknown` and cast.
interface User {
    id: string;
    username: string;
}

interface LoginProps {
    onLogin: (token: string, user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const res = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            onLogin(data.token, data.user);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
                <h2 className="text-3xl font-bold mb-6 text-center text-pink-500">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>
                {error && <div className="bg-red-500/20 text-red-400 p-2 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-pink-400 hover:underline"
                    >
                        {isLogin ? 'Sign up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};
