import React, { useRef, useEffect } from "react";

export default function RuleList({ children }) {
    const ruleListRef = useRef();

    useEffect(() => {

        function onMutation([{ addedNodes }]) {

            if (addedNodes?.length) {
                const li = addedNodes[0];

                li.scrollIntoView({ behavior: "smooth", block: "end" });
                li.children[1].focus();
            }
        }

        const observer = new MutationObserver(onMutation);

        observer.observe(ruleListRef.current, { childList: true });
        return () => {
            observer.disconnect();
        };
    }, []);


    return <ul ref={ruleListRef} className="config__added-rules" aria-labelledby="added-rules-label">
        {children}
    </ul>;
}
