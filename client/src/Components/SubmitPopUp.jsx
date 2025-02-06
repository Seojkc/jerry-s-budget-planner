import { useState } from 'react';
import '../StyleSheets/SubmitPopup.css';

function SubmitPopup({show}) {

    return (
        <div className={`future-popup ${show ? 'popup-show' : 'popup-hide'}`}>
            <div className="holographic-checkmark">
                <div className="checkmark-core"></div>
                <div className="energy-wave"></div>
            </div>
            <h1 className="future-text">Submitted Successful!</h1>
            <div className="energy-pulse"></div>
        </div>
    );
}

export default SubmitPopup;