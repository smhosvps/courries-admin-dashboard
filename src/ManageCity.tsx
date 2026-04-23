import { useState } from "react";
import CityList from "./components/CityList";
import CityForm from "./components/CityForm";
import {
  City,
  CityInput,
  useAddCityMutation,
  useGetCitiesQuery,
  useUpdateCityMutation,
} from "./redux/features/cityApi/cityApi";

export default function ManageCity() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [addCity] = useAddCityMutation();
  const [updateCity] = useUpdateCityMutation();
  const { refetch } = useGetCitiesQuery();

  const handleAdd = () => {
    setEditingCity(null);
    setModalOpen(true);
  };
  const handleEdit = (city: City) => {
    setEditingCity(city);
    setModalOpen(true);
  };
  const handleSubmit = async (data: CityInput) => {
    if (editingCity) {
      await updateCity({ id: editingCity._id, ...data });
    } else {
      await addCity(data);
    }
    await refetch(); // force refresh after add/edit
    setModalOpen(false);
  };

  return (
    <div className="p-4">
      <CityList onAddClick={handleAdd} onEditClick={handleEdit} />
      <CityForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCity}
        isEditing={!!editingCity}
      />
    </div>
  );
}
