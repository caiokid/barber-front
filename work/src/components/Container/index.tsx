import type React from "react";


type Props = {
 children: React.ReactNode;
 className:string;

}
 

function Container({children,className}: Props) {
    return (
    <div className={className}>
        {children}
    </div>
    )
}
  
export default Container
  