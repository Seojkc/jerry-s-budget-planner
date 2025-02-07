import React, { useState } from 'react';
import '../StyleSheets/Income.css';
import CreateNewBill from '../Components/CreateNewBill';
import CurrentRecurringBills from '../Components/CurrentRecurringBills';
import UpcomingBills from '../Components/UpcomingBills';



function Income() {

  const[refresh,setRefresh] =useState(false)


    return (
        <div className="Container">
            <h1 className='welcome-tag'>Recurring Bills</h1>
            <div class="grid-container">
              <div class="item CreateNewBill" data-number="1">
                <CurrentRecurringBills/>
                
              </div>
              <div class="item CreateNewBill" data-number="2">
                <UpcomingBills/>
              </div>
              <div class="item CreateNewBill" data-number="3">
                <CreateNewBill refresh={refresh}/>
              </div>
              <div class="item" data-number="4">
                <h2 className='sub-heading'>Create Notification</h2>
              </div>
              <div class="item bill-history-container" data-number="5">
                <h2 className='sub-heading'>Bill History</h2>
              </div>
          </div>  
          

        </div>
    );
}

export default Income;