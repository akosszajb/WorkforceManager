import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EquipmentTable from "../Components/EquipmentTable/EquipmentTable";

const fetchEquipment = () => {
  return fetch("/api/equipments").then((res) => res.json());
};

const deleteEquipment = async (id) => {
  const response = await fetch(`/api/equipments/${id}`, { method: "DELETE" });
  if (response.ok) {
    return true;
  }
  return false;
};

const EquipmentList = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchETerm, setSearchETerm] = useState("");
  const [sortEBy, setSortEBy] = useState(null);

  const handleDelete = async (id) => {
    const success = await deleteEquipment(id);
    if (success) {
      setEquipments((prevEquipments) =>
        prevEquipments.filter((equipment) => equipment._id !== id)
      );
    } else {
      console.error(`Failed to delete eqipment with ID ${id}`);
    }
  };

  const handleSearch = (event) => {
    setSearchETerm(event.target.value);
  };

  const handleSortByName = () => {
    setSortEBy("name");
  };

  const handleSortByType = () => {
    setSortEBy("type");
  };

  const handleSortByAmount = () => {
    setSortEBy("amount");
  };

  useEffect(() => {
    fetchEquipment()
      .then((equipments) => {
        setLoading(false);
        setEquipments(equipments);
      })
      .catch((error) => {
        console.error("Error fetching equipments:", error);
        setLoading(false);
      });
  }, []);

  let filteredEquipments = equipments
    ? equipments.filter((equipment) => {
        return (
          (equipment.name &&
            equipment.name.toLowerCase().includes(searchETerm.toLowerCase())) ||
          (equipment.type &&
            equipment.type.toLowerCase().includes(searchETerm.toLowerCase()))
        );
      })
    : [];

  if (sortEBy) {
    filteredEquipments.sort((a, b) => {
      if (sortEBy === "name") {
        return (a.name || "").localeCompare(b.name);
      } else if (sortEBy === "type") {
        return (a.type || "").localeCompare(b.type);
      } else if (sortEBy === "amount") {
        return (a.amount || 0) - (b.amount || 0);
      }
    });
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search by Name or Type"
        value={searchETerm}
        onChange={handleSearch}
      />
      <button type="button" onClick={handleSortByName}>
        Sort by Name
      </button>
      <button type="button" onClick={handleSortByType}>
        Sort by Type
      </button>
      <button type="button" onClick={handleSortByAmount}>
        Sort by Amount
      </button>
      <EquipmentTable equipments={filteredEquipments} onDelete={handleDelete} />
    </>
  );
};

export default EquipmentList;
