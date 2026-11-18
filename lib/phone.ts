/** Маска телефона Казахстана: хранение — 11 цифр «7XXXXXXXXXX», показ — «+7 (XXX) XXX-XX-XX». */

export const digitsOf = (v: string) => {
  let d = v.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (d && !d.startsWith("7")) d = "7" + d;
  return d.slice(0, 11);
};

export const formatPhone = (d: string) => {
  const p = d.slice(1);
  if (!d) return "";
  let out = "+7";
  if (p.length) out += " (" + p.slice(0, 3);
  if (p.length >= 3) out += ")";
  if (p.length > 3) out += " " + p.slice(3, 6);
  if (p.length > 6) out += "-" + p.slice(6, 8);
  if (p.length > 8) out += "-" + p.slice(8, 10);
  return out;
};

/** Следующее значение по событию ввода с учётом удаления разделителей и «8 707…». */
export function nextPhone(prevDigits: string, inputValue: string) {
  let next = inputValue.startsWith("+7")
    ? ("7" + inputValue.slice(2).replace(/\D/g, "")).slice(0, 11)
    : digitsOf(inputValue);
  if (prevDigits.length <= 1 && next.startsWith("78")) next = ("7" + next.slice(2)).slice(0, 11);
  const prevShown = formatPhone(prevDigits);
  if (inputValue.length < prevShown.length && next === prevDigits) return prevDigits.slice(0, -1);
  return next;
}
