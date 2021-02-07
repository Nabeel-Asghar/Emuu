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

exports.validateReview = (data) => {
  let errors = {};

  if (isEmpty(data.title)) {
    errors.title = "Must not be empty";
  }

  if (isEmpty(data.description)) {
    errors.description = "Must not be empty";
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
