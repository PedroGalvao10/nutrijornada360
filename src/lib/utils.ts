type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

export function cn(...inputs: ClassValue[]) {
  return inputs.flat().filter(Boolean).join(' ');
}
