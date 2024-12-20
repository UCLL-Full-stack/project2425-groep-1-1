import React from "react";
import {User} from "@types";

type Props = {
  users: User[];
}

const UsersOverview: React.FC<Props> = ({ users }: Props) => {


  return (
    <div className="container d-flex justify-content-center">
      <table className="table table-bordered">
        <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Signup date</th>
        </tr>
        </thead>
        <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{new Date(user.signUpDate!).toLocaleDateString()}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersOverview;
