import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminHeader';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar is closed by default

  return (
    <>
      <div className="admin-layout">
        <AdminNavbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setIsSidebarOpen} />
        <div className="admin-body">
          <AdminSidebar isOpen={isSidebarOpen} />
          {/* Main content here */}
          <div className='container'>
            <h1 className='text-center'>Dashboard</h1>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
