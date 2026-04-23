import { useDeleteDeletionReasonMutation, useGetAllDeletionReasonsQuery} from '@/redux/features/deleterReasonsApi/deleteReasonsApi';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { useState} from 'react';


const ITEMS_PER_PAGE = 10;

const DeletedAccountsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch all users and deletion reasons
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({});
  const { data: deletionReasons, isLoading: reasonsLoading, refetch } = useGetAllDeletionReasonsQuery([]);


  console.log(deletionReasons, "dggfg")
  const [deleteDeletionReason] = useDeleteDeletionReasonMutation();

  // State for confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Combine user data with deletion reasons
  const combinedData = deletionReasons?.data?.map((reason:any) => {
    const user = usersData?.users?.find((u:any) => u._id === reason.userId);
    return {
      ...reason,
      user: user || null,
      status: user ? 'User Exists' : 'User Deleted'
    };
  }) || [];

  // Filter data based on search term
  const filteredData = combinedData?.filter((item:any) => 
    item?.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item?.user?.firsName?.toLowerCase().includes(searchTerm?.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (record:any) => {
    setSelectedRecord(record);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDeletionReason(selectedRecord.userId).unwrap();
      refetch();
      setNotification({
        show: true,
        message: 'Deletion record removed successfully',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        show: true,
        message: 'Failed to delete record',
        type: 'error'
      });
    } finally {
      setShowConfirm(false);
    }
  };

  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  if (usersLoading || reasonsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Deleted Accounts Management</h1>
      
      {/* Search Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by User ID, Email or Name..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deletion Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item:any, index:any) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="text-sm font-medium text-gray-900">{item?.user?.firstName}  {item.user?.lastName}</div> 
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item?.user ? (
                      <div>
                        <div className="text-sm text-gray-500">{item?.user?.email}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">User details not available</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item?.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.status === 'User Exists' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                      disabled={item.status === 'User Deleted'}
                    >
                      Delete Record
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No deleted accounts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
              </span>{' '}
              of <span className="font-medium">{filteredData.length}</span> results
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-md ${currentPage === page ? 'bg-blue-500 text-white' : ''}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to permanently delete this deletion record? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg 
          ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          <div className="flex justify-between items-center">
            <span>{notification.message}</span>
            <button onClick={closeNotification} className="ml-4">
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletedAccountsTable;