"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AddSchool = () => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        contact: "",
        email_id: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ visible: false, message: '', isSuccess: false });

    const showNotification = (message, isSuccess) => {
        setNotification({ visible: true, message, isSuccess });
    };

    useEffect(() => {
        if (notification.visible) {
            const timer = setTimeout(() => {
                setNotification({ visible: false, message: '', isSuccess: false });
            }, 3000); // Popup disappears after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [notification.visible]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (imageFile) {
            data.append('image', imageFile);
        } else {
            showNotification("Please select an image file.", false);
            setLoading(false);
            return;
        }
// http://localhost:5000
        try {
            const response = await fetch("https://assignment-school.onrender.com/add-school", {
                method: "POST",
                body: data,
            });

            const text = await response.text();
            let responseData;
            try { responseData = JSON.parse(text); } catch { responseData = { raw: text }; }

            if (!response.ok) {
                showNotification(`Server error ${response.status}: ${responseData?.error || text}`, false);
                return;
            }

            showNotification("Data saved in MySQL ✅", true);
            setFormData({ name: "", address: "", city: "", state: "", contact: "", email_id: "" });
            setImageFile(null);
        } catch (err) {
            showNotification(`Network error: ${err.message}`, false);
        } finally {
            setLoading(false);
        }
    };

    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sm:p-8 flex items-center justify-between">
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                        Add a New School
                    </h1>
                    <Link href="/showschools" passHref>
                        <button className="text-sm font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors py-2 px-4 rounded-full">
                            School list
                        </button>
                    </Link>
                </div>
                
                <form onSubmit={submitHandler} className="p-6 sm:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group relative">
                            <input
                                type="text"
                                id="school-name"
                                name="name"
                                value={formData.name}
                                onChange={changeHandler}
                                className="w-full peer h-12 px-4 pt-4 pb-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                                placeholder=" "
                                required
                            />
                            <label htmlFor="school-name" className="absolute left-4 top-2 text-sm text-gray-500 transform transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 -translate-y-1/2">
                                School Name
                            </label>
                        </div>
                        <div className="group relative">
                            <input
                                type="text"
                                id="school-address"
                                name="address"
                                value={formData.address}
                                onChange={changeHandler}
                                className="w-full peer h-12 px-4 pt-4 pb-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                                placeholder=" "
                                required
                            />
                            <label htmlFor="school-address" className="absolute left-4 top-2 text-sm text-gray-500 transform transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 -translate-y-1/2">
                                Address
                            </label>
                        </div>
                        <div className="group relative">
                            <input
                                type="text"
                                id="school-city"
                                name="city"
                                value={formData.city}
                                onChange={changeHandler}
                                className="w-full peer h-12 px-4 pt-4 pb-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                                placeholder=" "
                                required
                            />
                            <label htmlFor="school-city" className="absolute left-4 top-2 text-sm text-gray-500 transform transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 -translate-y-1/2">
                                City
                            </label>
                        </div>
                        <div className="group relative">
                            <input
                                type="text"
                                id="school-state"
                                name="state"
                                value={formData.state}
                                onChange={changeHandler}
                                className="w-full peer h-12 px-4 pt-4 pb-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                                placeholder=" "
                                required
                            />
                            <label htmlFor="school-state" className="absolute left-4 top-2 text-sm text-gray-500 transform transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 -translate-y-1/2">
                                State
                            </label>
                        </div>
                        <div className="group relative">
                            <input
                                type="text"
                                id="school-contact"
                                name="contact"
                                value={formData.contact}
                                onChange={changeHandler}
                                className="w-full peer h-12 px-4 pt-4 pb-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                                placeholder=" "
                                required
                            />
                            <label htmlFor="school-contact" className="absolute left-4 top-2 text-sm text-gray-500 transform transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 -translate-y-1/2">
                                Contact
                            </label>
                        </div>
                        <div className="group relative">
                            <input
                                type="email"
                                id="school-email"
                                name="email_id"
                                value={formData.email_id}
                                onChange={changeHandler}
                                className="w-full peer h-12 px-4 pt-4 pb-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                                placeholder=" "
                                required
                            />
                            <label htmlFor="school-email" className="absolute left-4 top-2 text-sm text-gray-500 transform transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 -translate-y-1/2">
                                Email
                            </label>
                        </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">School Image</label>
                        <input 
                            type="file" 
                            name="image" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            required
                        />
                    </div>
                    
                    <button
                        type='submit'
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-300 transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding School...' : 'Add School'}
                    </button>
                </form>
            </div>

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
        </div>
    )
}

export default AddSchool;





