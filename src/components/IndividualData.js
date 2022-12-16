import React from "react"

export const IndividualData = ({
    individualExcelData,
    columns,
    index,
    updateHandler,
}) => {
    return (
        <>
            {columns.map(name => (
                <td key={name}>
                    <input
                        type="text"
                        value={
                            typeof individualExcelData[name] === "number"
                                ? Math.round(individualExcelData[name])
                                : individualExcelData[name]
                        }
                        onChange={e => updateHandler(e, name, index)}
                        name={name}
                    />
                </td>
            ))}
        </>
    )
}
