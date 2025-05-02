import { useState } from 'react';
import '../css/contactForm.css';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validate = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Ingrese un correo electrónico válido';
    }
    
    if (!formData.message) {
      errors.message = 'El mensaje es requerido';
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    const errors = validate();
    setFormErrors(errors);
    
  
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
    
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      setSubmitSuccess(true);
      
     
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form">
      {submitSuccess && (
        <div className="success-message">
          ¡Mensaje enviado con éxito! Te contactaremos pronto.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre"
            className={formErrors.name ? 'error' : ''}
          />
          {formErrors.name && <span className="error-text">{formErrors.name}</span>}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo"
            className={formErrors.email ? 'error' : ''}
            required
          />
          {formErrors.email && <span className="error-text">{formErrors.email}</span>}
        </div>

        <div className="form-group">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Teléfono (opcional)"
          />
        </div>

        <div className="form-group">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Mensaje"
            rows="5"
            className={formErrors.message ? 'error' : ''}
            required
          ></textarea>
          {formErrors.message && <span className="error-text">{formErrors.message}</span>}
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};