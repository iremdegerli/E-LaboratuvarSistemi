import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase kullanıcı oluşturma işlevi
import { auth } from "../firebaseConfig"; // Firebase yapılandırmasını içe aktar

// Kullanıcı Kayıt Formu
const Register = () => {
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 

  // Kayıt olma işlevi
  const handleRegister = async (e) => {
    e.preventDefault(); 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Kayıt Başarılı: ", userCredential.user); 
      alert("Kayıt başarılı!");
    } catch (err) {
      console.error("Kayıt Hatası: ", err.message);
      setError(err.message); 
    }
  };

  return (
    <div>
      <h1>Kayıt Ol</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email Adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Kayıt Ol</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Hata mesajını göster */}
    </div>
  );
};

export default Register;
