import { useState } from "react";

const ProfileForm = () => {
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email, profilePic }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      console.log("Profile updated successfully:", data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>Error: {error}</div>}
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Profile Picture URL:</label>
        <input
          type="text"
          value={profilePic}
          onChange={(e) => setProfilePic(e.target.value)}
        />
      </div>
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default ProfileForm;
