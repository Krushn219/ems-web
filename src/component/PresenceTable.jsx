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

// const REACT_APP_API_URL = "http://localhost:4001";

const AdminPresenceTable = () => {
  const [employees, setEmployees] = useState([]);
  const [employeesPresence, setEmployeesPresence] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchEmployees();
    fetchEmployeesPresence();
  }, []);

  useEffect(() => {
    // Check if the date has changed compared to the previous day
    // If it has changed, reset the employeesPresence state to an empty array
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);
    if (
      previousDate.toISOString().slice(0, 10) !==
      selectedDate.toISOString().slice(0, 10)
    ) {
      setEmployeesPresence([]);
    }
  }, [selectedDate]);

  const fetchEmployeesPresence = () => {
    // Make the axios call to fetch employees based on the selected date
    axios
      // .get(process.env.REACT_APP_API_URL + `/api/employee/all`)
      .get(process.env.REACT_APP_API_URL + `/api/employeePresence/date`)
      .then((response) => {
        setEmployeesPresence(response.data.employeePresence);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchEmployees = () => {
    // Make the axios call to fetch employees based on the selected date
    axios
      // .get(process.env.REACT_APP_API_URL + `/api/employee/all`)
      .get(process.env.REACT_APP_API_URL + `/api/employee/all`)
      .then((response) => {
        setEmployees(response.data.employee);
      })
      .catch((error) => {
        console.log(error);
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
    const formattedToday = selectedDate.toISOString().slice(0, 10);
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
        fetchEmployeesPresence();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const isFutureDate = selectedDate > new Date();
  // Filter the employeesPresence to get data for the selected date
  const presentDataForSelectedDate = employeesPresence.filter(
    (data) => data.date === selectedDate.toISOString().slice(0, 10)
  );

  return (
    <div>
      <h2>Employee Presence Details</h2>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
      />
      <button onClick={fetchEmployeesPresence} disabled={isFutureDate}>
        Present Data
      </button>
      {/* Conditionally render the table based on the selected date */}
      {isFutureDate ? (
        <p>Cannot view or modify data for future dates.</p>
      ) : (
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
            {employees.map((employee, index) => {
              const isPresent = presentDataForSelectedDate.find(
                (data) => data.EmployeeID === employee._id
              );
              return (
                <tr key={employee._id}>
                  <td>{employee.FirstName}</td>
                  <td>
                    <input
                      type="number"
                      value={
                        isPresent
                          ? isPresent.workHours
                          : employee.workingHours || ""
                      }
                      onChange={(e) =>
                        handleWorkingHoursChange(index, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={
                        isPresent?.present
                          ? faCheckSquare
                          : employee.present
                          ? faCheckSquare
                          : faSquare
                      }
                      onClick={() => handlePresentChange(index)}
                    />
                  </td>
                  <td>
                    <button
                      className="custom-button"
                      onClick={() => {
                        createPresentData(
                          employee._id,
                          employee.FirstName,
                          employee.workingHours,
                          employee
                        );
                      }}
                      disabled={isPresent}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPresenceTable;
