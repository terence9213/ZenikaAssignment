import React from "react"
import {useEffect, useState } from "react";

import { Button, Form, Input, message, Modal, Popconfirm } from "antd"


import { AllCommunityModule, ColDef, ModuleRegistry, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);

// console.log("FETCHING");
// fetch("https://localhost:7033/api/Cafes/GetAllCafes").then((res) => res.json()).then((data) => console.log(data));

interface IRow {
    id: string,
    name: string,
    description: string,
    location: string,
    numEmployees: number,
    edit: null,
    delete: null
};

export default function() {
    // CREATE MODAL
    const [createModalOpen, setCreateModalOpen] = React.useState<boolean>(false);
    const [createModalLoading, setCreateModalLoading] = React.useState<boolean>(true);
    const [createForm] = Form.useForm();

    const loadingCreate = () => {
        setCreateModalOpen(true);
        fetch("https://localhost:7033/api/Cafes/GetNextCafeId")
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
            fetch("https://localhost:7033/api/Cafes/CreateCafe", requestOptions)
            .then((res) => res.json())
            .then((data) => { 
                getCafeData();
                setCreateModalOpen(false);
            });
        }
        catch (errorInfo) 
        {
            message.error("Form fields are not valid.");
        }
    };

    // EDIT MODAL
    const [editModalOpen, setEditModalOpen] = React.useState<boolean>(false);
    const [editModalLoading, setEditModalLoading] = React.useState<boolean>(true);
    const [form] = Form.useForm();

    const loadingEdit = (cafeId: string) => {
        setEditModalOpen(true);
        fetch("https://localhost:7033/api/Cafes/GetCafeById?id=" + cafeId)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            form.setFieldsValue({
                id: data.id,
                name: data.name,
                description: data.description,
                location: data.location
            });
            setEditModalLoading(false);
        });
    };

    const handleEditOk = async () => {
        try
        {
            const formData = await form.validateFields();
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain'},
                body: JSON.stringify(formData)
            };
            fetch("https://localhost:7033/api/Cafes/UpdateCafePOST?id=" + formData.id, requestOptions)
            .then((res) => res.json())
            .then((data) => { 
                getCafeData();
                setEditModalOpen(false);
            });
        }
        catch (errorInfo) 
        {
            message.error("Form fields are not valid.");
        }
    };

    // DELETE POPCONFIRM
    const handleDeleteCafe = (cafeId: string) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain'},
        };
        fetch("https://localhost:7033/api/Cafes/DeleteCafePOST?id=" + cafeId, requestOptions)
        .then((res) => {
            console.log(res);
            getCafeData();
        });
        
    };

    // CAFE DATA
    const [rowData, setRowData] = useState<IRow[]>([]);
    const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
        { field: "id" },
        { field: "name" },
        { field: "description" },
        { field: "location" },
        {
            field: "numEmployees",
            cellRenderer: (params: ICellRendererParams<IRow>) => (
                <Link to={"/EmployeesPage/" + (params.data ? params.data.id : "") }>
                    <Button type="link">{ params.data ? params.data.numEmployees : 0 }</Button>
                </Link>
            )
        },
        { 
            field: "edit", 
            cellRenderer: (params: ICellRendererParams<IRow>) => {
                const btn = React.createElement(Button, 
                    {
                        type: 'primary', 
                        onClick: () => { 
                            if(params.data)
                            {
                                loadingEdit(params.data.id);
                            }
                        }
                    }, 'Edit');
                return btn;
            }
        },
        {
            field: "delete",
            cellRenderer: (params: ICellRendererParams<IRow>) => (
                <Popconfirm title={<h3>Warning</h3>}
                description="Are you sure you want to delete this cafe?"
                onConfirm={() => {
                    if(params.data)
                    {
                        handleDeleteCafe(params.data.id);
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

    const getCafeData = () => {
        // fetch("https://localhost:7033/api/Cafes/GetAllCafes")
        fetch("https://localhost:7033/api/Cafes/GetCafeWithNumEmployeesByLocation")
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setRowData(data);
        });
    };

    useEffect(() => {
        getCafeData();
    }, []);

    

    return (
        <div style={{width:800, height:800, margin:"auto"}}>
            <h1>CAFES PAGE</h1>
            <Button type="primary" onClick={loadingCreate}>Create</Button>
            <AgGridReact 
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
            />

            <Modal
                title={<h3>Edit Cafe</h3>}
                loading={editModalLoading}
                open={editModalOpen}
                onCancel={() => setEditModalOpen(false)}
                onOk={handleEditOk}
            >
                <Form form={form} layout="vertical">
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
                        label="description"
                        name="description"
                        rules={[ {max: 256, message: "Maximum length 256!"} ]}>
                            <Input/>
                    </Form.Item>
                    <Form.Item
                        label="location"
                        name="location">
                            <Input/>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={<h3>Create Cafe</h3>}
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
                        label="description"
                        name="description"
                        rules={[ {max: 256, message: "Maximum length 256!"} ]}>
                            <Input/>
                    </Form.Item>
                    <Form.Item
                        label="location"
                        name="location">
                            <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>

    );
}