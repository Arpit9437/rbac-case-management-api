const generateConfirmationEmail = (username, token) => {
  const confirmationLink = `${process.env.FRONTEND_URL}/confirm-account/${token}`;

  return {
    subject: "Confirm Your Anti-Doping Portal Account",
    html: `
        <h2>Welcome to the Anti-Doping Portal</h2>
        <p>Hello ${username},</p>
        <p>Your account has been created by an administrator. Please click the link below to confirm your account:</p>
        <a href="${confirmationLink}">Confirm Account</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this account, please ignore this email.</p>
      `,
  };
};

module.exports = {
  generateConfirmationEmail,
};
