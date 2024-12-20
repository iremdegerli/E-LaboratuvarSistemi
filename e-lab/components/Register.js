import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase kullanıcı oluşturma işlevi
import { auth } from "../firebaseConfig"; // Firebase yapılandırmasını içe aktar

// Kullanıcı Kayıt Formu
const Register = () => {
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Şifre state
  const [error, setError] = useState(""); // Hata mesajları için state

  // Kayıt olma işlevi
  const handleRegister = async (e) => {
    e.preventDefault(); // Formun yenilenmesini engeller
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Kayıt Başarılı: ", userCredential.user); // Kullanıcı bilgileri
      alert("Kayıt başarılı!");
    } catch (err) {
      console.error("Kayıt Hatası: ", err.message);
      setError(err.message); // Hata mesajını kullanıcıya göster
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

export default Register; // Register bileşenini dışa aktar
