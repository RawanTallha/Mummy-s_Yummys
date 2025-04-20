// JavaScript function to validate the form
function validateForm() {
    var firstName = document.forms["signupForm"]["firstName"].value;
    var lastName = document.forms["signupForm"]["lastName"].value;
    var phone = document.forms["signupForm"]["phone"].value;
    var email = document.forms["signupForm"]["email"].value;
    var username = document.forms["signupForm"]["username"].value;
    var password = document.forms["signupForm"]["password"].value;
    var terms = document.forms["signupForm"]["terms"].checked;

    // Check if first name and last name are provided
    if (firstName == "" || lastName == "") {
        alert("الاسم الاول و الاسم الاخير مطلوب");
        return false;
    }

    // Check if phone number is 10 digits
    if (phone.length != 10 || isNaN(phone)) {
        alert("رقم الجوال يجب أن يتكون من 10 أرقام");
        return false;
    }

    // Check if email format is valid
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email != "" && !emailPattern.test(email)) {
        alert("البريد الالكتروني غير صحيح");
        return false;
    }

    // Check if username is provided
    if (username == "") {
        alert("اسم المستخدم مطلوب");
        return false;
    }

    // Check if password is provided
    if (password == "") {
        alert("كلمة المرور مطلوبة");
        return false;
    }

    // Check if terms and conditions are accepted
    if (!terms) {
        alert("يجب الموافقة على الشروط والأحكام");
        return false;
    }

    // If all checks pass, allow form submission
    return true;
}
