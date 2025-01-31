import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react'
import '../StyleSheets/Income.css';
import { models } from 'powerbi-client';
import ProgressLine from '../Components/ProgressLineBarChart';
import PercentageDonutChart from '../Components/PercentageDonutChart'
import CategoryBasedLineChart from '../Components/CategoryBasedLineChart' 

function Report() {


    return (
        <div className="Container">
            <h1 className='heading'>Report Page</h1>

            <div className='two-grid-container'>
                <div className='donut-container'>
                    <h1>Percentage Distribution of Expenses</h1>
                    <div>
                        <PercentageDonutChart/>
                    </div>
                </div>
                <div className='category-container'>
                    <h1>Category-Based Chart</h1>
                    <div>
                        <CategoryBasedLineChart/>
                    </div>
                </div>


            </div>
            
            <div className='ProgressMonthlyLineBarContainer'>
                <div className='Expense-chart-div'>
                    <h1>Total Expense Chart</h1>
                    <ProgressLine/>
                </div>
            </div>
        </div>
    );
}

export default Report;