import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react'
import '../StyleSheets/Income.css';
import { models } from 'powerbi-client';



function Report() {

    const embedConfig = 
    { 
        type: 'report', 
        id: '<Report Id>', 
        embedUrl: '<Embed Url>', 
        accessToken: '<Access Token>', 
        tokenType: models.TokenType.Embed, 
        settings: 
        { panes: 
            { filters: 
                { expanded: false, 
                    visible: false, 
                }, 
            }, 
        }
            
        , 
    }; 
    const eventHandlers = new Map([ ['loaded', function () 
        { console.log('Report loaded'); }], 
        ['rendered', function () 
            { console.log('Report rendered'); 

            }], ['error', function (event) 
                { console.log(event.detail); }], ]); 
                const cssClassName = 'report-style-class'; 
                const getEmbeddedComponent = (embeddedReport) => { window.report = embeddedReport;};

    return (
        <div className="Container">
            <h1>POWER BI SAMPLE SALES REPORT</h1>
            
            <div> 
                {/* <PowerBIEmbed 
                embedConfig={embedConfig} 
                eventHandlers={eventHandlers} 
                cssClassName={cssClassName} 
                getEmbeddedComponent={getEmbeddedComponent} 
                />  */}
                <iframe className='ifrmae' title="Sales Data" src="https://app.powerbi.com/view?r=eyJrIjoiM2Y2MGE4YjEtNGMyNi00YmVkLTlmZDUtZGZjM2Q2NDAxM2QxIiwidCI6IjY0MDUxNjY1LTJjNjktNDAxMi05Y2ZlLTU5YzJhNjJhNWExZiJ9" frameborder="0" allowFullScreen="true"></iframe>
                
            </div>
            
        </div>
    );
}

export default Report;