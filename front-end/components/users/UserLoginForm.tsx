import { StatusMessage } from "@types";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";
import userService from "@services/UserService";
import { useTranslation } from "next-i18next";

const UserLoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const router = useRouter();

  const clearErrors = () => {
    setNameError(null);
    setPasswordError(null);
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let result = true;

    if (!name && name.trim() === "") {
      setNameError(t('login.validate.name'));
      result = false;
    }

    if (!password && password.trim() === "") {
      setPasswordError(t('login.validate.password'));
      result = false;
    }

    return result;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    clearErrors();

    if (!validate()) {
      return;
    }

    const [res] = await Promise.all([userService.loginUser({ username: name, password: password })]);
    if (res.ok) {
      const user = await res.json();
      setStatusMessages([{ message: t('login.success'), type: "success" }]);

      localStorage.setItem("loggedInUser", JSON.stringify({
        token: user.token,
        username: user.username,
        role: user.role,
      }));

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      const errorStatusMessage = await res.json();
      setStatusMessages([{ message: errorStatusMessage.message, type: 'error' }]);
    }
  };

  return (
    <>
      <div className="d-flex flex-column">
        {statusMessages && (
          <div className="row">
            <ul className="list-unstyled mb-3 mx-auto ">
              {statusMessages.map(({ message, type }, index) => (
                <li
                  key={index}
                  className={classNames({
                    "text-danger": type === "error",
                    "text-success": type === "success",
                  })}
                >
                  {message}
                </li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="nameInput" className="col-form-label">{t('login.label.username')}</label>
            <input
              id="nameInput"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="form-control"
              required
            />
            {nameError && <div className="alert alert-danger mt-3">{nameError}</div>}
          </div>
          <div className="mb-2">
            <label htmlFor="passwordInput" className="col-form-label">{t('login.label.password')}</label>
            <input
              id="passwordInput"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-control"
              required
            />
            {passwordError && (
              <div className="alert alert-danger mt-3">{passwordError}</div>
            )}
          </div>
          <input type="submit" className="btn btn-primary" value={t('login.button')} />

        </form>
      </div>
    </>
  );
};

export default UserLoginForm;