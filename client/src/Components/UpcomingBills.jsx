import '../StyleSheets/UpcomingBills.css';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FiTrash2, FiClock, FiCalendar, FiDollarSign, FiRepeat } from 'react-icons/fi';
import { toast } from "react-toastify"; // For notifications

const BillList = () => {
  const [bills, setBills] = useState([]);


  const markAsPaidFn= async(billId)=>
    {
        try
        {
            await axios.put(`http://localhost:5000/api/Bills/${billId}/markaspaid`);

            toast.success(`Bill #${billId} marked as paid successfully!`, {
              position: "top-right",
              autoClose: 3000,
            });            fetchBills();
        }
        catch(error){
            toast.error(`Failed to mark bill #${billId} as paid.`, {
                position: "top-right",
                autoClose: 3000,
              });
        }
    }

    

    const skipPaymentFn= async(billId)=>
      {
          try
          {
              await axios.put(`http://localhost:5000/api/Bills/${billId}/skipPaymentFn`);
  
              toast.success(`Bill #${billId} marked as paid successfully!`, {
                position: "top-right",
                autoClose: 3000,
              });            fetchBills();
          }
          catch(error){
              toast.error(`Failed to mark bill #${billId} as paid.`, {
                  position: "top-right",
                  autoClose: 3000,
                });
          }
      }
  
  // Fetch bills from API
  const fetchBills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Bills/upcomingBills');
        setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };
  useEffect(() => {
    
    fetchBills();
  }, []);



  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 }
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
      <h2 className=" bill-heading">Upcoming Bills this month</h2>
      <div className="container-list">
        <AnimatePresence >
            {bills.map((bill,index) => (
            <div >
                    <div className="flip-card-container-upcoming glass-card-upcoming" >
                        <div className={`flip-card`}>
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
                                              
                                              <h1 className='price-tag'>${bill.amount}</h1>
                                              <h1 className='due-date-bill-upcoming'>{formatDate(new Date(bill.next_due_date).toLocaleDateString())}</h1>

                                              <div className="flex justify-between items-start">
                                                  <div className='display-flex'>
                                                      <h1 className='bill-name'>{bill.bill_name}</h1>
                                                  </div>
                                              </div>

                                              <button className='mark-as-paid-button skip-button' onClick={()=>skipPaymentFn(bill.bill_id)}>
                                                  <h2>Skip Payment</h2>
                                              </button>

                                              <button className='mark-as-paid-button' onClick={()=>markAsPaidFn(bill.bill_id)}>
                                                  <h2>Mark as Paid</h2>
                                              </button>

                                              
                                      </motion.div>
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

