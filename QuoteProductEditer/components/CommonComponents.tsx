/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogFooter, DialogType, Label, PrimaryButton, ProgressIndicator, Spinner, SpinnerSize } from "@fluentui/react";
import * as React from "react";
import './common.css';

const dialogContentProps = {
    type: DialogType.normal,
    title: 'Uploaded Success Fully',
    closeButtonAriaLabel: 'Close',
    subText: 'Do you want to Close This Dialog ?',
};
export const ConfirmationDialog: React.FC<any> = ({ isopen, onClose, afterResponse }) => {

    const closeAndResponse = () => {
        onClose();
        afterResponse();
    }
    return (
        <>
            <Dialog
                hidden={!isopen}
                onDismiss={onClose}
                dialogContentProps={dialogContentProps}
            >
                <DialogFooter>

                    <PrimaryButton onClick={closeAndResponse} className='correct'>OK</PrimaryButton>
                </DialogFooter>
            </Dialog>
        </>
    )
}



export const Loader: React.FC<any> = () => {
    return (
        <>
            <div className="mt-34">
                <ProgressIndicator label="Updating Quote Products" description="Updating ..." />
            </div>
        </>
    )
}

