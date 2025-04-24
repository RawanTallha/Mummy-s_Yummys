fetch('navbar.html')
  .then(res => res.text())
  .then(data => document.getElementById('navbar').innerHTML = data);

fetch('footer.html')
  .then(res => res.text())
  .then(data => document.getElementById('footer').innerHTML = data);

function validateContactForm() {
    const form = document.forms["contactUsForm"];
    const name = form["name"].value.trim();
    const email = form["email"].value.trim();
    const mobile = form["mobile"].value.trim();
    const message = form["message"].value.trim();

    if (!name) {
        alert("الاسم مطلوب");
        return false;
    }

    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
        alert("رقم الجوال يجب أن يتكون من 10 أرقام");
        return false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        alert("البريد الإلكتروني غير صحيح");
        return false;
    }

    if (!message) {
        alert("يرجى كتابة رسالتك");
        return false;
    }

    return true;
}

document.getElementById("contactUsForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateContactForm()) return;

    const formData = new FormData(this);

    const data = {
        name: formData.get("name"),
        gender: formData.get("gender"),
        phone_number: formData.get("mobile"),
        dob: formData.get("dob"),
        email: formData.get("email"),
        language: formData.get("language"),
        message: formData.get("message"),
    };

    console.log("Sending contact form data:", data);

    try {
        const response = await fetch("/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("تم إرسال رسالتك بنجاح!");
            this.reset();
        } else {
            const text = await response.text();
            alert(" حدث خطأ أثناء الإرسال: " + text);
        }
    } catch (err) {
        console.error("Fetch failed:", err);
        alert("حدث خطأ أثناء الإرسال. حاول مرة أخرى لاحقًا.");
    }
});
