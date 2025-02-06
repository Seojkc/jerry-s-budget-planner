import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FiDollarSign, FiCalendar, FiTag, FiBell, FiChevronDown } from 'react-icons/fi';
import '../StyleSheets/Income.css'
import axios from 'axios';
import SubmitPopUp from '../Components/SubmitPopUp';


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
`;

const FloatingLabel = styled(motion.label)`
  position: absolute;
  left: 40px;
  top: 50%;
  transform: translateY(-40%);
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  font-size: 1rem;
  transition: all 0.3s ease;
`;

const InputField = styled.input`
  
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
    transform: translateY(-200%);
    font-size: 0.8rem;
    color: #6366f1;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
`;

const DropdownContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const DropdownHeader = styled.div`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DropdownList = styled(motion.ul)`
  position: absolute;
  width: 100%;
  background: #1a1a2f;
  border-radius: 12px;
  margin-top: 0.5rem;
  overflow: hidden;
  z-index: 100;
`;

const DropdownItem = styled.li`
  padding: 1rem;
  color: #fff;
  transition: all 0.2s ease;
    list-style: none;
  &:hover {
    background: rgba(99, 102, 241, 0.2);
  }
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    background: #6366f1;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: all 0.3s ease;
  }

  ${({ active }) => active && `
    background: rgba(99, 102, 241, 0.3);
    
    &::after {
      left: calc(100% - 26px);
    }
  `}
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
  transition: all 0.3s ease;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ErrorMessage = styled(motion.div)`
  color: #ff4757;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

