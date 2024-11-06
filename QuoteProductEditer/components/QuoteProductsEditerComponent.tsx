/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import { Checkbox, DetailsList, FontWeights, getTheme, IColumn, Icon, mergeStyleSets, MessageBar, Modal, PrimaryButton, SelectionMode, TooltipHost } from "@fluentui/react";
import { useEffect, useState } from "react";
import { getData } from "./DynamicService";
import { PaginationComponent } from "./PaginationComponent";
import '../central.css';
import { EditPriceDialogComponent } from "./EditPriceDialogComponent";
import './common.css';
import { updateData } from './DynamicService';
import { IProduct } from '../Model';
import { ConfirmationDialog, Loader } from "./CommonComponents";
export interface QuoteProductsEditerComponentProps {
    label: string;
    onChanges: (newValue: string | undefined) => void;
    context: ComponentFramework.Context<IInputs>;
    quoteid: string;
    clientUrl: string;
}


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



export const QuoteProductsEditerComponent = React.memo((props: QuoteProductsEditerComponentProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const openDialog = (): any => setIsDialogOpen(true);
    const closeDialog = (): any => setIsDialogOpen(false);
    const [data, setData] = useState<IProduct[]>([]);
    const [isProducts, setIsProducts] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [paginatedItems, setPaginatedItems] = React.useState<any>([]);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const openConfirmDialog = (): any => setIsConfirmDialogOpen(true);
    const closeConfirmDialog = (): any => setIsConfirmDialogOpen(false);
    const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);
    const openConfirmUpdate = (): any => setIsConfirmUpdateOpen(true);
    const closeConfirmUpdate = (): any => setIsConfirmUpdateOpen(false);
    const [isModified, setIsModified] = useState(false);
    const [isRecordSelected, setIsRecordSelected] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploded, setIsUploded] = useState(false);
    useEffect(() => {
        QuoteDetailsData();
    }, []);

    const QuoteDetailsData = async () => {
        const allData: IProduct[] = [];
        const query = `quotedetails?$select=quotedetailid,baseamount,extendedamount,quotedetailname,priceperunit,productname,productnumber,quantity,_uomid_value &$expand=uomid($select=name)&$filter=_quoteid_value eq ${props.quoteid}`;
        const productResponse = await getData(props.clientUrl, query);
        productResponse.value.forEach((item: any) => {
            allData.push({
                ProductNumber: item.productnumber,
                ProductName: item.productname,
                QuoteDetailId: item.quotedetailid,
                PricePerUnit: item.priceperunit,
                ExtendedAmount: item.extendedamount,
                UOM: item.uomid.name,
                Quantity: item.quantity,
                isSelected: false,
                isValidProduct: true,
                isUploaded: 0,
                Message: 'This is from system data base'
            })

        })
        const total = Math.ceil(allData.length / pageSize);
        setTotalPages(total);
        setData(allData);
        const paginated = allData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        setPaginatedItems(paginated);
        setIsProducts(true);

    }
    const columns: IColumn[] = [
        {
            key: 'column1', name: '', fieldName: 'isSelected', minWidth: 10, maxWidth: 100, isMultiline: false,
            onRender: (item: any) => (

                <Checkbox
                    checked={item.isSelected} // You can manage checked state if needed
                    onChange={() => dataUpdateAfterSelection(item)}
                />
            ),
        },
        {
            key: 'column2', name: '', fieldName: 'isValidProduct', minWidth: 10, maxWidth: 100, isMultiline: false,
            onRender: (item: any) => (

                <TooltipHost
                    content={item.Message}
                    calloutProps={{ gapSpace: 0 }}
                >
                    <Icon iconName="Warning" styles={{ root: { color: item.isValidProduct ? (item.isUploaded == 1 ? 'green' : 'yellow') : 'red', fontSize: 24, cursor: 'pointer' } }} />
                </TooltipHost>
            ),
        },
        { key: 'column3', name: 'Product Number', fieldName: 'ProductNumber', minWidth: 100, maxWidth: 150, isMultiline: false },
        { key: 'column4', name: 'Product Name', fieldName: 'ProductName', minWidth: 100, maxWidth: 150, isMultiline: false },
        { key: 'column5', name: 'UOM', fieldName: 'UOM', minWidth: 50, maxWidth: 150, isMultiline: false },
        { key: 'column6', name: 'Price', fieldName: 'PricePerUnit', minWidth: 50, maxWidth: 150, isMultiline: false },
        { key: 'column7', name: 'Quantity', fieldName: 'Quantity', minWidth: 50, maxWidth: 150, isMultiline: false },
        { key: 'column8', name: 'Extended Amount', fieldName: 'ExtendedAmount', minWidth: 50, maxWidth: 150, isMultiline: false },
    ];

    const dataUpdateAfterSelection = (item: any) => {
        const updatedData = data.map((d: any) => {
            if (d.QuoteDetailId === item.QuoteDetailId) {
                const isS = d.isSelected ? false : true;
                return { ...d, isSelected: isS };
            }
            return d;
        });
        setData(updatedData);
        const total = Math.ceil(updatedData.length / pageSize);
        setTotalPages(total);
        const paginated = updatedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        setPaginatedItems(paginated);
    };

    const handleCurrentPage = (page: any) => {
        setCurrentPage(page);
        const total = Math.ceil(data.length / pageSize);
        setTotalPages(total);
        const paginated = data.slice((page - 1) * pageSize, page * pageSize);
        setPaginatedItems(paginated);
    }

    const handlePageSizeChange = (pageSize: any) => {
        setPageSize(pageSize);
        setCurrentPage(1);
        const total = Math.ceil(data.length / pageSize);
        setTotalPages(total);
        const paginated = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        setPaginatedItems(paginated);
    }

    const inputRecord = (value: any, isApproach: any, isPrice: any) => {
        const parsedValue = Number(value);
        if (isNaN(parsedValue)) {
            console.error('Invalid value provided');
            return;
        }
        const updatedData = data.map((d: any) => {
            if (d.isSelected) {
                let price = d.PricePerUnit || 0;
                let isValid = d.isValidProduct;
                let Message = d.Message;
                if (isPrice === 'price') {
                    price = isApproach ? price + parsedValue : price - parsedValue;
                    isValid = price<10?false:true;
                    Message = isValid?Message:'Price less Than 10';
                } else {
                    const percentageChange = (price * parsedValue) / 100;
                    price = isApproach ? price + percentageChange : price - percentageChange;
                    isValid = price<10?false:true;
                    Message = isValid?Message:'Price less Than 10';
                }
                
                return { ...d, PricePerUnit: price,isValidProduct:isValid,Message:Message };
            }

            return d;
        });

        setData(updatedData);
        setIsModified(true);
        const total = Math.ceil(updatedData.length / pageSize);
        setTotalPages(total);
        const paginated = updatedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        setPaginatedItems(paginated);
    }

    const modifyProducts = () => {
        setIsRecordSelected(true);
        const selectedRecords = data.filter((d: any) => d.isSelected);
        if (selectedRecords.length > 0) {
            openConfirmDialog();
        }
        else {
            setIsRecordSelected(false);
        }
    }

    const updateRecords = async () => {
        setIsUploading(true);
        for (const item of data) {
            const record: any = {};
            record.ispriceoverridden = true;
            record.priceperunit = item.PricePerUnit;
            record["quoteid@odata.bind"] = `/quotes(${props.quoteid})`
            const updatedId = await updateData(props.clientUrl, 'quotedetails', item.QuoteDetailId, record);
            if (!updatedId) { item.isUploaded = 0; item.isValidProduct = false; item.Message = 'Internal Error '; continue; }
            if (updatedId) { item.isUploaded = 1;item.isValidProduct = true; item.Message = 'Uploaded Successfull '; continue; }
            console.log(updatedId);
        }
        const total = Math.ceil(data.length / pageSize);
        setTotalPages(total);
        const paginated = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        setPaginatedItems(paginated);
        setIsUploading(false);
        openConfirmUpdate();
        
    }
    const afterResponse = () => {
        //window.location.reload();
        setIsUploded(true);
        setIsModified(false);
    }
    const closeAndReload = () => {
        if (isUploded) {
            closeDialog();
            window.location.reload();
        }
        else {
            closeDialog();
        }
    }
    return (
        <>
            <PrimaryButton onClick={openDialog}> Edit Products</PrimaryButton>

            <Modal
                isOpen={isDialogOpen}
                onDismiss={closeDialog}
                isBlocking={false}
                containerClassName={contentStyles.container}
                // modalProps={modalProps}
                styles={{
                    main: {
                        selectors: {
                            ['@media (min-width: 480px)']: {
                                minWidth: 650,
                                // maxWidth: '1500px',
                                // width: '1300px',
                                padding: '30px',
                                // height: '600px'
                            }
                        }
                    }
                }}
            >
                <div className='header_text mb-15'>
                    <div>
                        <h2>Edit Quote Products</h2>
                    </div>
                    <Icon iconName="Cancel" onClick={closeAndReload} style={{ cursor: 'pointer', fontSize: '24px', color: 'red', fontWeight: '600' }} />
                </div>
                <div style={{ display: isRecordSelected ? 'none' : 'block' }}>
                    <MessageBar > Please Select Atleast One Record for Modify Thanks.</MessageBar>
                </div>

                <div className="action_button fr gp df">
                    <PrimaryButton onClick={modifyProducts}> Modify Price</PrimaryButton>
                    <PrimaryButton disabled={!isModified} onClick={updateRecords}>Update Products</PrimaryButton>
                </div>

                <ConfirmationDialog isopen={isConfirmUpdateOpen} onClose={closeConfirmUpdate} afterResponse={afterResponse} />
                <EditPriceDialogComponent isopen={isConfirmDialogOpen} onClose={closeConfirmDialog} inputRecord={inputRecord} />
                {isUploading ?
                    <Loader /> :

                    <div style={{ display: isProducts ? 'block' : 'none' }} className="mt-34">
                        <DetailsList
                            items={paginatedItems}
                            columns={columns}
                            setKey="set"
                            layoutMode={0}
                            compact={true}
                            selectionMode={SelectionMode.none}
                        />
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            onPageChange={handleCurrentPage}
                            onPageSizeChange={handlePageSizeChange}
                        />

                    </div>
                }

            </Modal>
        </>
    );






});