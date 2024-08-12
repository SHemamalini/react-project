import axios from "axios";
import { useEffect, useState } from "react";
import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    const [filterUsers, setFilterUsers] = useState([]);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [userData, setUserData] = useState({ name: "", age: "", city: "" });

    const getAllUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8000/users");
            setUsers(res.data);
            setFilterUsers(res.data);
        } catch (error) {
            console.error("There was an error fetching users:", error);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const handleSearchChange = (e) => {
        const searchText = e.target.value.toLowerCase();
        const filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(searchText) ||
            user.city.toLowerCase().includes(searchText)
        );
        setFilterUsers(filteredUsers);
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this user?");
        if (isConfirmed) {
            try {
                const res = await axios.delete(`http://localhost:8000/users/${id}`);
                setUsers(res.data);
                setFilterUsers(res.data);
            } catch (error) {
                console.error("There was an error deleting the user:", error);
            }
        }
    };

    const closeModel = () => {
        setIsModelOpen(false);
        getAllUsers();
    };

    const handleAddRecord = () => {
        setUserData({ name: "", age: "", city: "" });
        setIsModelOpen(true);
    };

    const handleData = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.age <= 0) {
            alert("Age must be a positive number.");
            return;
        }
        try {
            if (userData._id) {
                await axios.patch(`http://localhost:8000/users/${userData._id}`, userData);
            } else {
                await axios.post("http://localhost:8000/users", userData);
            }
            closeModel();
            setUserData({ name: "", age: "", city: "" });
        } catch (error) {
            console.error("There was an error submitting the form:", error);
        }
    };

    const handleUpdateRecord = (user) => {
        setUserData(user);
        setIsModelOpen(true);
    };

    return (
        <div className="container">
            <h3>CRUD Application</h3>
            <div className="input-search">
                <input type="search" placeholder="Search Text Here" onChange={handleSearchChange} />
                <button className="button" onClick={handleAddRecord}>Add Record</button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>City</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {filterUsers && filterUsers.map((user, index) => (
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.age}</td>
                            <td>{user.city}</td>
                            <td><button className="button" onClick={() => handleUpdateRecord(user)}>Edit</button></td>
                            <td><button onClick={() => handleDelete(user._id)} className="button1">Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModelOpen && (
                <div className="model">
                    <div className="model-content">
                        <span className="close" onClick={closeModel}>&times;</span>
                        <h2>User Record</h2>
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" value={userData.name} name="name" id="name" onChange={handleData} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="age">Age</label>
                            <input type="number" value={userData.age} name="age" id="age" onChange={handleData} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="city">City</label>
                            <input type="text" value={userData.city} name="city" id="city" onChange={handleData} />
                        </div>
                        <button className="button" onClick={handleSubmit}>{userData.id ? 'Update User' : 'Add User'}</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
