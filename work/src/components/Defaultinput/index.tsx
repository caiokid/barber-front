

type DeafaultInputProps={
    className:string;
    id:string;
} & React.ComponentProps<'input'>;


export function DefaultInput({className,id,type, ...rest} :DeafaultInputProps){   
    return (
    <>
        <input className={className} id={id} type={type} {...rest} />
    </>
    )
}


export default DefaultInput
