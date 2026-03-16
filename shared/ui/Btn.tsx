interface BtnProps {
  text: string;
  color: string;
}

export const Btn = ({ text, color }: BtnProps) => {
  return <button style={{ backgroundColor: color }}>{text}</button>;
};
