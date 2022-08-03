import React, { useRef, cloneElement, useEffect } from "react";

export default function RuleList({ children }) {
    const lastRuleItemRef = useRef();

    useEffect(() => {
        lastRuleItemRef.current.focus();
    }, []);

    function renderList() {
        return React.Children.map(children, (child, index) => {
            if (index === React.Children.count(children) - 1) {

                // Pass ref to the last item in the list
                return cloneElement(child, { ref: lastRuleItemRef });
            }
            return child;
        });
    }


    return <ul className="config__added-rules" aria-labelledby="added-rules-label">
        {renderList()}
    </ul>;
}
