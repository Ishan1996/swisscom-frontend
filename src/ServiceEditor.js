import React, { useState, useEffect } from 'react';
import { createService, updateService, getServices, deleteService } from './serviceapi';

const generateId = () => `id_${Math.random().toString(36).substring(2, 6)}`;

const ServiceEditor = () => {
  const [services, setServices] = useState([]);
  const [service, setService] = useState({ id: '', resources: [] });
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    getServices()
      .then((res) => setServices(res.data))
      .catch(() => alert('Error loading services'));
  };

  const handleChange = (key, value) => {
    setService({ ...service, [key]: value });
  };

  const updateResource = (index, updated) => {
    const newResources = [...service.resources];
    newResources[index] = updated;
    setService({ ...service, resources: newResources });
  };

  const addResource = () => {
    setService({
      ...service,
      resources: [...service.resources, { id: generateId(), owners: [] }]
    });
  };

  const removeResource = (index) => {
    const newResources = [...service.resources];
    newResources.splice(index, 1);
    setService({ ...service, resources: newResources });
  };

  const updateOwner = (resIndex, ownerIndex, updatedOwner) => {
    const newResources = [...service.resources];
    newResources[resIndex].owners[ownerIndex] = updatedOwner;
    setService({ ...service, resources: newResources });
  };

  const addOwner = (resIndex) => {
    const newResources = [...service.resources];
    newResources[resIndex].owners.push({
      id: generateId(),
      name: '',
      accountNumber: '',
      level: 1
    });
    setService({ ...service, resources: newResources });
  };

  const removeOwner = (resIndex, ownerIndex) => {
    const newResources = [...service.resources];
    newResources[resIndex].owners.splice(ownerIndex, 1);
    setService({ ...service, resources: newResources });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const action = isEditMode
      ? updateService(service.id, service)
      : createService(service);

    action
      .then(() => {
        alert(isEditMode ? 'Service updated' : 'Service created');
        resetForm();
        loadServices();
      })
      .catch(() => alert('Error saving service'));
  };

  const handleEdit = (srv) => {
    setService(srv);
    setIsEditMode(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id)
        .then(() => {
          alert('Service deleted');
          loadServices();
        })
        .catch(() => alert('Error deleting service'));
    }
  };

  const resetForm = () => {
    setService({ id: '', resources: [] });
    setIsEditMode(false);
  };

  const filteredServices = services.filter(s =>
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '1rem', maxWidth: '1000px', margin: 'auto' }}>
      <h2>{isEditMode ? 'Edit Service' : 'Create New Service'}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <label>Service ID:</label>
        <input
          type="text"
          value={service.id}
          onChange={(e) => handleChange('id', e.target.value)}
          required
          disabled={isEditMode}
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />

        {service.resources.map((res, resIndex) => (
          <div key={resIndex} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '1rem' }}>
            <label>Resource ID:</label>
            <input
              type="text"
              value={res.id}
              onChange={(e) => updateResource(resIndex, { ...res, id: e.target.value })}
              required
            />
            <button type="button" onClick={() => removeResource(resIndex)} style={{ marginLeft: '10px' }}>
              Remove Resource
            </button>

            <div style={{ marginTop: '10px' }}>
              <strong>Owners:</strong>
              {res.owners.map((owner, ownerIndex) => (
                <div key={ownerIndex} style={{ marginLeft: '1rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={owner.name}
                    onChange={(e) =>
                      updateOwner(resIndex, ownerIndex, { ...owner, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={owner.accountNumber}
                    onChange={(e) =>
                      updateOwner(resIndex, ownerIndex, { ...owner, accountNumber: e.target.value })
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Level"
                    value={owner.level}
                    onChange={(e) =>
                      updateOwner(resIndex, ownerIndex, { ...owner, level: Number(e.target.value) })
                    }
                    required
                  />
                  <button type="button" onClick={() => removeOwner(resIndex, ownerIndex)}>
                    Remove Owner
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addOwner(resIndex)}>Add Owner</button>
            </div>
          </div>
        ))}

        <button type="button" onClick={addResource}>Add Resource</button>
        <br /><br />
        <button type="submit">{isEditMode ? 'Update Service' : 'Create Service'}</button>
        {isEditMode && (
          <button type="button" onClick={resetForm} style={{ marginLeft: '1rem' }}>
            Cancel Edit
          </button>
        )}
      </form>

      <h2>All Services</h2>
      <input
        type="text"
        placeholder="Search by ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
      />

      {filteredServices.map((srv) => (
        <div key={srv.id} style={{ border: '1px solid #aaa', padding: '10px', marginBottom: '1rem' }}>
          <strong>Service ID:</strong> {srv.id}
          {srv.resources.map((res) => (
            <div key={res.id} style={{ marginLeft: '1rem' }}>
              <div><strong>Resource ID:</strong> {res.id}</div>
              {res.owners.map((owner) => (
                <div key={owner.id} style={{ marginLeft: '1rem' }}>
                  Name: {owner.name} | Account: {owner.accountNumber} | Level: {owner.level}
                </div>
              ))}
            </div>
          ))}
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => handleEdit(srv)}>Edit</button>
            <button onClick={() => handleDelete(srv.id)} style={{ marginLeft: '1rem' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceEditor;
