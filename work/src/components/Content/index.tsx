import type React from "react";


type Props = {

 className?: string;
 children: React.ReactNode;

}
 

function Content({className, children}: Props) {
  
       
    return (
    <div className={className}>
        {children}
    </div>
    )
}
  
export default Content
  