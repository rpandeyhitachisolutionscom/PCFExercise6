/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChoiceGroup, FontWeights, getTheme, IChoiceGroupOption, mergeStyleSets, Modal, PrimaryButton, TextField, Toggle } from '@fluentui/react';
import * as React from 'react';
import './common.css';
const theme = getTheme();

const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
    },
    header: [
        theme.fonts.xLargePlus,
        {
            flex: '1 1 auto',
            borderTop: `4px solid ${theme.palette.themePrimary}`,
            color: theme.palette.neutralPrimary,
            display: 'flex',
            alignItems: 'center',
            fontWeight: FontWeights.semibold,
            padding: '12px 12px 14px 24px',
        },
    ],
    heading: {
        color: theme.palette.neutralPrimary,
        fontWeight: FontWeights.semibold,
        fontSize: 'inherit',
        margin: '0',
    },
    body: {
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        selectors: {
            p: { margin: '14px 0' },
            'p:first-child': { marginTop: 0 },
            'p:last-child': { marginBottom: 0 },
        },
    },
});

export const EditPriceDialogComponent: React.FC<any> = ({ isopen, onClose, inputRecord }) => {
    const [isPercentage, setIsPercentage] = React.useState(false);
    const [isPrice, setIsprice] = React.useState('price');
    const [isApproach, setISApproach] = React.useState(true);
    const [value, setValue] = React.useState('');

    function onChangeIncrease(ev: React.MouseEvent<HTMLElement>, checked?: boolean) {
        if (checked) {
            setISApproach(true);
        }
        else {
            setISApproach(false);
        }
    }
    // function onChangeDecrease(ev: React.MouseEvent<HTMLElement>, checked?: boolean) {
    //     console.log('toggle is ' + (checked ? 'checked' : 'not checked'));
    //     setISApproach(2);
    // }
    // const handlePriceChange = () => {
    //     //setIsprice(true);
    //     setIsPercentage(false);
    // }
    // const handlePercentageChange = () => {
    //     //setIsprice(false);
    //     setIsPercentage(true);
    // }

    const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        // If newValue is defined, set it; otherwise, use e.target.value
        setValue(newValue || e.currentTarget.value);
    };

    const cancel = () => {
        onClose();
    }
    const apply = () => {
    if(value !=''){
        inputRecord(value,isApproach,isPrice);
        onClose();
    }
    }
    const options: IChoiceGroupOption[] = [
        { key: 'price', text: 'By Price' },
        { key: 'percentage', text: 'By Percentage' },
    ];
    const handleRadioChange = (value: any) => {
        setIsprice(value);
    }
    return (
        <>
            <Modal
                isOpen={isopen}
                onDismiss={onClose}
                isBlocking={false}
                containerClassName={contentStyles.container}
                styles={{
                    main: {
                        selectors: {
                            ['@media (min-width: 480px)']: {
                                minWidth: 450,
                                // maxWidth: '1500px',
                                // width: '1300px',
                                padding: '30px',
                                // height: '600px'
                            }
                        }
                    }
                }}
            >
                <div>
                    <h2>Pricing Approach</h2>
                </div>
                <div className='dfc'>
                    <div className='type_selection mt-15 dfc'>
                        <div className='type_button df gp fr'>
                            <ChoiceGroup
                                selectedKey={isPrice}
                                options={options}
                                onChange={(e, option) => handleRadioChange(option?.key)}
                                label=""
                            />
                            <div className='Approach_Selection' style={{ display: (isPrice != '') ? 'block' : 'none' }}>
                                <div className='df gp fr'>
                                    <Toggle label="" defaultChecked onText="Increase Price" offText="Decrease Price" onChange={onChangeIncrease} />
                                </div>
                            </div>
                        </div>
                        <div className='mt-15'>
                            <div className='df gp '>
                                <TextField
                                    label={isPrice == 'price' ? 'Enter Price value' : 'Enter Price Percentage'}
                                    value={value}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='df gp mt-34 fr'>
                        <p onClick={apply}>Apply Changes</p>
                        <p onClick={cancel}> Cancel</p>
                    </div>
                </div>


            </Modal>
        </>
    );

}