import React from "react";
import {useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { AllCommunityModule, ColDef, ModuleRegistry, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import { Button, Modal, Form, Input, Popconfirm, Select, message } from "antd";


ModuleRegistry.registerModules([AllCommunityModule]);

interface IRow {
    id: string,
    name: string,
    eMailAddress: string,
    phoneNumber: string,
    gender: string,
    numDaysWorked: number,
    cafe: string,
    cafeId: string,
    edit: null,
    delete: null
};

interface IRowEm {
    employeeId: string,
    cafeName: string,
    cafeId: string,
    startDate: Date,
    endDate: Date,
    fire: null
}

interface ISelectCafeItem {
    id: string,
    name: string
}

interface ISelectCafeOption {
    label: string,
    value: string
}

export default function() {
    const {cafeId} = useParams();
    // EMPLOYEE DATA
    const [rowData, setRowData] = useState<IRow[]>([]);
    const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
        { field: "id" },
        { field: "name" },
        { field: "eMailAddress" },
        { field: "phoneNumber"},
        { field: "gender"},
        { field: "numDaysWorked"},
        { 
            field: "cafe",
            cellRenderer: (params: ICellRendererParams<IRow>) => (
                <Button type="default" onClick={ ()=> loadingEmploymentModal(params.data.id) }>
                    {params.data.cafe}
                </Button>
            )
        },
        { field: "cafeId"},
        { 
            field: "edit",
            cellRenderer: (params: ICellRendererParams<IRow>) => (
                <Button type="primary" onClick={() => { if(params.data){ loadingEdit(params.data.id); } }}>
                    Edit
                </Button>
            )
        },
        {
            field: "delete",
            cellRenderer: (params: ICellRendererParams<IRow>) => (
                <Popconfirm title={<h3>Warning</h3>}
                description="Are you sure you want to delete this employee?"
                onConfirm={() => {
                    if(params.data)
                    {
                        handleDeleteEmployee(params.data.id);
                    }
                }}
                okText="Yes"
                cancelText="No">
                    <Button type="primary" danger>Delete</Button>
                </Popconfirm>
            )
        }
    ]);
    const defaultColDef: ColDef = { flex: 1 };

    const getEmployeeData = () => {
        let url = "https://localhost:7033/api/Cafes/GetEmployeesWithNumDaysWorkedByCafe";
        if(cafeId) { url = url + "?cafeId=" + cafeId; }
        fetch(url)
        .then((res) => res.json())
        .then((data) => {
            setRowData(data);
        });
    };

    useEffect(() => {
        getEmployeeData();
    }, []);

    // EDIT MODAL
    const [editModalOpen, setEditModalOpen] = React.useState<boolean>(false);
    const [editModalLoading, setEditModalLoading] = React.useState<boolean>(true);
    const [editForm] = Form.useForm();

    const loadingEdit = (employeeId: string) => {
        setEditModalOpen(true);
        fetch("https://localhost:7033/api/Cafes/GetEmployeeById?id=" + employeeId)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            editForm.setFieldsValue({
                id: data.id,
                name: data.name,
                eMailAddress: data.eMailAddress,
                phoneNumber: data.phoneNumber,
                gender: data.gender
            });
            setEditModalLoading(false);
        });
    };

    const handleEditOk = async () => {
        try
        {
            const formData = await editForm.validateFields();
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain'},
                body: JSON.stringify(formData)
            };
            fetch("https://localhost:7033/api/Cafes/UpdateEmployeePOST?id=" + formData.id, requestOptions)
            .then((res) => res.json())
            .then((data) => { 
                getEmployeeData();
                setEditModalOpen(false);
            });
        }
        catch (errorInfo) 
        {
            message.error("Form fields are not valid.");
        }
        
    };

    // DELETE POPCONFIRM
    const handleDeleteEmployee = (employeeId: string) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain'},
        };
        console.log(employeeId);
        fetch("https://localhost:7033/api/Cafes/DeleteEmployeePOST?id=" + employeeId, requestOptions)
        .then((res) => {
            console.log(res);
            getEmployeeData();
        });
        
    };

    // CREATE MODAL
    const [createModalOpen, setCreateModalOpen] = React.useState<boolean>(false);
    const [createModalLoading, setCreateModalLoading] = React.useState<boolean>(true);
    const [createForm] = Form.useForm();

    const loadingCreate = () => {
        setCreateModalOpen(true);
        fetch("https://localhost:7033/api/Cafes/GetNextEmployeeId")
        .then((res) => res.text())
        .then((data) => {
            createForm.setFieldValue("id", data);
            setCreateModalLoading(false);
        });
    };

    const handleCreateOk = async () => {
        try
        {
            const createFormData = await createForm.validateFields();
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain'},
                body: JSON.stringify(createFormData)
            };
            fetch("https://localhost:7033/api/Cafes/CreateEmployee", requestOptions)
            .then((res) => res.json())
            .then((data) => { 
                getEmployeeData();
                setCreateModalOpen(false);
            });
        }
        catch (errorInfo) 
        {
            message.error("Form fields are not valid.");
        }
    };

    // EMPLOYMENT MODAL
    const [employmentModalOpen, setEmploymentModalOpen] = React.useState<boolean>(false);
    const [employmentModalLoading, setEmploymentModalLoading] = React.useState<boolean>(true);
    const [employmentForm] = Form.useForm();

    // Employment Data
    const [emRowData, setEmRowData] = useState<IRowEm[]>([]);
    const [emColDefs, setEmColDefs] = useState<ColDef<IRowEm>[]>([
        { field: "employeeId", hide: true },
        { field: "cafeName" },
        { field: "cafeId" },
        { field: "startDate" },
        { field: "endDate"},
        {
            field: "fire",
            cellRenderer: (params: ICellRendererParams<IRowEm>) => (
                <Button 
                    type="primary" danger disabled={params.data?.endDate != null} 
                    onClick={() => {
                        handleFireClick(params.data.cafeId, params.data.employeeId);
                    }}>
                    Fire
                </Button>
            )
        },
    ]);

    // Select Cafe Options
    const [selectCafeOptions, setSelectCafeOptions] = useState<ISelectCafeOption[]>([]);

    const loadingEmploymentModal = (employeeId: string) =>
    {
        setEmploymentModalOpen(true);
        employmentForm.setFieldValue("employeeId", employeeId);
        const url = "https://localhost:7033/api/Cafes/EmplymentAndCafeForEmployeeId?id=" + employeeId;
        fetch(url)
        .then((res) => res.json())
        .then((data) => {
            setEmRowData(data);
            setEmploymentModalLoading(false);
        });

        fetch("https://localhost:7033/api/Cafes/GetAllCafes")
        .then((res) => res.json())
        .then((data) => {
            const selectOptions: ISelectCafeOption[] = data.map((item: ISelectCafeItem)=> ({
                label: item.name,
                value: item.id
            }));
            setSelectCafeOptions(selectOptions);
        });
    };

    const getEmploymentData = (employeeId: string) => {
        const url = "https://localhost:7033/api/Cafes/EmplymentAndCafeForEmployeeId?id=" + employeeId;
        fetch(url)
        .then((res) => res.json())
        .then((data) => {
            setEmRowData(data);
        });
    };

    const handleHireClick = () => {
        const employeeId = employmentForm.getFieldValue("employeeId");
        const cafeId = employmentForm.getFieldValue("cafe");

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain'},
        };
        fetch("https://localhost:7033/api/Cafes/HireEmployeeForCafe?employeeId=" + employeeId + "&cafeId=" + cafeId, requestOptions)
        .then(async (res) => {
            if(!res.ok) { 
                const errMsg = await res.text();
                console.log(errMsg);
                message.error(errMsg);
            }
            else{
                getEmploymentData(employeeId);
                getEmployeeData();
            }
        });

    };

    const handleFireClick = (cafeId: string, employeeId: string) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain'},
        };
        fetch("https://localhost:7033/api/Cafes/FireEmployeeFromCafe?employeeId=" + employeeId + "&cafeId=" + cafeId, requestOptions)
        .then(async (res) => {
            if(!res.ok) { 
                const errMsg = await res.text();
                console.log(errMsg);
                message.error(errMsg);
            }
            else{
                getEmploymentData(employeeId);
                getEmployeeData();
            }
        });
    }
    
    const handleEmploymentModalOk = () => {
        getEmployeeData();
        setEmploymentModalOpen(false);
    }

    const phonePattern = /^[98]\d{7}$/;

    return (
        <div style={{width:1200, height:800, margin:"auto"}}>
            <h1>EMPLOYEES PAGE</h1>
            <Button type="primary" onClick={loadingCreate}>Create</Button>
            <AgGridReact 
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
            />
            {/* EDIT MODAL */}
            <Modal
                title={<h3>Edit Employee</h3>}
                loading={editModalLoading}
                open={editModalOpen}
                onCancel={() => setEditModalOpen(false)}
                onOk={handleEditOk}
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item
                        label="id"
                        name="id">
                            <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="name"
                        name="name"
                        rules={[
                            { required: true, message: "Required!" },
                            { min: 6, message: "Name must be at least 6 characters." },
                            { max: 10, message: "Name cannot exceed 10 characters." },
                          ]}>
                            <Input/>
                    </Form.Item>
                    <Form.Item
                        label="eMailAddress"
                        name="eMailAddress"
                        rules={[
                            {
                              type: "email",
                              message: "Please enter a valid email address!",
                            }
                          ]}>
                            <Input/>
                    </Form.Item>
                    <Form.Item
                        label="phoneNumber"
                        name="phoneNumber"
                        rules={[
                            {
                              pattern: phonePattern,
                              message: "Phone number must be 8 digits and start with 9 or 8"
                            }
                          ]}>
                            <Input maxLength={8}/>
                    </Form.Item>
                    <Form.Item
                        label="gender"
                        name="gender">
                            <Input/>
                    </Form.Item>
                </Form>

            </Modal>
            {/* CREATE MODAL*/}
            <Modal
                title={<h3>Create Employee</h3>}
                loading={createModalLoading}
                open={createModalOpen}
                onCancel={() => setCreateModalOpen(false)}
                onOk={handleCreateOk}
            >
                <Form form={createForm} layout="vertical">
                    <Form.Item
                        label="id"
                        name="id">
                            <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="name"
                        name="name"
                        rules={[
                            { required: true, message: "Required!" },
                            { min: 6, message: "Name must be at least 6 characters." },
                            { max: 10, message: "Name cannot exceed 10 characters." },
                          ]}>
                            <Input/>
                    </Form.Item>
                    <Form.Item
                        label="eMailAddress"
                        name="eMailAddress"
                        rules={[
                            {
                              type: "email",
                              message: "Please enter a valid email address!",
                            }
                          ]}>
                            <Input/>
                    </Form.Item>
                    <Form.Item
                        label="phoneNumber"
                        name="phoneNumber"
                        rules={[
                            {
                              pattern: phonePattern,
                              message: "Phone number must be 8 digits and start with 9 or 8"
                            }
                          ]}>
                            <Input maxLength={8}/>
                    </Form.Item>
                    <Form.Item
                        label="gender"
                        name="gender">
                            <Input/>
                    </Form.Item>
                </Form>
            </Modal>
            {/* EMPLOYMENTS MODAL */}
            <Modal
                title={<h3>Employment History</h3>}
                loading={employmentModalLoading}
                open={employmentModalOpen}
                onCancel={() => setEmploymentModalOpen(false)}
                onOk={handleEmploymentModalOk}
                >
                    <div style={{ height:400}}>
                        <AgGridReact
                        rowData={emRowData}
                        columnDefs={emColDefs}
                        defaultColDef={defaultColDef}>
                        </AgGridReact>
                    </div>
                    <hr></hr>
                    <Form form={employmentForm}>
                        <Form.Item
                            label="employeeId"
                            name="employeeId">
                                <Input disabled/>
                        </Form.Item>
                        <Form.Item
                            label="cafe"
                            name="cafe">
                                <Select options={selectCafeOptions}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleHireClick}>Hire</Button>
                        </Form.Item>
                    </Form>
            </Modal>
        </div>
    );
}