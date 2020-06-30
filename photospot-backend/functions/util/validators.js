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

exports.validatePhotographerPageData = (data) => {
  let errors = {};

  if (isEmpty(data.bio)) {
    errors.bio = "Must not be empty";
  }

  if (isEmpty(data.location_city)) {
    errors.location_city = "Must not be empty";
  }

  if (isEmpty(data.location_state)) {
    errors.location_state = "Must not be empty";
  }

  if (data.willingnessToTravel === null) {
    errors.willingnessToTravel = "Must be a valid value";
  }

  if (data.ratePerHour === null) {
    errors.ratePerHour = "Must be a valid value";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
