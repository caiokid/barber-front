import React from "react";
import { Link } from "react-router";


type RouterProps = {
 children: React.ReactNode
 href:string;
} & React.ComponentProps<'a'>;

export function RouterLink( {children, href, ...props}: RouterProps){
    return <Link to={href} {...props}>{children}</Link>
}