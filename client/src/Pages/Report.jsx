import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react'
import '../StyleSheets/Income.css';
import { models } from 'powerbi-client';
import ProgressLine from '../Components/ProgressLineBarChart';


function Report() {


    return (

        
        <div className="Container">
            
            <ProgressLine/>
        </div>
    );
}

export default Report;