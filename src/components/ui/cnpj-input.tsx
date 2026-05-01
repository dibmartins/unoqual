import * as React from "react"
import { Input } from "@/components/ui/input"

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "");
  
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

function isValidCnpj(cnpj: string) {
  const digits = cnpj.replace(/\D/g, "");

  if (digits.length !== 14) return false;

  // Check for repeated digits
  if (/^(\d)\1+$/.test(digits)) return false;

  // Validate first digit
  let length = digits.length - 2;
  let numbers = digits.substring(0, length);
  const check = digits.substring(length);
  let sum = 0;
  let pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += Number(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(check.charAt(0))) return false;

  // Validate second digit
  length = length + 1;
  numbers = digits.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += Number(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(check.charAt(1))) return false;

  return true;
}

interface CnpjInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value" | "defaultValue"> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  shouldValidate?: boolean;
}

const CnpjInput = React.forwardRef<HTMLInputElement, CnpjInputProps>(
  ({ className, onChange, onValueChange, value, defaultValue, shouldValidate = true, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState(() => {
      if (value !== undefined) return formatCnpj(String(value));
      if (defaultValue !== undefined) return formatCnpj(String(defaultValue));
      return "";
    });
    const [isInvalid, setIsInvalid] = React.useState(false);
    const [isTouched, setIsTouched] = React.useState(false);

    React.useEffect(() => {
      if (value !== undefined) {
        setLocalValue(formatCnpj(String(value)));
      }
    }, [value]);

    const validate = (val: string) => {
      if (!shouldValidate) return;
      const digits = val.replace(/\D/g, "");
      if (digits.length === 14) {
        setIsInvalid(!isValidCnpj(digits));
      } else if (digits.length > 0) {
        setIsInvalid(true);
      } else {
        setIsInvalid(false);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCnpj(e.target.value);
      setLocalValue(formatted);
      
      if (isTouched || formatted.replace(/\D/g, "").length >= 14) {
        validate(formatted);
      }
      
      const currentTarget = e.currentTarget;
      const target = e.target;
      
      const clonedEvent = {
        ...e,
        target: { ...target, value: formatted },
        currentTarget: { ...currentTarget, value: formatted }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange?.(clonedEvent);
      onValueChange?.(formatted);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsTouched(true);
      validate(localValue);
      props.onBlur?.(e);
    };

    return (
      <Input
        {...props}
        ref={ref}
        className={className}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={18}
        placeholder={props.placeholder || "00.000.000/0000-00"}
        aria-invalid={props["aria-invalid"] || (shouldValidate && isTouched && isInvalid)}
      />
    )
  }
)
CnpjInput.displayName = "CnpjInput"

export { CnpjInput, formatCnpj, isValidCnpj }
