import React, { useRef, useState } from "react";
import { FileDrop } from "react-file-drop";
import * as XLSX from 'xlsx'
import Progress from "./Progress/Progress.jsx";

import "./Dnd.scss";
import ProcessSellAnalytics from "../Utility/ProcessSellAnalyticsXLSX.js";

export default function Dnd({setDoc, isDocLoaded, setIsDocLoaded}) {
    const inputRef = useRef();
    const [filenames, setNames] = useState([]);

    function uploadBrowse(input) {
        let files = input.files
        const extension = files[0].name.split(".")[1]?.toLowerCase();

        if (extension !== undefined) {
            //clear icons
            setNames([])
            const fNames = Object.keys(files).map((name) => {
                return {
                    name: files[name].name,
                    icon: files[name].name.split(".")[1]?.toUpperCase().trim()
                };
            });
            setNames((prev) => [...prev, fNames].flat());
        } else {
            alert("file type not supported");
        }

        const regex = /^.*\.(xls|xlsx)$/;
        if (regex.test(input.value.toLowerCase())) {
            if (typeof (FileReader) !== 'undefined') {
                const reader = new FileReader();
                if (reader.readAsBinaryString) {
                    reader.onload = (e) => {
                        processExcel(reader.result);
                    };
                    reader.readAsBinaryString(input.files[0]);
                }
            } else {
                console.log("This browser does not support HTML5.");
            }
        } else {
            console.log("Please upload a valid Excel file.");
        }
    }

    function uploadDnd(files) {
        const extension = files[0].name.split(".")[1]?.toLowerCase();

        if (extension !== undefined) {
            //clear icons
            setNames([])
            const fNames = Object.keys(files).map((name) => {
                return {
                    name: files[name].name,
                    icon: files[name].name.split(".")[1]?.toUpperCase().trim()
                };
            });
            setNames((prev) => [...prev, fNames].flat());
        } else {
            alert("file type not supported");
        }

        if (extension !== undefined) {
            if (typeof (FileReader) !== 'undefined') {
                const reader = new FileReader();
                if (reader.readAsBinaryString) {
                    reader.onload = (e) => {
                        processExcel(reader.result);
                    };
                    reader.readAsBinaryString(files[0]);
                }
            } else {
                console.log("This browser does not support HTML5.");
            }
        } else {
            console.log("Please upload a valid Excel file.");
        }
    }

    function processExcel(data) {
        setIsDocLoaded(false)
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.SheetNames[0];
        const excelRows1 = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
        setDoc(ProcessSellAnalytics(excelRows1))
    }

    const filePicker = () => {
        inputRef.current.click();
    }

    return (
        <div className="container">
            {!isDocLoaded ? <h3>{`Загрузите файл`}</h3> : <h3>{`файл загружен ${new Date().toLocaleString()}`}</h3>}
            {/* <div className="progressContainer">
                {filenames &&
                    filenames.map((file, i) => (
                        <Progress key={i} name={file.name} icon={file.icon} />
                    ))}
            </div> */}
            <FileDrop onTargetClick={filePicker} onDrop={(files) => uploadDnd(files)}>
                <p className="placeholder">
                    DRAG FILE HERE <br /> OR <span>BROWSE</span>
                </p>
                <input
                    accept=".xls, .xlsx"
                    value=""
                    style={{ visibility: "hidden", opacity: 0 }}
                    ref={inputRef}
                    multiple="multiple"
                    type="file"
                    onChange={(e) => uploadBrowse(e.target)}
                />
            </FileDrop>
        </div>
    );
}
