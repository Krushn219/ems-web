import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faSquare,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import "./PresenceTable.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdminPresenceTable = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchEmployees();
  }, [selectedDate]);

  const fetchEmployees = () => {
    // Make the axios call to fetch employees based on the selected date
    axios
      .get(process.env.REACT_APP_API_URL + `/api/employee/all`)
      .then((response) => {
        setEmployees(response.data.employee);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreatePresentData = () => {
    const formattedDate = selectedDate.toISOString().slice(0, 10);

    axios
      .post(
        process.env.REACT_APP_API_URL + "/api/employeePresence/create",
        { date: formattedDate },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then((response) => {
        console.log("Present data created successfully:", response.data);
        fetchEmployees();
      })
      .catch((error) => {
        console.log("Error creating present data:", error);
      });
  };

  const handlePresentChange = (index) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index].present = !updatedEmployees[index].present;
    setEmployees(updatedEmployees);
  };

  const handleWorkingHoursChange = (index, hours) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index].workingHours = hours;
    setEmployees(updatedEmployees);
  };

  const createPresentData = (employeeId, name, workingHours, employee) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedToday = `${year}-${month}-${day}`;
    // Check if the present data already exists for the employee and selected date
    const existingData = employees.find(
      (employee) =>
        employee.EmployeeID === employeeId &&
        employee.date === formattedToday &&
        employee.present
    );

    if (existingData) {
      // If the present data already exists, do not create new data
      console.log("Present data already exists for this employee and date.");
      return;
    }

    const requestBody = {
      present: employee.present, // Assuming you want to set present to 'true' when creating
      EmployeeID: employeeId,
      EmployeeName: name,
      date: formattedToday, // Include the date information
      workingHours: workingHours,
    };

    axios
      .post(
        process.env.REACT_APP_API_URL + "/api/employeePresence/create",
        requestBody,
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then((response) => {
        fetchEmployees();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveEmployeeData = (employeeId, name, workingHours, isPresent) => {
    // Call the API here to save the employee's present data
    // Use the employeeId, name, workingHours, and isPresent values to construct the request body
    // Make the POST request to the backend API to save the data
    // Handle success and error responses accordingly
    // For example:
    axios
      .post(
        process.env.REACT_APP_API_URL + "/api/employeePresence/create",
        {
          EmployeeID: employeeId,
          EmployeeName: name,
          workingHours: workingHours,
          present: isPresent,
        },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then((response) => {
        console.log("Employee data saved successfully:", response.data);
        // Optionally, you can show a success message or perform other actions
      })
      .catch((error) => {
        console.log("Error saving employee data:", error);
        // Optionally, you can show an error message or perform other actions
      });
  };

  return (
    <div>
      <h2>Employee Presence Details</h2>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
      />
      <button onClick={handleCreatePresentData}>Present Data</button>
      <table border={1}>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Working Hours</th>
            <th>Present</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee._id}>
              <td>{employee.FirstName}</td>
              <td>
                <input
                  type="number"
                  value={employee.workingHours || ""}
                  onChange={(e) =>
                    handleWorkingHoursChange(index, e.target.value)
                  }
                />
              </td>
              <td>
                <FontAwesomeIcon
                  icon={employee.present ? faCheckSquare : faSquare}
                  onClick={() => handlePresentChange(index)}
                />
              </td>
              <td>
                <button
                  className="custom-button"
                  onClick={() =>
                    createPresentData(
                      employee._id,
                      employee.FirstName,
                      employee.workingHours,
                      employee
                    )
                  }
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>

                {/* <button
                  className="custom-button"
                  onClick={() =>
                    saveEmployeeData(
                      employee._id,
                      employee.FirstName,
                      employee.workingHours,
                      employee.present
                    )
                  }
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPresenceTable;
