import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import SocialIcons from "./SocialIcons";

export default function Footer() {
    return (
        <footer className="footer">
            <SocialIcons/>
            <div className="copyright">
                &copy; OpenJS Foundation and other contributors, <a href="https://www.openjsf.org">www.openjsf.org</a>
            </div>
            <ThemeSwitcher/>
        </footer>
    );
}
