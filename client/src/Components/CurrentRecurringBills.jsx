import '../StyleSheets/CurrentRecurringBills.css';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FiTrash2, FiClock, FiCalendar, FiDollarSign, FiRepeat } from 'react-icons/fi';

const BillList = () => {
  const [bills, setBills] = useState([]);
  
  // Fetch bills from API
  const fetchBills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Bills');
      const billsWithColors = response.data.map(bill => ({
          ...bill,
          color: randomGradient() // Generate a gradient for each bill
        }));
        setBills(billsWithColors);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };
  useEffect(() => {
    
    fetchBills();
  }, []);

  // Delete bill function
  const handleDelete = async (billId) => {
    try {
      await axios.delete(`http://localhost:5000/api/bills/${billId}`);
      fetchBills();
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const randomBrightColor = () => {
    const hue = Math.floor(Math.random() * 360); // Random hue (0-360)
    return `hsl(${hue}, 90%, 55%)`; // High saturation, medium brightness
  };
  
  // Function to create a structured gradient (dark to light)
  const randomGradient = () => {
    const color1 = randomBrightColor();
    const color2 = `hsl(${Math.random() * 360}, 90%, 75%)`; // Lighter shade
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  };

  const [flippedCards, setFlippedCards] = useState([]);

  // Step 2: Function to toggle the flip state of a specific card
  const handleCardFlip = (index) => {
    setFlippedCards((prev) => {
      const updatedFlippedCards = [...prev];
      if (updatedFlippedCards.includes(index)) {
        updatedFlippedCards.splice(updatedFlippedCards.indexOf(index), 1); // Remove flip if it's already flipped
      } else {
        updatedFlippedCards.push(index); // Add flip if it's not flipped
      }
      return updatedFlippedCards;
    });
  };


  const formatDate = (date) => {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate().toString().padStart(2, '0'); // Ensure day is 2 digits
    const month = formattedDate.toLocaleString('default', { month: 'long' }); // Get full month name
    const year = formattedDate.getFullYear(); // Get the year
    return `${month} ${day}, ${year}`; // Combine the values
  };
  

  return (
    <div className="container-Recurring-bills">
      <h2 className=" bill-heading">Current Recurring Bills</h2>
      <p className='bill-sub-heading'>click card for details</p>
      <div className="container-list">
        <AnimatePresence >
            {bills.map((bill,index) => (
            <div >
                    <div className="flip-card-container glass-card" style={{ background: bill.color }} onClick={() => handleCardFlip(index)}>
                        <div className={`flip-card ${flippedCards.includes(index) ? 'flipped' : ''}`}>
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <div className="card-content">
                                        <motion.div
                                            key={bill.bill_id}
                                            variants={cardVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            
                                            transition={{ duration: 0.3 }}
                                            className="glass-card bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 mb-4 relative">
                                                <div className='first-curve-glass-card'></div>
                                                <div className='second-curve-glass-card'></div>
                                                
                                                <div className="flex justify-between items-start">

                                                    <div className='display-flex'>
                                                        <h1 className='bill-name'>{bill.bill_name}</h1>
                                                        <span className="bill-category">
                                                            {bill.category}
                                                        </span>
                                                    </div>

                                                    <h1 className='price-tag'>${bill.amount}</h1>
                                                    <p className='price-frequency'>{bill.frequency}</p>
                                                </div>
                                            </motion.div>
                                    </div>
                                </div>
                                <div className="flip-card-back">
                                    <div className="card-content">
                                        <p className='start-date-title-bill'>Start Date</p>
                                        <h1 className='start-date-bill'>{formatDate(new Date(bill.start_date).toLocaleDateString())}</h1>
                                        
                                        <p className='due-date-title-bill'>Next Due Date</p>
                                        <h1 className='due-date-bill'>{formatDate(new Date(bill.next_due_date).toLocaleDateString())}</h1>

                                        <p className='description-bill'>{bill.description}</p>


                                        
                                        <button 
                                            onClick={() => handleDelete(bill.bill_id)}
                                            className="delete-trash-bill"
                                        >
                                            <FiTrash2 size={30} />
                                        </button>
                                        
                                       


                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>








                
                
                
            </div>
            

            
            ))}
        </AnimatePresence>

      </div>
      
    </div>
  );
};

// Add this CSS for glassmorphism effect


export default BillList;

