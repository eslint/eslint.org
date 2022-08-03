import React, { forwardRef } from "react";

const RuleItem = forwardRef(({ children }, ref) =>
    (
        <li className="config__added-rules__item">
            {children(ref)}
        </li>
    ));

RuleItem.displayName = "RuleItem";
export default RuleItem;
