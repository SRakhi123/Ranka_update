import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesmanModal = ({ isOpen, onClose }) => {
  const [salesmen, setSalesmen] = useState([]);
  const [newSalesman, setNewSalesman] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch salesmen data
  const fetchSalesmen = () => {
    axios
      .get(`${API_BASE_URL}/salesmen`)
      .then((response) => setSalesmen(response.data))
      .catch((error) =>
        toast.error("Failed to fetch salesmen. Please try again.")
      );
  };

  useEffect(() => {
    if (isOpen) fetchSalesmen();
  }, [isOpen]);

  // Add a new salesman
  const handleAddSalesman = () => {
    if (!newSalesman.trim()) {
      toast.warn("Please enter a valid name.");
      return;
    }
    axios
      .post(`${API_BASE_URL}/salesmen/add`, { salesmen: [newSalesman] })
      .then((response) => {
        setSalesmen(response.data); // Assume the API returns the updated list
        setNewSalesman("");
        toast.success("Salesman added successfully!");
      })
      .catch((error) => toast.error("Failed to add salesman."));
  };

  // Delete a salesman
  const handleDeleteSalesman = (id) => {
    axios
      .delete(`${API_BASE_URL}/salesmen/delete`, { data: { ids: [id] } })
      .then(() => {
        setSalesmen(salesmen.filter((s) => s.id !== id));
        toast.success("Salesman deleted successfully!");
      })
      .catch((error) => toast.error("Failed to delete salesman."));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center"
      style={{ zIndex: 1000 }}
    >
      <div className="bg-white rounded-lg shadow-lg w-128 p-6 relative" style={{ width: '35rem' }}>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Manage Salesmen</h2>

        <div className="overflow-auto max-h-64 border rounded-lg mb-4">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {salesmen.length > 0 ? (
                salesmen.map((salesman) => (
                  <tr key={salesman.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{salesman.id}</td>
                    <td className="px-4 py-2 border-b">{salesman.name}</td>
                    <td className="px-4 py-2 border-b text-center">
                      <button
                        className="bg-indigo-600 text-white text-sm px-3 py-1 rounded hover:bg-indigo-600"
                        onClick={() => handleDeleteSalesman(salesman.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center text-gray-500 py-4"
                  >
                    No salesmen found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-grow border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter salesman name"
            value={newSalesman}
            onChange={(e) => setNewSalesman(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleAddSalesman}
          >
            Add
          </button>
        </div>

        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SalesmanModal;
