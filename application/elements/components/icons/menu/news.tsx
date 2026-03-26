import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const NewsMenuIcon = ({ isActive }: { isActive: boolean }) => {
    const color = isActive ? "#FF3200" : "#BEBEBE";
    return (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <Path
                d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
                stroke={color}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M7 8h10M7 12h10M7 16h6"
                stroke={color}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default NewsMenuIcon;
