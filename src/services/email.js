// Email service
const pendingEmails = [];

function sendEmail(to, subject, body) {
  const email = { to, subject, body, sentAt: new Date() };
  pendingEmails.push(email);
  return email;
}

function getQueue() {
  return [...pendingEmails];
}

function clearQueue() {
  pendingEmails.length = 0;
}

module.exports = { sendEmail, getQueue, clearQueue };
