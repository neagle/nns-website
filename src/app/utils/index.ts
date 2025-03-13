export const fullName = ({
  firstName = "",
  middleName = "",
  lastName = "",
}) => {
  return [firstName, middleName, lastName].join(" ");
};
