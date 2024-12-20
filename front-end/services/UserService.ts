import { User } from "@types";

const loginUser = async (user: User) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

const getAllUsers = async () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("loggedInUser")!)?.token,
    },
  })
}

const UserService = {
  loginUser,
  getAllUsers,
};

export default UserService;