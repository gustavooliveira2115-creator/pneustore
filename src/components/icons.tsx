export const SearchIcon = () => (
  <svg width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="64 64 896 896">
    <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
  </svg>
);

export const UserIcon = () => (
  <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
    <path d="M11.0003 11.9167C13.5316 11.9167 15.5837 9.86464 15.5837 7.33333C15.5837 4.80203 13.5316 2.75 11.0003 2.75C8.46902 2.75 6.41699 4.80203 6.41699 7.33333C6.41699 9.86464 8.46902 11.9167 11.0003 11.9167ZM11.0003 11.9167C12.9452 11.9167 14.8105 12.6893 16.1858 14.0646C17.561 15.4398 18.3337 17.3051 18.3337 19.25M11.0003 11.9167C9.0554 11.9167 7.19014 12.6893 5.81488 14.0646C4.43961 15.4398 3.66699 17.3051 3.66699 19.25" stroke="currentColor" strokeWidth="1.83333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CartIcon = ({ size = 22 }: { size?: number } = {}) => (
  <svg width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16">
    <path d="M0.866577 1.36719H2.19991L3.97324 9.64719C4.0383 9.95043 4.20702 10.2215 4.45038 10.4138C4.69375 10.606 4.99651 10.7074 5.30658 10.7005H11.8266C12.13 10.7 12.4242 10.596 12.6606 10.4057C12.897 10.2154 13.0613 9.95021 13.1266 9.65385L14.2266 4.70052H2.91324M5.50004 14.0005C5.50004 14.3687 5.20156 14.6672 4.83337 14.6672C4.46518 14.6672 4.16671 14.3687 4.16671 14.0005C4.16671 13.6323 4.46518 13.3338 4.83337 13.3338C5.20156 13.3338 5.50004 13.6323 5.50004 14.0005ZM12.8334 14.0005C12.8334 14.3687 12.5349 14.6672 12.1667 14.6672C11.7985 14.6672 11.5 14.3687 11.5 14.0005C11.5 13.6323 11.7985 13.3338 12.1667 13.3338C12.5349 13.3338 12.8334 13.6323 12.8334 14.0005Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDown = ({ color = "white" }: { color?: string }) => (
  <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronRight = () => (
  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronLeft = () => (
  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LocationPin = () => (
  <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
    <path d="M15 7.5C15 12 9 16.5 9 16.5C9 16.5 3 12 3 7.5C3 5.9087 3.63214 4.38258 4.75736 3.25736C5.88258 2.13214 7.4087 1.5 9 1.5C10.5913 1.5 12.1174 2.13214 13.2426 3.25736C14.3679 4.38258 15 5.9087 15 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const WhatsAppIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const HamburgerIcon = () => (
  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M3.33398 10H16.6673M3.33398 5H16.6673M3.33398 15H16.6673" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const WrenchIcon = () => (
  <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StarIcon = ({ filled, half }: { filled: boolean; half?: boolean }) => (
  <span style={{ color: filled || half ? "#f5a623" : "#ddd", fontSize: 14, position: "relative", display: "inline-block" }}>
    {half ? (
      <>
        <span style={{ color: "#ddd" }}>★</span>
        <span style={{ position: "absolute", left: 0, overflow: "hidden", width: "50%", color: "#f5a623" }}>★</span>
      </>
    ) : (
      "★"
    )}
  </span>
);

export function Stars({ count }: { count: number }) {
  const full = Math.floor(count);
  const half = count % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {Array.from({ length: full }).map((_, i) => (
        <StarIcon key={`f${i}`} filled />
      ))}
      {half && <StarIcon filled half />}
      {Array.from({ length: empty }).map((_, i) => (
        <StarIcon key={`e${i}`} filled={false} />
      ))}
    </span>
  );
}
