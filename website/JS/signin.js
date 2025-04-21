function validateSignin() {
    var firstName = document.forms["signupForm"]["firstName"].value;
    var lastName = document.forms["signupForm"]["lastName"].value;
    var phone = document.forms["signupForm"]["phone"].value;
    var email = document.forms["signupForm"]["email"].value;
    var username = document.forms["signupForm"]["username"].value;
    var password = document.forms["signupForm"]["password"].value;
    var terms = document.forms["signupForm"]["terms"].checked;

    if (firstName == "" || lastName == "") {
        alert("الاسم الاول و الاسم الاخير مطلوب");
        return false;
    }

    if (phone.length != 10 || isNaN(phone)) {
        alert("رقم الجوال يجب أن يتكون من 10 أرقام");
        return false;
    }

    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email != "" && !emailPattern.test(email)) {
        alert("البريد الالكتروني غير صحيح");
        return false;
    }

    if (username == "") {
        alert("اسم المستخدم مطلوب");
        return false;
    }

    if (password == "") {
        alert("كلمة المرور مطلوبة");
        return false;
    }

    if (!terms) {
        alert("يجب الموافقة على الشروط والأحكام");
        return false;
    }

    return true;
}

// JavaScript function to handle form submission
document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent default form submit

    const formData = new FormData(e.target);
    const data = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password"),
    };

    try {
        // Send data to the server
        const response = await fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Redirect to profile page if signup is successful
            window.location.href = '/profile.html';
        } else {
            // If response is not OK, show the error message from backend
            const responseData = await response.json();
            alert(responseData.message);  // Show the error message "Username or email already taken"
        }

    } catch (err) {
        console.error("Signup error:", err);
        alert("Something went wrong. Please try again.");
    }
});

