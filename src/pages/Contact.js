// src/pages/Contact.js
import React, { useState } from 'react';
import { FiMail, FiLinkedin, FiSend, FiChevronRight, FiMessageSquare } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS configuration
      const serviceId = 'service_2m3g3vy'; 
      const templateId = 'template_sv3qz9v'; 
      const publicKey = 'EefO7LzPnAgMyBnX2'; 

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: 'Surya Teja',
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      alert(`Thank you, ${formData.name}, for your message! I have received your email and will get back to you soon.`);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('Sorry, there was an error sending your message. Please try again or contact me directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="contact-layout-container">
        <div className="contact-info-panel">
          <div className="info-header">
            <div className="info-icon-wrapper">
              <FiMail />
            </div>
            <h2>Let's Connect</h2>
          </div>
          <p className="info-text">
            Have a project in mind, a question, or just want to say hi? I'd love to hear from you. Contact me, and I'll get back to you as soon as possible.
          </p>
          <div className="info-links">
            <a href="mailto:medisettysuryateja000@gmail.com">
              <FiMail />
              <span>medisettysuryateja000@gmail.com</span>
            </a>
            <a href="https://www.linkedin.com/in/surya-teja-medisetty-5b62822a3/" target='_blank' rel="noopener noreferrer">
              <FiLinkedin />
              <span>LinkedIn</span>
            </a>
            <a target='_blank' rel="noopener noreferrer">
              <FiMessageSquare />
              <span>9440410212</span>
            </a>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="contact-form-panel">
          <form onSubmit={handleSubmit}>
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Hi Surya, I'd like to talk about..."
                disabled={isSubmitting}
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="action-btn primary submit-btn"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
