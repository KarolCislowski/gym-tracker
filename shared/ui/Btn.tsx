interface BtnProps {
  text: string;
  color: string;
}

/**
 * Minimal button helper used by legacy or experimental UI paths.
 * @param props - Button props.
 * @param props.text - Visible button label.
 * @param props.color - Inline background color applied to the native button.
 * @returns A native button element with inline background styling.
 */
export const Btn = ({ text, color }: BtnProps) => {
  return <button style={{ backgroundColor: color }}>{text}</button>;
};
