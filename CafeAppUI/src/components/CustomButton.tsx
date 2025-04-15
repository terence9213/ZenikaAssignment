import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community';
import { Button } from 'antd'
import React from 'react'
import * as antd from "antd";

export class CustomButton implements ICellRendererComp {
    eGui!: HTMLButtonElement;
    init(params: ICellRendererParams) {
        this.eGui = document.createElement('button');
        console.log(params);
        //const icon = params.value === 'Male' ? 'fa-male' : 'fa-female';
        //this.eGui. = `<i class="fa ${icon}"></i> ${params.value}`;
    }

    getGui() {
        return this.eGui;
    }
    refresh(params: ICellRendererParams): boolean {
        return false;
    }
}
