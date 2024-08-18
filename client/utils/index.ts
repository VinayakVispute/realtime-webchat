export const getInitials = (name: string | undefined) => {
  return (name ?? "Anonymous")
    .split(" ")
    .map((n) => n.charAt(0))
    .join("");
};

// This is testingsf edf

export const isObjectEmpty = (obj: Object): boolean => {
  return Object.keys(obj).length === 0;
};
