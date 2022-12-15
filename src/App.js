import { useState } from 'react'
import { Data } from './components/Data'
import * as XLSX from 'xlsx'
import './App.css';
import 'table2excel';
import Table from 'react-bootstrap/Table';
const Table2Excel = window.Table2Excel;
function App() {

  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  // it will contain array of objects

  // handle File
  const fileType = ['application/vnd.ms-excel', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log(selectedFile.type, selectedFile);
      if (selectedFile && fileType.includes(selectedFile.type)) {
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

  function html_table_to_excel(type) {
    var table2excel = new Table2Excel();
    table2excel.export(document.querySelectorAll("table"));
  }
  return (
    <div className="container2">

      {/* upload file section */}
      <div className='form'>
        <div class="label">Upload Excel file</div>
        <form className='form-group' autoComplete="off"
          onSubmit={handleSubmit}>
          <input type='file' className='form-control'
            onChange={handleFile} required></input>
          {excelFileError && <div className='text-danger'
            style={{ marginTop: 5 + 'px' }}>{excelFileError}</div>}
          <button type='submit' className='btn btn-success btn-submit'
          >Submit</button>
        </form>
      </div>


      <br></br>
      <hr></hr>
      <h5>View Excel file</h5>
      <div className='viewer'>
        {excelData === null && <>No file selected</>}
        {excelData !== null && (
          <div className='table-container'>
            <button onClick={() => html_table_to_excel('xlsx')} className='btn btn-light btn-download '>Download</button>
            <Table responsive="xl" className='table' id="employee_data"  >

              <thead>
                <tr>
                  {headers.map((item, index) => <th scope='col' key={index}>{item}</th>)}

                </tr>
              </thead>
              <tbody>
                <Data excelData={excelData} columns={headers} updateHandler={updateHandler} />
              </tbody>
            </Table>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;