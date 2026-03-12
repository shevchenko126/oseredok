const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");

  if (local.length <= 2) {
    // если слишком короткий логин — заменяем всё звездочками
    return local[0] + "*****" + "@" + domain;
  }

  return (
    local.slice(0, 2) +
    "*****" +
    local.slice(-1) + // последняя буква
    "@" +
    domain
  );
}

export default maskEmail;