import React, { useState } from 'react';
import { Button, ButtonGroup, Modal, ModalDialog, Typography, Input } from '@mui/joy';

const ListView = ({ clients, onEndVisit, onViewDetails }) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [clientToEnd, setClientToEnd] = useState(null);
  const [clientToPurchase, setClientToPurchase] = useState(null);
  const [billNumber, setBillNumber] = useState('');

  const handleEndVisitClick = (client) => {
    setClientToEnd(client);
    setConfirmModalOpen(true);
  };

  const handlePurchaseClick = (client) => {
    setClientToPurchase(client);
    setPurchaseModalOpen(true);
  };

  const confirmPurchase = async () => {
    if (!clientToPurchase) return;

    try {
      const response = await fetch('https://ranka.nuke.co.in/backend/api/visitors/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          primary_mobile_no: clientToPurchase.primary_mobile_no,
          purchase: 1,
          bill_no: billNumber,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Purchase recorded successfully');
        window.location.reload(); // Reload to reflect changes
      } else {
        console.error('Error:', result);
        alert('Failed to record purchase');
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      alert('An error occurred while recording the purchase');
    } finally {
      setPurchaseModalOpen(false);
      setClientToPurchase(null);
      setBillNumber('');
    }
  };

  const confirmEndVisit = async () => {
    if (!clientToEnd) return;

    try {
      const response = await fetch('https://ranka.nuke.co.in/backend/api/visitors/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          primary_mobile_no: clientToEnd.primary_mobile_no,
          status: 'PP1', // Static status as per the requirement
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Visitor status updated successfully');
        window.location.reload(); // Reload the page to reflect changes
      } else {
        console.error('Error:', result);
        alert('Failed to update visitor status');
      }
    } catch (error) {
      console.error('Error during status update:', error);
      alert('An error occurred while updating the visitor status');
    } finally {
      setConfirmModalOpen(false);
      setClientToEnd(null);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getStatusLabel = (status) => {
    if (status === 'PP1') {
      return 'Inactive';
    }
    if (status === 0 || status === '0') {
      return 'Active';
    }
    return 'Inactive';
  };

  const isEndVisitDisabled = (status) => {
    return status === 1 || status === 'PP1';
  };

  return (
    <>
      <div className="overflow-x-auto mx-auto p-4 sm:p-6 max-w-7xl bg-white rounded-lg shadow-lg my-4">
        <table className="min-w-full text-left table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Last Visit</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Purchase</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{client.id}</td>
                <td className="px-4 py-2">{client.name}</td>
                <td className="px-4 py-2">{client.company_name}</td>
                <td className="px-4 py-2">{client.primary_mobile_no}</td>
                <td className="px-4 py-2">{formatDate(client.updated_at)}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      getStatusLabel(client.status) === 'Active'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {getStatusLabel(client.status)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Button
                    color={client.purchase === "1" ? 'success' : 'info'}
                    onClick={() => handlePurchaseClick(client)}
                    variant="outlined"
                    size="sm"
                  >
                    {client.purchase === "1" ? 'Yes' : 'No'}
                  </Button>
                </td>
                <td className="px-4 py-2">
                  <ButtonGroup variant="outlined" size="sm">
                    <Button
                      color="danger"
                      onClick={() => handleEndVisitClick(client)}
                      disabled={isEndVisitDisabled(client.status)}
                    >
                      End Visit
                    </Button>
                    <Button color="primary" onClick={() => onViewDetails(client)}>
                      View Details
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for "End Visit" */}
      {confirmModalOpen && (
        <Modal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
          <ModalDialog aria-labelledby="confirm-end-visit" size="sm">
            <Typography id="confirm-end-visit" level="h5" fontWeight="bold">
              End Visit Confirmation
            </Typography>
            <Typography level="body1" mb={2}>
              Are you sure you want to end this visit?
            </Typography>
            <ButtonGroup variant="solid" fullWidth>
              <Button color="danger" onClick={confirmEndVisit}>
                Yes, End Visit
              </Button>
              <Button onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
            </ButtonGroup>
          </ModalDialog>
        </Modal>
      )}

      {/* Purchase Modal */}
      {purchaseModalOpen && (
        <Modal open={purchaseModalOpen} onClose={() => setPurchaseModalOpen(false)}>
          <ModalDialog aria-labelledby="confirm-purchase" size="sm">
            <Typography id="confirm-purchase" level="h5" fontWeight="bold">
              Purchase Confirmation
            </Typography>
            <Typography level="body1" mb={2}>
              Enter the bill number for this purchase:
            </Typography>
            <Input
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="Enter Bill Number"
              mb={2}
            />
            <ButtonGroup variant="solid" fullWidth>
              <Button color="info" onClick={confirmPurchase}>
                Confirm Purchase
              </Button>
              <Button onClick={() => setPurchaseModalOpen(false)}>Cancel</Button>
            </ButtonGroup>
          </ModalDialog>
        </Modal>
      )}
    </>
  );
};

export default ListView;
