const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

exports.validateSignUpData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(data.password)) {
    errors.password = "Must not be empty";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  if (isEmpty(data.firstName)) {
    errors.firstName = "Must not be empty";
  }

  if (isEmpty(data.lastName)) {
    errors.lastName = "Must not be empty";
  }

  if (data.photographer) {
    if (isEmpty(data.location_city)) {
      errors.city = "Must not be empty";
    }

    if (isEmpty(data.location_state)) {
      errors.state = "Must not be empty";
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  }

  if (isEmpty(data.password)) {
    errors.password = "Must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateResetPasswordData = (data) => {
  let errors = {};

  if (!isEmail(data)) {
    errors.email = "Must be valid email";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateChangePassword = (data) => {
  let errors = {};

  if (data.newPassword === data.oldPassword) {
    errors.similar = "Your new password can't be the same as the old one.";
  }

  if (isEmpty(data.newPassword) || isEmpty(data.oldPassword)) {
    errors.matching = "Must not be empty";
  }

  if (data.newPassword !== data.newPasswordConfirm) {
    errors.matching = "Passwords don't match.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateReview = (data) => {
  let errors = {};

  if (isEmpty(data.title) | (data.title.length < 5)) {
    errors.title = "The title of your review must be longer than 5 characters.";
  }

  if (isEmpty(data.description) || data.description.length < 10) {
    errors.description = "The description of your review must be longer than 10 characters.";
  }

  if (data.reviewID === data.photographerID) {
    errors = "You cannot review yourself.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validatePhotographerPageData = (data) => {
  let errors = {};

  if (data.categories.length === 0) {
    errors.categories = "Must fill out categories";
  }

  if (isEmpty(data.camera)) {
    errors.camera = "Must not be empty";
  }

  if (isEmpty(data.headline) || data.headline.length < 10) {
    errors.headline = "Must be longer than 10 characters";
  }

  if (isEmpty(data.instagram)) {
    errors.instagram = "Must not be empty";
  }

  if (isEmpty(data.company)) {
    errors.company = "Must not be empty";
  }

  if (isEmpty(data.bio) || data.bio.length < 20) {
    errors.bio = "Must be longer than 20 characters";
  }

  // if (data.ratePerHour === null) {
  //   errors.ratePerHour = "Must be a valid value";
  // }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateProfileUpdate = (data) => {
  let errors = {};

  if (isEmpty(data.firstName)) {
    errors.firstName = "Must not be empty";
  }

  if (isEmpty(data.lastName)) {
    errors.lastName = "Must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
