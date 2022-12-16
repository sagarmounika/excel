import { useState } from "react"
import { Row } from "./components/Row"
import * as XLSX from "xlsx"
import "./App.css"
import "table2excel"
import Table from "react-bootstrap/Table"
import { FaCloudDownloadAlt } from "react-icons/fa"
import { BsArrowBarRight } from "react-icons/bs"
import "./style.css"
const Table2Excel = window.Table2Excel

function App() {
  const [excelFile, setExcelFile] = useState(null)
  const [excelFileError, setExcelFileError] = useState(null)
  const [fileName, setFileName] = useState("")
  const [excelData, setExcelData] = useState(null)

  const fileType = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]
  // handle file
  const handleFile = e => {
    let selectedFile = e.target.files[0]
    let fileName = e.target.files[0].name
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader()
        reader.readAsArrayBuffer(selectedFile)
        reader.onload = e => {
          setExcelFileError(null)
          setExcelFile(e.target.result)
          setFileName(fileName)
        }
      } else {
        setExcelFileError("Please select only excel file types")
        setExcelFile(null)
        setFileName("")
      }
    } else {
      setExcelFileError("Please select file")
      setExcelFile(null)
      setFileName("")
    }
  }

  // submit function
  const handleSubmit = () => {
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" })
      const worksheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[worksheetName]
      const data = XLSX.utils.sheet_to_json(worksheet)
      setExcelData(data)
    } else {
      setExcelData(null)
    }
  }

  let headers = excelData && Object.keys(excelData[0])

  const updateHandler = (e, name, index) => {
    const value = e.target.value
    const list = [...excelData]
    list[index][name] = value
    setExcelData(list)
  }

  function html_table_to_excel() {
    var table2excel = new Table2Excel()
    table2excel.export(document.querySelectorAll("table"), "Updated")
  }
  return (
    <div className="container2">
      <div className="uploadField">
        <div className="uploadFileTitle">Please upload Excel file</div>
        <div className="flexContainer">
          <button className="fileUpload">
            <span>Choose File</span>
            <input
              type="file"
              id="file-input"
              onChange={handleFile}
              required
              className="fileUploadInput"
            />
          </button>
          <span className="customText">
            {fileName ? fileName : "No file chosen, yet."}
          </span>
        </div>
      </div>
      {excelFileError && (
        <div className="text-danger" style={{ marginTop: 5 + "px" }}>
          {excelFileError}
        </div>
      )}
      <button
        type="submit"
        className="btn btn-success btn-submit"
        onClick={handleSubmit}
      >
        <span>Submit</span>
        <BsArrowBarRight />
      </button>
      <br></br>
      <hr></hr>

      <div className="viewer">
        {excelData === null && <>No file selected</>}
        {excelData !== null && (
          <div className="table-container">
            <button
              onClick={() => html_table_to_excel()}
              className="btn btn-success btn-download"
            >
              <span>Download</span>
              <FaCloudDownloadAlt />
            </button>
            <Table responsive="xl" className="table">
              <thead>
                <tr>
                  {headers.map((item, index) => (
                    <th scope="col" key={index}>
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Row
                  excelData={excelData}
                  columns={headers}
                  updateHandler={updateHandler}
                />
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
