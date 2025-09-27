import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../../Service/User';
import toast from 'react-hot-toast';

const SettingsCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">{title}</h3>
        {children}
    </div>
);

export default function SellerSettings() {
    const [profile, setProfile] = useState({ email: '', passwordLastChangedAt: null, profileLastUpdatedAt: null });
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getUserProfile();
                setProfile(profileData);
            } catch (error) {
                console.log(error);
                toast.error("Could not fetch profile data.");
            }
        };
        fetchProfile();
    }, []);

    const handleEmailChange = (e) => setProfile(prev => ({ ...prev, email: e.target.value }));
    const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const proceedWithEmailUpdate = async () => {
        try {
            const updatedProfile = await updateUserProfile({ email: profile.email });
            setProfile(updatedProfile);
            toast.success("Email updated successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEmailUpdate = (e) => {
        e.preventDefault();
        toast((t) => (
            <div className="flex flex-col items-center gap-2">
                <p className="font-semibold">Are you sure you want to update your email?</p>
                <div className="flex gap-4">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={() => { proceedWithEmailUpdate(); toast.dismiss(t.id); }}>
                        Confirm
                    </button>
                    <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded" onClick={() => toast.dismiss(t.id)}>
                        Cancel
                    </button>
                </div>
            </div>
        ));
    };
    
    const proceedWithPasswordUpdate = async () => {
        try {
            const updatedProfile = await updateUserProfile({ password: passwords.password });
            setProfile(updatedProfile);
            setPasswords({ password: '', confirmPassword: '' }); 
            toast.success("Password updated successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (passwords.password !== passwords.confirmPassword) {
            return toast.error("New passwords do not match.");
        }
        if (!passwords.password) {
            return toast.error("Password cannot be empty.");
        }
        toast((t) => (
            <div className="flex flex-col items-center gap-2">
                <p className="font-semibold">Are you sure you want to change your password?</p>
                <div className="flex gap-4">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={() => { proceedWithPasswordUpdate(); toast.dismiss(t.id); }}>
                        Confirm
                    </button>
                    <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded" onClick={() => toast.dismiss(t.id)}>
                        Cancel
                    </button>
                </div>
            </div>
        ));
    };
    
    const handleLogout = () => {
        toast((t) => (
            <div className="flex flex-col items-center gap-2">
                <p className="font-semibold">Are you sure you want to logout?</p>
                <div className="flex gap-4">
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={() => {
                        localStorage.removeItem('user');
                        toast.success("Logged out successfully.");
                        navigate('/login');
                        toast.dismiss(t.id);
                    }}>
                        Logout
                    </button>
                    <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded" onClick={() => toast.dismiss(t.id)}>
                        Cancel
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Settings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <SettingsCard title="Account Credentials">
                        <form onSubmit={handleEmailUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input 
                                    type="email" 
                                    value={profile.email} 
                                    onChange={handleEmailChange} 
                                    className="mt-1 w-full p-2 border rounded-md" 
                                />
                            </div>
                            <button type="submit" className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700">
                                Update Email
                            </button>
                            {profile.profileLastUpdatedAt && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Last updated: {new Date(profile.profileLastUpdatedAt).toLocaleDateString()}
                                </p>
                            )}
                        </form>
                        <hr className="my-6" />
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={passwords.password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password" 
                                    className="mt-1 w-full p-2 border rounded-md" 
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password" 
                                    className="mt-1 w-full p-2 border rounded-md" 
                                />
                            </div>
                            <button type="submit" className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700">
                                Change Password
                            </button>
                             {profile.passwordLastChangedAt && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Password last changed: {new Date(profile.passwordLastChangedAt).toLocaleDateString()}
                                </p>
                            )}
                        </form>
                    </SettingsCard>

                    <SettingsCard title="Account Actions">
                        <p className="text-gray-600 mb-4">Logout from your account or permanently delete it.</p>
                        <div className="flex space-x-4">
                            <button onClick={handleLogout} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600">
                                Logout
                            </button>
                            <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-red-400" disabled>
                                Delete Account
                            </button>
                        </div>
                    </SettingsCard>
                </div>
                <div className="space-y-8">
                    <SettingsCard title="Notification Preferences">
                        <p className="text-gray-600 mb-4">Choose how you receive notifications.</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label>Email for new orders</label>
                                <input type="checkbox" className="toggle-checkbox" />
                            </div>
                             <div className="flex items-center justify-between">
                                <label>Email for low stock alerts</label>
                                <input type="checkbox" className="toggle-checkbox" defaultChecked />
                            </div>
                        </div>
                    </SettingsCard>

                     <SettingsCard title="Store Information">
                        <p className="text-gray-600 mb-4">This information will be displayed to customers.</p>
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Store Name</label>
                                <input type="text" placeholder="e.g., Green Earth Goods" className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Store Description</label>
                                <textarea placeholder="A short description of your store" className="mt-1 w-full p-2 border rounded-md" rows="3"></textarea>
                            </div>
                        </div>
                    </SettingsCard>
                </div>
            </div>
        </div>
    );
}