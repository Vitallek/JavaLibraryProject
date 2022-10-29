import React, { useRef, useState } from "react";
import { FileDrop } from "react-file-drop";

import "./Dnd.scss";
import { getFinOrdersList, saveFile } from "../../../Utility/Wildberries/CallApiWildberries.js";
// import ProcessSellAnalytics from "../Utility/ProcessSellAnalyticsXLSX.js";

export default function SaveFileComponent() {
    const inputRef = useRef();
    const [filenames, setNames] = useState([]);
    let strToDisplay = 'Загрузите фин.отчёт'

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
                passFileToSaveFunction(input.files[0])
            } else {
                console.log("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid Excel file.");
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
                passFileToSaveFunction(files[0])
            } else {
                console.log("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid Excel file.");
        }
    }

    function passFileToSaveFunction(file) {
        // getFinOrdersList(`https://${process.env.REACT_APP_SERVER_ADDR}/get-fin-orders-list`).then(fileNamesInDir => {
        //     if (fileNamesInDir.includes(`${file.lastModified}.xlsx`)){
        //         Notification.requestPermission().then(() => {
        //             const notification = new Notification('Уведомление', {
        //                 body: `Файл ${file.lastModified} уже существует`,
        //                 tag: 'fileExists'
        //             })
        //             setTimeout(() => {
        //                 notification.close()
        //             }, 3000);
        //         })
                
        //         return
        //     }
            
        // })
        console.log(file)
        const formData = new FormData()
        formData.append(`file`, file)
        formData.append(`fileName`, `${file.lastModified}`)
        saveFile(`https://${process.env.REACT_APP_SERVER_ADDR}/save-wb-fin-order`, formData, `${file.lastModified}.xlsx`)
    }

    const filePicker = () => {
        inputRef.current.click();
    }

    return (
        <div className="container">
            <h3>{strToDisplay}</h3>
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
