
const UserTable: React.FC = () => {
  const users = [
    { username: 'user1', password: 'user1', role: 'user' },
    { username: 'user2', password: 'user2', role: 'admin' },
    { username: 'user3', password: 'user3', role: 'organizer' },
  ];

  return (
    <div className="d-flex justify-content-center flex-column">
      <table className="table table-bordered">
        <thead>
        <th>username</th>
        <th>password</th>
        <th>role</th>
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
  )
}

export default UserTable;