import React from "react";

const RuleItem = ({ children }) =>
    (
        <li className="config__added-rules__item">
            {children}
        </li>
    );

RuleItem.displayName = "RuleItem";
export default RuleItem;
