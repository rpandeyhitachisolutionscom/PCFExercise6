/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, Spinner, SpinnerSize } from "@fluentui/react";
import * as React from "react";


export const consfirmationDialog:React.FC<any> = ({isOpen,onClose,afterResponse})=>{
    return(
        <>
       
        </>
    )
}



export const Loader:React.FC<any> = ()=>{
    return(
        <>
       <Spinner label=" " size={SpinnerSize.large} styles={{ root: { width: 60, height: 60 } }} />
       <Label style={{ marginLeft: 10, fontSize: '22px' }}>Saving Products to Quote</Label>
        </>
    )
}

