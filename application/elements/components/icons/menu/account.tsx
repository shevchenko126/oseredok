import React from "react";
import Svg, { Path } from "react-native-svg";

const AccountMenuIcon  = ({ isActive }: {isActive: boolean}) => {
    return (
        <Svg width="18" height="20" viewBox="0 0 18 20" fill="none" >
            <Path d="M16.8501 18.8496V16.8496C16.8501 15.7887 16.4287 14.7713 15.6785 14.0212C14.9284 13.271 13.911 12.8496 12.8501 12.8496H4.8501C3.78923 12.8496 2.77182 13.271 2.02167 14.0212C1.27152 14.7713 0.850098 15.7887 0.850098 16.8496V18.8496M12.8501 4.84961C12.8501 7.05875 11.0592 8.84961 8.8501 8.84961C6.64096 8.84961 4.8501 7.05875 4.8501 4.84961C4.8501 2.64047 6.64096 0.849609 8.8501 0.849609C11.0592 0.849609 12.8501 2.64047 12.8501 4.84961Z"
            stroke={isActive ? "#FF3200" : "#BEBEBE"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>



    )
};

export default AccountMenuIcon;