document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.querySelector("[name='username']").value;
    const email = document.querySelector("[name='email']").value;
    const password = document.querySelector("[name='password']").value;

    const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        alert("Signup Successful");
        window.location.href = "login.html"; // Redirect to login page
    } else {
        alert(`Signup Failed: ${data.message}`);
    }
});
