import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Geofence, useDeleteGeofenceMutation, useGetGeofencesQuery } from '@/redux/features/geofencingApi/geofencingApi';

interface GeofenceTableProps {
    onViewOnMap: (geofence: Geofence) => void;
    onEdit: (geofence: Geofence) => void;
}

const GeofenceTable: React.FC<GeofenceTableProps> = ({ onViewOnMap, onEdit }) => {
    const { data: geofences, isLoading, error } = useGetGeofencesQuery();
    const [deleteGeofence, { isLoading: isDeleting }] = useDeleteGeofenceMutation();
    const [searchTerm, setSearchTerm] = useState('');

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [geofenceToDelete, setGeofenceToDelete] = useState<Geofence | null>(null);

    const handleDeleteClick = (geofence: Geofence) => {
        setGeofenceToDelete(geofence);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!geofenceToDelete) return;
        try {
            await deleteGeofence(geofenceToDelete._id).unwrap();
            toast.success('Geofence deleted successfully');
            setDeleteModalOpen(false);
            setGeofenceToDelete(null);
            // Instead of reloading the page, we could refetch the list
            // For now, keep the reload or use refetch if available
            window.location.reload();
        } catch (err) {
            console.log(err);
            toast.error('Failed to delete geofence');
        }
    };

    const cancelDelete = () => {
        setDeleteModalOpen(false);
        setGeofenceToDelete(null);
    };

    if (isLoading) return <div className="flex justify-center items-center h-64">Loading geofences...</div>;
    if (error) return <div className="text-red-500 text-center p-4">Error loading geofences</div>;

    const filteredGeofences = geofences?.filter(gf =>
        gf.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="font-sans">
            {/* Header with title and search */}
            <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                <h2 className="text-2xl font-semibold text-gray-800">Areas of Operation</h2>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-none outline-none text-sm w-48"
                    />
                </div>
            </div>

            {/* Table wrapper - responsive with borders */}
            <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
                <table className="min-w-full bg-white border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 border border-gray-200">Name</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 border border-gray-200">Type</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 border border-gray-200">Center / Coordinates</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 border border-gray-200">Radius</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 border border-gray-200">Status</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 border border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGeofences?.map((gf) => (
                            <tr key={gf._id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 text-sm font-medium text-gray-900 border border-gray-200">{gf.name}</td>
                                <td className="py-3 px-4 border border-gray-200">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gf.type === 'circle'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-indigo-100 text-indigo-800'
                                            }`}
                                    >
                                        {gf.type}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600 border border-gray-200">
                                    {gf.type === 'circle'
                                        ? `${gf.center?.coordinates[1]?.toFixed(4)}, ${gf.center?.coordinates[0]?.toFixed(4)}`
                                        : 'Polygon (multiple points)'}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600 border border-gray-200">
                                    {gf.radius ? `${gf.radius.toLocaleString()} m` : '-'}
                                </td>
                                <td className="py-3 px-4 border border-gray-200">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gf.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {gf.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="py-3 px-4 border border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onViewOnMap(gf)}
                                            className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition"
                                            title="View on Map"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(gf)}
                                            className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition"
                                            title="Edit"
                                            disabled={gf.type !== 'circle'}
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(gf)}
                                            className="text-red-600 hover:bg-red-50 p-1.5 rounded-md transition"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredGeofences?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500 border border-gray-200">
                                    No geofences found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && geofenceToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
                            <button
                                onClick={cancelDelete}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600">
                                Are you sure you want to delete the geofence "<strong>{geofenceToDelete.name}</strong>"?
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition bg-white font-medium w-full"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeofenceTable;