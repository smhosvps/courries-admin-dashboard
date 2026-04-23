/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import {
  useAddCountryMutation,
  useGetCountriesQuery,
  useUpdateCountryMutation,
} from "./redux/features/countryApi/countryApi";
import CountryList from "./components/CountryList";
import CountryForm from "./components/CountryForm";

export default function ManageCountry() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { refetch } = useGetCountriesQuery({});

  const [addCountry] = useAddCountryMutation();
  const [updateCountry] = useUpdateCountryMutation();

  const handleAddClick = () => {
    setEditingCountry(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (country: any) => {
    setEditingCountry(country);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (isEditing && editingCountry) {
        await updateCountry({ id: editingCountry?._id, ...formData }).unwrap();
      } else {
        await addCountry(formData).unwrap();
      }
        await refetch(); // force refresh after add/edit
      setIsModalOpen(false);
    } catch (err:any) {
      console.error("Failed to save country:", err);
      alert(err?.data?.message || "Failed to save country");
    }
  };

  return (
    <div className="min-h-screen">
      <div className=" px-0 lg:px-4 py-8">
        <CountryList
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
        />
        <CountryForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingCountry}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}
