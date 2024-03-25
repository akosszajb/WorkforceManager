import { useState, useEffect } from "react";

const EquipmentForm = ({ onSave, disabled, equipment, onCancel }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (equipment) {
      console.log("Equip object:", equipment);
      setName(equipment.name || "");
      setType(equipment.type || "");
      setAmount(equipment.amount || "");
    }
  }, [equipment]);

  const onSubmit = (e) => {
    e.preventDefault();

    const newEquipment = {
      name,
      type,
      amount,
    };

    if (equipment) {
      onSave({ ...equipment, ...newEquipment });
    } else {
      onSave(newEquipment);
    }
  };

  return (
    <form className="EquipmentForm" onSubmit={onSubmit}>
      <div className="control">
        <label htmlFor="name">Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          id="name"
        />
      </div>

      <div className="control">
        <label htmlFor="type">Type:</label>
        <input
          value={type}
          onChange={(e) => setType(e.target.value)}
          name="type"
          id="type"
        />
      </div>

      <div className="control">
        <label htmlFor="amount">Amount:</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          name="amount"
          id="amount"
        />
      </div>

      <div className="buttons">
        <button type="submit" disabled={disabled}>
          {equipment && equipment._id ? "Update Equipment" : "Create Equipment"}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EquipmentForm;
