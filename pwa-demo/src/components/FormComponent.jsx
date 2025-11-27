import React, { useState } from 'react';
import { useOfflineQueue } from '../hooks/useOfflineQueue';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

function FormComponent({ onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const isOnline = useOnlineStatus();
    const { addToQueue } = useOfflineQueue();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isOnline) {
                // Try to submit directly
                const response = await fetch('/api/forms', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    onSuccess && onSuccess(formData);
                    setFormData({ name: '', email: '', message: '' });
                } else {
                    throw new Error('Failed to submit form');
                }
            } else {
                // Add to queue
                await addToQueue('form', formData);
                onSuccess && onSuccess({ ...formData, queued: true });
                setFormData({ name: '', email: '', message: '' });
            }
        } catch (error) {
            // If online but request failed, add to queue
            if (isOnline) {
                await addToQueue('form', formData);
                onSuccess && onSuccess({ ...formData, queued: true });
                setFormData({ name: '', email: '', message: '' });
            } else {
                alert('Failed to save form. It has been queued for later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Contact Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows="4"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : isOnline ? 'Submit' : 'Save (Offline - Queued)'}
                </button>
            </form>
        </div>
    );
}

export default FormComponent;

