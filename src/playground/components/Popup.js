import React, { useState } from "react";

export default function Popup({ options, message, ruleName, onFix }) {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className="popup">
            <div className="popup__content">
                <div className="popup__main">
                    <p className="popup__text">{message}</p>
                    <div className="popup__refs">
                        <a href={`https://eslint.org/docs/rules/${ruleName}`}>{ruleName}</a>
                    </div>
                </div>

                {options ? (
                    <button className="popup__fix-btn" onClick={() => setShowOptions(!showOptions)} aria-expanded="false" aria-haspopup="true" id="ANOTHER_UNIQUE_BUTTON_ID">
                        <span>Fix</span>
                        <svg width="12" height="8" focusable="false" viewBox="0 0 12 8">
                            <g fill="none">
                                <path fill="currentColor" d="M1.41.59l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z" />
                                <path d="M-6-8h24v24h-24z" />
                            </g>
                        </svg>
                    </button>
                ) : (
                    onFix && (
                        <button onClick={onFix} className="popup__fix-btn" aria-expanded="false" aria-haspopup="true" id="ANOTHER_UNIQUE_BUTTON_ID">
                            <span>Fix</span>
                        </button>
                    )
                )}
            </div>
            {showOptions && (
                <ul className="popup__fix-options" role="menu" aria-labelledby="ANOTHER_UNIQUE_BUTTON_ID" id="js-popup-fix-options">
                    <li className="popup__fix-options__item" role="menuitem" tabIndex="-1">Fix using this option</li>
                    <li className="popup__fix-options__item" role="menuitem" tabIndex="-1">Fix using another option</li>
                    <li className="popup__fix-options__item" role="menuitem" tabIndex="-1">Fix using another another option</li>
                    <li className="popup__fix-options__item" role="menuitem" tabIndex="-1">ignore this message</li>
                </ul>
            )}
        </div>
    );
}
