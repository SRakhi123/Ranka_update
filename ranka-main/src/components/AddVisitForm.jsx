import React, { useState, useEffect } from "react";
import { CloudArrowUpIcon, ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/solid"; 
import { toast } from "react-toastify";

const MessageModal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-xl font-bold text-indigo-800 mb-4">Message</h2>
      <p>{message}</p>
      <div className="mt-6 text-right">
        <button
          onClick={onClose}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          OK
        </button>
      </div>
    </div>
  </div>
);

const AddVisitForm = ({ closeModal, onVisitAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    address_line1: "",
    tel_no: "",
    primary_mobile_no: "",
    secondary_mobile_no: "",
    company_name: "",
    village: "",
    tahsil: "",
    dist: "",
    pin_code: "",
    tent_house: false,
    catering: false,
    event: false,
    hotel: false,
    restro: false,
    resort: false,
    tent_suppliers: false,
    home_used: false,
    other: false,
    other_text: "",
    cooler: false,
    salesman: "",
  });

  const [salesmen, setSalesmen] = useState([]);
  const [step, setStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [messageModal, setMessageModal] = useState({ isOpen: false, message: "" });
  const [checkboxError, setCheckboxError] = useState("");

  useEffect(() => {
    // Fetch the salesmen from the API
    const fetchSalesmen = async () => {
      try {
        const response = await fetch('https://ranka.nuke.co.in/backend/api/salesmen');
        const data = await response.json();
        setSalesmen(data);
      } catch (error) {
        console.error("Error fetching salesmen:", error);
        toast.error("Failed to load salesmen.");
      }
    };

    fetchSalesmen();
  }, []);

  const handleCheckboxChange = (name, checked) => {
    const selectedCount = Object.values(formData).filter(value => value === true).length;
    let newSelectedCount = checked ? selectedCount + 1 : selectedCount - 1;

    if (!checked && newSelectedCount < 1) {
      setCheckboxError("Please select at least one option.");
      return;
    } else if (checked && newSelectedCount > 3) {
      setCheckboxError("Please select a maximum of 3 options.");
      return;
    } else {
      setCheckboxError("");
    }

    setFormData(prevFormData => ({ ...prevFormData, [name]: checked }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "primary_mobile_no" && value.length === 10) {
      setIsNextDisabled(false);
    } else if (name === "primary_mobile_no") {
      setIsNextDisabled(true);
    }
  };

  const fetchVisitorDetails = async () => {
    setLoading(true);
    try {

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/visitors/details?mobile=${formData.primary_mobile_no}`);
      const data = await response.json();

      if (data.message === "Visitor not found") {
        toast.error("Visitor not found. Please enter details manually.");
      } else {
        setFormData({
          ...formData,
          ...data,
          tent_house: data.tent_house === 1,
          catering: data.catering === 1,
          event: data.event === 1,
          hotel: data.hotel === 1,
          restro: data.restro === 1,
          resort: data.resort === 1,
          tent_suppliers: data.tent_suppliers === 1,
          home_used: data.home_used === 1,
          other: data.other === 1,
          cooler: data.cooler === 1,
        });
        toast.success("Visitor details loaded successfully.");
      }
    } catch (error) {
      console.error("Error fetching visitor details:", error);
      toast.error("An error occurred while fetching visitor details.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (step === 1 && formData.primary_mobile_no.length === 10) {
      await fetchVisitorDetails();
    }
    setStep(step + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    upsertVisitor();
  };

  const upsertVisitor = async () => {
    setLoading(true);
  
    // Exclude unnecessary fields: 'id', 'created_at', 'updated_at', 'visit_count'
    const { id, created_at, updated_at, visit_count, other_text, ...dataWithoutMeta } = formData;
  
    const formattedData = {
      ...dataWithoutMeta,
      tent_house: formData.tent_house ? 1 : 0,
      catering: formData.catering ? 1 : 0,
      event: formData.event ? 1 : 0,
      hotel: formData.hotel ? 1 : 0,
      restro: formData.restro ? 1 : 0,
      resort: formData.resort ? 1 : 0,
      tent_suppliers: formData.tent_suppliers ? 1 : 0,
      home_used: formData.home_used ? 1 : 0,
      other: formData.other ? formData.other_text : 0,
      cooler: formData.cooler ? 1 : 0,
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/visitors/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessageModal({ isOpen: true, message: data.message });
        onVisitAdded(data);
      } else {
        throw new Error("Failed to upsert visitor");
      }
    } catch (error) {
      setMessageModal({ isOpen: true, message: "Failed to create visitor" });
    } finally {
      setLoading(false);
    }
  };
  
  

  const closeMessageModal = () => {
    setMessageModal({ isOpen: false, message: "" });
    closeModal();
  };

  const renderStep1 = () => (
    <div>
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">Enter a Mobile Number - Step 1</h2>
      <div>
        <label className="block text-gray-700 font-medium mb-2" htmlFor="primary_mobile_no">
          Primary Mobile Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="primary_mobile_no"
          name="primary_mobile_no"
          value={formData.primary_mobile_no}
          onChange={handleInputChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter 10-digit mobile number"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">Enter Visitor Details - Step 2</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          />
        </div>

        {/* Salesman Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="salesman">Salesperson</label>
          <select
            id="salesman"
            name="salesman"
            value={formData.salesman}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          >
            <option value="">Select salesperson</option>
            {salesmen.map(salesman => (
              <option key={salesman.id} value={salesman.name}>
                {salesman.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="secondary_mobile_no">
            Secondary Mobile Number
          </label>
          <input
            type="text"
            id="secondary_mobile_no"
            name="secondary_mobile_no"
            value={formData.secondary_mobile_no}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) {
                handleInputChange(e);
              }
            }}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            placeholder="Enter 10-digit mobile number"
          />
          {formData.secondary_mobile_no.length > 0 && formData.secondary_mobile_no.length !== 10 && (
            <p className="text-red-500 text-sm">Secondary Mobile Number must be 10 digits</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="tel_no">Telephone Number</label>
          <input
            type="text"
            id="tel_no"
            name="tel_no"
            value={formData.tel_no}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="company_name">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="village">Village</label>
          <input
            type="text"
            id="village"
            name="village"
            value={formData.village}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="tahsil">Tahsil</label>
          <input
            type="text"
            id="tahsil"
            name="tahsil"
            value={formData.tahsil}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="dist">
            District <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="dist"
            name="dist"
            value={formData.dist}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="pin_code">PIN Code</label>
          <input
            type="text"
            id="pin_code"
            name="pin_code"
            value={formData.pin_code}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="address_line1">Address Line 1</label>
          <input
            type="text"
            id="address_line1"
            name="address_line1"
            value={formData.address_line1}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          />
        </div>
      </div>

      {/* Service Checkboxes */}
      <div className="my-4 flex flex-wrap gap-4">
        {[
          { label: "Tent House", name: "tent_house" },
          { label: "Catering", name: "catering" },
          { label: "Event", name: "event" },
          { label: "Hotel", name: "hotel" },
          { label: "Restro", name: "restro" },
          { label: "Resort", name: "resort" },
          { label: "Tent Suppliers", name: "tent_suppliers" },
          { label: "Home Used", name: "home_used" },
          { label: "Other", name: "other" },
          { label: "Cooler", name: "cooler" },
        ].map(({ label, name }) => (
          <label key={name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={name}
              checked={formData[name]}
              onChange={(e) => handleCheckboxChange(name, e.target.checked)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {checkboxError && (
        <p className="text-red-500 text-sm">{checkboxError}</p>
      )}

      {formData.other && (
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="other_text">Other Details</label>
          <input
            type="text"
            id="other_text"
            name="other_text"
            value={formData.other_text}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            required
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex p-6" style={{ height: "90vh", width: "100%" }}>
      <div className="w-[100%] pr-4 flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300 flex items-center"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back
              </button>
            )}
            {step < 2 && (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={isNextDisabled || loading}
                className={`bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center ml-auto ${isNextDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Loading..." : "Next"} <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            )}
            {step === 2 && (
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex items-center ml-auto"
              >
                <CloudArrowUpIcon className="w-5 h-5 mr-2" /> Submit
              </button>
            )}
          </div>
        </form>

        {messageModal.isOpen && (
          <MessageModal
            message={messageModal.message}
            onClose={closeMessageModal}
          />
        )}
      </div>
    </div>
  );
};

export default AddVisitForm;
