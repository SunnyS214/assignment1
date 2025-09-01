

"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const ShowSchool = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ visible: false, message: '', isSuccess: false });
    const [confirmModal, setConfirmModal] = useState({ visible: false, idToDelete: null });

    const showNotification = (message, isSuccess) => {
        setNotification({ visible: true, message, isSuccess });
    };

    useEffect(() => {
        if (notification.visible) {
            const timer = setTimeout(() => {
                setNotification({ visible: false, message: '', isSuccess: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.visible]);

    const fetchSchools = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://assignment-school.onrender.com/get-schools");
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json();
            setSchools(data);
        } catch (err) {
            console.error("Failed to fetch schools:", err);
            setError("Failed to load data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const handleDelete = (id) => {
        setConfirmModal({ visible: true, idToDelete: id });
    };

    const confirmDelete = async () => {
        setConfirmModal({ visible: false, idToDelete: null });
        setLoading(true);

        try {
            const response = await fetch(`https://assignment-school.onrender.com/delete-school/${confirmModal.idToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const text = await response.text();
                let errorData = { raw: text };
                try { errorData = JSON.parse(text); } catch {}
                showNotification(`Error deleting school: ${errorData.error || text}`, false);
                return;
            }

            showNotification("School deleted successfully!", true);
            fetchSchools();
        } catch (err) {
            showNotification(`Network error: ${err.message}`, false);
        } finally {
            setLoading(false);
        }
    };

    const cancelDelete = () => {
        setConfirmModal({ visible: false, idToDelete: null });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-xl font-semibold text-gray-700">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-xl font-semibold text-red-500">Error: {error}</p>
            </div>
        );
    }

    const schoolsToDisplay = schools.slice(0, 6);

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
                    List of Schools
                </h1>
                <Link href="/" passHref>
                    <div className="py-2 px-6 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors cursor-pointer transform hover:scale-105 active:scale-95">
                        Add New School
                    </div>
                </Link>
            </div>

            {schoolsToDisplay.length === 0 ? (
                <div className="flex flex-col justify-center items-center mt-20 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <p className="text-2xl text-gray-500 font-semibold">No schools found in the database.</p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {schoolsToDisplay.map(school => (
                        <li
                            key={school.id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-200 transform hover:-translate-y-1"
                        >
                            {school.image && (
                                <img
                                    src={`https://assignment-school.onrender.com${school.image}`}
                                    alt={`${school.name} school image`}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{school.name}</h3>
                                <p className="text-base text-gray-600 mb-1 flex items-center whitespace-nowrap overflow-hidden text-ellipsis">
                                   
                                    <span className="font-medium text-gray-700">Address:</span> {`${school.address}, ${school.city}, ${school.state}`}
                                </p>
                                <p className="text-sm text-gray-600 mb-1 flex items-center">
                                    
                                    <span className="font-medium text-gray-700">Contact:</span> {school.contact}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center">
                                
                                    <span className="font-medium text-gray-700">Email:</span> {school.email_id}
                                </p>
                                <button
                                    onClick={() => handleDelete(school.id)}
                                    className="mt-4 w-full py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors transform active:scale-95"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {notification.visible && (
                <div className={`
                    fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50
                    px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-out
                    ${notification.isSuccess ? 'bg-green-500' : 'bg-red-500'}
                    ${notification.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}>
                    <div className="flex items-center space-x-2">
                        {notification.isSuccess ? (
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <span className="text-white text-sm font-semibold">
                            {notification.message}
                        </span>
                    </div>
                </div>
            )}
            
            {confirmModal.visible && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm border-t-4 border-red-500">
                        <div className="text-center">
                            <h3 className="text-lg leading-6 font-medium text-red-600">
                                Confirm Deletion
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to delete this school? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowSchool;