function FuturisticForm(refresh) {
  const [formData, setFormData] = useState({
    amount: '',
    frequency: 'Monthly',
    startDate: new Date().toISOString().split('T')[0],
    category: 'Food',
    description: '',
    vendor:'',
    notifications: false,
    notificationDaysBefore:0
  });

  const [showPopup, setShowPopup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const [errors, setErrors] = useState({});
  const frequencies = ['Monthly', 'Bi-Weekly', 'Annual'];
  const categories = ['Education', 'Entertainment', 'Food', 'Health', 'Miscellaneous','Transport','Utilities'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFrequencySelect = (frequency) => {
    setFormData(prev => ({ ...prev, frequency }));
    setDropdownOpen(false);
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category }));
    setCategoryDropdownOpen(false);
  };

  

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    // Amount validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    // Start date validation
    const selectedDate = new Date(formData.startDate);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.startDate = 'Start date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  //API
  const createRecurringBill = (billData) => {
    return axios.post('http://localhost:5000/api/Bills', billData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  const resetData=()=>
    {
       setFormData({
            amount: '',
            frequency: 'Monthly',
            startDate: new Date().toISOString().split('T')[0],
            category: 'Food',
            description: '',
            vendor:'',
            notifications: false,
            notificationDaysBefore:0
          });
    }


    useEffect(() => {
        axios.get(`http://localhost:5000/api/Bills/${1}`)
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.error("Error fetching bills:", error);
            });
    }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    
    if (isValid) {
        const newBill = {
            bill_id: 1,
            user_id: 1,
            bill_name: formData.vendor,
            amount: formData.amount,
            frequency: formData.frequency,
            start_date: formData.startDate,
            end_date: null,
            category: formData.category,
            description: formData.description,
            send_notification: formData.notifications,
            notification_days_before: formData.notificationDaysBefore,
            payment_method: "",
            vendor: formData.vendor,
            reference_number: "",
            blnStatus: true,
            next_due_date: new Date().toISOString().split("T")[0]
        };
        

        createRecurringBill(newBill)
            .then(response => {
            // Handle success
            console.log('Bill created:', response.data);
            // Show success notification
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false)
                resetData();
                //handleClose();
            }, 2000);
            })
            .catch(error => {
            // Handle error
            console.error('Error creating bill:', error);
            // Add error state handling if needed
            });
        

        
    }
  };

  return (
    <FuturisticFormContainer>
    <SubmitPopUp show={showPopup} />
      <FormTitle>New Recurring Bill</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <InputContainer>
            <InputField
              name="amount"
              type="number"
              placeholder=" "
              className='start-date-input'
              value={formData.amount}
              onChange={handleInputChange}
            />
            <FloatingLabel
              initial={{ y: '-50%' }}
              animate={{ y: formData.amount ? '-350%' : '-50%' }}
            >
              <FiDollarSign style={{ marginRight: '8px' }} />
              Amount
            </FloatingLabel>
            {errors.amount && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errors.amount}
              </ErrorMessage>
            )}
            
          </InputContainer>

          <DropdownContainer ref={dropdownRef}>
            <DropdownHeader onClick={() => setDropdownOpen(!dropdownOpen)}>
              {formData.frequency || 'Select Frequency'}
              <FiChevronDown />
            </DropdownHeader>
            <AnimatePresence>
              {dropdownOpen && (
                <DropdownList
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {frequencies.map((freq) => (
                    <DropdownItem key={freq} onClick={() => handleFrequencySelect(freq)}>
                      {freq}
                    </DropdownItem>
                  ))}
                </DropdownList>
              )}
            </AnimatePresence>
          </DropdownContainer>

          <InputContainer>
            <InputField
              name="startDate"
              type="date"
              placeholder=" "
              className='start-date-input'
              value={formData.startDate}
              onChange={handleInputChange}
            />
            <FloatingLabel
              initial={{ y: '-50%' }}
              animate={{ y: formData.startDate ? '-350%' : '-50%' }}
            >
              <FiCalendar style={{ marginRight: '8px' }} />
              Start Date
            </FloatingLabel>
            {errors.startDate && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errors.startDate}
              </ErrorMessage>
            )}
            
          </InputContainer>

          <DropdownContainer ref={categoryDropdownRef}>
            <DropdownHeader onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}>
              {formData.category || 'Select Category'}
              <FiChevronDown />
            </DropdownHeader>
            <AnimatePresence>
              {categoryDropdownOpen && (
                <DropdownList
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {categories.map((category) => (
                    <DropdownItem key={category} onClick={() => handleCategorySelect(category)}>
                      {category}
                    </DropdownItem>
                  ))}
                </DropdownList>
              )}
            </AnimatePresence>
          </DropdownContainer>

          {/* Updated Category InputContainer */}
          
        </FormGrid>

        <FormGrid>
            <InputContainer>
            <InputField
                name="description"
                type="text"
                placeholder=" "
                className='start-date-input'
                value={formData.description}
                onChange={handleInputChange}
            />
            <FloatingLabel
                initial={{ y: '-50%' }}
                animate={{ y: formData.description ? '-350%' : '-50%' }}
            >
                Description<sup> (optional)</sup>
            </FloatingLabel>
            </InputContainer>

            <InputContainer>
                <InputField
                    name="vendor"
                    type="text"
                    placeholder=" "
                    className='start-date-input'
                    value={formData.vendor}
                    onChange={handleInputChange}
                />
                <FloatingLabel
                    initial={{ y: '-50%' }}
                    animate={{ y: formData.vendor ? '-350%' : '-50%' }}>
                    Vendor<sup> (optional)</sup>
                </FloatingLabel>
            </InputContainer>
        </FormGrid>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0',height:'50px' }}>
            <FiBell style={{ color: '#fff' }} />
            <span style={{ color: '#fff' }}>Enable Notifications</span>
            <ToggleSwitch
                active={formData.notifications}
                onClick={() => setFormData(prev => ({ ...prev, notifications: !prev.notifications }))}/>
            <InputField
                style={formData.notifications?{display:''}:{display:'none'}}
                name="notificationDaysBefore"
                type="number"
                placeholder=""
                min="0"
                className='start-date-input days-before-input'
                value={formData.notificationDaysBefore}
                onChange={handleInputChange}
                /><span style={formData.notifications?{color: '#fff'}:{display:'none'}}>Days Before</span>
        
        </div>

        <SubmitButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          type="submit">
          Create Bill
        </SubmitButton>
      </form>
    </FuturisticFormContainer>
  );
}
 
export default FuturisticForm;