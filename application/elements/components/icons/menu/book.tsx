import React from "react";
import Svg, { Path } from "react-native-svg";

const BookMenuIcon  = ({ isActive }: {isActive: boolean}) => {
    return (
        <Svg width="22" height="20" viewBox="0 0 22 20" fill="none">
            <Path d="M10.8501 4.84961C10.8501 3.78874 10.4287 2.77133 9.67852 2.02118C8.92838 1.27104 7.91096 0.849609 6.8501 0.849609H0.850098V15.8496H7.8501C8.64575 15.8496 9.40881 16.1657 9.97142 16.7283C10.534 17.2909 10.8501 18.054 10.8501 18.8496M10.8501 4.84961V18.8496M10.8501 4.84961C10.8501 3.78874 11.2715 2.77133 12.0217 2.02118C12.7718 1.27104 13.7892 0.849609 14.8501 0.849609H20.8501V15.8496H13.8501C13.0544 15.8496 12.2914 16.1657 11.7288 16.7283C11.1662 17.2909 10.8501 18.054 10.8501 18.8496"
            stroke={isActive ? "#FF3200" : "#BEBEBE"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    )
};

export default BookMenuIcon;