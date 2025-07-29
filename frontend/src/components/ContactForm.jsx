import { useState } from 'react';
import api from "@/services/api.js";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await api.post('/email/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setSuccess(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start w-full p-8 min-h-[50vh] bg-gray-100 dark:bg-gray-800 max-w-[90%] rounded-md gap-4">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="mb-6 text-lg">Have questions or need assistance? Reach out to us!</p>

            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-[600px] gap-4">
                <input
                    type="text"
                    placeholder="Your Name"
                    className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <input
                    type="email"
                    placeholder="Your Email"
                    className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                <textarea
                    placeholder="Your Message"
                    className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 h-32"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send Message'}
                </button>

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">Message sent successfully!</p>}
            </form>
        </div>
    );
}