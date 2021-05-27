module.exports.handler = async (event, context, callback) => {
  try {
    console.log(`CustomMessage lambda-Event: ${JSON.stringify(event, 0, 2)}`);

    const { codeParameter, usernameParameter, linkParameter } = event.request;
    // eslint-disable-next-line camelcase
    const { name, email, preferred_username } = event.request.userAttributes;
    const message =
      `<h1 id="${usernameParameter}">Online course Platform</h1>.` +
      `<p>Welcome ${name}.</p>` +
      // eslint-disable-next-line camelcase
      `<p> Confirmation Code to complete the Signup: ${codeParameter} </p>`;
    event.response.emailSubject = "Your Online Course Account";
    event.response.emailMessage = message;
    event.response.smsMessage = message;

    callback(null, event);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
