import { useState, useRef } from 'react'
import { Data } from './components/Data'
import * as XLSX from 'xlsx'
import 'table2excel';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
const Table2Excel = window.Table2Excel;
function App() {

  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);

  // submit
  const [excelData, setExcelData] = useState(null);
  // it will contain array of objects

  // handle File
  const fileType = ['application/vnd.ms-excel'];
  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log(selectedFile.type, selectedFile);
      if (selectedFile) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          console.log(e, "e")
          setExcelFileError(null);
          setExcelFile(e.target.result);
        }
      }
      else {
        setExcelFileError('Please select only excel file types');
        setExcelFile(null);
      }
    }
    else {
      console.log('plz select your file');
    }
  }

  // submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(excelFile, "excelFile")
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      console.log(data, "data")
      setExcelData(data);
    }
    else {
      setExcelData(null);
    }
  }
  let headers = excelData && Object.keys(excelData[0]);
  const updateHandler = (e, name, index) => {
    const value = e.target.value;
    const list = [...excelData];
    list[index][name] = value;
    setExcelData(list);
  }
  const tableRef = useRef(null);
  function html_table_to_excel(type) {
    var table2excel = new Table2Excel();
    console.log(table2excel, table2excel)
    table2excel.export(document.querySelectorAll("table"));
  }
  return (
    <div className="container">

      {/* upload file section */}
      <div className='form'>
        <form className='form-group' autoComplete="off"
          onSubmit={handleSubmit}>
          <label><h5>Upload Excel file</h5></label>
          <br></br>
          <input type='file' className='form-control'
            onChange={handleFile} required></input>
          {excelFileError && <div className='text-danger'
            style={{ marginTop: 5 + 'px' }}>{excelFileError}</div>}
          <button type='submit' className='btn btn-success'
            style={{ marginTop: 5 + 'px' }}>Submit</button>
        </form>
      </div>

      <br></br>
      <hr></hr>
      <button onClick={() => html_table_to_excel('xlsx')}>Download</button>
      <h5>View Excel file</h5>
      <div className='viewer'>
        {excelData === null && <>No file selected</>}
        {excelData !== null && (
          <div className='table-responsive'>
            <table className='table' id="employee_data">
              <thead>
                <tr>
                  {headers.map((item, index) => <th scope='col' key={index}>{item}</th>)}

                </tr>
              </thead>
              <tbody>
                <Data excelData={excelData} columns={headers} updateHandler={updateHandler} />
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;