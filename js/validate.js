// https://chnsa.ws/26g
function validate() {
  // Get the values from the form fields
  var firstName = document.getElementById("first-name").value;
  var lastName = document.getElementById("last-name").value;
  var email = document.getElementById("email").value;
  var subject = document.getElementById("subject").value;
  var message = document.getElementById("message").value;
  var error_message = document.getElementById("error_message");

  // Set the error message style
  error_message.style.padding = "0 1rem 1rem 0";
  error_message.style.color = "red";
  error_message.style.fontSize = "1.5rem";

  // Show the error message and scroll to it
  function showError(message) {
    error_message.innerHTML = message;
    error_message.scrollIntoView();
    return false;
  }

  // Check if the first name is valid
  if (firstName.length < 3) {
    return showError("Your first name must be longer than 2 characters. Sorry Bo.");
  }

  // Check if the last name is valid
  if (lastName.length < 3) {
    return showError("Your last name must be longer than 2 character. Sorry Ng.");
  }

  // Check if the email is valid
  if (email.indexOf("@") === -1 || email.length < 6) {
    return showError("Please enter a valid email address.");
  }

  // Check if the subject is valid
  if (subject.length < 1) {
    return showError("Please pick a subject.");
  }

  // Check if the message is valid
  if (message.length <= 3) {
    return showError("Your message must contain more than 2 characters.");
  }

  // Show a success message
  alert("Thank you. Your form has been submitted successfully!");
  return true;
}
