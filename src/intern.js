import React, { useState } from 'react';
import Papa from 'papaparse';

const EmployeeAnalyzer = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [consecutiveDaysResults, setConsecutiveDaysResults] = useState([]);

  const handleFile = (file) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        console.log(result.data);
        result.data.forEach((employee) => {
          console.log({
            startTime: employee.Time,
            endTime: employee['Time Out'],
            // Add any other time-related fields you have in the data
          });
        });
        setEmployeeData(result.data);
      },
    });
  };

  const analyzeEmployees = () => {
    const sortedEmployeeData = [...employeeData].sort(
      (a, b) => new Date(a.Time) - new Date(b.Time)
    );

    const lessThan10HoursBetweenShiftsEmployees = [];
    const moreThan14HoursSingleShiftEmployees = [];
    const sevenConsecutiveDaysEmployees = [];
    let consecutiveDaysCount = 1;

    for (let i = 1; i < sortedEmployeeData.length; i++) {
      const currentEmployee = sortedEmployeeData[i];
      const previousEmployee = sortedEmployeeData[i - 1];

      const currentTime = new Date(currentEmployee.Time);
      const previousTime = new Date(previousEmployee["Time Out"]);

      const timeDifference = (currentTime - previousTime) / (1000 * 60 * 60);

      if (timeDifference > 1 && timeDifference < 10) {
        lessThan10HoursBetweenShiftsEmployees.push({
          name: currentEmployee["Employee Name"],
          position: currentEmployee["Position ID"],
        });
      }

      if (isConsecutiveDays(previousEmployee, currentEmployee)) {
        consecutiveDaysCount++;
      } else {
        consecutiveDaysCount = 1;
      }

      if (consecutiveDaysCount === 7) {
        const consecutiveDaysResult = {
          name: currentEmployee["Employee Name"],
          position: currentEmployee["Position ID"],
          startTime: currentEmployee.Time,
          endTime: currentEmployee["Time Out"],
        };
        sevenConsecutiveDaysEmployees.push(consecutiveDaysResult);
      }

      const hoursWorked = currentEmployee["Timecard Hours (as Time)"];

      if (hoursWorked && hoursWorked !== "" && hoursWorked !== null) {
        const hoursWorkedNumeric = parseFloat(hoursWorked.split(":")[0]);

        if (!isNaN(hoursWorkedNumeric) && hoursWorkedNumeric > 14) {
          moreThan14HoursSingleShiftEmployees.push(currentEmployee);
        }
      }
    }

    setConsecutiveDaysResults(sevenConsecutiveDaysEmployees);

    console.log("Employees who have worked for 7 consecutive days:");
    sevenConsecutiveDaysEmployees.forEach((employee) => {
      console.log("Name:", employee.name, "Position:", employee.position);
      console.log("Start Time:", employee.startTime);
      console.log("End Time:", employee.endTime);
    });

    console.log("Employees who have less than 10 hours between shifts but greater than 1 hour:");
    lessThan10HoursBetweenShiftsEmployees.forEach((employee) => {
      console.log("Name:", employee.name, "Position:", employee.position);
    });

    console.log("Employees who have worked for more than 14 hours in a single shift:");
    moreThan14HoursSingleShiftEmployees.forEach((employee) => {
      console.log("Name:", employee["Employee Name"], "Position:", employee["Position ID"]);
    });
  };

  const isConsecutiveDays = (previousEmployee, currentEmployee) => {
    const previousTime = new Date(previousEmployee["Time Out"]);
    const currentTime = new Date(currentEmployee["Time"]);

    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const daysDifference = Math.round(Math.abs((previousTime - currentTime) / oneDay));

    return daysDifference === 1;
  };

  return (
    <div>
      <h1>Employee Analyzer</h1>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <button onClick={analyzeEmployees}>Analyze Employees</button>

     
    
    </div>
  );
};

export default EmployeeAnalyzer;
