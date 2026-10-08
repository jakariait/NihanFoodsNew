import React from 'react';
import UserStats from '../component/componentGeneral/UserStats.jsx';
import RecentOrders from '../component/componentGeneral/RecentOrders.jsx';
import Newsletter from '../component/componentGeneral/Newsletter.jsx';

const UserHomePage = () => {
  return (
    <div className="space-y-6">
      <UserStats />
      <RecentOrders />
      <Newsletter />
    </div>
  );
};

export default UserHomePage;
