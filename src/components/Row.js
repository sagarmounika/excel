import React from "react"
import { IndividualData } from "./IndividualData"

export const Row = ({ excelData, columns, updateHandler }) => {
    return excelData.map((individualExcelData, index) => (
        <tr key={index}>
            <IndividualData
                individualExcelData={individualExcelData}
                columns={columns}
                index={index}
                updateHandler={updateHandler}
            />
        </tr>
    ))
}
