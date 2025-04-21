document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent default form submit

    const formData = new FormData(e.target);
    const data = {
        username: formData.get("username"),
        password: formData.get("password")
    };

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.redirected) {
            window.location.href = response.url; // successful login
        } else {
            const text = await response.text();
            alert(text); // shows "Invalid password"
        }

    } catch (err) {
        console.error("Login error:", err);
        alert("Something went wrong.");
    }
});