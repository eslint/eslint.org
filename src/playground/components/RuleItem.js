import React, { useRef, useEffect } from "react";

export default function RuleItem({ children }) {
    const ref = useRef();

    useEffect(() => {
        ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
        ref.current.children[1].focus();
    }, []);

    return (
        <li ref={ref} className="config__added-rules__item">
            {children}
        </li>
    );
}
