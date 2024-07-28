import React, { useState } from 'react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import data from './data';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const statusColors = {
  'Completed': 'bg-green-500',
  'In Progress': 'bg-blue-500',
  'Worgress': 'bg-yellow-500',  // Assuming this was a typo for "Progress"
  'Open Work': 'bg-teal-500',
  'Cancelled': 'bg-red-500',
};

const Dashboard = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const getWeekData = (weekStart) => {
    const weekEnd = endOfWeek(weekStart);
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return daysOfWeek.map((day) => {
      let dayData = data.filter(d => d.date.toDateString() === day.toDateString());

      if (statusFilter) {
        dayData = dayData.filter(d => d.status === statusFilter);
      }

      if (dateFilter) {
        const selectedDate = new Date(dateFilter);
        dayData = dayData.filter(d => d.date.toDateString() === selectedDate.toDateString());
      }

      return { day, data: dayData };
    });
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const weekStart = startOfWeek(currentWeek);
  const weekData = getWeekData(weekStart);



  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen text-white">
      <h1 className=" text-lg text-center md:text-4xl font-bold mb-4">Weekly PMs Dashboard</h1>
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className='flex w-full rounded-md justify-between items-center md:w-1/2 bg-slate-800 py-3 px-3'>
        <button
          onClick={handlePreviousWeek}
          className="bg-blue-700 rounded-full w-8 h-8 flex justify-center items-center  shadow hover:bg-blue-800   "
        >
          <FaArrowLeft className="mr-2" />
        </button>
        <div className='font-bold text-xs md:text-lg mx-1'> 
          {format(weekStart, 'dd/MM')} - {format(endOfWeek(weekStart), 'dd/MM')}
        </div>
        <button
          onClick={handleNextWeek}
          className="bg-blue-700 rounded-full w-8 h-8 flex justify-center items-center  shadow hover:bg-blue-800   "
        >
          <FaArrowRight className="ml-2" />
        </button>
          
        </div>
      
        <div className="flex md:items-center mt-4 md:mt-0">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="bg-gray-700 px-2 text-sm py-2 rounded shadow text-white md:ml-4"
          >
            <option value="">All Statuses</option>
            {Object.keys(statusColors).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="bg-gray-700 px-2 py-2 rounded shadow text-white ml-4"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weekData.map((dayData) => {
          const dayName = format(dayData.day, 'EEEE');

          return (
            <div key={dayName} className="text-white p-4 rounded shadow-md bg-gray-800">
              <h3 className="text-lg font-extrabold mb-2">{dayName}</h3>
              {dayData.data.length > 0 ? (
                dayData.data.map((data, index) => {
                  const statusColor = statusColors[data.status] || 'bg-gray-500';
                  return (
                    <div key={index} className={`mb-2 p-2 flex justify-around items-center rounded ${statusColor}`}>
                      <h2 className="text-xl font-bold">{data.srNo}</h2>
                        <p className="text-sm font-bold">{format(data.date, 'dd/MM/yyyy')}</p>
         
                      <p className={` font-extrabold py-1 rounded text-white ${statusColor} `}>{data.status}</p>
                     
                    </div>
                  );
                })
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
