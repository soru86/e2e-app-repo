import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // reCAPTCHA v3 site key (using Google's test key for development)
  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojSP4W0R5O';

  // Load reCAPTCHA v3 script dynamically if not already loaded
  useEffect(() => {
    if (!window.grecaptcha) {
      // Check if script is already being loaded
      const existingScript = document.querySelector(
        `script[src*="recaptcha/api.js"]`
      );

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }
  }, [recaptchaSiteKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const recaptchaAction = 'submit';

  const executeRecaptcha = async () => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(recaptchaSiteKey, { action: recaptchaAction })
          .then((token) => {
            resolve(token);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Execute reCAPTCHA v3
      const recaptchaToken = await executeRecaptcha();

      // Submit form with reCAPTCHA token
      const response = await axios.post('http://localhost:5001/api/submit', {
        ...formData,
        recaptchaToken,
        recaptchaAction,
      });

      if (response.data.success) {
        setSuccess('Form submitted successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          country: '',
        });
      }
    } catch (err) {
      if (err.message === 'reCAPTCHA not loaded') {
        setError('reCAPTCHA failed to load. Please refresh the page and try again.');
      } else {
        setError(
          err.response?.data?.error || 'Failed to submit form. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      <h2>Contact Form</h2>
      <p className="form-description">
        This form is protected by reCAPTCHA v3. Your submission will be automatically verified.
      </p>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country *</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            placeholder="Enter your country"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Enter your message"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        <p className="recaptcha-notice">
          This site is protected by reCAPTCHA and the Google{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{' '}
          apply.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
