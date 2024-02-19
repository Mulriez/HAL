function checkQuery(value) {

   
  if (value === undefined) return false;
  if (value === "") return false;
  if (value === null) return false;

  return true;
}

module.exports = checkQuery