import React from "react";
import Svg, { Path } from "react-native-svg";

const RedClockIcon = () => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M10 2H14" stroke="#FF3200" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M12 14L15 11" stroke="#FF3200" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 16.4183 6 12 6C7.58172 6 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z" stroke="#FF3200" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    )
};

export default RedClockIcon;