import { link } from "react-router";
import { useState, useEffect, use } from "react";
import { getAccount } from "../api/users";
import { useAuth } from "../auth/AuthContext";

// User's account page with their information and reservations
export default function Account() {
  const { token } = useAuth();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const syncAccount = async () => {
      const data = await getAccount(token);
      setAccount(data);
    };
    syncAccount();
  }, [token]);

  if (!token)
    return (
      <p>
        Please <Link to="/login">log in</Link> to view your account.
      </p>
    );

  if (!account) return <p>Loading...</p>;

  return (
    <>
      <header>
        <h1>Welcome, {account.name}</h1>
        <p>Your email on file with us is {account.email}</p>
      </header>
    </>
  );
}
