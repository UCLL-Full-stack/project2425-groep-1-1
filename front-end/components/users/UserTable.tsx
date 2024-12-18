import React from "react";

const UserTable: React.FC = () => {
    const users = [
        { username: 'user1', password: 'user1', role: 'User' },
        { username: 'validator1', password: 'validator1', role: 'Validator' },
        { username: 'organizer1', password: 'organizer1', role: 'Organizer' },
        { username: 'admin1', password: 'admin1', role: 'Admin' },
    ];

    return (
        <div className="container d-flex justify-content-center">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>username</th>
                        <th>password</th>
                        <th>role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.username}</td>
                            <td>{user.password}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
