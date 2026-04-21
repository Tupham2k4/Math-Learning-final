import React from 'react';
import DashboardHeader from '../Components/AdminDashboard/DashboardHeader/DashboardHeader';
import StatsCards from '../Components/AdminDashboard/StatsCards/StatsCards';
import QuickAccessCards from '../Components/AdminDashboard/QuickAccessCards/QuickAccessCards';
import GradeScoreChart from '../Components/AdminDashboard/GradeScoreChart/GradeScoreChart';
import ScoreOverview from '../Components/AdminDashboard/ScoreOverview/ScoreOverview';
import RecentActivities from '../Components/AdminDashboard/RecentActivities/RecentActivities';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <DashboardHeader />
      
      <StatsCards />
      
      <QuickAccessCards />
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '30px' }} className="chart-insights-row">
        <GradeScoreChart />
        <ScoreOverview />
      </div>

      <RecentActivities />
    </div>
  );
};

export default AdminDashboard;