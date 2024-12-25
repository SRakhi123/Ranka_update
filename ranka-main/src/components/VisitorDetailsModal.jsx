import React, { useState, useEffect } from 'react';
import { Modal, ModalDialog, Typography, Button } from '@mui/joy';

const VisitorDetailsModal = React.memo(({ isModalOpen, closeModal, visitor, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(visitor || {});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value, // Convert checkbox to 1/0
    });
  };

  // Handle save operation
  const handleSave = async () => {
    // Destructure to remove unwanted fields
    const { id, created_at, updated_at, status, visit_count, ...dataToSend } = formData;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/visitors/upsert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        onUpdate(updatedClient); // Notify parent component of the update
        setIsEditing(false); // Exit edit mode
        closeModal(); // Close modal after saving
      } else {
        console.error('Failed to update visitor details');
      }
    } catch (error) {
      console.error('Error updating visitor:', error);
    }
  };

  // Reset formData when modal reopens with a different visitor
  useEffect(() => {
    if (visitor) {
      setFormData(visitor);
    }
  }, [visitor]);

  if (!visitor) return null;

  return (
    <Modal
      open={isModalOpen}
      onClose={closeModal}
      aria-labelledby="visitor-details-title"
    >
      <ModalDialog>
        <Typography id="visitor-details-title" level="h5" className="font-bold mb-4">
          Visitor Details
        </Typography>

        {/* Visitor details form (read-only or editable) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Name", name: "name", value: formData?.name },
            { label: "Secondary Mobile Number", name: "secondary_mobile_no", value: formData?.secondary_mobile_no },
            { label: "Telephone Number", name: "tel_no", value: formData?.tel_no },
            { label: "Company Name", name: "company_name", value: formData?.company_name },
            { label: "Village", name: "village", value: formData?.village },
            { label: "Tahsil", name: "tahsil", value: formData?.tahsil },
            { label: "District", name: "dist", value: formData?.dist },
            { label: "PIN Code", name: "pin_code", value: formData?.pin_code },
          ].map(({ label, name, value }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium mb-2">{label}</label>
              <input
                type="text"
                name={name}
                value={value || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border px-4 py-2 rounded-lg ${isEditing ? '' : 'bg-gray-100'}`}
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Address Line 1</label>
            <input
              type="text"
              name="address_line1"
              value={formData?.address_line1 || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full border px-4 py-2 rounded-lg ${isEditing ? '' : 'bg-gray-100'}`}
            />
          </div>
        </div>

        {/* Services Checkboxes */}
        <div className="my-4 flex flex-wrap gap-4">
          {[
            { label: "Tent House", name: "tent_house", checked: formData?.tent_house === 1 },
            { label: "Catering", name: "catering", checked: formData?.catering === 1 },
            { label: "Event", name: "event", checked: formData?.event === 1 },
            { label: "Hotel", name: "hotel", checked: formData?.hotel === 1 },
            { label: "Restro", name: "restro", checked: formData?.restro === 1 },
            { label: "Resort", name: "resort", checked: formData?.resort === 1 },
            { label: "Tent Suppliers", name: "tent_suppliers", checked: formData?.tent_suppliers === 1 },
            { label: "Home Used", name: "home_used", checked: formData?.home_used === 1 },
            { label: "Other", name: "other", checked: formData?.other === 1 },
            { label: "Cooler", name: "cooler", checked: formData?.cooler === 1 },
          ].map(({ label, name, checked }) => (
            <label key={name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={name}
                checked={!!checked}
                onChange={handleChange}
                readOnly={!isEditing}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          {isEditing ? (
            <>
              <Button onClick={handleSave} color="primary" className="mr-2">
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} color="neutral">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)} color="warning" className="mr-2">
                Edit
              </Button>
              <Button onClick={closeModal} color="neutral">
                Close
              </Button>
            </>
          )}
        </div>
      </ModalDialog>
    </Modal>
  );
});

export default VisitorDetailsModal;
