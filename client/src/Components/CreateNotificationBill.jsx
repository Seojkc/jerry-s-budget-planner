import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import '../StyleSheets/CreateNotificationBill.css';

const FuturisticFormContainer = styled.div`
  background: linear-gradient(145deg, #0f0f1a, #2a2a40);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
 
  margin: 2rem auto;
`;

const FormTitle = styled.h2`
  color: #fff;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
  padding-right:50px;
`;

const FloatingLabel = styled(motion.label)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  font-size: 1rem;
  transition: all 0.3s ease;
`;

const InputField = styled.input`
  width: 100%;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  


  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
  }

  &:not(:placeholder-shown) + ${FloatingLabel},
  &:focus + ${FloatingLabel} {
    transform: translateY(-450%);
    font-size: 0.8rem;
    color: #6366f1;
  }
`;

const DatePickerWrapper = styled(DatePicker)`
  width: 100%;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1.5rem;
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #ff4757;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const EmailComposer = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    body: '',
    scheduleDate: null
  });
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (formData.scheduleDate) {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 1);
      minDate.setHours(0, 0, 0, 0);
      
      if (formData.scheduleDate < minDate) {
        setFormData(prev => ({...prev, scheduleDate: minDate}));
      }
    }
  }, [formData.scheduleDate]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.recipient) {
      newErrors.recipient = 'Recipient is required';
    } else if (!emailRegex.test(formData.recipient)) {
      newErrors.recipient = 'Invalid email format';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Message body is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Submit logic here
    console.log('Email data:', formData);
    
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      resetData();
    }, 2000);
  };

  const resetData = () => {
    setFormData({
      recipient: '',
      subject: '',
      body: '',
      scheduleDate: null
    });
    setErrors({});
  };

  return (
    <FuturisticFormContainer>
      <FormTitle>Compose Email</FormTitle>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <InputField
            type="email"
            value={formData.recipient}
            onChange={(e) => setFormData({...formData, recipient: e.target.value})}
            placeholder=" "
          />
          <FloatingLabel
            initial={{ y: '-50%' }}
            animate={{ y: formData.recipient ? '-200%' : '-50%' }}
            transition={{ duration: 0.3 }}>
            Recipient Email
          </FloatingLabel>
          {errors.recipient && <ErrorMessage>{errors.recipient}</ErrorMessage>}
        </InputContainer>

        <InputContainer>
          <InputField
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            placeholder=" "
          />
          <FloatingLabel
            initial={{ y: '-50%' }}
            animate={{ y: formData.subject ? '-200%' : '-50%' }}
            transition={{ duration: 0.3 }}
          >
            Subject
          </FloatingLabel>
          {errors.subject && <ErrorMessage>{errors.subject}</ErrorMessage>}
        </InputContainer>

        <InputContainer>
          <InputField
            as="textarea"
            value={formData.body}
            onChange={(e) => setFormData({...formData, body: e.target.value})}
            placeholder=" "
            rows="6"
          />
          <FloatingLabel
            initial={{ y: '-50%' }}
            animate={{ y: formData.body ?'-450%': '-50%' }}
            className='message-body'
            transition={{ duration: 0.3 }}
          >
            Message Body
          </FloatingLabel>
          {errors.body && <ErrorMessage>{errors.body}</ErrorMessage>}
        </InputContainer>

        <InputContainer>
          <DatePickerWrapper
            selected={formData.scheduleDate}
            onChange={(date) => setFormData({...formData, scheduleDate: date})}
            minDate={new Date().setDate(new Date().getDate() + 1)}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select schedule date"
          />
        </InputContainer>

        <SubmitButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
        >
          {formData.scheduleDate ? 'Schedule Email' : 'Send Immediately'}
        </SubmitButton>
      </form>
    </FuturisticFormContainer>
  );
};

export default EmailComposer;