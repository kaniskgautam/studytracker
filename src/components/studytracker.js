import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import jsPDF from "jspdf";
<img src="/logo.png" alt="Study Tracker Logo" className="w-16 h-16 mx-auto" />

const StudyTracker = () => {
  const [logs, setLogs] = useState([]);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [reminder, setReminder] = useState("");

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem("studyLogs")) || [];
    setLogs(storedLogs);
    const storedNotes = localStorage.getItem("studyNote") || "";
    setNote(storedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("studyNote", note);
  }, [note]);

  const addLog = (subject, hours) => {
    const newLog = { date: new Date().toISOString().split("T")[0], subject, hours };
    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    localStorage.setItem("studyLogs", JSON.stringify(updatedLogs));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Study Progress Report", 10, 10);
    logs.forEach((log, index) => {
      doc.text(`${log.date} - ${log.subject}: ${log.hours} hours`, 10, 20 + index * 10);
    });
    doc.save("study_report.pdf");
  };

  const setStudyReminder = () => {
    if (reminder) {
      alert(`Reminder set for: ${reminder}`);
    }
  };

  const filteredLogs = logs.filter(log => log.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Study Tracker</h1>
      <div className="my-4">
        <input type="text" placeholder="Subject" id="subject" className="p-2 border rounded" />
        <input type="number" placeholder="Hours" id="hours" className="p-2 border rounded mx-2" />
        <button className="p-2 bg-blue-500 text-white rounded" onClick={() => addLog(document.getElementById("subject").value, document.getElementById("hours").value)}>Add</button>
      </div>
      <button className="p-2 bg-green-500 text-white rounded" onClick={generatePDF}>Download Report</button>
      <div className="my-6">
        <h2 className="text-xl font-bold">Study Logs</h2>
        <input type="text" placeholder="Search by subject" className="p-2 border rounded my-2" onChange={(e) => setSearch(e.target.value)} />
        <ul>
          {filteredLogs.map((log, index) => (
            <li key={index}>{log.date} - {log.subject}: {log.hours} hours</li>
          ))}
        </ul>
      </div>
      <div className="my-6">
        <h2 className="text-xl font-bold">Study Progress</h2>
        <LineChart width={600} height={300} data={logs}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Line type="monotone" dataKey="hours" stroke="#8884d8" />
        </LineChart>
      </div>
      <div className="my-6">
        <h2 className="text-xl font-bold">Study Notes</h2>
        <textarea className="w-full p-2 border rounded" placeholder="Write your notes here..." value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <div className="my-6">
        <h2 className="text-xl font-bold">Set Study Reminder</h2>
        <input type="text" placeholder="Reminder" className="p-2 border rounded" onChange={(e) => setReminder(e.target.value)} />
        <button className="p-2 bg-yellow-500 text-white rounded mx-2" onClick={setStudyReminder}>Set Reminder</button>
      </div>
    </div>
  );
};

export default StudyTracker;
